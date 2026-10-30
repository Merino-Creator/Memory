import './scss/main.scss';

import { applyTheme, resetGameData } from './theme';

const gameOverPage: string = 'game-over';
const autoRedirectDelayMs: number = 2000;
const defaultScore: string = '0';

const baseUrl: string = import.meta.env.BASE_URL.replace(/\/$/, '');
const settingsUrl: string = `${baseUrl}/pages/game-settings.html`;
const winUrl: string = `${baseUrl}/pages/win-screen.html`;
const drawUrl: string = `${baseUrl}/pages/draw.html`;

const winnerNames: Record<string, string> = {
    blue: 'BLUE PLAYER',
    orange: 'ORANGE PLAYER',
};

const winner: string | null = localStorage.getItem('winner');

/** Sets the winner as the data-winner attribute on the body. */
function applyWinner(): void {
    if (winner) {
        document.body.dataset.winner = winner;
    }
}

/** Shows the name of the winner. On a draw it stays empty. */
function showWinnerName(): void {
    const nameEl: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('#winnerName');
    const name: string | undefined = winner ? winnerNames[winner] : undefined;

    if (nameEl && name) {
        nameEl.textContent = name;
    }
}

/** Shows the final score of both players. */
function showFinalScore(): void {
    const blueEl: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('#finalScoreBlue');
    const orangeEl: HTMLSpanElement | null = document.querySelector<HTMLSpanElement>('#finalScoreOrange');

    if (blueEl) {
        blueEl.textContent = localStorage.getItem('scoreBlue') ?? defaultScore;
    }
    if (orangeEl) {
        orangeEl.textContent = localStorage.getItem('scoreOrange') ?? defaultScore;
    }
}

/** Resets the game data and returns to the settings page. */
function leaveToSettings(): void {
    resetGameData();
    window.location.href = settingsUrl;
}

/**
 * Determines the screen that follows the game over screen.
 * @returns the URL of the draw screen or the win screen
 */
function getNextScreenUrl(): string {
    return winner === 'draw' ? drawUrl : winUrl;
}

/** On the game over screen, forwards to the result screen after a short delay. */
function scheduleNextScreen(): void {
    if (!window.location.pathname.includes(gameOverPage)) {
        return;
    }
    setTimeout(() => {
        window.location.href = getNextScreenUrl();
    }, autoRedirectDelayMs);
}

/** Links the home button to the return to the settings page. */
function bindBackButton(): void {
    document.querySelector<HTMLButtonElement>('.back-btn')?.addEventListener('click', leaveToSettings);
}

/** Initializes the win, draw and game over screens. */
function init(): void {
    applyTheme();
    applyWinner();
    showWinnerName();
    showFinalScore();
    bindBackButton();
    scheduleNextScreen();
}

init();