import '../scss/main.scss';
import { applyTheme } from './theme';

const currentTheme = applyTheme();

const winner = localStorage.getItem('winner');
if (winner) {
    document.body.dataset.winner = winner;
}

/* ---------- Zurück-Button ---------- */
const backBtn = document.querySelector<HTMLButtonElement>('.back-btn');

backBtn?.addEventListener('click', () => {
    window.location.href = 'game-settings.html';
});

/* ---------- Automatische Weiterleitung auf dem Game-Over-Screen ---------- */
if (window.location.pathname.includes('game-over')) {
    setTimeout(() => {
        window.location.href = 'game-settings.html';
    }, 3000);
}

/* ---------- Endstand anzeigen ---------- */
const finalBlue = document.querySelector<HTMLSpanElement>('#finalScoreBlue');
const finalOrange = document.querySelector<HTMLSpanElement>('#finalScoreOrange');

if (finalBlue) finalBlue.textContent = localStorage.getItem('scoreBlue') ?? '0';
if (finalOrange) finalOrange.textContent = localStorage.getItem('scoreOrange') ?? '0';

/* ---------- Gewinner-Anzeige (Name + Spielfigur) ---------- */
const winnerNameEl = document.querySelector<HTMLHeadingElement>('#winnerName');

if (winner === 'blue' || winner === 'orange') {
    if (winnerNameEl) {
        winnerNameEl.textContent = winner === 'blue' ? 'BLUE PLAYER' : 'ORANGE PLAYER';
    }
}