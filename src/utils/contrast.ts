import Color from "colorjs.io";

const SUPPORTED_STANDARDS = new Set(["WCAG21", "APCA"] as const);

type ContrastStandard = "WCAG21" | "APCA";

type Candidate = {
    raw: string;
    resolved: Color;
};

export type ContrastOptions = {
    fallback?: string;
    lightBackgroundTextColor?: string;
    darkBackgroundTextColor?: string;
    standard?: ContrastStandard;
    minimumContrast?: number;
};

function canUseDom(): boolean {
    return typeof window !== "undefined" && typeof document !== "undefined";
}

function normalizeStandard(standard?: string): ContrastStandard {
    if (!standard) {
        return "WCAG21";
    }

    const normalized = standard.toUpperCase();
    return SUPPORTED_STANDARDS.has(normalized as ContrastStandard)
        ? (normalized as ContrastStandard)
        : "WCAG21";
}

// for extracting color from layered / gradient backgrounds
function splitTopLevelByComma(input: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (char === "(") {
            depth++;
        } else if (char === ")") {
            depth = Math.max(0, depth - 1);
        } else if (char === "," && depth === 0) {
            parts.push(input.slice(start, i).trim());
            start = i + 1;
        }
    }

    parts.push(input.slice(start).trim());
    return parts.filter(Boolean);
}

function extractColorPrefix(value: string): string {
    let depth = 0;
    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (char === "(") {
            depth++;
            continue;
        }
        if (char === ")") {
            depth = Math.max(0, depth - 1);
            continue;
        }
        if (depth === 0 && (char === " " || char === "\t" || char === "\n" || char === "\r" || char === "\f")) {
            return value.slice(0, i).trim();
        }
    }
    return value.trim();
}

function extractGradientColorTokens(gradient: string): string[] {
    const start = gradient.indexOf("(");
    const end = gradient.lastIndexOf(")");
    if (start < 0 || end <= start) {
        return [];
    }

    return splitTopLevelByComma(gradient.slice(start + 1, end))
        .map(extractColorPrefix)
        .filter(Boolean);
}

function tryParseColor(value: string): Color | null {
    try {
        return new Color(value);
    } catch {
        return null;
    }
}

function resolveCssVariable(value: string): string | null {
    if (!canUseDom()) {
        return null;
    }

    const token = value.trim();
    if (!token) {
        return null;
    }

    const probe = document.createElement("span");
    probe.style.color = "";
    probe.style.color = token;
    if (!probe.style.color) {
        return null;
    }

    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    return resolved || null;
}

function parseCssColor(value: string): Color | null {
    const direct = tryParseColor(value);
    if (direct) {
        return direct;
    }
    
    const resolved = resolveCssVariable(value);
    return resolved ? tryParseColor(resolved) : null;
}

function colorKey(color: Color): string {
    const srgb = color.to("srgb").coords;
    return srgb.map((v) => v.toFixed(6)).join(",");
}

function extractBackgroundCandidates(element: HTMLElement): Color[] {
    const style = getComputedStyle(element);
    const found = new Map<string, Color>();

    if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
        const color = parseCssColor(style.backgroundColor);
        if (color) {
            found.set(colorKey(color), color);
        }
    }

    if (style.backgroundImage && style.backgroundImage !== "none") {
        for (const layer of splitTopLevelByComma(style.backgroundImage)) {
            for (const token of extractGradientColorTokens(layer)) {
                const color = parseCssColor(token);
                if (color) {
                    found.set(colorKey(color), color);
                }
            }
        }
    }

    return [...found.values()];
}

function getContrastScore(background: Color, foreground: Color, standard: ContrastStandard): number {
    try {
        const score = Color.contrast(background, foreground, standard);
        if (typeof score !== "number" || Number.isNaN(score)) {
            return -Infinity;
        }
        return standard === "APCA" ? Math.abs(score) : score;
    } catch {
        return -Infinity;
    }
}

function buildCandidates({
    lightBackgroundTextColor,
    darkBackgroundTextColor
}: Pick<ContrastOptions, "lightBackgroundTextColor" | "darkBackgroundTextColor">): Candidate[] {
    const rawCandidates = [lightBackgroundTextColor, darkBackgroundTextColor]
        .filter((token): token is string => Boolean(token?.trim()));

    const found = new Map<string, Candidate>();
    for (const raw of rawCandidates) {
        const color = parseCssColor(raw);
        if (!color) {
            continue;
        }
        found.set(colorKey(color), { raw, resolved: color });
    }

    return [...found.values()];
}

export function pickReadableTextColorFromElement(
    element: HTMLElement,
    {
        fallback = "#f2f2f2",
        lightBackgroundTextColor = "#242424",
        darkBackgroundTextColor = "#f2f2f2",
        standard,
        minimumContrast
    }: ContrastOptions = {}
): string {
    const backgrounds = extractBackgroundCandidates(element);
    if (backgrounds.length === 0) {
        return fallback;
    }

    const algorithm = normalizeStandard(standard);
    const requiredContrast = minimumContrast ?? (algorithm === "APCA" ? 60 : 4.5);
    const candidates = buildCandidates({
        lightBackgroundTextColor,
        darkBackgroundTextColor
    });

    if (candidates.length === 0) {
        return fallback;
    }

    let best: Candidate | null = null;
    let bestScore = -Infinity;
    let passing: Candidate | null = null;
    let passingScore = -Infinity;

    for (const candidate of candidates) {
        const score = backgrounds.reduce((min, background) => {
            const contrast = getContrastScore(background, candidate.resolved, algorithm);
            return contrast < min ? contrast : min;
        }, Infinity);

        if (score > bestScore) {
            bestScore = score;
            best = candidate;
        }

        if (score >= requiredContrast && score > passingScore) {
            passingScore = score;
            passing = candidate;
        }
    }

    return (passing ?? best)?.raw ?? fallback;
}
