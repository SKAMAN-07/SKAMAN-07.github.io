/**
 * Hive Neural Constellation & Synaptic Mesh Engine
 * - 60 FPS HTML5 Canvas Procedural Visualizer
 * - Real-time electrical synapse current passing & action potential pulses
 * - Ambient Anthropic-style landing mesh
 * - Fullscreen dark synapse execution canvas with real-time workflow phases
 */

class NeuralConstellation {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isSynapseMode = options.isSynapseMode || false;
    this.isLandingMode = options.isLandingMode || false;

    this.nodes = [];
    this.edges = [];
    this.pulses = [];      // Traveling action potential packets
    this.sparks = [];      // Electrical micro-arcs along synapses
    this.rings = [];       // Radar pulse halos
    this.particles = [];   // Ambient cosmic starlight
    this.phaseText = "INITIALIZING SYNAPTIC VECTORS...";
    
    this.mouse = { x: -1000, y: -1000, active: false };
    this.animId = null;
    this.isRunning = false;

    this.colors = {
      arbiter: { main: '#34d399', glow: 'rgba(52, 211, 153, 0.9)', name: 'Arbiter' },
      architect: { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.9)', name: 'Architect' },
      skeptic: { main: '#f87171', glow: 'rgba(248, 113, 113, 0.9)', name: 'Skeptic' },
      verifier: { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.9)', name: 'Verifier' },
      synthesizer: { main: '#c084fc', glow: 'rgba(192, 132, 252, 0.9)', name: 'Synthesizer' },
      synapseElectric: '#22d3ee',
      ambient: { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.3)', name: 'Neuron' }
    };

    this.init();
  }

  init() {
    this.resize();
    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.active = true;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.touches[0].clientX - rect.left;
        this.mouse.y = e.touches[0].clientY - rect.top;
        this.mouse.active = true;
      }
    }, { passive: true });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.active = false;
    });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.active = false;
    });

    this.createNodes();
    this.createAmbientDust();
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = this.isSynapseMode 
      ? (parent ? parent.clientHeight : window.innerHeight) 
      : (this.isLandingMode ? (parent ? parent.clientHeight : 500) : 340);

    this.width = width;
    this.height = height;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);

    if (this.nodes.length > 0) {
      this.positionNodes();
    }
  }

  createNodes() {
    this.nodes = [];
    const focalKeys = ['arbiter', 'architect', 'skeptic', 'verifier', 'synthesizer'];

    // 1. Primary Council Neurons
    focalKeys.forEach((key, index) => {
      this.nodes.push({
        id: key,
        isFocal: true,
        role: key,
        label: key.toUpperCase(),
        color: this.colors[key],
        x: 0,
        y: 0,
        baseRadius: this.isSynapseMode ? (key === 'arbiter' ? 18 : 14) : (key === 'arbiter' ? 14 : 11),
        radius: this.isSynapseMode ? 16 : 12,
        energy: 1.0,
        pulsePhase: index * 0.9,
        charge: 1.0
      });
    });

    // 2. Dense Synaptic Network Neurons
    const ambientCount = this.isSynapseMode ? 45 : (this.isLandingMode ? 35 : 25);
    for (let i = 0; i < ambientCount; i++) {
      this.nodes.push({
        id: `neuron_${i}`,
        isFocal: false,
        role: 'ambient',
        label: '',
        color: this.colors.ambient,
        x: Math.random() * (this.width || 800),
        y: Math.random() * (this.height || 400),
        vx: (Math.random() - 0.5) * (this.isSynapseMode ? 0.6 : 0.3),
        vy: (Math.random() - 0.5) * (this.isSynapseMode ? 0.6 : 0.3),
        baseRadius: Math.random() * 3 + 1.5,
        radius: Math.random() * 3 + 1.5,
        energy: Math.random() * 0.5 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        charge: Math.random()
      });
    }

    this.positionNodes();
    this.buildEdges();
  }

  positionNodes() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const scale = this.isSynapseMode ? 1.25 : 1.0;

    const focalPositions = {
      arbiter: { x: cx, y: cy - 100 * scale },
      architect: { x: cx - 250 * scale, y: cy - 25 * scale },
      skeptic: { x: cx - 130 * scale, y: cy + 85 * scale },
      verifier: { x: cx + 130 * scale, y: cy + 85 * scale },
      synthesizer: { x: cx + 250 * scale, y: cy - 25 * scale }
    };

    this.nodes.forEach(n => {
      if (n.isFocal && focalPositions[n.id]) {
        n.x = Math.max(40, Math.min(this.width - 40, focalPositions[n.id].x));
        n.y = Math.max(40, Math.min(this.height - 40, focalPositions[n.id].y));
      }
    });
  }

  buildEdges() {
    this.edges = [];
    const focalNodes = this.nodes.filter(n => n.isFocal);

    // Fully mesh focal council nodes
    for (let i = 0; i < focalNodes.length; i++) {
      for (let j = i + 1; j < focalNodes.length; j++) {
        this.edges.push({
          source: focalNodes[i],
          target: focalNodes[j],
          isCore: true,
          strength: 1.0
        });
      }
    }

    // Connect ambient neurons to form synaptic mesh
    const ambientNodes = this.nodes.filter(n => !n.isFocal);
    ambientNodes.forEach(amb => {
      let nearestFocal = null;
      let minDist = 9999;
      focalNodes.forEach(foc => {
        const d = Math.hypot(foc.x - amb.x, foc.y - amb.y);
        if (d < minDist && d < (this.isSynapseMode ? 280 : 220)) {
          minDist = d;
          nearestFocal = foc;
        }
      });
      if (nearestFocal) {
        this.edges.push({ source: nearestFocal, target: amb, isCore: false, strength: 0.35 });
      }

      // Interconnect nearby neurons
      ambientNodes.forEach(other => {
        if (amb !== other) {
          const d = Math.hypot(amb.x - other.x, amb.y - other.y);
          if (d < (this.isSynapseMode ? 110 : 90) && Math.random() < 0.12) {
            this.edges.push({ source: amb, target: other, isCore: false, strength: 0.2 });
          }
        }
      });
    });
  }

  createAmbientDust() {
    this.particles = [];
    const count = this.isSynapseMode ? 80 : 50;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (this.width || 800),
        y: Math.random() * (this.height || 400),
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3
      });
    }
  }

  /**
   * Fires an electric synaptic current pulse between neurons
   */
  emitPulse(senderId, targetId, color = null) {
    const s = this.nodes.find(n => n.id === senderId);
    const t = this.nodes.find(n => n.id === targetId);
    if (!s || !t) return;

    this.pulses.push({
      source: s,
      target: t,
      progress: 0,
      speed: 0.03 + Math.random() * 0.025,
      color: color || s.color.main,
      size: this.isSynapseMode ? 5.5 : 4.0,
      tailLength: 28,
      isElectric: true
    });

    this.spawnRing(s.x, s.y, s.color.main);
  }

  spawnRing(x, y, color = '#38bdf8') {
    this.rings.push({
      x, y,
      radius: 6,
      maxRadius: this.isSynapseMode ? 60 : 44,
      alpha: 0.9,
      speed: 1.8,
      color
    });
  }

  /**
   * Continuous high-frequency synaptic current discharge in Synapse mode
   */
  triggerSynapticBurst() {
    if (this.edges.length === 0) return;
    const edge = this.edges[Math.floor(Math.random() * this.edges.length)];
    const color = edge.source.color ? edge.source.color.main : '#22d3ee';
    
    this.pulses.push({
      source: edge.source,
      target: edge.target,
      progress: 0,
      speed: 0.04 + Math.random() * 0.03,
      color,
      size: 4.8,
      tailLength: 32,
      isElectric: true
    });
  }

  simulateCouncilTraffic() {
    const roles = ['architect', 'skeptic', 'verifier', 'synthesizer'];
    const s = roles[Math.floor(Math.random() * roles.length)];
    let t = roles[Math.floor(Math.random() * roles.length)];
    while (t === s) {
      t = roles[Math.floor(Math.random() * roles.length)];
    }
    this.emitPulse(s, t);
    if (Math.random() < 0.5) {
      this.emitPulse(s, 'arbiter');
    }
  }

  triggerArbiterConvergence(approved = true) {
    const color = approved ? '#34d399' : '#f87171';
    const arbiter = this.nodes.find(n => n.id === 'arbiter');
    if (!arbiter) return;

    ['architect', 'skeptic', 'verifier', 'synthesizer'].forEach((r, idx) => {
      setTimeout(() => {
        this.emitPulse(r, 'arbiter', color);
      }, idx * 100);
    });

    setTimeout(() => {
      this.spawnRing(arbiter.x, arbiter.y, color);
      setTimeout(() => this.spawnRing(arbiter.x, arbiter.y, color), 200);
    }, 450);
  }

  setPhaseText(text) {
    this.phaseText = text;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resizeHandler);
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const time = Date.now() * 0.002;

    // In Synapse mode, generate periodic electric discharges
    if (this.isSynapseMode && Math.random() < 0.35) {
      this.triggerSynapticBurst();
    }

    // 1. Draw Starlight Cosmic Dust
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. Drift Ambient Neurons
    this.nodes.forEach(n => {
      if (!n.isFocal) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > this.width - 20) n.vx *= -1;
        if (n.y < 20 || n.y > this.height - 20) n.vy *= -1;
      }
    });

    // 3. Render Synapse Axon Mesh Lines with Electric Arcs
    this.edges.forEach(e => {
      const isCore = e.isCore;
      const dist = Math.hypot(e.target.x - e.source.x, e.target.y - e.source.y);

      // Base synapse line
      const grad = this.ctx.createLinearGradient(e.source.x, e.source.y, e.target.x, e.target.y);
      const baseAlpha = isCore ? (this.isSynapseMode ? 0.45 : 0.35) : 0.12;
      const pulsate = Math.sin(time * 2 + dist * 0.01) * 0.15;
      const opacity = Math.max(0.08, baseAlpha + pulsate);

      grad.addColorStop(0, e.source.color.glow.replace(/[\d\.]+\)$/, `${opacity})`));
      grad.addColorStop(1, e.target.color.glow.replace(/[\d\.]+\)$/, `${opacity})`));

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = isCore ? (this.isSynapseMode ? 2.0 : 1.4) : 0.8;
      this.ctx.beginPath();
      this.ctx.moveTo(e.source.x, e.source.y);

      // In Synapse mode, add subtle electric arc jitter to core lines
      if (this.isSynapseMode && isCore && Math.random() < 0.15) {
        const midX = (e.source.x + e.target.x) / 2 + (Math.random() - 0.5) * 8;
        const midY = (e.source.y + e.target.y) / 2 + (Math.random() - 0.5) * 8;
        this.ctx.lineTo(midX, midY);
      }

      this.ctx.lineTo(e.target.x, e.target.y);
      this.ctx.stroke();

      // Mouse attraction electric arc in Synapse mode
      if (this.isSynapseMode && this.mouse.active) {
        const dMouse = Math.hypot(this.mouse.x - e.source.x, this.mouse.y - e.source.y);
        if (dMouse < 140 && Math.random() < 0.08) {
          this.ctx.save();
          this.ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
          this.ctx.lineWidth = 1.2;
          this.ctx.beginPath();
          this.ctx.moveTo(e.source.x, e.source.y);
          const jX = (e.source.x + this.mouse.x) / 2 + (Math.random() - 0.5) * 16;
          const jY = (e.source.y + this.mouse.y) / 2 + (Math.random() - 0.5) * 16;
          this.ctx.lineTo(jX, jY);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    });

    // 4. Update and Render Radar Pulse Halos
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const ring = this.rings[i];
      ring.radius += ring.speed;
      ring.alpha -= 0.022;

      if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
        this.rings.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.strokeStyle = ring.color;
      this.ctx.globalAlpha = Math.max(0, ring.alpha);
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 5. Update and Render High-Velocity Electric Synapse Pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed;

      if (p.progress >= 1.0) {
        this.spawnRing(p.target.x, p.target.y, p.color);
        this.pulses.splice(i, 1);
        continue;
      }

      const currX = p.source.x + (p.target.x - p.source.x) * p.progress;
      const currY = p.source.y + (p.target.y - p.source.y) * p.progress;
      
      const tailProg = Math.max(0, p.progress - 0.16);
      const tailX = p.source.x + (p.target.x - p.source.x) * tailProg;
      const tailY = p.source.y + (p.target.y - p.source.y) * tailProg;

      // Electric streak
      const beamGrad = this.ctx.createLinearGradient(tailX, tailY, currX, currY);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      beamGrad.addColorStop(0.4, p.color);
      beamGrad.addColorStop(1, '#ffffff');

      this.ctx.save();
      this.ctx.strokeStyle = beamGrad;
      this.ctx.lineWidth = this.isSynapseMode ? 3.8 : 3.0;
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);

      // Lightning jitter along pulse
      if (this.isSynapseMode && Math.random() < 0.4) {
        const jX = (tailX + currX) / 2 + (Math.random() - 0.5) * 6;
        const jY = (tailY + currY) / 2 + (Math.random() - 0.5) * 6;
        this.ctx.lineTo(jX, jY);
      }

      this.ctx.lineTo(currX, currY);
      this.ctx.stroke();

      // Leading glowing photon head
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = this.isSynapseMode ? 18 : 12;
      this.ctx.beginPath();
      this.ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 6. Render Neurons
    this.nodes.forEach(n => {
      const isArbiter = (n.id === 'arbiter');
      const pulseMod = Math.sin(time * 3 + n.pulsePhase) * 1.8;
      const r = n.baseRadius + (n.isFocal ? pulseMod : 0);

      this.ctx.save();
      this.ctx.shadowColor = n.color.main;
      this.ctx.shadowBlur = n.isFocal ? (this.isSynapseMode ? 28 : 18) : 6;

      // Base circle
      this.ctx.fillStyle = n.color.main;
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      this.ctx.fill();

      if (n.isFocal) {
        // Core center
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2);
        this.ctx.fill();

        // Orbiting halo ring
        this.ctx.strokeStyle = n.color.glow;
        this.ctx.lineWidth = 1.3;
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
        this.ctx.stroke();

        if (isArbiter) {
          this.ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
          this.ctx.setLineDash([6, 3]);
          this.ctx.beginPath();
          this.ctx.arc(n.x, n.y, r + 16, 0, Math.PI * 2);
          this.ctx.stroke();
        }

        // Neuron label
        this.ctx.restore();
        this.ctx.save();
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.font = '700 11px "JetBrains Mono", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(n.label, n.x, n.y + r + 20);
        this.ctx.restore();
      } else {
        this.ctx.restore();
      }
    });

    // 7. In Synapse Fullscreen Mode: Render Real-Time Workflow HUD Overlay
    if (this.isSynapseMode) {
      this.ctx.save();
      this.ctx.textAlign = 'center';
      
      // Real-time stage text
      this.ctx.font = '700 13px "JetBrains Mono", monospace';
      this.ctx.fillStyle = '#34d399';
      this.ctx.shadowColor = '#34d399';
      this.ctx.shadowBlur = 10;
      this.ctx.fillText(this.phaseText, this.width / 2, this.height - 40);

      // Top telemetry
      this.ctx.font = '600 11px "JetBrains Mono", monospace';
      this.ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText("SYNAPSE CURRENT: 60 FPS • ACTION POTENTIALS: ACTIVE • TOPOLOGY: 5-WAY FRONTIER MESH", this.width / 2, 35);
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

window.NeuralConstellation = NeuralConstellation;
