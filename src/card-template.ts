/**
 * Creates the HTML of a memory card with front and back side.
 * @param motif - the name of the motif that becomes visible when the card is flipped
 * @returns the HTML of the card as a string
 */
export function renderCard(motif: string): string {
    return `
        <div class="card__inner">
            <div class="card__face"></div>
            <div class="card__face card__face--back" data-motif="${motif}"></div>
        </div>
    `;
}