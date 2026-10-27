/**
 * Erzeugt das HTML einer Memory-Karte mit Vorder- und Rückseite.
 * @param motif - Name des Motivs, das beim Umdrehen sichtbar wird
 * @returns das HTML der Karte als String
 */
export function renderCard(motif: string): string {
    return `
        <div class="card__inner">
            <div class="card__face"></div>
            <div class="card__face card__face--back" data-motif="${motif}"></div>
        </div>
    `;
}