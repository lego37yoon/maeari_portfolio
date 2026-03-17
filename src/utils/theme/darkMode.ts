import { writable } from 'svelte/store';

export const darkMode = writable<boolean>(false);

export type DarkModeControllerOptions = {
    darkModeButton?: (HTMLElement & { selected?: boolean }) | undefined;
    onChanged?: (enabled: boolean) => void;
};

export function applyDarkMode(enabled: boolean, options: DarkModeControllerOptions = {}): void {
    const { darkModeButton, onChanged } = options;

    if (darkModeButton) {
        darkModeButton.selected = enabled;
    }

    if (typeof document !== "undefined") {
        if (enabled) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }

    darkMode.set(enabled);
    onChanged?.(enabled);
}
