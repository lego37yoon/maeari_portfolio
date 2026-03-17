import { pickReadableTextColorForPageTop } from "./color";

export type HeaderThemeContext = {
    getDarkModeState: () => boolean;
    getHeaderElement: () => HTMLElement | undefined;
};

export type HeaderHeroTextColorSyncOptions = {
    path?: string;
    overrideDarkModeState?: boolean;
};

const BACK_COLOR_DETECTION_NEEDED_URL = ["/", "/oss"] as string[];

function isBackColorDetectionNeededPath(path: string): boolean {
    return BACK_COLOR_DETECTION_NEEDED_URL.includes(path);
}

function getHeaderTextColorOptions(darkModeState: boolean) {
    return {
        fallback: darkModeState ? "#ffffff" : "var(--mfp-primary-text-color)",
        lightBackgroundTextColor: darkModeState ? "#111111" : "var(--mfp-primary-text-color)",
        darkBackgroundTextColor: "#ffffff"
    };
}

export function syncHeaderHeroTextColor(
    context: HeaderThemeContext,
    onUpdate: (headerHeroTextColor: string) => void,
    options: HeaderHeroTextColorSyncOptions | boolean | undefined = undefined
): void {
    const normalized = typeof options === "boolean"
        ? { overrideDarkModeState: options }
        : options ?? {};

    if (typeof document === "undefined") {
        return;
    }

    const darkModeState = normalized.overrideDarkModeState ?? context.getDarkModeState();
    const colorOptions = getHeaderTextColorOptions(darkModeState);

    let nextColor = "";

    if (normalized.path !== undefined && isBackColorDetectionNeededPath(normalized.path)) {
        nextColor = pickReadableTextColorForPageTop(null, false, colorOptions);
    } else {
        const teaserArea = document.getElementById("teaserArea");
        nextColor = pickReadableTextColorForPageTop(
            teaserArea,
            teaserArea ? doesElementIntersectHeaderArea(teaserArea, context.getHeaderElement()) : false,
            colorOptions
        );
    }

    if (nextColor) {
        onUpdate(nextColor);
    }
}

export function connectHeaderHeroColorObserver(
    context: HeaderThemeContext,
    onUpdate: (headerHeroTextColor: string) => void
): MutationObserver {
    if (typeof document === "undefined") {
        return new MutationObserver(() => {});
    }

    const refresh = () => {
        syncHeaderHeroTextColor(context, onUpdate);
    };

    const observer = new MutationObserver(() => {
        refresh();
    });
    const observedTargets = [
        document.getElementById("teaserArea"),
        document.body,
        document.documentElement
    ];
    for (const target of observedTargets) {
        if (!target) {
            continue;
        }
        observer.observe(target, {
            attributes: true,
            attributeFilter: ["style", "class"]
        });
    }

    refresh();
    return observer;
}

export function isHeaderAtTop(scrollY: number = typeof window === "undefined" ? 1 : window.scrollY): boolean {
    return scrollY <= 1;
}

function doesElementIntersectHeaderArea(element: HTMLElement, headerElement: HTMLElement | undefined): boolean {
    const rect = element.getBoundingClientRect();
    const headerHeight = headerElement?.getBoundingClientRect().height ?? 0;
    const visibleHeaderHeight = headerHeight > 0 ? headerHeight : 54;
    return rect.top < visibleHeaderHeight && rect.bottom > 0;
}
