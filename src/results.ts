import './scss/main.scss';
import cardsData from './data/cards.json';

import { renderCard } from './card-template';
import { applyTheme } from './theme';
import type { GameState, MotifKey, Player, Winner } from './types';

const players: Player[] = ['blue', 'orange'];
const pairSize: number = 2;
const flippedClass: string = 'is-flipped';
const defaultCardCount: number = 16;
const defaultColumns: number = 4;
const mismatchDelayMs: number = 600;
const gameEndDelayMs: number = 800;

const columnsByBoard: Record<string, number> = {
    '16 cards': 4,
    '24 cards': 6,
    '36 cards': 6,
};

const motifKeysByTheme: Record<string, MotifKey> = {
    'code-vibes': 'it-motifs',
    'da-projects': 'da-motifs',
};

const defaultMotifKey: MotifKey = 'it-motifs';

const baseUrl: string = import.meta.env.BASE_URL.replace(/\/$/, '');
const gameOverUrl: string = `${baseUrl}/pages/game-over.html`;
const gameSettingsUrl: string = `${baseUrl}/pages/game-settings.html`;

const currentTheme: string = applyTheme();
const boardLabel: string = localStorage.getItem('board') ?? '';
const cardCount: number = Number(boardLabel.split(' ')[0]) || defaultCardCount;
const columns: number = columnsByBoard[boardLabel] ?? defaultColumns;
const pairsNeeded: number = cardCount / pairSize;
const motifKey: MotifKey = motifKeysByTheme[currentTheme] ?? defaultMotifKey;

const gameBoard: HTMLElement | null = document.querySelector<HTMLElement>('#gameBoard');
const playerTurnEl: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.player-turn');
const exitDialog: HTMLDialogElement | null = document.querySelector<HTMLDialogElement>('#exitDialog');

const scoreElements: Record<Player, HTMLSpanElement | null> = {
    blue: document.querySelector<HTMLSpanElement>('#scoreBlue'),
    orange: document.querySelector<HTMLSpanElement>('#scoreOrange'),
};

const state: GameState = {
    currentPlayer: getStartPlayer(),
    points: { blue: 0, orange: 0 },
    flippedCards: [],
    isLocked: false,
    matchedPairs: 0,
};

/**
 * Reads the player color chosen on the settings page.
 * @returns the color the game starts with
 */
function getStartPlayer(): Player {
    const saved: string = (localStorage.getItem('player') ?? '').toLowerCase();

    return saved === 'orange' ? 'orange' : 'blue';
}

/**
 * Shuffles a list randomly (Fisher-Yates).
 * @param items - the list to shuffle
 * @returns a new, shuffled list
 */
function shuffle<T>(items: T[]): T[] {
    const result: T[] = [...items];

    for (let i: number = result.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Picks the motifs for the board size and doubles them into pairs.
 * @returns the shuffled list of all card motifs
 */
function buildCardMotifs(): string[] {
    const motifs: string[] = cardsData[motifKey].slice(0, pairsNeeded);

    return shuffle([...motifs, ...motifs]);
}

/** Shows the current points of both players. */
function updateScore(): void {
    players.forEach((player) => {
        const scoreEl: HTMLSpanElement | null = scoreElements[player];

        if (scoreEl) {
            scoreEl.textContent = String(state.points[player]);
        }
    });
}

/** Shows the current player in the header. */
function updateCurrentPlayerDisplay(): void {
    if (playerTurnEl) {
        playerTurnEl.dataset.player = state.currentPlayer;
    }
}

/** Switches to the other player. */
function switchPlayer(): void {
    state.currentPlayer = state.currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayerDisplay();
}

/** Releases the cards so the next turn can begin. */
function resetTurn(): void {
    state.flippedCards = [];
    state.isLocked = false;
}

/**
 * Determines the outcome of the game from the points.
 * @returns 'blue', 'orange' or 'draw' on a tie
 */
function getWinner(): Winner {
    const { blue, orange } = state.points;

    if (blue === orange) {
        return 'draw';
    }
    return blue > orange ? 'blue' : 'orange';
}

/** Saves the result and opens the game over screen. */
function endGame(): void {
    localStorage.setItem('scoreBlue', String(state.points.blue));
    localStorage.setItem('scoreOrange', String(state.points.orange));
    localStorage.setItem('winner', getWinner());
    window.location.href = gameOverUrl;
}

/** Handles a found pair: awards a point and checks for the end of the game. */
function handleMatch(): void {
    state.points[state.currentPlayer]++;
    updateScore();
    state.matchedPairs++;
    resetTurn();

    if (state.matchedPairs === pairsNeeded) {
        setTimeout(endGame, gameEndDelayMs);
    }
}

/**
 * Turns two non-matching cards back and switches the player.
 * @param first - the card that was flipped first
 * @param second - the card that was flipped second
 */
function handleMismatch(first: HTMLButtonElement, second: HTMLButtonElement): void {
    setTimeout(() => {
        first.classList.remove(flippedClass);
        second.classList.remove(flippedClass);
        resetTurn();
        switchPlayer();
    }, mismatchDelayMs);
}

/** Compares the two flipped cards. */
function checkMatch(): void {
    const [first, second] = state.flippedCards;

    state.isLocked = true;
    if (first.dataset.motif === second.dataset.motif) {
        handleMatch();
    } else {
        handleMismatch(first, second);
    }
}

/**
 * Flips a card and starts the comparison once two cards are open.
 * @param card - the clicked card
 */
function handleCardClick(card: HTMLButtonElement): void {
    if (state.isLocked || card.classList.contains(flippedClass)) {
        return;
    }
    card.classList.add(flippedClass);
    state.flippedCards.push(card);

    if (state.flippedCards.length === pairSize) {
        checkMatch();
    }
}

/**
 * Creates a card with its motif and click handler.
 * @param motif - the name of the card's motif
 * @returns the finished card element
 */
function createCard(motif: string): HTMLButtonElement {
    const card: HTMLButtonElement = document.createElement('button');

    card.type = 'button';
    card.classList.add('card');
    card.dataset.motif = motif;
    card.innerHTML = renderCard(motif);
    card.addEventListener('click', () => handleCardClick(card));
    return card;
}

/** Builds the game board with all cards. */
function renderBoard(): void {
    if (!gameBoard) {
        return;
    }
    gameBoard.style.setProperty('--columns', String(columns));
    buildCardMotifs().forEach((motif) => gameBoard.appendChild(createCard(motif)));
}

/** Opens the dialog for leaving the game. */
function openExitDialog(): void {
    exitDialog?.showModal();
}

/** Closes the dialog and continues the game. */
function closeExitDialog(): void {
    exitDialog?.close();
}

/** Leaves the game and returns to the settings page. */
function leaveGame(): void {
    window.location.href = gameSettingsUrl;
}

/** Links the buttons of the exit dialog to their actions. */
function bindExitDialog(): void {
    document.querySelector('#openExitBtn')?.addEventListener('click', openExitDialog);
    document.querySelector('#cancelExitBtn')?.addEventListener('click', closeExitDialog);
    document.querySelector('#confirmExitBtn')?.addEventListener('click', leaveGame);
}

/** Initializes the game. */
function init(): void {
    renderBoard();
    updateCurrentPlayerDisplay();
    bindExitDialog();
}

init();