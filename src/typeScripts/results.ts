import '../scss/main.scss';
import { applyTheme, resetGameData } from './theme';

applyTheme();

const winner = localStorage.getItem('winner');
if (winner) {
    document.body.dataset.winner = winner;
}

const backBtn = document.querySelector<HTMLButtonElement>('.back-btn');

backBtn?.addEventListener('click', () => {
    resetGameData();
    window.location.href = 'game-settings.html';
});

if (window.location.pathname.includes('game-over')) {
    setTimeout(() => {
        const base = import.meta.env.BASE_URL.replace(/\/$/, '');
        const target = localStorage.getItem('winner') === 'draw' ? 'draw.html' : 'win-screen.html';
        window.location.href = `${base}/pages/${target}`;
    }, 2000);
}

const finalBlue = document.querySelector<HTMLSpanElement>('#finalScoreBlue');
const finalOrange = document.querySelector<HTMLSpanElement>('#finalScoreOrange');

if (finalBlue) finalBlue.textContent = localStorage.getItem('scoreBlue') ?? '0';
if (finalOrange) finalOrange.textContent = localStorage.getItem('scoreOrange') ?? '0';

const winnerNameEl = document.querySelector<HTMLHeadingElement>('#winnerName');

if (winner === 'blue' || winner === 'orange') {
    if (winnerNameEl) {
        winnerNameEl.textContent = winner === 'blue' ? 'BLUE PLAYER' : 'ORANGE PLAYER';
    }
}
