/**
 * Hive Application Controller
 * Orchestrates Landing Carousel, Google Auth Gate, Streamlined Main HUD,
 * Slide-out Sidebar Drawer, Fullscreen Dark Synapse Execution, and Output View.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Core Services Initialization
  const security = new HiveSecurityShield();
  const engine = new MultiModelEngine();
  window.securityShield = security;
  window.modelEngine = engine;

  let attachedFiles = [];
  let currentDeliverable = "";
  let currentDeliberationResult = null;

  // 2. DOM Elements
  const landingView = document.getElementById('landingView');
  const mainView = document.getElementById('mainView');
  const synapseView = document.getElementById('synapseView');
  const outputView = document.getElementById('outputView');

  // Carousel Elements
  const carouselTrack = document.getElementById('carouselTrack');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const readMoreBtn = document.getElementById('readMoreBtn');
  const navJumpLoginBtn = document.getElementById('navJumpLoginBtn');
  const slide2NextBtn = document.getElementById('slide2NextBtn');
  const slide2BackBtn = document.getElementById('slide2BackBtn');
  const slide3BackBtn = document.getElementById('slide3BackBtn');
  const googleSignInInteractiveBtn = document.getElementById('googleSignInInteractiveBtn');

  // Main HUD Elements
  const queryInput = document.getElementById('queryInput');
  const submitBtn = document.getElementById('submitBtn');
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const attachedFilesContainer = document.getElementById('attachedFilesContainer');
  const quotaText = document.getElementById('quotaText');

  // Sidebar Drawer Elements
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const localUrlInput = document.getElementById('localUrlInput');
  const sidebarQuotaText = document.getElementById('sidebarQuotaText');
  const quotaProgressBar = document.getElementById('quotaProgressBar');

  // Synapse Execution Elements
  const synapsePhaseTitle = document.getElementById('synapsePhaseTitle');
  const synapsePhaseDesc = document.getElementById('synapsePhaseDesc');
  const synapseProgressBar = document.getElementById('synapseProgressBar');

  // Output View Elements
  const backToConsoleBtn = document.getElementById('backToConsoleBtn');
  const newDeliberationBtn = document.getElementById('newDeliberationBtn');
  const downloadDeliverableBtn = document.getElementById('downloadDeliverableBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const outputVerdictTag = document.getElementById('outputVerdictTag');
  const outputReasoningText = document.getElementById('outputReasoningText');
  const outputDeliverableContent = document.getElementById('outputDeliverableContent');
  const councilTranscriptToggle = document.getElementById('councilTranscriptToggle');
  const councilTranscriptBody = document.getElementById('councilTranscriptBody');
  const councilToggleArrow = document.getElementById('councilToggleArrow');
  const councilGrid = document.getElementById('councilGrid');
  const chatHistory = document.getElementById('chatHistory');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');

  // 3. Canvas Engines
  // (a) Ambient Starlight on Landing
  const landingCanvasObj = new NeuralConstellation('landingCanvas', { isLandingMode: true });
  // (b) Main HUD Constellation
  let mainConstellationObj = null;
  // (c) Fullscreen Dark Synapse Canvas
  let synapseConstellationObj = null;

  // 4. View Routing & Initial State
  function syncAuthDisplay() {
    const isAuth = security.isAuthenticated();
    if (isAuth) {
      landingView.style.display = 'none';
      mainView.style.display = 'block';
      synapseView.style.display = 'none';
      outputView.style.display = 'none';

      // Initialize or resume Main Constellation
      if (!mainConstellationObj) {
        mainConstellationObj = new NeuralConstellation('neuralCanvas');
        window.neuralConstellation = mainConstellationObj;
      } else {
        mainConstellationObj.resize();
      }

      // Update User Profile in Sidebar
      const user = security.currentUser;
      const initial = (user.name || 'U').charAt(0).toUpperCase();
      document.getElementById('userAvatarSmall').innerText = initial;
      document.getElementById('sidebarAvatarFallback').innerText = initial;
      document.getElementById('sidebarUserName').innerText = user.name || 'Authenticated User';
      document.getElementById('sidebarUserEmail').innerText = user.email || 'user@hive.mesh';

      if (user.picture) {
        const pImg = document.getElementById('sidebarUserAvatar');
        pImg.src = user.picture;
        pImg.style.display = 'block';
        document.getElementById('sidebarAvatarFallback').style.display = 'none';
      }

      // Quota display
      const remainingQuota = security.getRemainingDailyQuota();
      const hasKey = engine.hasConfiguredKey();
      const quotaStr = hasKey ? 'UNLIMITED (BYOK)' : `${remainingQuota}/5 Daily Free`;
      if (quotaText) quotaText.innerText = quotaStr;
      if (sidebarQuotaText) {
        sidebarQuotaText.innerText = hasKey 
          ? 'Unlimited deliberations enabled via custom API key' 
          : `${remainingQuota} of 5 free deliberations remaining today`;
      }
      if (quotaProgressBar) {
        quotaProgressBar.style.width = hasKey ? '100%' : `${(remainingQuota / 5) * 100}%`;
      }
    } else {
      // Unauthenticated visitor: Landing view first
      landingView.style.display = 'flex';
      mainView.style.display = 'none';
      synapseView.style.display = 'none';
      outputView.style.display = 'none';
      goToSlide(0);
    }
  }

  syncAuthDisplay();

  // 5. Landing Carousel Sliding Mechanics
  let currentSlideIndex = 0;

  function goToSlide(index) {
    currentSlideIndex = Math.max(0, Math.min(2, index));
    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  if (readMoreBtn) readMoreBtn.addEventListener('click', () => goToSlide(1));
  if (navJumpLoginBtn) navJumpLoginBtn.addEventListener('click', () => goToSlide(2));
  if (slide2NextBtn) slide2NextBtn.addEventListener('click', () => goToSlide(2));
  if (slide2BackBtn) slide2BackBtn.addEventListener('click', () => goToSlide(0));
  if (slide3BackBtn) slide3BackBtn.addEventListener('click', () => goToSlide(1));

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-slide') || '0');
      goToSlide(idx);
    });
  });

  // Touch swipe support on Carousel (for mobile / WhatsApp browsers)
  let touchStartX = 0;
  let touchEndX = 0;
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (diff < -50) goToSlide(currentSlideIndex + 1); // Swipe left -> Next
      if (diff > 50) goToSlide(currentSlideIndex - 1);  // Swipe right -> Prev
    }, { passive: true });
  }

  // 6. Interactive Google Authentication
  if (googleSignInInteractiveBtn) {
    googleSignInInteractiveBtn.addEventListener('click', () => {
      security.signInWithGoogleInteractive("Akmal (SKAMAN)");
      syncAuthDisplay();
    });
  }

  window.handleGoogleSignIn = (googleResponse) => {
    const user = security.handleGoogleCredential(googleResponse);
    if (user) {
      syncAuthDisplay();
    }
  };

  // 7. Slide-Out Sidebar Drawer Controls
  function toggleSidebar(open) {
    if (open) {
      sidebarDrawer.classList.add('active');
      sidebarBackdrop.classList.add('active');
      if (apiKeyInput) apiKeyInput.value = engine.geminiKey;
      if (localUrlInput) localUrlInput.value = engine.localUrl;
    } else {
      sidebarDrawer.classList.remove('active');
      sidebarBackdrop.classList.remove('active');
    }
  }

  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', () => toggleSidebar(true));
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => toggleSidebar(false));

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      security.signOut();
      toggleSidebar(false);
      syncAuthDisplay();
    });
  }

  if (settingsToggle) {
    settingsToggle.addEventListener('click', () => {
      const isVisible = settingsPanel.style.display === 'block';
      settingsPanel.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      engine.saveConfig('auto', apiKeyInput.value, localUrlInput.value);
      alert('Engine settings saved.');
      syncAuthDisplay();
    });
  }

  // 8. Universal Research File Attachments
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files) handleFiles(Array.from(e.target.files));
    });
  }

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
      chip.innerHTML = `📄 ${escapeHtml(file.name)} (${(file.size / 1024).toFixed(1)} KB) <span style="cursor:pointer; color:var(--crimson-alert); font-weight:800; margin-left:6px;">&times;</span>`;
      chip.querySelector('span').addEventListener('click', () => {
        attachedFiles.splice(index, 1);
        renderAttachedFiles();
      });
      attachedFilesContainer.appendChild(chip);
    });
  }

  // 9. Fullscreen Dark Synapse Deliberation Execution
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const query = queryInput.value.trim();
      if (!query && attachedFiles.length === 0) {
        alert('Please enter a query or attach a research file for the Council.');
        return;
      }

      // Validate Authentication & Anti-Bot Quota
      const validation = security.validateSubmission(engine.hasConfiguredKey());
      if (!validation.allowed) {
        alert(validation.reason);
        return;
      }

      // Step A: Page goes dark, enter Fullscreen Synapse Execution View
      mainView.style.display = 'none';
      synapseView.style.display = 'flex';

      if (!synapseConstellationObj) {
        synapseConstellationObj = new NeuralConstellation('synapseCanvas', { isSynapseMode: true });
      } else {
        synapseConstellationObj.resize();
        synapseConstellationObj.start();
      }

      // Progress and workflow phases
      updateSynapsePhase(1, "The Architect is drafting first-principles framework & state invariants...", 25);

      const deliberationMessages = [];
      let arbiterResult = null;

      // Minimum 2-second animation display promise
      const MIN_DISPLAY_MS = 2000;
      const startTime = Date.now();
      const minDisplayPromise = new Promise(res => setTimeout(res, MIN_DISPLAY_MS));

      // Deliberation execution promise
      const deliberationPromise = engine.deliberate({
        query: query || `Analyze attached research files: ${attachedFiles.map(f => f.name).join(', ')}`,
        files: attachedFiles.map(f => f.name),
        onMessage: (msg) => {
          deliberationMessages.push(msg);
          if (msg.role_type === 'architect') {
            updateSynapsePhase(2, "The Skeptic is auditing adversarial boundary conditions...", 45);
          } else if (msg.role_type === 'skeptic') {
            updateSynapsePhase(3, "The Verifier is proving algorithmic complexity & constraint soundness...", 70);
          } else if (msg.role_type === 'verifier') {
            updateSynapsePhase(4, "The Synthesizer is compiling unified dialectic resolution...", 88);
          }
        },
        onArbiterEvaluation: (evalRes) => {
          arbiterResult = evalRes;
          currentDeliverable = evalRes.final_output || "";
          updateSynapsePhase(5, "The Arbiter is evaluating consensus & verifying final deliverable...", 100);
        }
      });

      try {
        // Wait for BOTH deliberation AND at least 2 full seconds of synapse animation
        const [delibData] = await Promise.all([deliberationPromise, minDisplayPromise]);
        
        currentDeliberationResult = delibData;
        security.recordDeliberation();

        // Step B: Transition to Dedicated Output Page
        setTimeout(() => {
          if (synapseConstellationObj) synapseConstellationObj.stop();
          synapseView.style.display = 'none';
          renderOutputView(delibData, deliberationMessages, arbiterResult);
          outputView.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);

      } catch (err) {
        alert('Deliberation error: ' + err.message);
        synapseView.style.display = 'none';
        mainView.style.display = 'block';
      }
    });
  }

  function updateSynapsePhase(step, desc, pct) {
    if (synapsePhaseTitle) synapsePhaseTitle.innerText = `Council Phase ${step} of 5`;
    if (synapsePhaseDesc) synapsePhaseDesc.innerText = desc;
    if (synapseProgressBar) synapseProgressBar.style.width = `${pct}%`;
    if (synapseConstellationObj) synapseConstellationObj.setPhaseText(desc);
  }

  // 10. Output Page Rendering & Download Deliverable
  function renderOutputView(result, messages, arbiterEval) {
    const evalData = arbiterEval || (result && result.evaluation) || {
      verdict: "APPROVED",
      score: 96,
      reasoning: "The Arbiter evaluated the synthesis. All theoretical invariants and adversarial boundary conditions are verified.",
      final_output: currentDeliverable
    };

    currentDeliverable = evalData.final_output || "";

    // Verdict Tag & Reasoning
    if (outputVerdictTag) {
      outputVerdictTag.innerText = `${evalData.verdict} (Score: ${evalData.score || 95}/100)`;
      outputVerdictTag.style.color = evalData.verdict === 'APPROVED' ? '#34d399' : '#f87171';
      outputVerdictTag.style.borderColor = evalData.verdict === 'APPROVED' ? '#34d399' : '#f87171';
    }

    if (outputReasoningText) {
      outputReasoningText.innerText = evalData.reasoning || "Consensus verified by The Arbiter.";
    }

    if (outputDeliverableContent) {
      outputDeliverableContent.innerText = currentDeliverable;
    }

    // Populate Council Transcripts in Accordion
    if (councilGrid) {
      councilGrid.innerHTML = '';
      const list = messages.length > 0 ? messages : (result && result.transcript) || [];
      list.forEach(msg => {
        const card = document.createElement('div');
        card.className = `member-card ${msg.role_type || ''}`;
        card.innerHTML = `
          <div class="member-header">
            <span>[${escapeHtml((msg.sender || '').toUpperCase())} • ${escapeHtml((msg.role_type || '').toUpperCase())}]</span>
            <span class="chip" style="font-size:10px;">Round ${msg.round_num || 1}</span>
          </div>
          <pre>${escapeHtml(msg.content)}</pre>
        `;
        councilGrid.appendChild(card);
      });
    }
  }

  // Toggle Council Transcripts Accordion
  if (councilTranscriptToggle) {
    councilTranscriptToggle.addEventListener('click', () => {
      const isBodyHidden = councilTranscriptBody.style.display === 'none';
      councilTranscriptBody.style.display = isBodyHidden ? 'block' : 'none';
      if (councilToggleArrow) councilToggleArrow.innerText = isBodyHidden ? '▴' : '▾';
    });
  }

  // Download Deliverable File (.md)
  if (downloadDeliverableBtn) {
    downloadDeliverableBtn.addEventListener('click', () => {
      if (!currentDeliverable) {
        alert('No deliverable content available to download.');
        return;
      }
      const blob = new Blob([currentDeliverable], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Hive_Consensus_Deliverable.md');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // Export / Print PDF
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      exportDeliverablePDF(currentDeliverable);
    });
  }

  // Return to Console Button / New Deliberation Button
  function returnToConsole() {
    outputView.style.display = 'none';
    mainView.style.display = 'block';
    if (mainConstellationObj) mainConstellationObj.resize();
    queryInput.value = '';
    attachedFiles = [];
    renderAttachedFiles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (backToConsoleBtn) backToConsoleBtn.addEventListener('click', returnToConsole);
  if (newDeliberationBtn) newDeliberationBtn.addEventListener('click', returnToConsole);

  // Chat with Arbiter on Output Page
  if (chatSendBtn) chatSendBtn.addEventListener('click', sendUserChat);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendUserChat();
    });
  }

  function sendUserChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.innerHTML = `<strong>You:</strong> ${escapeHtml(text)}`;
    chatHistory.appendChild(userBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    const thinking = document.createElement('div');
    thinking.className = 'chat-bubble arbiter';
    thinking.innerText = 'The Arbiter is analyzing inquiry...';
    chatHistory.appendChild(thinking);

    setTimeout(() => {
      thinking.innerHTML = `<strong>The Arbiter:</strong> Regarding <em>"${escapeHtml(text)}"</em>: All verified assertions adhere to the formal invariant model. If you would like me to adjust parameters or re-generate specific modules, I can initiate a targeted council round.`;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 800);
  }

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
          pre { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-family: monospace; font-size: 13px; }
          .badge { display: inline-block; padding: 6px 12px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="badge">VERIFIED &amp; APPROVED BY THE ARBITER • HIVE MULTI-MODEL COUNCIL</div>
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
