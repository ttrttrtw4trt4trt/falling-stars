const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');

let score = 0;
let timeLeft = 30;
let gameInterval = null;
let spawnInterval = null;
let keys = { left: false, right: false };

function startGame() {
  // reset
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;

  // remove old stars
  document.querySelectorAll('.star').forEach(s => s.remove());

  // start timers
  gameInterval = setInterval(gameTick, 1000);
  spawnInterval = setInterval(spawnStar, 800);
  requestAnimationFrame(gameLoop);
}

function gameTick() {
  timeLeft--;
  timeEl.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  alert('Time up! Your score: ' + score);
}

function spawnStar() {
  const star = document.createElement('div');
  star.className = 'star';
  const x = Math.random() * (gameArea.clientWidth - 24);
  star.style.left = x + 'px';
  gameArea.appendChild(star);

  // animate falling
  let y = -30;
  const speed = 1 + Math.random() * 2; // speed per frame
  function fall() {
    y += speed;
    star.style.top = y + 'px';

    // check collision with player
    const pRect = player.getBoundingClientRect();
    const sRect = star.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();

    // convert to game-area coordinates
    const sTop = sRect.top - areaRect.top;
    const sLeft = sRect.left - areaRect.left;

    const pTop = pRect.top - areaRect.top;
    const pLeft = pRect.left - areaRect.left;

    // simple collision check
    if (sTop + sRect.height >= pTop &&
        sLeft + sRect.width > pLeft &&
        sLeft < pLeft + pRect.width) {
      // caught
      score++;
      scoreEl.textContent = score;
      star.remove();
      return;
    }

    if (y > gameArea.clientHeight + 50) {
      star.remove();
      return;
    }
    requestAnimationFrame(fall);
  }
  requestAnimationFrame(fall);
}

function gameLoop() {
  // move player
  const step = 6;
  let left = player.offsetLeft;
  if (keys.left) left -= step;
  if (keys.right) left += step;
  left = Math.max(0, Math.min(gameArea.clientWidth - player.clientWidth, left));
  player.style.left = left + 'px';

  requestAnimationFrame(gameLoop);
}

// controls
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

startBtn.addEventListener('click', startGame);
