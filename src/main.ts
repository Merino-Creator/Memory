import './scss/main.scss'

const themeRadios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
const themeImage = document.querySelector<HTMLImageElement>('.settings-box-right img');

const themeImages: Record<string, string> = {
    'Code vibes theme': '/assets/images/settings-screen/it-theme-logo.png',
    'DA Projects theme': '/assets/images/settings-screen/da-theme-logo.png'
};

themeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        const labelText = radio.parentElement?.querySelector('.label-text')?.textContent;
        if (labelText && themeImages[labelText] && themeImage) {
            themeImage.src = themeImages[labelText];
        }
    });
});