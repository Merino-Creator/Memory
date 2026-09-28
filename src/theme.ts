const themeKeys: Record<string, string> = {
    'Code vibes theme': 'code-vibes',
    'DA Projects theme': 'da-projects',
};

export function applyTheme(): string {
    const label = localStorage.getItem('theme');
    const theme = (label && themeKeys[label]) || 'code-vibes';
    document.body.dataset.theme = theme;
    return theme;
}