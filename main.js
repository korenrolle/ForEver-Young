// main.js — Forever Young Casino · entry point
// ES module; imported by index.html as type="module"

import { Scene3D, SYMBOLS, REEL_STRIPS } from './js/Scene3D.js';
import { Player, RANKS, BET_LEVELS }      from './js/Player.js';
import { AudioEngine }                     from './js/Audio.js';

// ─── Boot ────────────────────────────────────────────────────────────────────
const player = Player.load();
const audio  = new AudioEngine();
let   scene  = null;
let   spinning = false;
let   betIndex = 1;

// ─── DOM refs ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const el = {
  balance  : $('balance-val'),
  jackpot  : $('jackpot-val'),
  betVal   : $('bet-val'),
  betDown  : $('bet-down'),
  betUp    : $('bet-up'),
  rankIcon : $('rank-icon'),
  rankName : $('rank-name'),
  xpFill   : $('xp-fill'),
  xpLabel  : $('xp-label'),
  spinBtn  : $('spin-btn'),
  maxBtn   : $('max-btn'),
  dailyBtn : $('daily-btn'),
  soundBtn : $('sound-btn'),
  statsBtn : $('stats-btn'),
  statsClose: $('stats-close'),
  statsPanel: $('stats-panel'),
  stSpins  : $('st-spins'),
  stWins   : $('st-wins'),
  stBiggest: $('st-biggest'),
  stXP     : $('st-xp'),
  rankLadder: $('rank-ladder'),
  toast    : $('toast'),
  winOverlay: $('win-overlay'),
  winTitle : $('win-title'),
  winAmount: $('win-amount'),
  winXPGain: $('win-xp-gain'),
  winEmoji : $('win-emoji'),
  winClose : $('win-close'),
  confetti : $('confetti-layer'),
  rankModal: $('rankup-modal'),
  rankNew  : $('rankup-new'),
  rankReward: $('rankup-reward'),
  rankClose: $('rankup-close'),
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = n => '$' + Math.floor(n).toLocaleString('en-US');

// ─── UI refresh ─────────────────────────────────────────────────────────────
function refreshUI() {
  const rank   = player.rank;
  const levels = BET_LEVELS[player.rankId];
  if (betIndex >= levels.length) betIndex = levels.length - 1;
  const bet    = levels[betIndex];

  el.balance.textContent  = fmt(player.balance);
  el.betVal.textContent   = fmt(bet);
  el.rankIcon.textContent = rank.icon;
  el.rankName.textContent = rank.name;
  el.rankName.style.color = rank.color;

  const prog = player.rankProgress;
  el.xpFill.style.width   = (prog * 100) + '%';
  el.xpFill.style.background =
    `linear-gradient(90deg, ${rank.color}, #ff44ff)`;

  const next = player.nextRank;
  el.xpLabel.textContent = next
    ? `${player.xp.toLocaleString()} / ${next.minXP.toLocaleString()} XP`
    : `${player.xp.toLocaleString()} XP · LEGEND`;

  // button states
  el.spinBtn.disabled  = spinning || player.balance < bet;
  el.betDown.disabled  = betIndex <= 0;
  el.betUp.disabled    = betIndex >= levels.length - 1;
  el.dailyBtn.textContent = player.dailyAvailable
    ? `🎁 Daily ${fmt(rank.daily)}`
    : '🕐 Daily (tomorrow)';
  el.dailyBtn.disabled = !player.dailyAvailable;

  // stats panel
  el.stSpins.textContent   = player.totalSpins.toLocaleString();
  el.stWins.textContent    = player.totalWins.toLocaleString();
  el.stBiggest.textContent = fmt(player.biggestWin);
  el.stXP.textContent      = player.xp.toLocaleString();

  buildLadder();
}

function buildLadder() {
  el.rankLadder.innerHTML = '';
  RANKS.forEach(r => {
    const div = document.createElement('div');
    div.className = 'ladder-row' +
      (r.id === player.rankId ? ' active' : '') +
      (r.id > player.rankId   ? ' locked' : '');
    const check = r.id < player.rankId ? '<span class="ladder-check">✓</span>' : '';
    div.innerHTML = `
      <span class="ladder-icon">${r.icon}</span>
      <div class="ladder-info">
        <div class="ladder-name" style="color:${r.color}">${r.name}</div>
        <div class="ladder-xp">${r.minXP.toLocaleString()} XP required</div>
      </div>
      ${check}`;
    el.rankLadder.appendChild(div);
  });
}

// ─── Jackpot ticker ──────────────────────────────────────────────────────────
let jackpotValue = 10_000_000;
function tickJackpot() {
  jackpotValue += Math.floor(Math.random() * 1200 + 300);
  el.jackpot.textContent = fmt(jackpotValue);
  setTimeout(tickJackpot, 600 + Math.random() * 500);
}

// ─── Toast ───────────────────────────────────────────────────────────────────
let _toastTimer = null;
function toast(msg, ms = 3200) {
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.toast.classList.remove('show'), ms);
}

// ─── Confetti ────────────────────────────────────────────────────────────────
const CONF_COLORS = ['#ffd700','#ff4444','#00ff88','#ff8800','#ffffff','#ff44cc','#44aaff'];
function fireConfetti(count = 80) {
  el.confetti.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const size = 6 + Math.random() * 10;
    c.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${CONF_COLORS[i % CONF_COLORS.length]};
      width: ${size}px; height: ${size * (1 + Math.random())}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.4}s;
    `;
    el.confetti.appendChild(c);
  }
}

// ─── Win overlay ─────────────────────────────────────────────────────────────
const WIN_EMOJIS = {
  mega: '🌟', jackpot: '💎', high: '🔥', mid: '⭐', low: '🎉', common: '✨', partial: '👍'
};
const WIN_TITLES = {
  mega:    '🌟 MEGA JACKPOT! 🌟',
  jackpot: '💎 JACKPOT! 💎',
  high:    '🔥 BIG WIN! 🔥',
  mid:     '⭐ GREAT WIN! ⭐',
  low:     '🎉 WINNER! 🎉',
  common:  '✨ WINNER! ✨',
  partial: '👍 CLOSE ONE!',
};

function showWin(tier, amount, xpGain) {
  el.winOverlay.dataset.tier = tier;
  el.winEmoji.textContent  = WIN_EMOJIS[tier] || '🏆';
  el.winTitle.textContent  = WIN_TITLES[tier]  || 'WINNER!';
  el.winAmount.textContent = '+' + fmt(amount);
  el.winXPGain.textContent = `+${xpGain} XP`;
  el.winOverlay.classList.add('show');
  fireConfetti(tier === 'mega' ? 200 : tier === 'jackpot' ? 150 : 80);
}

el.winClose.addEventListener('click', () => {
  el.winOverlay.classList.remove('show');
});

// ─── Rank-up modal ────────────────────────────────────────────────────────────
function showRankUp(rank) {
  el.rankNew.textContent    = `${rank.icon} ${rank.name}`;
  el.rankNew.style.color    = rank.color;
  el.rankReward.textContent = rank.reward > 0
    ? `+${fmt(rank.reward)} bonus chips! Daily bonus: ${fmt(rank.daily)}`
    : '';
  el.rankModal.classList.add('show');
}

el.rankClose.addEventListener('click', () => {
  el.rankModal.classList.remove('show');
});

// ─── Spin logic ──────────────────────────────────────────────────────────────
function currentBet() {
  return BET_LEVELS[player.rankId][betIndex];
}

async function doSpin() {
  const bet = currentBet();
  if (spinning || player.balance < bet) return;

  audio.init();
  audio.spin();

  spinning = true;
  player.balance -= bet;
  player.totalSpins++;
  refreshUI();

  // Pick random stop index for each reel
  const stopIndices  = REEL_STRIPS.map(strip => Math.floor(Math.random() * strip.length));
  const symbolIds    = stopIndices.map((si, ri) => REEL_STRIPS[ri][si]);

  let reelsDone = 0;
  scene.spin(stopIndices, reelIdx => {
    audio.stopSpin();
    audio.reelStop(reelIdx);
    reelsDone++;
    if (reelsDone === 3) {
      setTimeout(() => evaluate(symbolIds, bet), 320);
    }
  });
}

function evaluate(symbolIds, bet) {
  const [a, b, c] = symbolIds;
  const symA = SYMBOLS[a];

  let win    = 0;
  let tier   = '';
  let xpGain = 5; // base XP for any spin

  if (a === b && b === c) {
    // Jackpot — three of a kind
    win    = Math.floor(bet * symA.payout);
    tier   = symA.tier;
    xpGain = xpGain + Math.min(200, symA.payout * 2);
    player.totalWins++;
    if (win > player.biggestWin) player.biggestWin = win;

  } else if (a === b || b === c || a === c) {
    // Two of a kind — small consolation
    win    = Math.floor(bet * 1.5);
    tier   = 'partial';
    xpGain = xpGain + 8;
    player.totalWins++;
    if (win > player.biggestWin) player.biggestWin = win;
  }

  if (win > 0) {
    player.balance += win;
    audio.win(win / bet);
    scene.celebrateWin(tier);
    showWin(tier, win, xpGain);
  } else {
    audio.lose();
    toast('No match — try again!');
  }

  // XP & possible rank-up
  const rankedUp = player.addXP(xpGain);
  if (rankedUp) {
    audio.rankUp();
    const delay = win > 0 ? 2800 : 600;
    setTimeout(() => showRankUp(rankedUp), delay);
  }

  player.save();

  setTimeout(() => {
    spinning = false;
    refreshUI();
  }, 400);
}

// ─── Controls ────────────────────────────────────────────────────────────────
el.spinBtn.addEventListener('click', doSpin);

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !spinning) { e.preventDefault(); doSpin(); }
});

el.betDown.addEventListener('click', () => {
  audio.init(); audio.click();
  if (betIndex > 0) { betIndex--; refreshUI(); }
});

el.betUp.addEventListener('click', () => {
  audio.init(); audio.click();
  const levels = BET_LEVELS[player.rankId];
  if (betIndex < levels.length - 1) { betIndex++; refreshUI(); }
});

el.maxBtn.addEventListener('click', () => {
  audio.init(); audio.click();
  betIndex = BET_LEVELS[player.rankId].length - 1;
  refreshUI();
  doSpin();
});

el.dailyBtn.addEventListener('click', () => {
  audio.init(); audio.click();
  const bonus = player.claimDaily();
  if (bonus > 0) {
    toast(`🎁 Daily bonus claimed: ${fmt(bonus)}! Come back tomorrow.`, 4500);
    refreshUI();
  }
});

// sound toggle
el.soundBtn.addEventListener('click', () => {
  audio.init();
  audio.enabled = !audio.enabled;
  el.soundBtn.textContent = audio.enabled ? '🔊' : '🔇';
});

// stats panel
el.statsBtn.addEventListener('click', () => {
  audio.init(); audio.click();
  el.statsPanel.classList.toggle('hidden');
});
el.statsClose.addEventListener('click', () => {
  el.statsPanel.classList.add('hidden');
});

// ─── Init ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  scene = new Scene3D($('game-canvas'));
  refreshUI();
  tickJackpot();

  // Welcome message
  setTimeout(() => {
    const r = player.rank;
    toast(`Welcome back, ${r.icon} ${r.name}! Balance: ${fmt(player.balance)}`);
  }, 1200);

  // Remind about daily bonus
  if (player.dailyAvailable) {
    setTimeout(() => toast('🎁 Your daily bonus is ready — claim it below!', 5000), 2800);
  }
});
