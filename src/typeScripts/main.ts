import '../scss/main.scss'

/* ---------- Startseite: Play-Button ---------- */
const playBtn = document.querySelector<HTMLButtonElement>('.play-btn');

playBtn?.addEventListener('click', () => {
    window.location.href = `${import.meta.env.BASE_URL}/pages/game-settings.html`;
});

/* ---------- Settings: Theme-Vorschau ---------- */
const themeRadios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
const previewBox = document.querySelector<HTMLDivElement>('.settings-box-right');

const previewKeys: Record<string, string> = {
    'Code vibes theme': 'code-vibes',
    'DA Projects theme': 'da-projects',
};

themeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        const labelText = radio.parentElement?.querySelector('.label-text')?.textContent;
        if (labelText && previewKeys[labelText] && previewBox) {
            previewBox.dataset.preview = previewKeys[labelText];
        }
    });
});

/* ---------- Settings: Auswahl und Election-Line ---------- */
const themeValueEl = document.querySelector<HTMLParagraphElement>('.theme-value');
const playerValueEl = document.querySelector<HTMLParagraphElement>('.player-value');
const boardValueEl = document.querySelector<HTMLParagraphElement>('.board-value');
const startBtn = document.querySelector<HTMLButtonElement>('.start-btn');

const selections = {
    theme: '',
    player: '',
    board: '',
};

function checkAllSelected() {
    if (startBtn && selections.theme && selections.player && selections.board) {
        startBtn.disabled = false;
    }
}

function bindRadioGroup(name: string, targetEl: HTMLParagraphElement | null, key: keyof typeof selections) {
    const radios = document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`);

    radios.forEach((radio) => {
        radio.addEventListener('change', () => {
            const labelText = radio.parentElement?.querySelector('.label-text')?.getAttribute('data-text');
            if (labelText && targetEl) {
                targetEl.textContent = labelText;
                selections[key] = labelText;
                checkAllSelected();
            }
        });
    });
}

bindRadioGroup('theme', themeValueEl, 'theme');
bindRadioGroup('player', playerValueEl, 'player');
bindRadioGroup('board', boardValueEl, 'board');

/* ---------- Settings: Spiel starten ---------- */
startBtn?.addEventListener('click', () => {
    localStorage.setItem('theme', selections.theme);
    localStorage.setItem('player', selections.player);
    localStorage.setItem('board', selections.board);
    window.location.href = `${import.meta.env.BASE_URL}/pages/game.html`;
});