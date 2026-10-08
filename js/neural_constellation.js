/**
 * Neural Constellation Real-Time Mesh Engine
 * Procedural HTML5 Canvas implementation based on reference animation.
 * Features 60 FPS glowing nodes, traveling light beams, sonar pulse rings,
 * and dynamic state triggers responding directly to multi-model council debate.
 */

class NeuralConstellation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.nodes = [];
    this.edges = [];
    this.pulses = []; // Traveling light beams along edges
    this.rings = [];  // Concentric radar halos
    this.particles = []; // Floating cosmic dust
    
    this.activeSpeaker = null;
    this.hoveredNode = null;
    this.mouse = { x: -1000, y: -1000 };
    
    this.colors = {
      arbiter: { main: '#34d399', glow: 'rgba(52, 211, 153, 0.8)', name: 'Arbiter' },
      architect: { main: '#38bdf8', glow: 'rgba(56, 189, 248, 0.8)', name: 'Architect' },
      skeptic: { main: '#f87171', glow: 'rgba(248, 113, 113, 0.8)', name: 'Skeptic' },
      verifier: { main: '#fbbf24', glow: 'rgba(251, 191, 36, 0.8)', name: 'Verifier' },
      synthesizer: { main: '#c084fc', glow: 'rgba(192, 132, 252, 0.8)', name: 'Synthesizer' },
      ambient: { main: '#60a5fa', glow: 'rgba(96, 165, 250, 0.3)', name: 'Node' }
    };
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.checkHover();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.hoveredNode = null;
    });

    this.createNodes();
    this.createAmbientDust();
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = this.canvas.height = 340;
    if (this.nodes.length > 0) {
      this.positionFocalNodes();
    }
  }

  createNodes() {
    this.nodes = [];
    const focalKeys = ['arbiter', 'architect', 'skeptic', 'verifier', 'synthesizer'];
    
    // Create Primary Focal Council Nodes
    focalKeys.forEach((key, index) => {
      this.nodes.push({
        id: key,
        isFocal: true,
        role: key,
        label: key.toUpperCase(),
        color: this.colors[key],
        x: 0,
        y: 0,
        baseRadius: key === 'arbiter' ? 14 : 11,
        radius: key === 'arbiter' ? 14 : 11,
        energy: 1.0,
        angle: 0,
        pulsePhase: index * 0.8
      });
    });

    this.positionFocalNodes();

    // Create 30 Ambient Constellation Network Nodes for Depth
    for (let i = 0; i < 30; i++) {
      this.nodes.push({
        id: `ambient_${i}`,
        isFocal: false,
        role: 'ambient',
        label: '',
        color: this.colors.ambient,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: Math.random() * 2.5 + 1.5,
        radius: Math.random() * 2.5 + 1.5,
        energy: 0.3,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    this.buildEdges();
  }

  positionFocalNodes() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    
    // Positions: Arbiter elevated top-center, Council in dynamic constellation arc
    const focalPositions = {
      arbiter: { x: cx, y: cy - 90 },
      architect: { x: cx - 240, y: cy - 20 },
      skeptic: { x: cx - 120, y: cy + 70 },
      verifier: { x: cx + 120, y: cy + 70 },
      synthesizer: { x: cx + 240, y: cy - 20 }
    };

    this.nodes.forEach(n => {
      if (n.isFocal && focalPositions[n.id]) {
        n.x = focalPositions[n.id].x;
        n.y = focalPositions[n.id].y;
      }
    });
  }

  buildEdges() {
    this.edges = [];
    const focalNodes = this.nodes.filter(n => n.isFocal);
    
    // Fully mesh focal Council nodes
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

    // Connect ambient nodes based on proximity
    const ambientNodes = this.nodes.filter(n => !n.isFocal);
    ambientNodes.forEach(amb => {
      // Connect to nearest focal node
      let nearestFocal = null;
      let minDist = 9999;
      focalNodes.forEach(foc => {
        const d = Math.hypot(foc.x - amb.x, foc.y - amb.y);
        if (d < minDist && d < 220) {
          minDist = d;
          nearestFocal = foc;
        }
      });
      if (nearestFocal) {
        this.edges.push({ source: nearestFocal, target: amb, isCore: false, strength: 0.3 });
      }

      // Connect to 1-2 close ambient neighbors
      ambientNodes.forEach(other => {
        if (amb !== other) {
          const d = Math.hypot(amb.x - other.x, amb.y - other.y);
          if (d < 85 && Math.random() < 0.08) {
            this.edges.push({ source: amb, target: other, isCore: false, strength: 0.15 });
          }
        }
      });
    });
  }

  createAmbientDust() {
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2
      });
    }
  }

  checkHover() {
    this.hoveredNode = null;
    for (let n of this.nodes) {
      const d = Math.hypot(this.mouse.x - n.x, this.mouse.y - n.y);
      if (d < n.baseRadius + 12) {
        this.hoveredNode = n;
        break;
      }
    }
  }

  /**
   * Fires a high-velocity traveling light beam packet from one model to another
   */
  emitPulse(senderId, targetId, color = null) {
    const s = this.nodes.find(n => n.id === senderId);
    const t = this.nodes.find(n => n.id === targetId);
    if (!s || !t) return;

    this.pulses.push({
      source: s,
      target: t,
      progress: 0,
      speed: 0.025 + Math.random() * 0.015,
      color: color || s.color.main,
      size: 4.5,
      tailLength: 24
    });

    // Spawn radar pulse ring around sender
    this.spawnRing(s.x, s.y, s.color.main);
  }

  spawnRing(x, y, color = '#38bdf8') {
    this.rings.push({
      x, y,
      radius: 6,
      maxRadius: 48,
      alpha: 0.9,
      speed: 1.4,
      color
    });
  }

  /**
   * Simulates full council debate burst (rapid cross-communication)
   */
  simulateCouncilTraffic() {
    const roles = ['architect', 'skeptic', 'verifier', 'synthesizer'];
    const sender = roles[Math.floor(Math.random() * roles.length)];
    let receiver = roles[Math.floor(Math.random() * roles.length)];
    while (receiver === sender) {
      receiver = roles[Math.floor(Math.random() * roles.length)];
    }
    this.emitPulse(sender, receiver);
    if (Math.random() < 0.4) {
      this.emitPulse(sender, 'arbiter');
    }
  }

  /**
   * Triggered when Arbiter evaluates or approves
   */
  triggerArbiterConvergence(approved = true) {
    const color = approved ? '#34d399' : '#f87171';
    const arbiter = this.nodes.find(n => n.id === 'arbiter');
    if (!arbiter) return;

    // Send pulses from all members to Arbiter
    ['architect', 'skeptic', 'verifier', 'synthesizer'].forEach((r, idx) => {
      setTimeout(() => {
        this.emitPulse(r, 'arbiter', color);
      }, idx * 120);
    });

    // Trigger double halo on Arbiter
    setTimeout(() => {
      this.spawnRing(arbiter.x, arbiter.y, color);
      setTimeout(() => this.spawnRing(arbiter.x, arbiter.y, color), 250);
    }, 500);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

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

    // 2. Update Ambient Node Drift
    this.nodes.forEach(n => {
      if (!n.isFocal) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > this.width - 20) n.vx *= -1;
        if (n.y < 20 || n.y > this.height - 20) n.vy *= -1;
      }
    });

    // 3. Render Edges (Interconnected mesh lines)
    const time = Date.now() * 0.002;
    this.edges.forEach(e => {
      const dist = Math.hypot(e.target.x - e.source.x, e.target.y - e.source.y);
      const isCore = e.isCore;
      
      const grad = this.ctx.createLinearGradient(e.source.x, e.source.y, e.target.x, e.target.y);
      const opacity = isCore ? 0.35 + Math.sin(time + dist * 0.01) * 0.15 : 0.12;
      grad.addColorStop(0, e.source.color.glow.replace(/[\d\.]+\)$/, `${opacity})`));
      grad.addColorStop(1, e.target.color.glow.replace(/[\d\.]+\)$/, `${opacity})`));

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = isCore ? 1.4 : 0.8;
      this.ctx.beginPath();
      this.ctx.moveTo(e.source.x, e.source.y);
      this.ctx.lineTo(e.target.x, e.target.y);
      this.ctx.stroke();
    });

    // 4. Update and Render Sonar/Radar Pulse Rings
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
      this.ctx.globalAlpha = ring.alpha;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Outer faint secondary dash ring
      this.ctx.setLineDash([4, 4]);
      this.ctx.lineWidth = 1.0;
      this.ctx.beginPath();
      this.ctx.arc(ring.x, ring.y, ring.radius * 1.25, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 5. Update and Render Traveling Light Beams (Data Pulses)
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed;

      if (p.progress >= 1.0) {
        // Arrival particle burst
        this.spawnRing(p.target.x, p.target.y, p.color);
        this.pulses.splice(i, 1);
        continue;
      }

      const currX = p.source.x + (p.target.x - p.source.x) * p.progress;
      const currY = p.source.y + (p.target.y - p.source.y) * p.progress;
      
      const tailProg = Math.max(0, p.progress - 0.12);
      const tailX = p.source.x + (p.target.x - p.source.x) * tailProg;
      const tailY = p.source.y + (p.target.y - p.source.y) * tailProg;

      // Draw light beam streak
      const beamGrad = this.ctx.createLinearGradient(tailX, tailY, currX, currY);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      beamGrad.addColorStop(0.5, p.color);
      beamGrad.addColorStop(1, '#ffffff');

      this.ctx.save();
      this.ctx.strokeStyle = beamGrad;
      this.ctx.lineWidth = 3.2;
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(currX, currY);
      this.ctx.stroke();

      // Leading photon head
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 14;
      this.ctx.beginPath();
      this.ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 6. Render Nodes
    this.nodes.forEach(n => {
      const isHovered = (this.hoveredNode === n);
      const isArbiter = (n.id === 'arbiter');
      
      // Dynamic pulsing radius
      const pulseMod = Math.sin(time * 3 + n.pulsePhase) * 1.5;
      const r = n.baseRadius + (n.isFocal ? pulseMod : 0) + (isHovered ? 3 : 0);

      this.ctx.save();
      // Outer multi-layer glow
      this.ctx.shadowColor = n.color.main;
      this.ctx.shadowBlur = n.isFocal ? (isHovered ? 26 : 16) : 6;

      // Node base circle
      this.ctx.fillStyle = isHovered ? '#ffffff' : n.color.main;
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      this.ctx.fill();

      // Center bright core for focal nodes
      if (n.isFocal) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2);
        this.ctx.fill();

        // Geometric concentric orbiting radar rings
        this.ctx.strokeStyle = n.color.glow;
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, r + 7, 0, Math.PI * 2);
        this.ctx.stroke();

        if (isArbiter) {
          // Arbiter executive halo ring
          this.ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
          this.ctx.setLineDash([6, 3]);
          this.ctx.beginPath();
          this.ctx.arc(n.x, n.y, r + 14, 0, Math.PI * 2);
          this.ctx.stroke();
        }

        // Node label
        this.ctx.restore();
        this.ctx.save();
        this.ctx.fillStyle = isHovered ? '#ffffff' : '#e2e8f0';
        this.ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "JetBrains Mono", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(n.label, n.x, n.y + r + 18);
        this.ctx.restore();
      } else {
        this.ctx.restore();
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Global instance handle
window.NeuralConstellation = NeuralConstellation;
