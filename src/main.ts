import './scss/main.scss';

import { THEME_KEYS, resetGameData } from './theme';
import type { SelectionKey, Selections } from './types';

const playBtn: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('.play-btn');
const startBtn: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('.start-btn');
const previewBox: HTMLElement | null = document.querySelector<HTMLElement>('.settings-box-right');
const themeRadios: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');

const valueElements: Record<SelectionKey, HTMLSpanElement | null> = {
    theme: document.querySelector<HTMLSpanElement>('.theme-value'),
    player: document.querySelector<HTMLSpanElement>('.player-value'),
    board: document.querySelector<HTMLSpanElement>('.board-value'),
};

const selectionKeys: SelectionKey[] = ['theme', 'player', 'board'];
const gameSettingsUrl: string = `${import.meta.env.BASE_URL}/pages/game-settings.html`;
const gameUrl: string = `${import.meta.env.BASE_URL}/pages/game.html`;

const selections: Selections = {
    theme: '',
    player: '',
    board: '',
};

/**
 * Reads the display text (data-text) of a radio button.
 * @param radio - the radio button inside a label
 * @returns the text, or null if there is none
 */
function getRadioText(radio: HTMLInputElement): string | null {
    const textEl: Element | null | undefined = radio.parentElement?.querySelector('.label-text');

    return textEl?.getAttribute('data-text') ?? null;
}

/** Resets the saved game data and opens the settings page. */
function openSettings(): void {
    resetGameData();
    window.location.href = gameSettingsUrl;
}

/** Opens the game page. The selection is already saved. */
function startGame(): void {
    window.location.href = gameUrl;
}

/**
 * Shows the preview of the chosen theme in the right area.
 * @param themeLabel - display text of the theme
 */
function updatePreview(themeLabel: string): void {
    const previewKey: string | undefined = THEME_KEYS[themeLabel];

    if (previewKey && previewBox) {
        previewBox.dataset.preview = previewKey;
    }
}

/** Checks whether theme, player and board size have been chosen. */
function isSelectionComplete(): boolean {
    return Boolean(selections.theme && selections.player && selections.board);
}

/** Enables the start button as soon as the selection is complete. */
function updateStartButton(): void {
    if (startBtn && isSelectionComplete()) {
        startBtn.disabled = false;
    }
}

/**
 * Applies a selection: display, in-memory state and localStorage.
 * @param key - the kind of selection
 * @param label - the chosen text
 */
function applySelection(key: SelectionKey, label: string): void {
    const targetEl: HTMLSpanElement | null = valueElements[key];

    if (targetEl) {
        targetEl.textContent = label;
    }
    selections[key] = label;
    localStorage.setItem(key, label);
    updateStartButton();
}

/** Links the theme radios to the preview. */
function bindThemePreview(): void {
    themeRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            const label: string | null = getRadioText(radio);

            if (label) {
                updatePreview(label);
            }
        });
    });
}

/**
 * Links a radio group to the display and to storage.
 * @param key - the group, matches the name attribute of its radios
 */
function bindRadioGroup(key: SelectionKey): void {
    const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>(`input[name="${key}"]`);

    radios.forEach((radio) => {
        radio.addEventListener('change', () => {
            const label: string | null = getRadioText(radio);

            if (label) {
                applySelection(key, label);
            }
        });
    });
}

/**
 * Restores a saved selection and triggers the change event.
 * @param key - the group to restore
 */
function restoreSelection(key: SelectionKey): void {
    const saved: string | null = localStorage.getItem(key);
    const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>(`input[name="${key}"]`);

    radios.forEach((radio) => {
        if (saved && getRadioText(radio) === saved) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        }
    });
}

/** Registers the click handlers of the buttons. */
function bindButtons(): void {
    playBtn?.addEventListener('click', openSettings);
    startBtn?.addEventListener('click', startGame);
}

/** Initializes the start page and the settings page. */
function init(): void {
    bindButtons();
    bindThemePreview();
    selectionKeys.forEach((key) => bindRadioGroup(key));
    selectionKeys.forEach((key) => restoreSelection(key));
}

init();