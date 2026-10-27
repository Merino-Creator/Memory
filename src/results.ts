import './scss/main.scss';

import { applyTheme, resetGameData } from './theme';

const GAME_OVER_PAGE: string = 'game-over';
const AUTO_REDIRECT_DELAY_MS: number = 2000;
const DEFAULT_SCORE: string = '0';

const BASE_URL: string = import.meta.env.BASE_URL.replace(/\/$/, '');
const SETTINGS_URL: string = `${BASE_URL}/pages/game-settings.html`;
const WIN_URL: string = `${BASE_URL}/pages/win-screen.html`;
const DRAW_URL: string = `${BASE_URL}/pages/draw.html`;

const WINNER_NAMES: Record<string, string> = {
    blue: 'BLUE PLAYER',
    orange: 'ORANGE PLAYER',
};

const WINNER: string | null = localStorage.getItem('winner');

/** Setzt den Gewinner als data-winner-Attribut am body. */
function applyWinner(): void {
    if (WINNER) {
        document.body.dataset.winner = WINNER;
    }
}

/** Zeigt den Namen des Gewinners an. Bei Unentschieden bleibt er leer. */
function showWinnerName(): void {
    const nameEl: HTMLHeadingElement | null = document.querySelector<HTMLHeadingElement>('#winnerName');
    const name: string | undefined = WINNER ? WINNER_NAMES[WINNER] : undefined;

    if (nameEl && name) {
        nameEl.textContent = name;
    }
}

/** Zeigt den Endstand beider Spieler an. */
function showFinalScore(): void {
    const blueEl: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('#finalScoreBlue');
    const orangeEl: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('#finalScoreOrange');

    if (blueEl) {
        blueEl.textContent = localStorage.getItem('scoreBlue') ?? DEFAULT_SCORE;
    }
    if (orangeEl) {
        orangeEl.textContent = localStorage.getItem('scoreOrange') ?? DEFAULT_SCORE;
    }
}

/** Setzt die Spieldaten zurück und kehrt zu den Settings zurück. */
function leaveToSettings(): void {
    resetGameData();
    window.location.href = SETTINGS_URL;
}

/**
 * Bestimmt den Screen, der nach dem Game-Over-Screen folgt.
 * @returns die URL des Draw- oder Win-Screens
 */
function getNextScreenUrl(): string {
    return WINNER === 'draw' ? DRAW_URL : WIN_URL;
}

/** Leitet auf dem Game-Over-Screen nach kurzer Zeit zum Ergebnis weiter. */
function scheduleNextScreen(): void {
    if (!window.location.pathname.includes(GAME_OVER_PAGE)) {
        return;
    }
    setTimeout(() => {
        window.location.href = getNextScreenUrl();
    }, AUTO_REDIRECT_DELAY_MS);
}

/** Verknüpft den Home-Button mit der Rückkehr zu den Settings. */
function bindBackButton(): void {
    document.querySelector<HTMLButtonElement>('.back-btn')?.addEventListener('click', leaveToSettings);
}

/** Initialisiert Win-, Draw- und Game-Over-Screen. */
function init(): void {
    applyTheme();
    applyWinner();
    showWinnerName();
    showFinalScore();
    bindBackButton();
    scheduleNextScreen();
}

init();