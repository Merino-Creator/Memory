import type cardsData from './data/cards.json';

/** The two player colors. */
export type Player = 'blue' | 'orange';

/** The outcome of a game: a player color or a draw. */
export type Winner = Player | 'draw';

/** The keys of the motif lists in cards.json. */
export type MotifKey = keyof typeof cardsData;

/** The kinds of selections made on the settings page. */
export type SelectionKey = 'theme' | 'player' | 'board';

/** The current selections made on the settings page. */
export interface Selections {
    theme: string;
    player: string;
    board: string;
}

/** The state of a running game. */
export interface GameState {
    currentPlayer: Player;
    points: Record<Player, number>;
    flippedCards: HTMLButtonElement[];
    isLocked: boolean;
    matchedPairs: number;
}