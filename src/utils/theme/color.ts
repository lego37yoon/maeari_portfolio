import {
    pickReadableTextColorFromElement,
    type ContrastOptions
} from "./contrast";

type ReadableTextColorOptions = Pick<
    ContrastOptions,
    "fallback" | "lightBackgroundTextColor" | "darkBackgroundTextColor" | "standard" | "minimumContrast"
>;

function isTransparentColor(value: string): boolean {
    const normalized = value.trim().toLowerCase();
    return !normalized || normalized === "transparent" || normalized === "rgba(0, 0, 0, 0)";
}

function getPageBackgroundColor(): string | null {
    const bodyStyle = getComputedStyle(document.body);
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyBackgroundColor = bodyStyle.backgroundColor;
    const rootBackgroundColor = rootStyle.backgroundColor;
    const materialBackground = bodyStyle.getPropertyValue("--md-sys-color-background").trim();

    if (!isTransparentColor(bodyBackgroundColor)) {
        return bodyBackgroundColor;
    }

    if (!isTransparentColor(rootBackgroundColor)) {
        return rootBackgroundColor;
    }

    if (!isTransparentColor(materialBackground)) {
        return materialBackground;
    }

    return null;
}

function pickReadableTextColorFromBackgroundColor(
    backgroundColor: string,
    options: ReadableTextColorOptions
): string {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.opacity = "0";
    probe.style.pointerEvents = "none";
    probe.style.backgroundColor = backgroundColor;
    document.body.appendChild(probe);

    try {
        return pickReadableTextColorFromElement(probe, options);
    } finally {
        probe.remove();
    }
}

export function pickReadableTextColorForPageTop(
    teaserArea: HTMLElement | null,
    shouldUseTeaser: boolean,
    options: ReadableTextColorOptions
): string {
    if (teaserArea && shouldUseTeaser) {
        const configuredColor = getComputedStyle(teaserArea).getPropertyValue("--teaser-text-color").trim();
        if (configuredColor) {
            return configuredColor;
        }

        return pickReadableTextColorFromElement(teaserArea, {
            ...options,
            fallback: options.darkBackgroundTextColor ?? options.fallback ?? "#ffffff"
        });
    }

    const fallbackBackground = getPageBackgroundColor();
    if (fallbackBackground) {
        return pickReadableTextColorFromBackgroundColor(fallbackBackground, options);
    }

    return options.fallback ?? "#ffffff";
}
