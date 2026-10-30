export const THEME_KEYS: Record<string, string> = {
    'Code vibes theme': 'code-vibes',
    'DA Projects theme': 'da-projects',
};

const defaultTheme: string = 'code-vibes';

const gameDataKeys: string[] = ['theme', 'player', 'board', 'winner', 'scoreBlue', 'scoreOrange'];

/**
 * Reads the chosen theme from localStorage.
 * @returns the theme key, or the default theme if nothing was chosen
 */
export function getCurrentTheme(): string {
    const label: string | null = localStorage.getItem('theme');
    const theme: string | undefined = label ? THEME_KEYS[label] : undefined;

    return theme ?? defaultTheme;
}

/**
 * Sets the current theme as the data-theme attribute on the body.
 * @returns the theme key that was set
 */
export function applyTheme(): string {
    const theme: string = getCurrentTheme();

    document.body.dataset.theme = theme;
    return theme;
}

/** Removes all saved game data from localStorage. */
export function resetGameData(): void {
    gameDataKeys.forEach((key) => localStorage.removeItem(key));
}