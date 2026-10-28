# Memory

Ein browserbasiertes Memory-Spiel, gebaut mit **TypeScript** und **SCSS**. Du spielst gegen einen Freund am selben Gerät, wählst dein Theme, deine Spielfarbe und die Boardgröße und deckst abwechselnd Kartenpaare auf, bis das Spielfeld leer ist.

## Features

- Zwei auswählbare Themes: **Code Vibes** und **DA Projects**, jeweils mit eigenem Farbschema, eigenen Icons, Kartenmotiven und Schriftart
- Live-Vorschau des Themes in den Settings, auch beim Überfahren der Optionen mit der Maus
- Drei Boardgrößen: 16, 24 oder 36 Karten, die Karten werden bei jeder Runde neu gemischt
- Spielerfarbe frei wählbar (Blau oder Orange), diese Farbe beginnt das Spiel
- Ein gefundenes Paar gibt einen Punkt und der Spieler darf weiterspielen, bei einem Fehlversuch wechselt der Spieler
- Live-Punktestand und Anzeige des aktuellen Spielers im Header
- Exit-Dialog im Spiel: Die Einstellungen bleiben erhalten, wenn du das Spiel verlässt
- Drei Ergebnis-Screens (Game Over, Win, Draw) mit Einblend-Animation
- Theme-, Einstellungs- und Ergebnis-Übergabe zwischen den Seiten per `localStorage`
- Animierte Karten (3D-Flip) und Hover-Effekte an allen Buttons

## Tech-Stack

- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/) nach dem [7-1-Pattern](https://sass-guidelin.es/#the-7-1-pattern)
- [Vite](https://vitejs.dev/) als Build-Tool (Multi-Page-Setup)

## Spielablauf

1. **Startseite** (`index.html`): Einstieg ins Spiel über den Play-Button
2. **Settings** (`pages/game-settings.html`): Theme, Spielerfarbe und Boardgröße auswählen. Der Start-Button wird aktiv, sobald alle drei Auswahlen getroffen sind
3. **Game** (`pages/game.html`): Karten aufdecken, Paare finden, Punkte sammeln
4. Nach dem letzten Paar erscheint immer zuerst der **Game-Over-Screen** (`pages/game-over.html`) mit dem Endstand. Nach 2 Sekunden folgt automatisch:
   - der **Win-Screen** (`pages/win-screen.html`) in der Farbe des Gewinners oder
   - der **Draw-Screen** (`pages/draw.html`) bei Punktegleichstand
5. Ein Klick auf **Home** setzt alle gespeicherten Daten zurück und führt zurück zu den Settings

Verlässt du das Spiel über **Exit game**, bleiben deine Einstellungen gespeichert und sind in den Settings wieder vorausgewählt.

## Installation und Start

### Voraussetzungen

- [Node.js](https://nodejs.org/) ab Version 20.11
- npm (wird mit Node.js installiert)

### Schritte

```bash
git clone <repository-url>
cd Memory
npm install
npm run dev
```

Der Dev-Server gibt im Terminal die Adresse aus, meist `http://localhost:5173/Memory/`. Das Projekt ist auf den Unterordner `/Memory/` eingestellt, deshalb gehört er mit in die Adresse. Ohne ihn erscheint eine leere Seite.

Beenden kannst du den Server mit `Strg + C`.

## So funktioniert es

- **Themes:** Das gewählte Theme steht als Attribut `data-theme` am `<body>`. Die Theme-Dateien definieren nur CSS-Variablen (Farben, Schrift, Bilder), die Struktur-Styles bleiben für beide Themes gleich.
- **Gewinner:** Auf den Ergebnis-Screens steht der Gewinner als `data-winner` am `<body>`. Daraus ergeben sich Farbe und Spielfigur des Win-Screens.
- **Kartenmotive:** Die Motive stehen als Namen in `cards.json`. Die Bilder werden per SCSS zugeordnet, damit Vite die Pfade beim Build korrekt umschreibt.
- **Datenübergabe:** Theme, Spielerfarbe, Boardgröße, Punkte und Gewinner liegen im `localStorage` und werden zwischen den Seiten weitergegeben.
- **Multi-Page-Build:** Jede HTML-Datei ist ein eigener Einstiegspunkt in der `vite.config.ts`.

## Lizenz
 
Dieses Projekt dient Lernzwecken im Rahmen einer Ausbildung/eines Kurses.
