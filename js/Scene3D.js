// js/Scene3D.js — Three.js 3D casino scene with canvas-scrolling reels

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { EffectComposer }  from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass }      from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';

// ─── Symbol table ─────────────────────────────────────────────────────────────
export const SYMBOLS = [
  { emoji: '7️⃣', name: 'Lucky 7',  payout: 100, tier: 'mega'    }, // 0
  { emoji: '💎',  name: 'Diamond',  payout: 40,  tier: 'jackpot' }, // 1
  { emoji: '🍒',  name: 'Cherry',   payout: 20,  tier: 'high'    }, // 2
  { emoji: '⭐',  name: 'Star',     payout: 10,  tier: 'mid'     }, // 3
  { emoji: '🔔',  name: 'Bell',     payout: 7,   tier: 'mid'     }, // 4
  { emoji: '🍋',  name: 'Lemon',    payout: 5,   tier: 'low'     }, // 5
  { emoji: '🍀',  name: 'Clover',   payout: 3,   tier: 'common'  }, // 6
];

// Each reel has its own strip of 24 symbol indices.
// Higher-payout symbols appear less frequently.
export const REEL_STRIPS = [
  [6,5,6,4,6,5,4,6,3,5,6,4,5,6,4,3,6,5,2,6,4,5,1,0], // reel 0
  [6,4,6,5,3,6,5,6,4,2,6,5,4,6,5,3,6,4,5,6,1,4,6,0], // reel 1
  [6,5,6,4,6,3,5,6,4,6,5,2,6,4,5,6,3,4,6,5,1,6,4,0], // reel 2
];

const STRIP_LEN   = REEL_STRIPS[0].length; // 24
const SYM_PX      = 200; // canvas pixels per symbol slot
const VISIBLE     = 3;   // rows shown in the window

// ─── Reel ─────────────────────────────────────────────────────────────────────
class Reel {
  constructor(xPos, reelIndex, parent) {
    this.strip   = REEL_STRIPS[reelIndex];
    this.total   = this.strip.length * SYM_PX; // full strip length in px

    // --- canvas texture ---
    this.canvas        = document.createElement('canvas');
    this.canvas.width  = 256;
    this.canvas.height = VISIBLE * SYM_PX;
    this.ctx           = this.canvas.getContext('2d');
    this.texture       = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    // --- spin state ---
    this.offset         = 0;   // pixels scrolled through the strip
    this.velocity       = 0;   // px / second
    this.spinning       = false;
    this.stopping       = false;
    this.targetOffset   = 0;
    this.travelNeeded   = 0;
    this.traveled       = 0;
    this.initVelocity   = 0;
    this.resultIndex    = 0;   // strip index of the winning symbol
    this.onStop         = null;

    // --- 3D mesh ---
    const W = (this.canvas.width / this.canvas.height) * 3.9;
    const geo = new THREE.PlaneGeometry(W, 3.9);
    const mat = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(xPos, 0.05, 0.52);
    parent.add(this.mesh);

    this._draw();
  }

  // ── drawing ──────────────────────────────────────────────────────────────
  _draw() {
    const ctx = this.ctx;
    const W   = this.canvas.width;
    const H   = SYM_PX;
    const rows = VISIBLE + 1; // one extra for seamless scroll

    // background
    ctx.fillStyle = '#08081a';
    ctx.fillRect(0, 0, W, this.canvas.height);

    const blur = this.spinning && this.velocity > 1200 && !this.stopping;

    for (let slot = 0; slot < rows; slot++) {
      const drawY     = slot * H - (this.offset % H);
      if (drawY > this.canvas.height + H) continue;
      if (drawY + H < -H) continue;

      const symbolPos  = Math.floor(this.offset / H) + slot;
      const stripIdx   = ((symbolPos % this.strip.length) + this.strip.length) % this.strip.length;
      const sym        = SYMBOLS[this.strip[stripIdx]];

      // row background alternation
      ctx.fillStyle = slot % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, drawY, W, H);

      // emoji
      ctx.save();
      if (blur) ctx.filter = `blur(${Math.min(8, this.velocity / 300)}px)`;
      ctx.font          = `${Math.round(H * 0.62)}px serif`;
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'middle';
      ctx.fillStyle     = '#ffffff';
      ctx.fillText(sym.emoji, W / 2, drawY + H / 2);
      ctx.restore();
    }

    // middle-row highlight border
    ctx.strokeStyle = 'rgba(255,210,50,0.65)';
    ctx.lineWidth   = 4;
    ctx.strokeRect(4, H + 2, W - 8, H - 4);

    // row dividers
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth   = 1;
    for (let i = 1; i < VISIBLE; i++) {
      ctx.beginPath();
      ctx.moveTo(0,  i * H);
      ctx.lineTo(W, i * H);
      ctx.stroke();
    }

    this.texture.needsUpdate = true;
  }

  // ── control ───────────────────────────────────────────────────────────────
  startSpin() {
    this.spinning   = true;
    this.stopping   = false;
    this.velocity   = 2800;
  }

  // Schedule stop after `delay` ms; land result strip-index `idx` in middle row
  stopAt(idx, delay) {
    setTimeout(() => {
      this.resultIndex = idx;

      // Middle row is row-index 1.
      // When offset = N * SYM_PX (exact) row-1 shows strip[N+1].
      // So for strip[idx] to sit in row-1: N = idx - 1 → offset = (idx-1)*SYM_PX
      const raw    = ((idx - 1) * SYM_PX % this.total + this.total) % this.total;
      let   dist   = raw - (this.offset % this.total);
      if (dist <= 0) dist += this.total;
      if (dist < SYM_PX * 4) dist += this.total; // guarantee enough travel

      this.targetOffset = raw;
      this.travelNeeded = dist;
      this.traveled     = 0;
      this.initVelocity = this.velocity;
      this.stopping     = true;
    }, delay);
  }

  // ── per-frame update ───────────────────────────────────────────────────────
  update(dt) {
    if (!this.spinning) return;

    const move = this.velocity * dt;
    this.offset = (this.offset + move) % this.total;

    if (this.stopping) {
      this.traveled += move;
      const progress = Math.min(this.traveled / this.travelNeeded, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      this.velocity  = this.initVelocity * (1 - eased * 0.97) + 40;

      if (progress >= 1) {
        this.offset   = this.targetOffset;
        this.velocity = 0;
        this.spinning = false;
        this.stopping = false;
        this._draw();
        if (this.onStop) this.onStop();
        return;
      }
    }

    this._draw();
  }

  // Return the symbol index (into SYMBOLS) currently in the middle row
  get middleSymbolId() {
    const stripIdx = ((Math.floor(this.offset / SYM_PX) + 1) % this.strip.length + this.strip.length) % this.strip.length;
    return this.strip[stripIdx];
  }
}

// ─── Scene3D ─────────────────────────────────────────────────────────────────
export class Scene3D {
  constructor(canvas) {
    this.canvas   = canvas;
    this.reels    = [];
    this.clock    = new THREE.Clock();
    this.spinning = false;
    this._init();
  }

  _init() {
    // renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled   = true;
    this.renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    // scene
    this.scene            = new THREE.Scene();
    this.scene.background = new THREE.Color(0x04040e);
    this.scene.fog        = new THREE.FogExp2(0x04040e, 0.045);

    // camera
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
    this.camera.position.set(0, 1.2, 9.5);
    this.camera.lookAt(0, 0.2, 0);
    this._camBase = this.camera.position.clone();

    this._buildRoom();
    this._buildCabinet();
    this._buildLights();
    this._buildParticles();
    this._buildPostProcessing();

    window.addEventListener('resize', () => this._onResize());
    this._loop();
  }

  // ── room environment ──────────────────────────────────────────────────────
  _buildRoom() {
    // floor
    const floorGeo = new THREE.PlaneGeometry(60, 60, 20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color:     0x0a0a18,
      roughness: 0.2,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // neon grid on floor
    const grid = new THREE.GridHelper(60, 30, 0x1a0040, 0x08001a);
    grid.position.y = -4.19;
    this.scene.add(grid);

    // ceiling
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 1 });
    const ceil    = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 14;
    this.scene.add(ceil);

    // distant neon wall strips
    const stripData = [
      { x: -14, y:  0, z: -10, ry: 0,           color: 0xff0088 },
      { x:  14, y:  0, z: -10, ry: 0,           color: 0x0088ff },
      { x:  -6, y:  0, z: -15, ry: Math.PI / 6, color: 0xffcc00 },
      { x:   6, y:  0, z: -15, ry: -Math.PI / 6,color: 0x00ffcc },
    ];
    stripData.forEach(d => {
      const geo = new THREE.BoxGeometry(0.09, 8, 0.09);
      const mat = new THREE.MeshStandardMaterial({
        color: d.color, emissive: d.color, emissiveIntensity: 2.5,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(d.x, d.y, d.z);
      m.rotation.y = d.ry;
      this.scene.add(m);
    });
  }

  // ── slot machine cabinet ──────────────────────────────────────────────────
  _buildCabinet() {
    this.cabinet = new THREE.Group();
    this.scene.add(this.cabinet);

    // body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x14142a, roughness: 0.35, metalness: 0.8,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(7.8, 5.8, 1.3), bodyMat);
    body.position.z = -0.15;
    body.castShadow    = true;
    body.receiveShadow = true;
    this.cabinet.add(body);

    // screen recess (dark inset)
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x060612, roughness: 0.95 });
    const screen    = new THREE.Mesh(new THREE.BoxGeometry(6.9, 4.1, 0.08), screenMat);
    screen.position.set(0, 0.08, 0.48);
    this.cabinet.add(screen);

    // neon frame
    this._addNeonFrame();

    // reel dividers
    [-1.7, 1.7].forEach(x => {
      const divMat = new THREE.MeshStandardMaterial({
        color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.8,
      });
      const div = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.0, 0.1), divMat);
      div.position.set(x, 0.08, 0.53);
      this.cabinet.add(div);
    });

    // win-line bar (hidden until win)
    const wlMat = new THREE.MeshStandardMaterial({
      color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 2,
      transparent: true, opacity: 0.85,
    });
    this.winLineMesh = new THREE.Mesh(new THREE.BoxGeometry(6.7, 0.05, 0.08), wlMat);
    this.winLineMesh.position.set(0, 0.08, 0.54);
    this.winLineMesh.visible = false;
    this.cabinet.add(this.winLineMesh);

    // bottom control bar
    const ctrlMat = new THREE.MeshStandardMaterial({ color: 0x1e1e3a, roughness: 0.5, metalness: 0.7 });
    const ctrl    = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.65, 1.3), ctrlMat);
    ctrl.position.set(0, -3.2, -0.15);
    this.cabinet.add(ctrl);

    // top sign
    this._buildSign();

    // 3 reels
    [-2.3, 0, 2.3].forEach((x, i) => {
      this.reels.push(new Reel(x, i, this.cabinet));
    });
  }

  _addNeonFrame() {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x8800ff, emissive: 0x5500cc, emissiveIntensity: 2,
    });
    const W = 7.95, H = 5.95, D = 1.5;
    const pieces = [
      new THREE.BoxGeometry(W, 0.14, D),   // top
      new THREE.BoxGeometry(W, 0.14, D),   // bottom
      new THREE.BoxGeometry(0.14, H, D),   // left
      new THREE.BoxGeometry(0.14, H, D),   // right
    ];
    const positions = [
      [0,  H / 2, 0],
      [0, -H / 2, 0],
      [-W / 2, 0, 0],
      [ W / 2, 0, 0],
    ];
    pieces.forEach((geo, i) => {
      const m = new THREE.Mesh(geo, frameMat);
      m.position.set(...positions[i]);
      this.cabinet.add(m);
    });

    // Corner accent lights
    const cornerMat = new THREE.MeshStandardMaterial({
      color: 0xff44ff, emissive: 0xff44ff, emissiveIntensity: 3,
    });
    const cGeo = new THREE.SphereGeometry(0.12, 8, 8);
    [[W/2, H/2], [-W/2, H/2], [W/2, -H/2], [-W/2, -H/2]].forEach(([cx, cy]) => {
      const c = new THREE.Mesh(cGeo, cornerMat);
      c.position.set(cx, cy, 0.08);
      this.cabinet.add(c);
    });
  }

  _buildSign() {
    // Canvas texture for the neon sign
    const sw = 1024, sh = 240;
    const sc = document.createElement('canvas');
    sc.width = sw; sc.height = sh;
    const sctx = sc.getContext('2d');

    sctx.fillStyle = '#050512';
    sctx.fillRect(0, 0, sw, sh);

    // outer glow border
    sctx.shadowColor = '#cc00ff';
    sctx.shadowBlur  = 25;
    sctx.strokeStyle = '#cc00ff';
    sctx.lineWidth   = 3;
    sctx.strokeRect(8, 8, sw - 16, sh - 16);

    // main text
    sctx.font          = 'bold 88px "Arial Black", sans-serif';
    sctx.textAlign     = 'center';
    sctx.textBaseline  = 'middle';
    sctx.shadowColor   = '#ff88ff';
    sctx.shadowBlur    = 30;
    sctx.fillStyle     = '#ffffff';
    sctx.fillText('FOREVER YOUNG', sw / 2, sh / 2);

    const tex  = new THREE.CanvasTexture(sc);
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(7.7, 1.82),
      new THREE.MeshBasicMaterial({ map: tex }),
    );
    sign.position.set(0, 4.15, 0.52);
    this.cabinet.add(sign);

    // neon tubes above / below the sign
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 3.5,
    });
    const tGeo = new THREE.BoxGeometry(7.9, 0.09, 0.09);
    [-0.92, 0.92].forEach(dy => {
      const t = new THREE.Mesh(tGeo, tubeMat);
      t.position.set(0, 4.15 + dy, 0.52);
      this.cabinet.add(t);
    });
  }

  // ── lighting ──────────────────────────────────────────────────────────────
  _buildLights() {
    this.scene.add(new THREE.AmbientLight(0x10102a, 4));

    // Main spotlight on cabinet
    this.mainSpot = new THREE.SpotLight(0xffffff, 4, 25, Math.PI / 7, 0.45, 1.5);
    this.mainSpot.position.set(0, 10, 6);
    this.mainSpot.target.position.set(0, 0, 0);
    this.mainSpot.castShadow = true;
    this.scene.add(this.mainSpot);
    this.scene.add(this.mainSpot.target);

    // Atmospheric colour points
    const pts = [
      { color: 0xff0066, pos: [-9,  3, -1], intensity: 1.2 },
      { color: 0x0066ff, pos: [ 9,  3, -1], intensity: 1.2 },
      { color: 0xffaa00, pos: [ 0,  7, -3], intensity: 1.0 },
      { color: 0x00ffaa, pos: [ 0, -1,  4], intensity: 0.8 },
    ];
    this.atmoLights = pts.map(p => {
      const l = new THREE.PointLight(p.color, p.intensity, 22);
      l.position.set(...p.pos);
      this.scene.add(l);
      return l;
    });
  }

  // ── particle system ───────────────────────────────────────────────────────
  _buildParticles() {
    const COUNT = 250;
    const pos   = new Float32Array(COUNT * 3);
    const col   = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 34;
      pos[i*3+1] = (Math.random() - 0.5) * 22;
      pos[i*3+2] = (Math.random() - 0.5) * 22 - 5;
      const c    = new THREE.Color().setHSL(Math.random(), 1, 0.7);
      col[i*3]   = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    this.particles    = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.07, vertexColors: true, transparent: true, opacity: 0.55,
    }));
    this.scene.add(this.particles);
    this._partPos = pos;
    this._partLen = COUNT;
  }

  // ── post-processing ───────────────────────────────────────────────────────
  _buildPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.85, 0.38, 0.80,
    );
    this.composer.addPass(this.bloom);
  }

  // ── animation loop ─────────────────────────────────────────────────────────
  _loop() {
    requestAnimationFrame(() => this._loop());
    const dt = this.clock.getDelta();
    const t  = this.clock.getElapsedTime();

    // update reels
    this.reels.forEach(r => r.update(dt));

    // float particles upward
    for (let i = 0; i < this._partLen; i++) {
      this._partPos[i*3+1] += 0.018 * dt * 60;
      if (this._partPos[i*3+1] > 11) {
        this._partPos[i*3+1]  = -11;
        this._partPos[i*3]    = (Math.random() - 0.5) * 34;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    // breathe atmosphere lights
    this.atmoLights.forEach((l, i) => {
      l.intensity = 0.9 + Math.sin(t * 0.8 + i * 1.6) * 0.35;
    });

    // cabinet gentle float
    this.cabinet.position.y = Math.sin(t * 0.45) * 0.06;

    // win-line pulse
    if (this.winLineMesh.visible) {
      this.winLineMesh.material.emissiveIntensity = 1.5 + Math.sin(t * 12) * 0.8;
    }

    // subtle camera sway
    this.camera.position.x = this._camBase.x + Math.sin(t * 0.22) * 0.06;
    this.camera.position.y = this._camBase.y + Math.sin(t * 0.17) * 0.04;

    this.composer.render();
  }

  // ── public API ────────────────────────────────────────────────────────────

  /**
   * Start spinning all 3 reels.
   * @param {number[]} stopIndices  - strip-index for each reel's winning position
   * @param {function} onReelStop   - called with reel index each time a reel lands
   */
  spin(stopIndices, onReelStop) {
    this.spinning = true;
    this.winLineMesh.visible = false;

    let done = 0;
    this.reels.forEach((reel, i) => {
      reel.startSpin();
      reel.stopAt(stopIndices[i], 900 + i * 520);
      reel.onStop = () => {
        done++;
        if (onReelStop) onReelStop(i);
        if (done === 3) this.spinning = false;
      };
    });
  }

  /** Flash lights / shake for a win */
  celebrateWin(tier) {
    this.winLineMesh.visible = true;

    if (tier === 'mega' || tier === 'jackpot') {
      // flashing lights
      let n = 0;
      const iv = setInterval(() => {
        this.mainSpot.intensity = n % 2 === 0 ? 10 : 2;
        n++;
        if (n > 12) { clearInterval(iv); this.mainSpot.intensity = 4; }
      }, 130);

      // camera shake
      const base = this._camBase.clone();
      let   s    = 0;
      const sv   = setInterval(() => {
        this.camera.position.x = base.x + (Math.random() - 0.5) * 0.35;
        this.camera.position.y = base.y + (Math.random() - 0.5) * 0.25;
        s++;
        if (s > 18) { clearInterval(sv); this._camBase.copy(base); }
      }, 55);
    }
  }

  _onResize() {
    const W = window.innerWidth, H = window.innerHeight;
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(W, H);
    this.composer.setSize(W, H);
  }
}
