// js/Player.js — Player progression, ranks, XP, persistence

export const RANKS = [
  { id: 0, name: 'Rookie',      icon: '🎰', minXP: 0,      color: '#9ca3af', reward: 0,         daily: 500    },
  { id: 1, name: 'Regular',     icon: '🃏', minXP: 500,    color: '#4ade80', reward: 5000,      daily: 2000   },
  { id: 2, name: 'High Roller', icon: '🎲', minXP: 2000,   color: '#60a5fa', reward: 25000,     daily: 10000  },
  { id: 3, name: 'VIP',         icon: '💎', minXP: 5000,   color: '#a78bfa', reward: 100000,    daily: 50000  },
  { id: 4, name: 'Elite',       icon: '👑', minXP: 15000,  color: '#fbbf24', reward: 500000,    daily: 100000 },
  { id: 5, name: 'Legend',      icon: '🌟', minXP: 50000,  color: '#ef4444', reward: 2000000,   daily: 500000 },
];

// Bet levels unlocked per rank
export const BET_LEVELS = [
  [50, 100, 250, 500],
  [100, 500, 1000, 5000],
  [500, 1000, 5000, 10000],
  [1000, 5000, 25000, 50000],
  [5000, 25000, 100000, 250000],
  [10000, 50000, 250000, 1000000],
];

const SAVE_KEY = 'foreverYoung_v3';

export class Player {
  constructor() {
    this.balance      = 10000;
    this.xp           = 0;
    this.rankId       = 0;
    this.totalSpins   = 0;
    this.totalWins    = 0;
    this.biggestWin   = 0;
    this.lastDaily    = 0;
  }

  static load() {
    const p = new Player();
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        Object.assign(p, data);
      }
    } catch (_) {}
    return p;
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        balance:    this.balance,
        xp:         this.xp,
        rankId:     this.rankId,
        totalSpins: this.totalSpins,
        totalWins:  this.totalWins,
        biggestWin: this.biggestWin,
        lastDaily:  this.lastDaily,
      }));
    } catch (_) {}
  }

  get rank()     { return RANKS[this.rankId]; }
  get nextRank() { return RANKS[this.rankId + 1] || null; }

  get rankProgress() {
    const cur  = RANKS[this.rankId];
    const next = this.nextRank;
    if (!next) return 1;
    return Math.min((this.xp - cur.minXP) / (next.minXP - cur.minXP), 1);
  }

  // Returns the new RANK object if we levelled up, else null
  addXP(amount) {
    this.xp += amount;
    const newId = RANKS.reduce((best, r) => (this.xp >= r.minXP ? r.id : best), 0);
    if (newId > this.rankId) {
      this.rankId = newId;
      this.balance += RANKS[newId].reward;
      this.save();
      return RANKS[newId];
    }
    return null;
  }

  get dailyAvailable() {
    return Date.now() - this.lastDaily >= 24 * 60 * 60 * 1000;
  }

  claimDaily() {
    if (!this.dailyAvailable) return 0;
    const bonus = this.rank.daily;
    this.balance  += bonus;
    this.lastDaily = Date.now();
    this.save();
    return bonus;
  }
}
