import './scss/main.scss';
import cardsData from './data/cards.json';

import { renderCard } from './card-template';
import { applyTheme } from './theme';

type Player = 'blue' | 'orange';
type Winner = Player | 'draw';
type MotifKey = keyof typeof cardsData;

interface GameState {
    currentPlayer: Player;
    points: Record<Player, number>;
    flippedCards: HTMLButtonElement[];
    isLocked: boolean;
    matchedPairs: number;
}

const PLAYERS: Player[] = ['blue', 'orange'];
const PAIR_SIZE: number = 2;
const FLIPPED_CLASS: string = 'is-flipped';
const DEFAULT_CARD_COUNT: number = 16;
const DEFAULT_COLUMNS: number = 4;
const MISMATCH_DELAY_MS: number = 600;
const GAME_END_DELAY_MS: number = 800;

const COLUMNS_BY_BOARD: Record<string, number> = {
    '16 cards': 4,
    '24 cards': 6,
    '36 cards': 6,
};

const MOTIF_KEYS_BY_THEME: Record<string, MotifKey> = {
    'code-vibes': 'it-motifs',
    'da-projects': 'da-motifs',
};

const DEFAULT_MOTIF_KEY: MotifKey = 'it-motifs';

const BASE_URL: string = import.meta.env.BASE_URL.replace(/\/$/, '');
const GAME_OVER_URL: string = `${BASE_URL}/pages/game-over.html`;
const GAME_SETTINGS_URL: string = `${BASE_URL}/pages/game-settings.html`;

const CURRENT_THEME: string = applyTheme();
const BOARD_LABEL: string = localStorage.getItem('board') ?? '';
const CARD_COUNT: number = Number(BOARD_LABEL.split(' ')[0]) || DEFAULT_CARD_COUNT;
const COLUMNS: number = COLUMNS_BY_BOARD[BOARD_LABEL] ?? DEFAULT_COLUMNS;
const PAIRS_NEEDED: number = CARD_COUNT / PAIR_SIZE;
const MOTIF_KEY: MotifKey = MOTIF_KEYS_BY_THEME[CURRENT_THEME] ?? DEFAULT_MOTIF_KEY;

const GAME_BOARD: HTMLElement | null = document.querySelector<HTMLElement>('#gameBoard');
const PLAYER_TURN_EL: HTMLDivElement | null = document.querySelector<HTMLDivElement>('.player-turn');
const EXIT_DIALOG: HTMLDialogElement | null = document.querySelector<HTMLDialogElement>('#exitDialog');

const SCORE_ELEMENTS: Record<Player, HTMLSpanElement | null> = {
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
 * Liest die in den Settings gewählte Spielerfarbe.
 * @returns die Farbe, mit der das Spiel startet
 */
function getStartPlayer(): Player {
    const saved: string = (localStorage.getItem('player') ?? '').toLowerCase();

    return saved === 'orange' ? 'orange' : 'blue';
}

/**
 * Mischt eine Liste zufällig (Fisher-Yates).
 * @param items - die Liste, die gemischt werden soll
 * @returns eine neue, gemischte Liste
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
 * Wählt die Motive für die Boardgröße aus und verdoppelt sie zu Paaren.
 * @returns die gemischte Liste aller Kartenmotive
 */
function buildCardMotifs(): string[] {
    const motifs: string[] = cardsData[MOTIF_KEY].slice(0, PAIRS_NEEDED);

    return shuffle([...motifs, ...motifs]);
}

/** Zeigt die aktuellen Punkte beider Spieler an. */
function updateScore(): void {
    PLAYERS.forEach((player) => {
        const scoreEl: HTMLSpanElement | null = SCORE_ELEMENTS[player];

        if (scoreEl) {
            scoreEl.textContent = String(state.points[player]);
        }
    });
}

/** Zeigt den aktuellen Spieler im Header an. */
function updateCurrentPlayerDisplay(): void {
    if (PLAYER_TURN_EL) {
        PLAYER_TURN_EL.dataset.player = state.currentPlayer;
    }
}

/** Wechselt zum anderen Spieler. */
function switchPlayer(): void {
    state.currentPlayer = state.currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayerDisplay();
}

/** Gibt die Karten frei, damit der nächste Zug beginnen kann. */
function resetTurn(): void {
    state.flippedCards = [];
    state.isLocked = false;
}

/**
 * Ermittelt anhand der Punkte den Ausgang des Spiels.
 * @returns 'blue', 'orange' oder 'draw' bei Gleichstand
 */
function getWinner(): Winner {
    const { blue, orange } = state.points;

    if (blue === orange) {
        return 'draw';
    }
    return blue > orange ? 'blue' : 'orange';
}

/** Speichert das Ergebnis und öffnet den Game-Over-Screen. */
function endGame(): void {
    localStorage.setItem('scoreBlue', String(state.points.blue));
    localStorage.setItem('scoreOrange', String(state.points.orange));
    localStorage.setItem('winner', getWinner());
    window.location.href = GAME_OVER_URL;
}

/** Wertet ein gefundenes Paar: Punkt vergeben, Spielende prüfen. */
function handleMatch(): void {
    state.points[state.currentPlayer]++;
    updateScore();
    state.matchedPairs++;
    resetTurn();

    if (state.matchedPairs === PAIRS_NEEDED) {
        setTimeout(endGame, GAME_END_DELAY_MS);
    }
}

/**
 * Dreht zwei nicht passende Karten zurück und wechselt den Spieler.
 * @param first - die zuerst aufgedeckte Karte
 * @param second - die danach aufgedeckte Karte
 */
function handleMismatch(first: HTMLButtonElement, second: HTMLButtonElement): void {
    setTimeout(() => {
        first.classList.remove(FLIPPED_CLASS);
        second.classList.remove(FLIPPED_CLASS);
        resetTurn();
        switchPlayer();
    }, MISMATCH_DELAY_MS);
}

/** Vergleicht die beiden aufgedeckten Karten. */
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
 * Deckt eine Karte auf und startet den Vergleich, sobald zwei offen sind.
 * @param card - die angeklickte Karte
 */
function handleCardClick(card: HTMLButtonElement): void {
    if (state.isLocked || card.classList.contains(FLIPPED_CLASS)) {
        return;
    }
    card.classList.add(FLIPPED_CLASS);
    state.flippedCards.push(card);

    if (state.flippedCards.length === PAIR_SIZE) {
        checkMatch();
    }
}

/**
 * Erzeugt eine Karte mit Motiv und Klick-Handler.
 * @param motif - Name des Motivs der Karte
 * @returns das fertige Karten-Element
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

/** Baut das Spielfeld mit allen Karten auf. */
function renderBoard(): void {
    if (!GAME_BOARD) {
        return;
    }
    GAME_BOARD.style.setProperty('--columns', String(COLUMNS));
    buildCardMotifs().forEach((motif) => GAME_BOARD.appendChild(createCard(motif)));
}

/** Öffnet den Dialog zum Beenden des Spiels. */
function openExitDialog(): void {
    EXIT_DIALOG?.showModal();
}

/** Schließt den Dialog und führt das Spiel fort. */
function closeExitDialog(): void {
    EXIT_DIALOG?.close();
}

/** Verlässt das Spiel und kehrt zu den Settings zurück. */
function leaveGame(): void {
    window.location.href = GAME_SETTINGS_URL;
}

/** Verknüpft die Buttons des Exit-Dialogs mit ihren Aktionen. */
function bindExitDialog(): void {
    document.querySelector('#openExitBtn')?.addEventListener('click', openExitDialog);
    document.querySelector('#cancelExitBtn')?.addEventListener('click', closeExitDialog);
    document.querySelector('#confirmExitBtn')?.addEventListener('click', leaveGame);
}

/** Initialisiert das Spiel. */
function init(): void {
    renderBoard();
    updateCurrentPlayerDisplay();
    bindExitDialog();
}

init();