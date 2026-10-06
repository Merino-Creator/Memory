import '../scss/main.scss'

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
    if (selections.theme && selections.player && selections.board) {
        startBtn!.disabled = false;
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

startBtn?.addEventListener('click', () => {
    localStorage.setItem('theme', selections.theme);
    localStorage.setItem('player', selections.player);
    localStorage.setItem('board', selections.board);
    window.location.href = 'game.html';
});
