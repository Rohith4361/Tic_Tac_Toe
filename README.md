# Tic Tac Toe — You vs AI

A beautiful, fully-featured Tic Tac Toe game with an impressive dark-purple UI,
coloured cells, glowing X/O marks, and a smart AI opponent.

---

## Project Structure

```
TicTacToe-Project/
├── index.html    ← Main HTML file (open this in your browser)
├── style.css     ← All visual styles & animations
├── game.js       ← Game logic + AI (Minimax with Alpha-Beta pruning)
└── README.md     ← You are here
```

---

## How to Run

1. Download / unzip the folder.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
3. No server, no dependencies, no installation needed — it just works!

---

## Features

### Difficulty Levels
| Level  | Colour | AI Behaviour                                         |
|--------|--------|------------------------------------------------------|
| Easy   | Green  | 50% optimal moves, 50% random — great for beginners |
| Medium | Amber  | 65% optimal, 35% random — makes occasional mistakes |
| Hard   | Red    | Perfect Minimax AI — best possible play every turn   |

- The **active level is always shown** via a glowing button border + indicator dot + badge below.

### Visual Design
- **Dark purple gradient** background with glass-morphism card.
- **9 uniquely coloured cells** (indigo, pink, teal, amber, red, emerald, purple, blue, rose).
- **X marks** glow cyan/sky-blue with a matching cell tint.
- **O marks** glow violet/purple with a matching cell tint.
- **Winning cells** pulse green so the result is immediately obvious.
- **Difficulty buttons** are colour-coded (green / amber / red) with a glow when active.
- Pop-in animations on every placed mark.
- Slide-up result banner: green = win, red = lose, amber = draw.

### Scoreboard
- Tracks wins, losses, and draws across multiple rounds.
- Active-player card highlights (cyan glow for You, purple glow for AI).

### AI — How it Works
The AI uses the **Minimax algorithm** with **Alpha-Beta pruning**:
- Explores all possible future game states recursively.
- Scores each outcome: +10 for AI win, -10 for player win, 0 for draw.
- Picks the move that maximises its own score while assuming the human plays optimally.
- Alpha-Beta pruning skips branches that can't affect the result, making it fast.

On **Hard** mode, the AI never loses — the best you can achieve is a draw.

---

## Browser Compatibility

Works in all modern browsers. No external libraries or frameworks required.

---

## Customisation Tips

- Change cell colours: edit `style.css` → `.cell:nth-child(N)` entries.
- Change AI difficulty ratios: edit `game.js` → `aiMove()` function.
- Change background gradient: edit `style.css` → `body` rule.
- Add sounds: hook into `placeMark()` and `endGame()` in `game.js`.
