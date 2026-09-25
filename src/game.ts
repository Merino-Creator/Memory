import './scss/main.scss';

const themeLabel = localStorage.getItem('theme');

const themeKeys: Record<string, string> = {
    'Code vibes theme': 'code-vibes',
    'DA Projects theme': 'da-projects',
};

if (themeLabel && themeKeys[themeLabel]) {
    document.body.dataset.theme = themeKeys[themeLabel];
}