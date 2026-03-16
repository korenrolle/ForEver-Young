// =============================================
//  ForEver Young — Full Casino Slot Machine
// =============================================

// ---- Symbol definitions ----
// Each symbol has: emoji, weight (lower = rarer), payout multiplier, name, tier
const SYMBOLS = [
  { emoji: '🎙',  weight: 1,  payout: 100,  name: 'Mic',       tier: 'mega'    },
  { emoji: '⏳',  weight: 2,  payout: 75,   name: 'Jackpot',   tier: 'jackpot' },
  { emoji: '💸',  weight: 4,  payout: 50,   name: 'Money',     tier: 'high'    },
  { emoji: '💊',  weight: 6,  payout: 10,   name: 'Pill',      tier: 'high'    },
  { emoji: '🧬',  weight: 8,  payout: 5,    name: 'DNA',       tier: 'mid'     },
  { emoji: '🦠',  weight: 8,  payout: 4,    name: 'Virus',     tier: 'mid'     },
  { emoji: '🌡',  weight: 10, payout: 3,    name: 'Temp',      tier: 'low'     },
  { emoji: '🧪',  weight: 10, payout: 2,    name: 'Flask',     tier: 'low'     },
  { emoji: '🎈',  weight: 12, payout: 1.5,  name: 'Balloon',   tier: 'low'     },
  { emoji: '🧸',  weight: 14, payout: 1.2,  name: 'Bear',      tier: 'common'  },
  { emoji: '🖍',  weight: 18, payout: 0.8,  name: 'Crayon',    tier: 'common'  },
  { emoji: '📟',  weight: 22, payout: 0.5,  name: 'Pager',     tier: 'common'  },
  { emoji: '📸',  weight: 30, payout: 0,    name: 'Camera',    tier: 'miss'    },
];

// Build weighted pool
const POOL = [];
SYMBOLS.forEach(sym => {
  for (let i = 0; i < sym.weight; i++) POOL.push(sym);
});

function pickSymbol() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

// ---- Game state ----
let balance      = 1_000_000;
let currentBet   = 10_000;
let lastWin      = 0;
let spinning     = false;
let spinTimeouts = [];

// ---- DOM refs ----
const balanceEl     = document.getElementById('numberPlace');
const currentBetEl  = document.getElementById('currentBet');
const lastWinEl     = document.getElementById('lastWin');
const jackpotEl     = document.getElementById('jackpotDisplay');
const spinBtn       = document.getElementById('subtract');
const maxBtn        = document.getElementById('endGame');
const fortuneBtn    = document.getElementById('positive');
const fortuneEl     = document.getElementById('fortuneDisplay');
const winOverlay    = document.getElementById('winOverlay');
const winTitleEl    = document.getElementById('winTitle');
const winAmountEl   = document.getElementById('winAmount');
const winCloseBtn   = document.getElementById('winCloseBtn');
const winLineEl     = document.getElementById('winLine');
const confettiEl    = document.getElementById('confettiContainer');
const cabinet       = document.querySelector('.slot-cabinet');
const betOptions    = document.querySelectorAll('.bet-option');

// Reel strip containers
const strips = [
  document.getElementById('strip1'),
  document.getElementById('strip2'),
  document.getElementById('strip3'),
];
const reelContainers = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
];

// ---- Fortune messages ----
const FORTUNES = [
  'The way the wind blows is consistent, the direction is not.',
  'You are older than you have ever been, and younger than you\'ll ever be.',
  'Every spin is a fresh beginning.',
  'Fortune favors those who keep spinning.',
  'The best days are still ahead.',
  'Youth is a state of mind — keep playing.',
  'Luck is the dividend of sweat. The more you spin, the luckier you get.',
  'Stars can\'t shine without a little darkness.',
  'Time flies. You are the pilot.',
  'Not all who wander are lost — some are just looking for the jackpot.',
];

// ---- Initialize reels with filler symbols ----
function buildReelStrip(stripEl) {
  stripEl.innerHTML = '';
  // Fill with 12 random symbols for the visual strip
  for (let i = 0; i < 12; i++) {
    const div = document.createElement('div');
    div.className = 'reel-symbol';
    div.textContent = pickSymbol().emoji;
    stripEl.appendChild(div);
  }
}

strips.forEach(buildReelStrip);

// ---- Update displays ----
function fmt(n) {
  return '$' + n.toLocaleString('en-US');
}

function updateDisplays() {
  balanceEl.textContent   = fmt(balance);
  currentBetEl.textContent = fmt(currentBet);
  lastWinEl.textContent   = fmt(lastWin);

  if (balance < currentBet) {
    balanceEl.classList.add('broke');
  } else {
    balanceEl.classList.remove('broke');
  }
}

// ---- Particles ----
function spawnParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left     = Math.random() * 100 + 'vw';
    p.style.animationDuration  = (4 + Math.random() * 8) + 's';
    p.style.animationDelay     = (Math.random() * 10) + 's';
    p.style.width  = (2 + Math.random() * 4) + 'px';
    p.style.height = (2 + Math.random() * 4) + 'px';
    const hue = [60, 30, 0][Math.floor(Math.random() * 3)];
    p.style.background = `hsl(${hue}, 100%, 60%)`;
    container.appendChild(p);
  }
}
spawnParticles();

// ---- Confetti burst ----
const CONFETTI_COLORS = ['#ffd700','#ff4444','#00ff88','#ff8800','#ffffff','#ff44cc','#44aaff'];
function fireConfetti(count = 80) {
  confettiEl.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left            = Math.random() * 100 + 'vw';
    c.style.background      = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    c.style.width           = (6 + Math.random() * 10) + 'px';
    c.style.height          = (10 + Math.random() * 16) + 'px';
    c.style.borderRadius    = Math.random() > 0.5 ? '50%' : '2px';
    c.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    c.style.animationDelay    = (Math.random() * 0.5) + 's';
    confettiEl.appendChild(c);
  }
}

// ---- Win overlay ----
function showWin(title, amount, tier) {
  winTitleEl.textContent  = title;
  winAmountEl.textContent = '+' + fmt(amount);
  winOverlay.classList.add('show');

  const emojiMap = { mega: '🎙', jackpot: '⏳', high: '💸', mid: '🌟', low: '✨', common: '🎉' };
  winOverlay.querySelector('.win-emoji').textContent = emojiMap[tier] || '🏆';

  const confettiCount = tier === 'mega' ? 200 : tier === 'jackpot' ? 150 : 80;
  fireConfetti(confettiCount);

  if (tier === 'mega' || tier === 'jackpot') {
    cabinet.classList.add('jackpot-flash');
    setTimeout(() => cabinet.classList.remove('jackpot-flash'), 2500);
  }
}

winCloseBtn.addEventListener('click', () => {
  winOverlay.classList.remove('show');
  winLine.classList.remove('active');
});

// ---- Reel spin animation ----
// Uses CSS transform animation to scroll the strip, then snaps to result
function animateReel(reelIdx, resultSymbol, delay) {
  return new Promise(resolve => {
    const strip = strips[reelIdx];
    const container = reelContainers[reelIdx];

    // Rebuild strip with shuffled symbols, result at the end center
    strip.innerHTML = '';
    const ROWS = 14;
    for (let i = 0; i < ROWS - 1; i++) {
      const div = document.createElement('div');
      div.className = 'reel-symbol';
      div.textContent = pickSymbol().emoji;
      strip.appendChild(div);
    }
    // Place result symbol as last visible
    const resultDiv = document.createElement('div');
    resultDiv.className = 'reel-symbol';
    resultDiv.textContent = resultSymbol.emoji;
    strip.appendChild(resultDiv);

    const symbolHeight = 130;
    const totalHeight  = ROWS * symbolHeight;
    // Start position: show first symbol
    strip.style.transition = 'none';
    strip.style.transform  = 'translateY(0)';

    const spinTimeout = setTimeout(() => {
      // Animate to show the last (result) symbol in center
      const targetY = -((ROWS - 1) * symbolHeight) + (container.clientHeight / 2 - symbolHeight / 2);
      strip.style.transition = `transform ${0.35 + reelIdx * 0.15}s cubic-bezier(0.17, 0.67, 0.35, 1.0)`;
      strip.style.transform  = `translateY(${targetY}px)`;

      const endTimeout = setTimeout(() => {
        resolve(resultSymbol);
      }, (0.35 + reelIdx * 0.15) * 1000 + 60);
      spinTimeouts.push(endTimeout);
    }, delay);
    spinTimeouts.push(spinTimeout);
  });
}

// Quick blur scroll effect before settle
function startBlurScroll(reelIdx) {
  const container = reelContainers[reelIdx];
  container.classList.add('spinning');
}
function stopBlurScroll(reelIdx) {
  reelContainers[reelIdx].classList.remove('spinning');
}

// ---- Core spin logic ----
async function doSpin(bet) {
  if (spinning) return;
  if (balance < bet) {
    showBroke();
    return;
  }

  spinning = true;
  balance -= bet;
  updateDisplays();
  winLineEl.classList.remove('active');

  // Disable buttons
  spinBtn.classList.add('disabled');
  maxBtn.classList.add('disabled');

  // Pick results
  const results = [pickSymbol(), pickSymbol(), pickSymbol()];

  // Start blur scroll on all reels
  [0, 1, 2].forEach(i => startBlurScroll(i));

  // After brief scroll show (simulate fast spinning)
  const blurDuration = 400;
  await new Promise(r => setTimeout(r, blurDuration));

  // Stop blur and animate settle per reel (staggered)
  [0, 1, 2].forEach(i => stopBlurScroll(i));

  // Animate each reel settling
  await Promise.all([
    animateReel(0, results[0], 0),
    animateReel(1, results[1], 160),
    animateReel(2, results[2], 320),
  ]);

  // Evaluate result
  evaluateResult(results, bet);

  spinning = false;
  checkCanPlay();
}

function evaluateResult(results, bet) {
  const [a, b, c] = results;
  const allMatch = a.emoji === b.emoji && b.emoji === c.emoji;

  if (allMatch) {
    const sym    = a;
    const payout = Math.floor(bet * sym.payout);
    balance += payout;
    lastWin  = payout;
    updateDisplays();

    winLineEl.classList.add('active');

    // Title based on tier
    const titleMap = {
      mega:    '🎙 MEGA JACKPOT! 🎙',
      jackpot: '⏳ JACKPOT! ⏳',
      high:    '💰 BIG WIN! 💰',
      mid:     '✨ NICE WIN! ✨',
      low:     '🎉 WINNER! 🎉',
      common:  '👍 WINNER! 👍',
      miss:    'WINNER!',
    };

    showWin(titleMap[sym.tier] || 'WINNER!', payout, sym.tier);
  } else {
    lastWin = 0;
    updateDisplays();
  }
}

function checkCanPlay() {
  if (balance < 1000) {
    spinBtn.classList.add('disabled');
    maxBtn.classList.add('disabled');
    showBroke();
  } else {
    if (balance >= currentBet) spinBtn.classList.remove('disabled');
    if (balance >= 100000)     maxBtn.classList.remove('disabled');
  }
}

function showBroke() {
  balanceEl.classList.add('broke');
  fortuneEl.textContent = 'You\'ve run out of chips. But ForEver Young means you can always start over!';
  fortuneEl.classList.add('visible');
}

// ---- Bet selector ----
betOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = parseInt(btn.dataset.bet, 10);
    if (val > balance) return;
    currentBet = val;
    betOptions.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateDisplays();
  });
});

// ---- Spin button ----
spinBtn.addEventListener('click', () => doSpin(currentBet));

// ---- Max bet button ----
maxBtn.addEventListener('click', () => {
  const maxBet = 100_000;
  if (balance < maxBet) return;
  currentBet = maxBet;
  betOptions.forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.bet) === maxBet);
  });
  updateDisplays();
  doSpin(maxBet);
});

// ---- Fortune button ----
fortuneBtn.addEventListener('click', () => {
  const msg = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  fortuneEl.classList.remove('visible');
  setTimeout(() => {
    fortuneEl.textContent = msg;
    fortuneEl.classList.add('visible');
  }, 100);
});

// ---- Jackpot counter ticker (cosmetic) ----
let jackpotValue = 1_000_000;
function tickJackpot() {
  jackpotValue += Math.floor(Math.random() * 500 + 100);
  jackpotEl.textContent = '$' + jackpotValue.toLocaleString('en-US');
  setTimeout(tickJackpot, 800 + Math.random() * 400);
}
tickJackpot();

// ---- Init ----
updateDisplays();
