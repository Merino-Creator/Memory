export const THEME_KEYS: Record<string, string> = {
    'Code vibes theme': 'code-vibes',
    'DA Projects theme': 'da-projects',
};

const DEFAULT_THEME: string = 'code-vibes';

const GAME_DATA_KEYS: string[] = ['theme', 'player', 'board', 'winner', 'scoreBlue', 'scoreOrange'];

/**
 * Liest das gewählte Theme aus dem localStorage.
 * @returns der Theme-Schlüssel, bei fehlender Auswahl das Standard-Theme
 */
export function getCurrentTheme(): string {
    const label: string | null = localStorage.getItem('theme');
    const theme: string | undefined = label ? THEME_KEYS[label] : undefined;

    return theme ?? DEFAULT_THEME;
}

/**
 * Setzt das aktuelle Theme als data-theme-Attribut am body.
 * @returns der Theme-Schlüssel, der gesetzt wurde
 */
export function applyTheme(): string {
    const theme: string = getCurrentTheme();

    document.body.dataset.theme = theme;
    return theme;
}

/** Entfernt alle gespeicherten Spieldaten aus dem localStorage. */
export function resetGameData(): void {
    GAME_DATA_KEYS.forEach((key) => localStorage.removeItem(key));
}