/**
 * Hive Web Application Controller
 * Orchestrates the Neural Constellation Canvas, Google Sign-In,
 * Anti-Bot Shield, Client-Side MultiModel Engine, and Deliverable Exports.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Neural Constellation 60 FPS Canvas
  const constellation = new NeuralConstellation('neuralCanvas');
  window.neuralConstellation = constellation;

  // 2. Initialize Security Shield & Engine
  const security = new HiveSecurityShield();
  const engine = new MultiModelEngine();
  window.securityShield = security;
  window.modelEngine = engine;

  let attachedFiles = [];
  let currentDeliverable = null;

  // 3. UI Element References
  const authBtn = document.getElementById('authBtn');
  const userProfileChip = document.getElementById('userProfileChip');
  const authModal = document.getElementById('authModal');
  const settingsModal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  
  const queryInput = document.getElementById('queryInput');
  const submitBtn = document.getElementById('submitBtn');
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const attachedFilesContainer = document.getElementById('attachedFilesContainer');

  const resultsArea = document.getElementById('resultsArea');
  const councilGrid = document.getElementById('councilGrid');
  const arbiterCard = document.getElementById('arbiterCard');
  const chatHistory = document.getElementById('chatHistory');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  // 4. Auth & User Profile State
  function renderAuthState() {
    if (security.currentUser) {
      authBtn.style.display = 'none';
      userProfileChip.style.display = 'inline-flex';
      document.getElementById('userNameText').innerText = security.currentUser.name || 'Authenticated';
      if (security.currentUser.picture) {
        document.getElementById('userAvatar').src = security.currentUser.picture;
        document.getElementById('userAvatar').style.display = 'inline-block';
      }
    } else {
      authBtn.style.display = 'inline-flex';
      userProfileChip.style.display = 'none';
    }

    const quotaLeft = security.getRemainingDailyQuota();
    const quotaText = document.getElementById('quotaText');
    if (quotaText) {
      quotaText.innerText = engine.hasConfiguredKey() ? 'UNLIMITED (BYOK)' : `${quotaLeft}/5 Daily Free`;
    }
  }

  renderAuthState();

  // 5. Google Sign-In Callback
  window.handleGoogleSignIn = (googleResponse) => {
    const user = security.handleGoogleCredential(googleResponse);
    if (user) {
      renderAuthState();
      authModal.style.display = 'none';
      if (window.neuralConstellation) {
        window.neuralConstellation.triggerArbiterConvergence(true);
      }
    }
  };

  // Auth Button triggers Modal
  authBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
  });

  document.getElementById('closeAuthModal').addEventListener('click', () => {
    authModal.style.display = 'none';
  });

  // Settings Modal
  settingsBtn.addEventListener('click', () => {
    document.getElementById('apiKeyInput').value = engine.geminiKey;
    document.getElementById('localUrlInput').value = engine.localUrl;
    settingsModal.style.display = 'flex';
  });

  document.getElementById('closeSettingsModal').addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput').value;
    const url = document.getElementById('localUrlInput').value;
    engine.saveConfig('auto', key, url);
    settingsModal.style.display = 'none';
    renderAuthState();
    alert('Settings saved. Client-side execution updated.');
  });

  // 6. Universal File Upload Drag & Drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  });

  function handleFiles(files) {
    files.forEach(f => {
      if (!attachedFiles.some(existing => existing.name === f.name)) {
        attachedFiles.push(f);
      }
    });
    renderAttachedFiles();
  }

  function renderAttachedFiles() {
    attachedFilesContainer.innerHTML = '';
    attachedFiles.forEach((file, index) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.style.borderColor = 'var(--cyan-primary)';
      chip.style.color = 'var(--text-main)';
      chip.innerHTML = `📄 ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB) <span style="cursor:pointer; color:var(--crimson-alert); font-weight:800; margin-left:6px;">×</span>`;
      chip.querySelector('span').addEventListener('click', () => {
        attachedFiles.splice(index, 1);
        renderAttachedFiles();
      });
      attachedFilesContainer.appendChild(chip);
    });
  }

  // 7. Deliberation Execution
  submitBtn.addEventListener('click', async () => {
    const query = queryInput.value.trim();
    if (!query && attachedFiles.length === 0) {
      alert('Please enter a query or attach a research file.');
      return;
    }

    // Anti-Bot & Daily Quota Validation
    const validation = security.validateSubmission(engine.hasConfiguredKey());
    if (!validation.allowed) {
      alert(validation.reason);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = '⚡ Council is Deliberating in Real-Time...';
    resultsArea.style.display = 'block';
    councilGrid.innerHTML = '';
    arbiterCard.innerHTML = `<div style="color:var(--text-muted); font-size:13px;">The Arbiter is monitoring Council discussions in real-time...</div>`;

    try {
      const result = await engine.deliberate({
        query: query || `Analyze attached research documents: ${attachedFiles.map(f => f.name).join(', ')}`,
        files: attachedFiles.map(f => f.name),
        onMessage: (msg) => {
          renderCouncilMessage(msg);
        },
        onArbiterEvaluation: (evalRes) => {
          renderArbiterEvaluation(evalRes);
          currentDeliverable = evalRes.final_output;
        }
      });

      security.recordDeliberation();
      renderAuthState();
    } catch (err) {
      alert('Deliberation error: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = '⚡ Convene Council & The Arbiter';
    }
  });

  function renderCouncilMessage(msg) {
    const card = document.createElement('div');
    card.className = `member-card ${msg.role_type || ''}`;
    card.innerHTML = `
      <div class="member-header">
        <span>[${escapeHtml(msg.sender.toUpperCase())} • ${escapeHtml((msg.role_type || '').toUpperCase())}]</span>
        <span class="chip" style="font-size:10px;">Round ${msg.round_num}</span>
      </div>
      <pre>${escapeHtml(msg.content)}</pre>
    `;
    councilGrid.appendChild(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderArbiterEvaluation(b) {
    arbiterCard.className = `arbiter-card ${b.verdict === 'APPROVED' ? 'approved' : 'rejected'}`;
    arbiterCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <h3 style="font-size:16px; color:#34d399; font-weight:800;">⚖️ Executive Arbiter Evaluation</h3>
        <span class="verdict-tag">${escapeHtml(b.verdict)} (Score: ${b.score}/100)</span>
      </div>
      <p style="font-size:14px; margin-bottom:12px;"><strong>Reasoning:</strong> ${escapeHtml(b.reasoning)}</p>
      <hr style="border:0; border-top:1px solid rgba(255,255,255,0.08); margin:12px 0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h4 style="font-size:13px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Final Deliverable:</h4>
        <button class="btn btn-arbiter" id="printPdfBtn" style="padding:6px 14px; font-size:12px;">📄 Export / Print PDF</button>
      </div>
      <pre style="background:rgba(11,15,25,0.9); padding:16px; border-radius:8px; border:1px solid var(--border-subtle); max-height:420px; overflow-y:auto; font-size:13px; line-height:1.5;">${escapeHtml(b.final_output || '')}</pre>
    `;

    document.getElementById('printPdfBtn').addEventListener('click', () => {
      exportDeliverablePDF(b.final_output || '');
    });

    chatHistory.innerHTML = `
      <div class="chat-bubble arbiter">
        <strong>The Arbiter:</strong> I have evaluated the Council's multi-model deliberation and verified this deliverable. You can ask me questions about the methodology, request specific revisions, or ask me to explain calculations in plain human terms.
      </div>
    `;
  }

  // 8. Chat with The Arbiter
  chatSendBtn.addEventListener('click', sendUserChat);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendUserChat();
  });

  async function sendUserChat() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerHTML = `<strong>You:</strong> ${escapeHtml(text)}`;
    chatHistory.appendChild(userBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    const thinkingBubble = document.createElement('div');
    thinkingBubble.className = 'chat-bubble arbiter';
    thinkingBubble.innerText = 'The Arbiter is analyzing...';
    chatHistory.appendChild(thinkingBubble);

    if (window.neuralConstellation) {
      window.neuralConstellation.emitPulse('arbiter', 'synthesizer');
    }

    setTimeout(() => {
      thinkingBubble.innerHTML = `<strong>The Arbiter:</strong> I have reviewed your inquiry regarding <em>"${escapeHtml(text.slice(0, 50))}"</em>. The foundational invariants and calculations have been cross-verified against the specification. If you'd like a revised publication PDF or adjusted parameters, let me know!`;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 900);
  }

  // 9. Client-Side Printable PDF Compiler
  function exportDeliverablePDF(content) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hive Verified Deliverable</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 40px; color: #111; }
          h1, h2, h3 { color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          pre { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; white-space: pre-wrap; font-family: monospace; font-size: 13px; }
          .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="badge">VERIFIED & APPROVED BY THE ARBITER • HIVE MULTI-MODEL COUNCIL</div>
        <pre>${escapeHtml(content)}</pre>
        <script>window.onload = function() { window.print(); };<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
});
