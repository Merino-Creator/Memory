import './scss/main.scss';
import { applyTheme } from './theme';

applyTheme();

const winner = localStorage.getItem('winner');
if (winner) {
    document.body.dataset.winner = winner;
}

const backBtn = document.querySelector<HTMLButtonElement>('.back-btn');

backBtn?.addEventListener('click', () => {
    window.location.href = './game-settings.html';
});

if (window.location.pathname.includes('game-over')) {
    setTimeout(() => {
        window.location.href = './game-settings.html';
    }, 3000);
}

const finalBlue = document.querySelector<HTMLSpanElement>('#finalScoreBlue');
const finalOrange = document.querySelector<HTMLSpanElement>('#finalScoreOrange');

if (finalBlue) finalBlue.textContent = localStorage.getItem('scoreBlue') ?? '0';
if (finalOrange) finalOrange.textContent = localStorage.getItem('scoreOrange') ?? '0';

const winnerNameEl = document.querySelector<HTMLHeadingElement>('#winnerName');
const winnerPawnImg = document.querySelector<HTMLImageElement>('#winnerPawnImg');

if (winner === 'blue') {
    if (winnerNameEl) winnerNameEl.textContent = 'BLUE PLAYER';
    if (winnerPawnImg) winnerPawnImg.src = '/public/assets/images/code-theme/winner-screen/blue-pawn.png';
} else if (winner === 'orange') {
    if (winnerNameEl) winnerNameEl.textContent = 'ORANGE PLAYER';
    if (winnerPawnImg) winnerPawnImg.src = '/public/assets/images/code-theme/winner-screen/orange-pawn.png';
}