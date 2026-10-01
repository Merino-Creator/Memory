import './scss/main.scss';
import cardsData from './data/cards.json';

/* ---------- Theme ---------- */
const themeLabel = localStorage.getItem('theme');

const themeKeys: Record<string, string> = {
    'Code vibes theme': 'code-vibes',
    'DA Projects theme': 'da-projects',
};

const currentTheme = (themeLabel && themeKeys[themeLabel]) || 'code-vibes';
document.body.dataset.theme = currentTheme;

/* ---------- Board-Einstellungen ---------- */
const boardSizeLabel = localStorage.getItem('board');
const gameBoard = document.querySelector<HTMLDivElement>('#gameBoard');

const columnsByBoard: Record<string, number> = {
    '16 cards': 4,
    '24 cards': 6,
    '36 cards': 6,
};

const cardCount = Number(boardSizeLabel?.split(' ')[0]) || 16;
const columns = columnsByBoard[boardSizeLabel ?? ''] ?? 4;

/* ---------- Motive auswählen und mischen ---------- */
const motifKeysByTheme: Record<string, keyof typeof cardsData> = {
    'code-vibes': 'it-motifs',
    'da-projects': 'da-motifs',
};

function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

const motifKey = motifKeysByTheme[currentTheme] ?? 'it-motifs';
const pairsNeeded = cardCount / 2;
const selectedMotifs = cardsData[motifKey].slice(0, pairsNeeded);
const cardMotifs = shuffle([...selectedMotifs, ...selectedMotifs]);

/* ---------- Spielzustand ---------- */
const playerChoice = (localStorage.getItem('player') ?? 'Blue').toLowerCase();
let currentPlayer = playerChoice;
const points: Record<string, number> = { blue: 0, orange: 0 };

let flippedCards: HTMLButtonElement[] = [];
let isLocked = false;
let matchedPairs = 0;

/* ---------- Anzeige: Punktestand ---------- */
const scoreBlueEl = document.querySelector<HTMLSpanElement>('#scoreBlue');
const scoreOrangeEl = document.querySelector<HTMLSpanElement>('#scoreOrange');

function updateScore() {
    if (scoreBlueEl) scoreBlueEl.textContent = String(points.blue);
    if (scoreOrangeEl) scoreOrangeEl.textContent = String(points.orange);
}

/* ---------- Anzeige: aktueller Spieler ---------- */
const currentPlayerImg = document.querySelector<HTMLImageElement>('#currentPlayerImg');

const playerImages: Record<string, string> = {
    blue: '/public/assets/images/code-theme/game-screen/blue-player.png',
    orange: '/public/assets/images/code-theme/game-screen/orange-player.png',
};

function updateCurrentPlayerDisplay() {
    if (currentPlayerImg) {
        currentPlayerImg.src = playerImages[currentPlayer];
    }
}

updateCurrentPlayerDisplay();

/* ---------- Spiellogik ---------- */
function handleCardClick(card: HTMLButtonElement) {
    if (isLocked || card.classList.contains('is-flipped')) return;

    card.classList.add('is-flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    const [first, second] = flippedCards;
    isLocked = true;

    if (first.dataset.motif === second.dataset.motif) {
        points[currentPlayer]++;
        updateScore();
        matchedPairs++;
        flippedCards = [];
        isLocked = false;

        if (matchedPairs === pairsNeeded) {
            setTimeout(endGame, 800);
        }
    } else {
        setTimeout(() => {
            first.classList.remove('is-flipped');
            second.classList.remove('is-flipped');
            flippedCards = [];
            currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
            updateCurrentPlayerDisplay();
            isLocked = false;
        }, 1000);
    }
}

function endGame() {
    localStorage.setItem('scoreBlue', String(points.blue));
    localStorage.setItem('scoreOrange', String(points.orange));

    if (points.blue === points.orange) {
        window.location.href = './draw.html';
        return;
    }

    const winner = points.blue > points.orange ? 'blue' : 'orange';

    if (winner === playerChoice) {
        localStorage.setItem('winner', winner);
        window.location.href = './win-screen.html';
    } else {
        window.location.href = './game-over.html';
    }
}

/* ---------- Karten erzeugen ---------- */
if (gameBoard) {
    gameBoard.style.setProperty('--columns', String(columns));

    cardMotifs.forEach((motif) => {
        const card = document.createElement('button');
        card.classList.add('card');
        card.dataset.motif = motif;

        card.innerHTML = `
            <div class="card__inner">
                <div class="card__face"></div>
                <div class="card__face card__face--back" style="background-image: url('${motif}')"></div>
            </div>
        `;

        card.addEventListener('click', () => handleCardClick(card));

        gameBoard.appendChild(card);
    });
}

/* ---------- Exit-Dialog ---------- */
function openDialog() {
    const mydialog = document.getElementById('exitDialog') as HTMLDialogElement;
    mydialog?.showModal();
}

const openBtn = document.getElementById('openBtn');
openBtn?.addEventListener('click', openDialog);

document.getElementById('cancelExitBtn')?.addEventListener('click', () => {
    (document.getElementById('exitDialog') as HTMLDialogElement)?.close();
});

document.getElementById('confirmExitBtn')?.addEventListener('click', () => {
    window.location.href = './game-settings.html';
});