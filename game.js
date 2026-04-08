/* ============================================================
   TIC TAC TOE — game.js
   AI powered by Minimax with Alpha-Beta pruning
   3 difficulty levels: Easy | Medium | Hard
   ============================================================ */

// ── DOM REFERENCES ─────────────────────────────────────────
const boardEl   = document.getElementById('board');
const statusEl  = document.getElementById('status');
const bannerEl  = document.getElementById('banner');
const newBtn    = document.getElementById('new-btn');
const scYou     = document.getElementById('s-you');
const scAi      = document.getElementById('s-ai');
const scDraw    = document.getElementById('s-draw');
const cardYou   = document.getElementById('sc-you');
const cardAi    = document.getElementById('sc-ai');
const lvlBadge  = document.getElementById('level-badge');
const lvlText   = document.getElementById('level-text');
const diffBtns  = document.querySelectorAll('.d-btn');

// ── STATE ───────────────────────────────────────────────────
let cells       = [];       // Array(9) — null | 'X' | 'O'
let gameOver    = false;
let playerTurn  = true;
let difficulty  = 'med';    // 'easy' | 'med' | 'hard'

const scores = { you: 0, ai: 0, draw: 0 };

// ── WIN COMBINATIONS ────────────────────────────────────────
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // cols
  [0, 4, 8], [2, 4, 6]               // diagonals
];

// ── LEVEL META ──────────────────────────────────────────────
const LEVEL_META = {
  easy: { badgeClass: 'easy', label: '🌿 Easy mode' },
  med:  { badgeClass: 'med',  label: '⚡ Medium mode' },
  hard: { badgeClass: 'hard', label: '🔥 Hard mode — unbeatable!' }
};

// ── INITIALISE GAME ─────────────────────────────────────────
function init() {
  cells      = Array(9).fill(null);
  gameOver   = false;
  playerTurn = true;

  boardEl.innerHTML    = '';
  bannerEl.className   = 'result-banner';
  statusEl.textContent = 'Your turn — make a move!';

  setTurnHighlight(true);

  // Build 9 cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => humanMove(i));
    boardEl.appendChild(cell);
  }
}

// ── HIGHLIGHT ACTIVE PLAYER ─────────────────────────────────
function setTurnHighlight(isPlayer) {
  cardYou.classList.toggle('active', isPlayer);
  cardAi.classList.toggle('active', !isPlayer);
}

// ── GET CELL ELEMENT ────────────────────────────────────────
function getCell(index) {
  return boardEl.children[index];
}

// ── PLACE MARK ON BOARD ─────────────────────────────────────
function placeMark(index, player) {
  cells[index] = player;
  const cell   = getCell(index);
  cell.textContent = player;
  cell.classList.add('taken', player === 'X' ? 'x-mark' : 'o-mark');

  // Trigger pop animation
  cell.classList.remove('pop');
  void cell.offsetWidth;            // force reflow
  cell.classList.add('pop');
}

// ── CHECK WIN ───────────────────────────────────────────────
function checkWin(board, player) {
  return WIN_LINES.find(line => line.every(i => board[i] === player)) || null;
}

// ── HUMAN MOVE ──────────────────────────────────────────────
function humanMove(index) {
  if (gameOver || !playerTurn || cells[index]) return;

  placeMark(index, 'X');
  playerTurn = false;
  setTurnHighlight(false);

  const winLine = checkWin(cells, 'X');
  if (winLine) { endGame('🎉 You win! Amazing!', winLine, 'rwin', 'you'); return; }
  if (cells.every(Boolean)) { endGame("🤝 It's a draw!", null, 'rdraw', 'draw'); return; }

  statusEl.textContent = 'AI is thinking…';
  const delay = difficulty === 'easy' ? 300 : 430;
  setTimeout(aiMove, delay);
}

// ── AI MOVE ─────────────────────────────────────────────────
function aiMove() {
  if (gameOver) return;

  const emptyIndices = cells.map((v, i) => v ? null : i).filter(v => v !== null);
  let chosenIndex;

  if (difficulty === 'easy') {
    // 50% optimal, 50% random
    chosenIndex = Math.random() < 0.5
      ? minimax(cells, 'O', -Infinity, Infinity).index
      : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  } else if (difficulty === 'med') {
    // 35% random, 65% optimal
    chosenIndex = Math.random() < 0.35
      ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
      : minimax(cells, 'O', -Infinity, Infinity).index;

  } else {
    // Hard: always optimal (perfect play)
    chosenIndex = minimax(cells, 'O', -Infinity, Infinity).index;
  }

  placeMark(chosenIndex, 'O');
  playerTurn = true;
  setTurnHighlight(true);

  const winLine = checkWin(cells, 'O');
  if (winLine) { endGame('🤖 AI wins! Try again!', winLine, 'rlose', 'ai'); return; }
  if (cells.every(Boolean)) { endGame("🤝 It's a draw!", null, 'rdraw', 'draw'); return; }

  statusEl.textContent = 'Your turn — make a move!';
}

// ── MINIMAX WITH ALPHA-BETA PRUNING ─────────────────────────
/**
 * @param {Array}  board   - current 9-cell state
 * @param {string} player  - 'O' (maximiser) | 'X' (minimiser)
 * @param {number} alpha   - best score for maximiser so far
 * @param {number} beta    - best score for minimiser so far
 * @returns {{ score: number, index: number }}
 */
function minimax(board, player, alpha, beta) {
  const opponent = player === 'O' ? 'X' : 'O';

  // Terminal states
  if (checkWin(board, 'O')) return { score: 10 };
  if (checkWin(board, 'X')) return { score: -10 };

  const available = board.map((v, i) => v ? null : i).filter(v => v !== null);
  if (available.length === 0) return { score: 0 };

  let best = player === 'O'
    ? { score: -Infinity }
    : { score:  Infinity };

  for (const idx of available) {
    board[idx] = player;
    const result = minimax(board, opponent, alpha, beta);
    result.index = idx;
    board[idx] = null;

    if (player === 'O') {
      if (result.score > best.score) best = result;
      alpha = Math.max(alpha, best.score);
    } else {
      if (result.score < best.score) best = result;
      beta = Math.min(beta, best.score);
    }

    // Prune
    if (beta <= alpha) break;
  }

  return best;
}

// ── END GAME ────────────────────────────────────────────────
function endGame(message, winLine, bannerType, winner) {
  gameOver = true;
  statusEl.textContent = '';

  // Highlight winning cells
  if (winLine) {
    winLine.forEach(i => getCell(i).classList.add('win-cell'));
  }

  // Update scores
  if (winner === 'you')  scores.you++;
  else if (winner === 'ai')   scores.ai++;
  else                        scores.draw++;

  scYou.textContent  = scores.you;
  scAi.textContent   = scores.ai;
  scDraw.textContent = scores.draw;

  // Show banner
  bannerEl.textContent = message;
  bannerEl.className   = `result-banner show ${bannerType}`;

  // Remove turn highlights
  setTurnHighlight(false);
  cardYou.classList.remove('active');
  cardAi.classList.remove('active');
}

// ── DIFFICULTY CHANGE ────────────────────────────────────────
function setDifficulty(newDiff) {
  difficulty = newDiff;

  // Update button states
  diffBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.d === newDiff) btn.classList.add('active');
  });

  // Update level badge
  const meta = LEVEL_META[newDiff];
  lvlBadge.className = `level-badge ${meta.badgeClass}`;
  lvlText.textContent = meta.label;

  // Start fresh game
  init();
}

// ── EVENT LISTENERS ─────────────────────────────────────────
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => setDifficulty(btn.dataset.d));
});

newBtn.addEventListener('click', init);

// ── START ────────────────────────────────────────────────────
init();
