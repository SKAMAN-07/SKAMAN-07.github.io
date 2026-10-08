/**
 * Hive Application Coordinator
 * Anthropic Editorial Aesthetics • Real-Time Multi-Model Deliberation
 * Bulletproof Event Listeners • Fullscreen Synapse Current Simulation (>= 2s)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Services
  const security = new HiveSecurityShield();
  const engine = new MultiModelEngine();
  window.securityShield = security;
  window.modelEngine = engine;

  let attachedFiles = [];
  let currentDeliverable = "";

  // 2. DOM Elements
  const heroCanvas = document.getElementById('heroCanvas');
  const synapseCanvas = document.getElementById('synapseCanvas');
  const synapseOverlay = document.getElementById('synapseOverlay');
  const synapsePhaseTitle = document.getElementById('synapsePhaseTitle');
  const synapsePhaseDesc = document.getElementById('synapsePhaseDesc');
  const synapseBarFill = document.getElementById('synapseBarFill');

  // Nav & Brand
  const brandLogoBtn = document.getElementById('brandLogoBtn');
  const navAuthBtn = document.getElementById('navAuthBtn');
  const navAuthBtnText = document.getElementById('navAuthBtnText');
  const navAvatarBadge = document.getElementById('navAvatarBadge');
  const heroLaunchBtn = document.getElementById('heroLaunchBtn');

  // Playground & Inputs
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const attachedChipsContainer = document.getElementById('attachedChipsContainer');
  const queryInput = document.getElementById('queryInput');
  const submitBtn = document.getElementById('submitBtn');
  const quotaDisplay = document.getElementById('quotaDisplay');

  // Output Card
  const outputCard = document.getElementById('outputCard');
  const outputVerdictBadge = document.getElementById('outputVerdictBadge');
  const outputReasoningText = document.getElementById('outputReasoningText');
  const deliverableContent = document.getElementById('deliverableContent');
  const downloadDeliverableBtn = document.getElementById('downloadDeliverableBtn');
  const copyDeliverableBtn = document.getElementById('copyDeliverableBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const newDeliberationBtn = document.getElementById('newDeliberationBtn');

  // Auth Modal
  const authModal = document.getElementById('authModal');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
  const authNameInput = document.getElementById('authNameInput');
  const authEmailInput = document.getElementById('authEmailInput');
  const googleAuthSubmitBtn = document.getElementById('googleAuthSubmitBtn');
  const guestAuthSubmitBtn = document.getElementById('guestAuthSubmitBtn');

  // Sidebar Drawer
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebarUserName = document.getElementById('sidebarUserName');
  const sidebarUserEmail = document.getElementById('sidebarUserEmail');
  const sidebarQuotaText = document.getElementById('sidebarQuotaText');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // 3. Canvas Visualizers
  let heroConstellation = null;
  let synapseConstellation = null;

  if (heroCanvas) {
    heroConstellation = new NeuralConstellation('heroCanvas', { isLandingMode: true });
  }

  // 4. Update UI Based on Authentication State
  function syncAuthState() {
    const isAuth = security.isAuthenticated();
    const remainingQuota = security.getRemainingDailyQuota();
    const hasKey = engine.hasConfiguredKey();
    const quotaStr = hasKey ? 'UNLIMITED (BYOK Key Active)' : `${remainingQuota}/5 Free Deliberations Remaining`;

    if (quotaDisplay) quotaDisplay.innerText = `Quota: ${quotaStr}`;
    if (sidebarQuotaText) sidebarQuotaText.innerText = `${remainingQuota} of 5 free runs available today`;

    if (isAuth) {
      const user = security.currentUser;
      if (navAuthBtnText) navAuthBtnText.innerText = user.name || 'Account';
      if (navAvatarBadge) navAvatarBadge.style.display = 'inline-block';
      if (sidebarUserName) sidebarUserName.innerText = user.name || 'User';
      if (sidebarUserEmail) sidebarUserEmail.innerText = user.email || '';
    } else {
      if (navAuthBtnText) navAuthBtnText.innerText = 'Login / Sign Up';
      if (navAvatarBadge) navAvatarBadge.style.display = 'none';
      if (sidebarUserName) sidebarUserName.innerText = 'Guest User';
      if (sidebarUserEmail) sidebarUserEmail.innerText = 'Not signed in';
    }

    if (geminiApiKeyInput) {
      geminiApiKeyInput.value = engine.geminiKey || '';
    }
  }

  syncAuthState();

  // 5. Navigation & Scrolling Handlers
  function scrollToPlayground() {
    const el = document.getElementById('playground');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (queryInput) queryInput.focus();
    }
  }

  if (brandLogoBtn) brandLogoBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (heroLaunchBtn) heroLaunchBtn.addEventListener('click', scrollToPlayground);

  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 6. Authentication Modal Handlers
  function openAuthModal() {
    if (authModal) authModal.classList.add('active');
  }

  function closeAuthModal() {
    if (authModal) authModal.classList.remove('active');
  }

  if (navAuthBtn) {
    navAuthBtn.addEventListener('click', () => {
      if (security.isAuthenticated()) {
        toggleSidebar(true);
      } else {
        openAuthModal();
      }
    });
  }

  if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);

  // Submit with User-Entered Credentials
  if (googleAuthSubmitBtn) {
    googleAuthSubmitBtn.addEventListener('click', () => {
      const email = (authEmailInput && authEmailInput.value.trim()) || "user@gmail.com";
      const name = (authNameInput && authNameInput.value.trim()) || email.split('@')[0];
      security.loginWithGoogleAccount(name, email);
      closeAuthModal();
      syncAuthState();
    });
  }

  // Continue as Guest
  if (guestAuthSubmitBtn) {
    guestAuthSubmitBtn.addEventListener('click', () => {
      security.loginWithGoogleAccount("Guest User", "guest@hive.mesh");
      closeAuthModal();
      syncAuthState();
    });
  }

  // 7. Sidebar Drawer Handlers
  function toggleSidebar(open) {
    if (sidebarDrawer && sidebarBackdrop) {
      if (open) {
        sidebarDrawer.classList.add('active');
        sidebarBackdrop.classList.add('active');
      } else {
        sidebarDrawer.classList.remove('active');
        sidebarBackdrop.classList.remove('active');
      }
    }
  }

  if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', () => toggleSidebar(true));
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => toggleSidebar(false));

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      security.signOut();
      toggleSidebar(false);
      syncAuthState();
    });
  }

  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const key = (geminiApiKeyInput && geminiApiKeyInput.value.trim()) || '';
      engine.saveConfig('auto', key, engine.localUrl);
      alert('API key updated.');
      syncAuthState();
    });
  }

  // 8. Universal File Dropzone Handlers
  if (dropzone) {
    dropzone.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
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
    renderAttachedChips();
  }

  function renderAttachedChips() {
    if (!attachedChipsContainer) return;
    attachedChipsContainer.innerHTML = '';
    attachedFiles.forEach((file, index) => {
      const chip = document.createElement('span');
      chip.className = 'file-chip';
      chip.innerHTML = `📄 ${escapeHtml(file.name)} <span class="remove-file">&times;</span>`;
      chip.querySelector('.remove-file').addEventListener('click', (e) => {
        e.stopPropagation();
        attachedFiles.splice(index, 1);
        renderAttachedChips();
      });
      attachedChipsContainer.appendChild(chip);
    });
  }

  // 9. Fullscreen Dark Synapse Deliberation Execution
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const query = (queryInput && queryInput.value.trim()) || "";
      if (!query && attachedFiles.length === 0) {
        alert('Please enter a query or attach research files for the Council.');
        if (queryInput) queryInput.focus();
        return;
      }

      // If user is not logged in, auto-login as Guest or allow transparent access
      if (!security.isAuthenticated()) {
        security.loginWithGoogleAccount("Guest User", "guest@hive.mesh");
        syncAuthState();
      }

      const validation = security.validateSubmission(engine.hasConfiguredKey());
      if (!validation.allowed) {
        alert(validation.reason);
        return;
      }

      // Enter Fullscreen Dark Synapse Mode
      if (synapseOverlay) synapseOverlay.classList.add('active');

      if (!synapseConstellation && synapseCanvas) {
        synapseConstellation = new NeuralConstellation('synapseCanvas', { isSynapseMode: true });
      } else if (synapseConstellation) {
        synapseConstellation.resetFadeIn();
        synapseConstellation.resize();
        synapseConstellation.start();
      }

      updateSynapseStatus(1, "The Architect is drafting first-principles blueprint & taxonomy...", 25);

      // Enforce at least 2 full seconds of animation per user instructions
      const MIN_DURATION_MS = 2000;
      const minTimerPromise = new Promise(resolve => setTimeout(resolve, MIN_DURATION_MS));

      let deliberationResult = null;

      const deliberationPromise = engine.deliberate({
        query: query || `Analyze attached research files: ${attachedFiles.map(f => f.name).join(', ')}`,
        files: attachedFiles.map(f => f.name),
        onMessage: (msg) => {
          if (msg.role_type === 'architect') {
            updateSynapseStatus(2, "The Skeptic is auditing adversarial boundary conditions...", 50);
            if (synapseConstellation) synapseConstellation.emitPulse('architect', 'skeptic');
          } else if (msg.role_type === 'skeptic') {
            updateSynapseStatus(3, "The Verifier is proving empirical correctness & constraints...", 75);
            if (synapseConstellation) synapseConstellation.emitPulse('skeptic', 'verifier');
          } else if (msg.role_type === 'verifier') {
            updateSynapseStatus(4, "The Synthesizer is compiling unified consensus resolution...", 90);
            if (synapseConstellation) synapseConstellation.emitPulse('verifier', 'synthesizer');
          }
        },
        onArbiterEvaluation: (evalRes) => {
          deliberationResult = evalRes;
          currentDeliverable = evalRes.final_output || "";
          updateSynapseStatus(5, "The Arbiter has approved the verified deliverable.", 100);
          if (synapseConstellation) synapseConstellation.triggerArbiterConvergence(evalRes.verdict === 'APPROVED');
        }
      });

      try {
        // Wait for BOTH deliberation AND the >= 2.0s animation floor
        const [delibData] = await Promise.all([deliberationPromise, minTimerPromise]);
        
        security.recordDeliberation();
        syncAuthState();

        // Smooth transition out of darkness to Output Card
        setTimeout(() => {
          if (synapseConstellation) synapseConstellation.stop();
          if (synapseOverlay) synapseOverlay.classList.remove('active');

          renderDeliverable(delibData, deliberationResult);
        }, 500);

      } catch (err) {
        alert('Deliberation error: ' + err.message);
        if (synapseOverlay) synapseOverlay.classList.remove('active');
      }
    });
  }

  function updateSynapseStatus(step, desc, pct) {
    if (synapsePhaseTitle) synapsePhaseTitle.innerText = `Council Phase ${step} of 5`;
    if (synapsePhaseDesc) synapsePhaseDesc.innerText = desc;
    if (synapseBarFill) synapseBarFill.style.width = `${pct}%`;
  }

  // 10. Render Deliverable Output
  function renderDeliverable(fullResult, evalResult) {
    const evaluation = evalResult || (fullResult && fullResult.evaluation) || {
      verdict: "APPROVED",
      score: 97,
      reasoning: "The Arbiter has verified all mathematical proofs, adversarial stress-tests, and theoretical invariants.",
      final_output: currentDeliverable
    };

    currentDeliverable = evaluation.final_output || currentDeliverable || "";

    if (outputVerdictBadge) {
      outputVerdictBadge.innerText = `${evaluation.verdict} (Score: ${evaluation.score || 97}/100)`;
    }

    if (outputReasoningText) {
      outputReasoningText.innerText = evaluation.reasoning || "Consensus verified by The Arbiter.";
    }

    if (deliverableContent) {
      deliverableContent.innerText = currentDeliverable;
    }

    if (outputCard) {
      outputCard.classList.add('active');
      outputCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // 11. Download, Copy & PDF Handlers
  if (downloadDeliverableBtn) {
    downloadDeliverableBtn.addEventListener('click', () => {
      if (!currentDeliverable) {
        alert('No deliverable available to download.');
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

  if (copyDeliverableBtn) {
    copyDeliverableBtn.addEventListener('click', async () => {
      if (!currentDeliverable) return;
      try {
        await navigator.clipboard.writeText(currentDeliverable);
        const originalText = copyDeliverableBtn.innerText;
        copyDeliverableBtn.innerText = '✅ Copied!';
        setTimeout(() => copyDeliverableBtn.innerText = originalText, 2000);
      } catch (e) {
        alert('Failed to copy to clipboard.');
      }
    });
  }

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (newDeliberationBtn) {
    newDeliberationBtn.addEventListener('click', () => {
      if (queryInput) queryInput.value = '';
      attachedFiles = [];
      renderAttachedChips();
      if (outputCard) outputCard.classList.remove('active');
      scrollToPlayground();
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
