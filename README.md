# Memory

Ein browserbasiertes Memory-Spiel, gebaut mit **TypeScript** und **SCSS**. Du spielst gegen einen Freund, wählst dein Theme, deine Spielfarbe und die Boardgröße, und deckst Kartenpaare auf, bis das Spielfeld leer ist.

## Features

- Zwei auswählbare Themes: **Code Vibes** und **DA Projects**, jeweils mit eigenem Farbschema, eigenen Icons und eigener Schriftart
- Drei Boardgrößen: 16, 24 oder 36 Karten
- Spielerfarbe frei wählbar (Blau oder Orange)
- Punktevergabe bei gefundenen Paaren, automatischer Spielerwechsel bei Fehlversuchen
- Eigene Ergebnis-Screens für Sieg, Niederlage und Unentschieden
- Theme- und Spielstand-Übergabe zwischen den Seiten per `localStorage`

## Tech-Stack

- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/) nach dem [7-1-Pattern](https://sass-guidelin.es/#the-7-1-pattern)
- [Vite](https://vitejs.dev/) als Build-Tool

## Spielablauf

1. **Startseite** (`index.html`) – Einstieg ins Spiel
2. **Settings** (`game-settings.html`) – Theme, Spielerfarbe und Boardgröße auswählen
3. **Game** (`game.html`) – Karten aufdecken, Paare finden, Punkte sammeln
4. Je nach Ergebnis landest du auf:
   - **Win Screen** (`win-screen.html`), wenn deine Farbe gewinnt
   - **Game Over** (`game-over.html`), wenn die gegnerische Farbe gewinnt (leitet nach 3 Sekunden automatisch zurück zu den Settings)
   - **Draw** (`draw.html`), bei Punktegleichstand

## Lizenz

Dieses Projekt dient Lernzwecken im Rahmen einer Ausbildung/eines Kurses.
