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