import './scss/main.scss';

import { THEME_KEYS, resetGameData } from './theme';

type SelectionKey = 'theme' | 'player' | 'board';

interface Selections {
    theme: string;
    player: string;
    board: string;
}

const PLAY_BTN: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('.play-btn');
const START_BTN: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('.start-btn');
const PREVIEW_BOX: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.settings-box-right');
const THEME_RADIOS: NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');

const VALUE_ELEMENTS: Record<SelectionKey, HTMLParagraphElement | null> = {
    theme: document.querySelector<HTMLParagraphElement>('.theme-value'),
    player: document.querySelector<HTMLParagraphElement>('.player-value'),
    board: document.querySelector<HTMLParagraphElement>('.board-value'),
};

const SELECTION_KEYS: SelectionKey[] = ['theme', 'player', 'board'];
const GAME_SETTINGS_URL: string = `${import.meta.env.BASE_URL}/pages/game-settings.html`;
const GAME_URL: string = `${import.meta.env.BASE_URL}/pages/game.html`;

const selections: Selections = {
    theme: '',
    player: '',
    board: '',
};

/**
 * Liest den Anzeigetext (data-text) eines Radio-Buttons aus.
 * @param radio - der Radio-Button innerhalb eines Labels
 * @returns der Text oder null, falls keiner vorhanden ist
 */
function getRadioText(radio: HTMLInputElement): string | null {
    const textEl: Element | null | undefined = radio.parentElement?.querySelector('.label-text');

    return textEl?.getAttribute('data-text') ?? null;
}

/** Setzt die gespeicherten Spieldaten zurück und öffnet die Settings-Seite. */
function openSettings(): void {
    resetGameData();
    window.location.href = GAME_SETTINGS_URL;
}

/** Öffnet die Spielseite. Die Auswahl ist bereits gespeichert. */
function startGame(): void {
    window.location.href = GAME_URL;
}

/**
 * Zeigt die Vorschau des gewählten Themes im rechten Bereich.
 * @param themeLabel - Anzeigetext des Themes
 */
function updatePreview(themeLabel: string): void {
    const previewKey: string | undefined = THEME_KEYS[themeLabel];

    if (previewKey && PREVIEW_BOX) {
        PREVIEW_BOX.dataset.preview = previewKey;
    }
}

/** Prüft, ob Theme, Spieler und Boardgröße gewählt wurden. */
function isSelectionComplete(): boolean {
    return Boolean(selections.theme && selections.player && selections.board);
}

/** Aktiviert den Start-Button, sobald die Auswahl vollständig ist. */
function updateStartButton(): void {
    if (START_BTN && isSelectionComplete()) {
        START_BTN.disabled = false;
    }
}

/**
 * Übernimmt eine Auswahl: Anzeige, Zwischenspeicher und localStorage.
 * @param key - Art der Auswahl
 * @param label - gewählter Text
 */
function applySelection(key: SelectionKey, label: string): void {
    const targetEl: HTMLParagraphElement | null = VALUE_ELEMENTS[key];

    if (targetEl) {
        targetEl.textContent = label;
    }
    selections[key] = label;
    localStorage.setItem(key, label);
    updateStartButton();
}

/** Verknüpft die Theme-Radios mit der Vorschau. */
function bindThemePreview(): void {
    THEME_RADIOS.forEach((radio) => {
        radio.addEventListener('change', () => {
            const label: string | null = getRadioText(radio);

            if (label) {
                updatePreview(label);
            }
        });
    });
}

/**
 * Verknüpft eine Radio-Gruppe mit Anzeige und Speicherung.
 * @param key - Gruppe, entspricht dem name-Attribut der Radios
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
 * Stellt eine gespeicherte Auswahl wieder her und löst das change-Event aus.
 * @param key - Gruppe, die wiederhergestellt wird
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

/** Registriert die Klick-Handler der Buttons. */
function bindButtons(): void {
    PLAY_BTN?.addEventListener('click', openSettings);
    START_BTN?.addEventListener('click', startGame);
}

/** Initialisiert Start- und Settings-Seite. */
function init(): void {
    bindButtons();
    bindThemePreview();
    SELECTION_KEYS.forEach((key) => bindRadioGroup(key));
    SELECTION_KEYS.forEach((key) => restoreSelection(key));
}

init();