import './scss/main.scss';
import cardsData from './data/cards.json';

const themeLabel = localStorage.getItem('theme');

const themeKeys: Record<string, string> = {
    'Code vibes theme': 'code-vibes',
    'DA Projects theme': 'da-projects',
};

if (themeLabel && themeKeys[themeLabel]) {
    document.body.dataset.theme = themeKeys[themeLabel];
}

const boardSizeLabel = localStorage.getItem('board');
const gameBoard = document.querySelector<HTMLDivElement>('#gameBoard');

const columnsByBoard: Record<string, number> = {
    '16 cards': 4,
    '24 cards': 6,
    '36 cards': 6,
};

const cardCount = Number(boardSizeLabel?.split(' ')[0]) || 16;
const columns = columnsByBoard[boardSizeLabel ?? ''] ?? 4;

const pairsNeeded = cardCount / 2;
const selectedMotifs = cardsData.motifs.slice(0, pairsNeeded);
const cardMotifs = [...selectedMotifs, ...selectedMotifs];

if (gameBoard) {
    gameBoard.style.setProperty('--columns', String(columns));

    cardMotifs.forEach((motif) => {
        const card = document.createElement('button');
        card.classList.add('card');

        card.innerHTML = `
            <div class="card__inner">
                <div class="card__face"></div>
                <div class="card__face card__face--back" style="background-image: url('${motif}')"></div>
            </div>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });

        gameBoard.appendChild(card);
    });
}