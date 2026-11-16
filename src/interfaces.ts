import type { Player } from './types';

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