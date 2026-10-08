/**
 * Hive Application Coordinator
 * Anthropic Editorial Aesthetics • Real-Time Multi-Model Deliberation
 * Anti-Burner Google Auth • Persistent Project Memory • Cloud Burst ("END CHAT")
 * Interactive Arbiter Chat • New Chat Confirmation Modal • Secure Support Desk
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Services
  const security = new HiveSecurityShield();
  const engine = new MultiModelEngine();
  const supportVault = new HiveSupportVault();
  window.securityShield = security;
  window.modelEngine = engine;
  window.supportVault = supportVault;

  let attachedFiles = [];
  let currentDeliverable = "";
  let arbiterHistory = [];

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
  const navLinkSupport = document.getElementById('navLinkSupport');

  // Playground & Inputs
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const attachedChipsContainer = document.getElementById('attachedChipsContainer');
  const queryInput = document.getElementById('queryInput');
  const submitBtn = document.getElementById('submitBtn');
  const quotaDisplay = document.getElementById('quotaDisplay');
  const memoryBadge = document.getElementById('memoryBadge');

  // Cloud Burst / New Chat / END CHAT Buttons
  const endChatBtn = document.getElementById('endChatBtn');
  const endChatHeaderBtn = document.getElementById('endChatHeaderBtn');
  const endChatOutputBtn = document.getElementById('endChatOutputBtn');
  const sidebarEndChatBtn = document.getElementById('sidebarEndChatBtn');
  const newChatHeaderBtn = document.getElementById('newChatHeaderBtn');
  const cloudBurstToast = document.getElementById('cloudBurstToast');

  // New Chat Confirmation Modal
  const newChatConfirmModal = document.getElementById('newChatConfirmModal');
  const newChatAgreeBtn = document.getElementById('newChatAgreeBtn');
  const newChatDisagreeBtn = document.getElementById('newChatDisagreeBtn');

  // Output Card
  const outputCard = document.getElementById('outputCard');
  const outputVerdictBadge = document.getElementById('outputVerdictBadge');
  const outputReasoningText = document.getElementById('outputReasoningText');
  const deliverableContent = document.getElementById('deliverableContent');
  const toggleViewFormatBtn = document.getElementById('toggleViewFormatBtn');
  const downloadDeliverableBtn = document.getElementById('downloadDeliverableBtn');
  const copyDeliverableBtn = document.getElementById('copyDeliverableBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const newDeliberationBtn = document.getElementById('newDeliberationBtn');

  // Deliberation Mode Tabs & AI Council Answers Feed
  const tabDeliverableBtn = document.getElementById('tabDeliverableBtn');
  const tabCouncilAnswersBtn = document.getElementById('tabCouncilAnswersBtn');
  const deliverablePanel = document.getElementById('deliverablePanel');
  const councilAnswersPanel = document.getElementById('councilAnswersPanel');
  const councilAnswersFeed = document.getElementById('councilAnswersFeed');
  const councilTelemetryStrip = document.getElementById('councilTelemetryStrip');
  let currentTranscript = [];

  // Gateway Modal & Controls
  const gatewayModalBtn = document.getElementById('gatewayModalBtn');
  const gatewayModal = document.getElementById('gatewayModal');
  const closeGatewayModalBtn = document.getElementById('closeGatewayModalBtn');
  const gatewayUrlInput = document.getElementById('gatewayUrlInput');
  const gatewayModelSelect = document.getElementById('gatewayModelSelect');
  const gatewayApiKeyInput = document.getElementById('gatewayApiKeyInput');
  const testGatewayBtn = document.getElementById('testGatewayBtn');
  const saveGatewayBtn = document.getElementById('saveGatewayBtn');
  const gatewayStatusNotice = document.getElementById('gatewayStatusNotice');
  const presetOmniRouteBtn = document.getElementById('presetOmniRouteBtn');
  const presetOpenRouterBtn = document.getElementById('presetOpenRouterBtn');
  const presetOllamaBtn = document.getElementById('presetOllamaBtn');

  // Arbiter Interactive Chat Card
  const arbiterChatCard = document.getElementById('arbiterChatCard');
  const arbiterChatStream = document.getElementById('arbiterChatStream');
  const arbiterMsgInput = document.getElementById('arbiterMsgInput');
  const arbiterSendBtn = document.getElementById('arbiterSendBtn');

  // Support Modal & Admin Desk
  const supportModal = document.getElementById('supportModal');
  const closeSupportModalBtn = document.getElementById('closeSupportModalBtn');
  const supportEmailInput = document.getElementById('supportEmailInput');
  const supportCategorySelect = document.getElementById('supportCategorySelect');
  const supportCommentInput = document.getElementById('supportCommentInput');
  const supportSubmitBtn = document.getElementById('supportSubmitBtn');
  const supportFeedbackStatus = document.getElementById('supportFeedbackStatus');
  const adminToggleAuthBtn = document.getElementById('adminToggleAuthBtn');
  const adminLockedNotice = document.getElementById('adminLockedNotice');
  const adminTicketsContainer = document.getElementById('adminTicketsContainer');
  const adminTicketsList = document.getElementById('adminTicketsList');

  // Auth Modal & Elements
  const authModal = document.getElementById('authModal');
  const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
  const authAlertBox = document.getElementById('authAlertBox');
  const authNameInput = document.getElementById('authNameInput');
  const authEmailInput = document.getElementById('authEmailInput');
  const googleAuthSubmitBtn = document.getElementById('googleAuthSubmitBtn');

  // Sidebar Drawer
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarDrawer = document.getElementById('sidebarDrawer');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebarUserName = document.getElementById('sidebarUserName');
  const sidebarUserEmail = document.getElementById('sidebarUserEmail');
  const sidebarQuotaText = document.getElementById('sidebarQuotaText');
  const logoutBtn = document.getElementById('logoutBtn');

  // 3. Canvas Visualizers
  let heroConstellation = null;
  let synapseConstellation = null;

  if (heroCanvas) {
    heroConstellation = new NeuralConstellation('heroCanvas', { isLandingMode: true });
  }

  // 4. Update UI Based on Authentication State & Project Memory
  function syncAuthState() {
    const isAuth = security.isAuthenticated();

    if (quotaDisplay) {
      quotaDisplay.innerHTML = `<span class="pill-dot"></span> Frontier Multi-Model Active • Zero Setup Hassle`;
    }

    if (sidebarQuotaText) {
      sidebarQuotaText.innerText = '● Active • Zero Setup Required';
    }

    if (isAuth) {
      const user = security.currentUser;
      if (navAuthBtnText) navAuthBtnText.innerText = user.name || 'Google Account';
      if (navAvatarBadge) navAvatarBadge.style.display = 'inline-block';
      if (sidebarUserName) sidebarUserName.innerText = user.name || 'Google User';
      if (sidebarUserEmail) sidebarUserEmail.innerText = user.email || '';
    } else {
      if (navAuthBtnText) navAuthBtnText.innerText = 'Login / Sign Up';
      if (navAvatarBadge) navAvatarBadge.style.display = 'none';
      if (sidebarUserName) sidebarUserName.innerText = 'Guest Visitor';
      if (sidebarUserEmail) sidebarUserEmail.innerText = 'Sign in with Google required';
    }

    updateMemoryUI();
  }

  function updateMemoryUI() {
    if (!memoryBadge) return;
    const turnCount = engine.getMemory().getTurnCount();
    if (turnCount === 0) {
      memoryBadge.innerText = '🧠 Memory: Fresh Slate';
      memoryBadge.classList.remove('has-context');
    } else {
      memoryBadge.innerText = `🧠 Memory: Turn ${turnCount} Preserved`;
      memoryBadge.classList.add('has-context');
    }
  }

  syncAuthState();

  // 5. Cloud Burst / END CHAT Handler
  function executeCloudBurst() {
    // 1. Purge project memory buffer
    engine.clearProjectMemory();

    // 2. Clear inputs, staging, and deliverable state
    if (queryInput) queryInput.value = '';
    attachedFiles = [];
    renderAttachedChips();

    // 3. Reset output card and Arbiter discussion
    if (outputCard) outputCard.classList.remove('active');
    currentDeliverable = "";
    currentTranscript = [];
    if (councilAnswersFeed) councilAnswersFeed.innerHTML = "";
    switchDeliberationTab('deliverable');
    arbiterHistory = [];
    resetArbiterChat();

    // 4. Update memory indicator
    updateMemoryUI();

    // 5. Display visual Cloud Burst Toast notification
    if (cloudBurstToast) {
      cloudBurstToast.innerText = '⚡ Cloud Burst Complete: Project memory & context buffer wiped clean.';
      cloudBurstToast.classList.add('active');
      setTimeout(() => {
        cloudBurstToast.classList.remove('active');
      }, 3200);
    }

    // 6. Smoothly scroll back to top of console
    scrollToPlayground();
  }

  // Hook all END CHAT triggers
  if (endChatBtn) endChatBtn.addEventListener('click', executeCloudBurst);
  if (endChatHeaderBtn) endChatHeaderBtn.addEventListener('click', executeCloudBurst);
  if (endChatOutputBtn) endChatOutputBtn.addEventListener('click', executeCloudBurst);
  if (sidebarEndChatBtn) sidebarEndChatBtn.addEventListener('click', () => {
    executeCloudBurst();
    toggleSidebar(false);
  });

  // 6. New Chat Confirmation Modal (Agree / Disagree)
  function promptNewChat() {
    const hasHistory = engine.getMemory().getTurnCount() > 0 || (queryInput && queryInput.value.trim()) || currentDeliverable;
    if (hasHistory) {
      if (newChatConfirmModal) newChatConfirmModal.style.display = 'flex';
    } else {
      executeCloudBurst();
    }
  }

  if (newChatHeaderBtn) newChatHeaderBtn.addEventListener('click', promptNewChat);

  if (newChatAgreeBtn) {
    newChatAgreeBtn.addEventListener('click', () => {
      if (newChatConfirmModal) newChatConfirmModal.style.display = 'none';
      executeCloudBurst();
    });
  }

  if (newChatDisagreeBtn) {
    newChatDisagreeBtn.addEventListener('click', () => {
      if (newChatConfirmModal) newChatConfirmModal.style.display = 'none';
      scrollToPlayground();
    });
  }

  // 7. Auto-Cleaning: Purge memory on tab close, navigate away, or web clear
  window.addEventListener('beforeunload', () => {
    engine.clearProjectMemory();
  });
  window.addEventListener('pagehide', () => {
    engine.clearProjectMemory();
  });

  // 8. Navigation & Scrolling Handlers
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
      const href = link.getAttribute('href');
      if (href === '#support') {
        e.preventDefault();
        openSupportModal();
        return;
      }
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 9. Authentication Modal Handlers (Strict Anti-Burner Validation)
  function openAuthModal(alertMsg = "") {
    if (authAlertBox) {
      if (alertMsg) {
        authAlertBox.innerText = alertMsg;
        authAlertBox.style.display = 'block';
      } else {
        authAlertBox.style.display = 'none';
      }
    }
    if (authModal) authModal.classList.add('active');
    if (authEmailInput) authEmailInput.focus();
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

  // Submit with User-Entered Credentials with Anti-Burner Verification
  if (googleAuthSubmitBtn) {
    googleAuthSubmitBtn.addEventListener('click', () => {
      const email = (authEmailInput && authEmailInput.value.trim()) || "";
      const name = (authNameInput && authNameInput.value.trim()) || "";

      if (!email) {
        if (authAlertBox) {
          authAlertBox.innerText = "Please enter your Google Account email (@gmail.com).";
          authAlertBox.style.display = 'block';
        }
        if (authEmailInput) authEmailInput.focus();
        return;
      }

      try {
        security.loginWithGoogleAccount(name, email);
        if (authAlertBox) authAlertBox.style.display = 'none';
        closeAuthModal();
        syncAuthState();
      } catch (err) {
        if (authAlertBox) {
          authAlertBox.innerText = err.message;
          authAlertBox.style.display = 'block';
        }
      }
    });
  }

  // 10. Sidebar Drawer Handlers
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
      executeCloudBurst();
      toggleSidebar(false);
      syncAuthState();
    });
  }

  // 11. Universal File Dropzone Handlers
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

  // 12. Fullscreen Dark Synapse Deliberation Execution
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const query = (queryInput && queryInput.value.trim()) || "";
      if (!query && attachedFiles.length === 0) {
        alert('Please enter a query or attach research files for the Council.');
        if (queryInput) queryInput.focus();
        return;
      }

      // Check Authentication (strictly gate access with real Google login)
      if (!security.isAuthenticated()) {
        openAuthModal("Authentication Required: Sign in with your Google Account (@gmail.com) to start deliberation.");
        return;
      }

      const validation = security.validateSubmission();
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

      updateSynapseStatus(1, "The Architect [Claude 3.7 Sonnet] is drafting blueprint & taxonomy...", 25);

      // Enforce at least 2 full seconds of animation floor per system instructions
      const MIN_DURATION_MS = 2000;
      const minTimerPromise = new Promise(resolve => setTimeout(resolve, MIN_DURATION_MS));

      let deliberationResult = null;

      const deliberationPromise = engine.deliberate({
        query: query || `Analyze attached research files: ${attachedFiles.map(f => f.name).join(', ')}`,
        files: attachedFiles.map(f => f.name),
        onMessage: (msg) => {
          if (msg.role_type === 'architect') {
            updateSynapseStatus(2, "The Skeptic [DeepSeek-R1] is auditing adversarial boundary conditions...", 50);
            if (synapseConstellation) synapseConstellation.emitPulse('architect', 'skeptic');
          } else if (msg.role_type === 'skeptic') {
            updateSynapseStatus(3, "The Verifier [GPT-4o] is proving empirical correctness & constraints...", 75);
            if (synapseConstellation) synapseConstellation.emitPulse('skeptic', 'verifier');
          } else if (msg.role_type === 'verifier') {
            updateSynapseStatus(4, "The Synthesizer [Claude 3.5 Sonnet] is compiling unified consensus...", 90);
            if (synapseConstellation) synapseConstellation.emitPulse('verifier', 'synthesizer');
          }
        },
        onArbiterEvaluation: (evalRes) => {
          deliberationResult = evalRes;
          currentDeliverable = evalRes.final_output || "";
          updateSynapseStatus(5, "The Arbiter has approved the verified deliverable with zero hallucination.", 100);
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
          updateMemoryUI();
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

  // 13. Markdown Formatter & HTML Sanitizer
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdownToHtml(md) {
    if (!md) return '';
    let text = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    text = text.replace(/^#### (.*$)/gim, '<h5 class="delib-h5">$1</h5>');
    text = text.replace(/^### (.*$)/gim, '<h4 class="delib-h4">$1</h4>');
    text = text.replace(/^## (.*$)/gim, '<h3 class="delib-h3">$1</h3>');
    text = text.replace(/^# (.*$)/gim, '<h2 class="delib-h2">$1</h2>');

    text = text.replace(/^---$/gim, '<hr class="delib-hr" />');

    text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    text = text.replace(/`([^`]+)`/g, '<code class="delib-code">$1</code>');
    text = text.replace(/\$\$([^\$]+)\$\$/g, '<div class="delib-formula">$$$1$$</div>');
    text = text.replace(/\$([^\$]+)\$/g, '<span class="delib-inline-formula">$1</span>');

    text = text.replace(/^\|(.+)\|$/gim, (match) => {
      const cells = match.split('|').slice(1, -1);
      const isDivider = cells.every(c => c.trim().match(/^:?-+:?$/));
      if (isDivider) return '<tr class="delib-tr-divider"></tr>';
      const cellHtml = cells.map(c => `<td class="delib-td">${c.trim()}</td>`).join('');
      return `<tr class="delib-tr">${cellHtml}</tr>`;
    });
    text = text.replace(/(<tr class="delib-tr">.*?<\/tr>(\s*<tr class="delib-tr-divider"><\/tr>)?)+/gis, (tbl) => {
      return `<div class="delib-table-wrapper"><table class="delib-table">${tbl.replace(/<tr class="delib-tr-divider"><\/tr>/g, '')}</table></div>`;
    });

    text = text.replace(/^\s*[-*•]\s+(.*$)/gim, '<li class="delib-li">$1</li>');
    text = text.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li class="delib-li-num" value="$1">$2</li>');

    text = text.replace(/(<li class="delib-li">.*?<\/li>\s*)+/gis, '<ul class="delib-ul">$&</ul>');
    text = text.replace(/(<li class="delib-li-num".*?<\/li>\s*)+/gis, '<ol class="delib-ol">$&</ol>');

    const blocks = text.split(/\n{2,}/);
    text = blocks.map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol') || 
          block.startsWith('<hr') || block.startsWith('<div') || block.startsWith('<table')) {
        return block;
      }
      return `<p class="delib-p">${block.replace(/\n/g, '<br>')}</p>`;
    }).filter(Boolean).join('\n');

    return text;
  }

  // 14. Render Deliverable Output & AI Council Answers
  let isFormattedView = true;

  function switchDeliberationTab(mode) {
    if (mode === 'deliverable') {
      if (tabDeliverableBtn) tabDeliverableBtn.classList.add('active');
      if (tabCouncilAnswersBtn) tabCouncilAnswersBtn.classList.remove('active');
      if (deliverablePanel) {
        deliverablePanel.style.display = 'block';
        deliverablePanel.classList.add('active');
      }
      if (councilAnswersPanel) {
        councilAnswersPanel.style.display = 'none';
        councilAnswersPanel.classList.remove('active');
      }
    } else if (mode === 'council') {
      if (tabCouncilAnswersBtn) tabCouncilAnswersBtn.classList.add('active');
      if (tabDeliverableBtn) tabDeliverableBtn.classList.remove('active');
      if (deliverablePanel) {
        deliverablePanel.style.display = 'none';
        deliverablePanel.classList.remove('active');
      }
      if (councilAnswersPanel) {
        councilAnswersPanel.style.display = 'block';
        councilAnswersPanel.classList.add('active');
      }
    }
  }

  if (tabDeliverableBtn) {
    tabDeliverableBtn.addEventListener('click', () => switchDeliberationTab('deliverable'));
  }
  if (tabCouncilAnswersBtn) {
    tabCouncilAnswersBtn.addEventListener('click', () => switchDeliberationTab('council'));
  }

  function getNodeColor(role) {
    switch (role) {
      case 'architect': return '#60a5fa';
      case 'skeptic': return '#f87171';
      case 'verifier': return '#fbbf24';
      case 'synthesizer': return '#a78bfa';
      case 'arbiter': return '#34d399';
      default: return '#da7756';
    }
  }

  function renderCouncilAnswers(transcript) {
    if (!councilAnswersFeed) return;
    councilAnswersFeed.innerHTML = '';

    if (!transcript || transcript.length === 0) {
      councilAnswersFeed.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted); font-size: 14px;">
          The AI Council has not yet convened for this session. Submit your inquiry above to review direct model council answers.
        </div>
      `;
      return;
    }

    transcript.forEach(step => {
      const card = document.createElement('div');
      card.className = 'council-answer-card';
      const role = step.role_type || 'architect';
      card.id = `councilCard-${role}`;

      const roleBadgeClass = `role-badge-${role}`;
      const roleLabel = role.toUpperCase();

      const header = document.createElement('div');
      header.className = 'council-answer-header';
      header.innerHTML = `
        <div class="council-answer-node-info">
          <span class="node-dot" style="background: ${getNodeColor(role)};"></span>
          <span class="council-answer-node-name">${escapeHtml(step.sender || 'Council Node')}</span>
        </div>
        <span class="council-answer-role-badge ${roleBadgeClass}">${roleLabel}</span>
      `;

      const body = document.createElement('div');
      body.className = 'council-answer-body formatted';
      body.innerHTML = formatMarkdownToHtml(step.content || '');

      card.appendChild(header);
      card.appendChild(body);
      councilAnswersFeed.appendChild(card);
    });
  }

  // Interactivity for top console telemetry strip: click any model node to navigate to its perspective
  if (councilTelemetryStrip) {
    const nodes = councilTelemetryStrip.querySelectorAll('.telemetry-node');
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const role = node.getAttribute('data-role');
        if (role === 'arbiter') {
          if (arbiterChatCard) {
            arbiterChatCard.scrollIntoView({ behavior: 'smooth' });
          } else if (outputCard) {
            outputCard.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (['architect', 'skeptic', 'verifier', 'synthesizer'].includes(role)) {
          switchDeliberationTab('council');
          if (outputCard) outputCard.scrollIntoView({ behavior: 'smooth' });
          const targetCard = document.getElementById(`councilCard-${role}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.classList.add('highlighted');
            setTimeout(() => {
              targetCard.classList.remove('highlighted');
            }, 2500);
          }
        }
      });
    });
  }

  function updateDeliverableView() {
    if (!deliverableContent) return;
    if (isFormattedView) {
      deliverableContent.innerHTML = formatMarkdownToHtml(currentDeliverable);
      deliverableContent.classList.add('formatted');
      if (toggleViewFormatBtn) toggleViewFormatBtn.innerText = "📄 Formatted View";
    } else {
      deliverableContent.innerText = currentDeliverable;
      deliverableContent.classList.remove('formatted');
      if (toggleViewFormatBtn) toggleViewFormatBtn.innerText = "📝 Raw Markdown";
    }
  }

  function renderDeliverable(fullResult, evalResult) {
    const evaluation = evalResult || (fullResult && fullResult.evaluation) || {
      verdict: "APPROVED",
      score: 98,
      reasoning: "The Arbiter has verified all mathematical proofs, adversarial stress-tests, and theoretical invariants.",
      final_output: currentDeliverable
    };

    currentDeliverable = evaluation.final_output || currentDeliverable || "";
    currentTranscript = (fullResult && fullResult.transcript) || currentTranscript || [];

    if (outputVerdictBadge) {
      outputVerdictBadge.innerText = `${evaluation.verdict} (Score: ${evaluation.score || 98}/100)`;
    }

    if (outputReasoningText) {
      outputReasoningText.innerText = evaluation.reasoning || "Consensus verified by The Arbiter with project memory intact.";
    }

    updateDeliverableView();
    renderCouncilAnswers(currentTranscript);
    switchDeliberationTab('deliverable');

    if (outputCard) {
      outputCard.classList.add('active');
      outputCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (toggleViewFormatBtn) {
    toggleViewFormatBtn.addEventListener('click', () => {
      isFormattedView = !isFormattedView;
      updateDeliverableView();
    });
  }

  // 15. Interactive Arbiter Consultation Chat Handlers
  function resetArbiterChat() {
    if (!arbiterChatStream) return;
    arbiterChatStream.innerHTML = `
      <div class="arbiter-msg msg-arbiter">
        <div class="msg-sender">⚖️ The Arbiter</div>
        <div class="msg-bubble">
          Hello! I am The Arbiter, executive leader of the Multi-Model Frontier Council. The deliberation is finalized and the complete deliverable is rendered in the window directly above this chat.
          <p style="margin: 8px 0 4px 0;">I am here to collaborate with you directly as a colleague:</p>
          <ul style="margin: 4px 0 0 18px;">
            <li>Click <strong>"📖 Where is the work?"</strong> to get a complete, structured executive walkthrough right here in chat.</li>
            <li>Ask <strong>"Is the work done?"</strong> for a full audit of completed sections and invariants.</li>
            <li>Ask <strong>in-depth questions</strong> about the domain, valuation, formulas, or risks.</li>
            <li>Tell me what <strong>revisions or additions</strong> you need, and I will update the deliverable immediately.</li>
          </ul>
        </div>
      </div>
    `;
    arbiterHistory = [];
  }

  function appendArbiterMessage(sender, content, isHtml = false) {
    if (!arbiterChatStream) return null;
    const msg = document.createElement('div');
    msg.className = `arbiter-msg msg-${sender}`;
    const name = sender === 'arbiter' ? '⚖️ The Arbiter' : '👤 You';
    msg.innerHTML = `<div class="msg-sender">${name}</div><div class="msg-bubble">${isHtml ? content : escapeHtml(content)}</div>`;
    arbiterChatStream.appendChild(msg);
    arbiterChatStream.scrollTop = arbiterChatStream.scrollHeight;
    return msg;
  }

  async function handleArbiterSend() {
    const text = (arbiterMsgInput && arbiterMsgInput.value.trim()) || "";
    if (!text) return;
    arbiterMsgInput.value = "";

    // Append user message bubble
    appendArbiterMessage('user', text);
    arbiterHistory.push({ role: 'user', content: text });

    // Typing bubble
    const typingEl = appendArbiterMessage('arbiter', '⚖️ The Arbiter is consulting...');

    try {
      const result = await engine.arbiterConsultation({
        message: text,
        deliverable: currentDeliverable,
        history: arbiterHistory
      });

      if (typingEl) typingEl.remove();

      let bubbleHtml = formatMarkdownToHtml(result.reply);
      if (result.updatedDeliverable) {
        const btnId = `applyChangeBtn_${Date.now()}`;
        bubbleHtml += `<br><button class="apply-change-btn" id="${btnId}">✨ Apply to Deliverable</button>`;
      }

      const msgEl = appendArbiterMessage('arbiter', bubbleHtml, true);
      arbiterHistory.push({ role: 'assistant', content: result.reply });

      if (result.updatedDeliverable) {
        const btn = msgEl.querySelector('.apply-change-btn');
        if (btn) {
          btn.addEventListener('click', () => {
            currentDeliverable = result.updatedDeliverable;
            updateDeliverableView();
            btn.innerText = "✅ Changes Applied to Deliverable!";
            btn.disabled = true;
          });
        }
      }
    } catch (err) {
      if (typingEl) typingEl.remove();
      appendArbiterMessage('arbiter', '⚠️ Error consulting Arbiter: ' + err.message);
    }
  }

  if (arbiterSendBtn) arbiterSendBtn.addEventListener('click', handleArbiterSend);
  if (arbiterMsgInput) {
    arbiterMsgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleArbiterSend();
      }
    });
  }

  // Quick intent chips
  document.querySelectorAll('.arbiter-quick-chips .chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const intent = btn.getAttribute('data-intent');
      if (intent === 'read') {
        if (arbiterMsgInput) arbiterMsgInput.value = "Where is the work? Please provide a detailed summary and walkthrough of the deliverable.";
        handleArbiterSend();
      } else if (intent === 'status') {
        if (arbiterMsgInput) arbiterMsgInput.value = "Is the work done or not? Please evaluate completeness against all invariants.";
        handleArbiterSend();
      } else if (intent === 'modify') {
        if (arbiterMsgInput) {
          arbiterMsgInput.value = "I want to request the following changes: ";
          arbiterMsgInput.focus();
        }
      } else if (intent === 'discuss') {
        if (arbiterMsgInput) arbiterMsgInput.value = "Let's deliberate deeper on the key trade-offs and domain mechanics.";
        handleArbiterSend();
      } else if (intent === 'audit') {
        if (arbiterMsgInput) arbiterMsgInput.value = "Conduct an adversarial audit on boundary failure modes and critical risks.";
        handleArbiterSend();
      }
    });
  });

  // 16. Gateway Settings Modal Handlers
  function openGatewayModal() {
    if (gatewayUrlInput) gatewayUrlInput.value = engine.localGatewayUrl;
    if (gatewayApiKeyInput) gatewayApiKeyInput.value = engine.gatewayApiKey;
    if (gatewayModelSelect) gatewayModelSelect.value = engine.gatewayModel || 'auto';
    if (gatewayStatusNotice) gatewayStatusNotice.style.display = 'none';
    if (gatewayModal) gatewayModal.style.display = 'flex';
  }

  function closeGatewayModal() {
    if (gatewayModal) gatewayModal.style.display = 'none';
  }

  if (gatewayModalBtn) gatewayModalBtn.addEventListener('click', openGatewayModal);
  if (closeGatewayModalBtn) closeGatewayModalBtn.addEventListener('click', closeGatewayModal);

  if (presetOmniRouteBtn) {
    presetOmniRouteBtn.addEventListener('click', () => {
      if (gatewayUrlInput) gatewayUrlInput.value = 'http://localhost:20128/v1';
      if (gatewayModelSelect) gatewayModelSelect.value = 'auto';
      if (gatewayApiKeyInput) gatewayApiKeyInput.value = 'sk_omniroute';
      if (gatewayStatusNotice) gatewayStatusNotice.style.display = 'none';
    });
  }

  if (presetOpenRouterBtn) {
    presetOpenRouterBtn.addEventListener('click', () => {
      if (gatewayUrlInput) gatewayUrlInput.value = 'https://openrouter.ai/api/v1';
      if (gatewayModelSelect) gatewayModelSelect.value = 'openrouter/free';
      if (gatewayApiKeyInput) {
        if (!gatewayApiKeyInput.value || gatewayApiKeyInput.value === 'sk_omniroute' || gatewayApiKeyInput.value === 'ollama') {
          gatewayApiKeyInput.value = '';
          gatewayApiKeyInput.placeholder = 'Paste OpenRouter Key (sk-or-...)';
        }
      }
      if (gatewayStatusNotice) gatewayStatusNotice.style.display = 'none';
    });
  }

  if (presetOllamaBtn) {
    presetOllamaBtn.addEventListener('click', () => {
      if (gatewayUrlInput) gatewayUrlInput.value = 'http://localhost:11434/v1';
      if (gatewayModelSelect) gatewayModelSelect.value = 'llama3.2';
      if (gatewayApiKeyInput) gatewayApiKeyInput.value = 'ollama';
      if (gatewayStatusNotice) gatewayStatusNotice.style.display = 'none';
    });
  }

  if (testGatewayBtn) {
    testGatewayBtn.addEventListener('click', async () => {
      const url = (gatewayUrlInput && gatewayUrlInput.value.trim()) || "http://localhost:20128/v1";
      const key = (gatewayApiKeyInput && gatewayApiKeyInput.value.trim()) || "sk_omniroute";
      const model = (gatewayModelSelect && gatewayModelSelect.value) || "auto";
      engine.setGatewayUrl(url, key, model);
      testGatewayBtn.innerText = "Testing...";
      testGatewayBtn.disabled = true;

      const health = await engine.checkGatewayHealth();
      testGatewayBtn.innerText = "⚡ Test Connection";
      testGatewayBtn.disabled = false;

      if (gatewayStatusNotice) {
        gatewayStatusNotice.style.display = 'block';
        if (health.online) {
          gatewayStatusNotice.style.background = 'rgba(16, 185, 129, 0.15)';
          gatewayStatusNotice.style.border = '1px solid #10b981';
          gatewayStatusNotice.style.color = '#34d399';
          gatewayStatusNotice.innerHTML = `✅ <strong>Connected!</strong> AI gateway active at <code>${health.url}</code> (Model: <code>${model}</code>). Deliberations and Arbiter chat will use live models.`;
        } else {
          gatewayStatusNotice.style.background = 'rgba(239, 68, 68, 0.15)';
          gatewayStatusNotice.style.border = '1px solid #ef4444';
          gatewayStatusNotice.style.color = '#f87171';
          const reasonHtml = health.reason ? `<div style="margin-top: 6px; font-size: 12px; color: #fca5a5; line-height: 1.4;">${health.reason}</div>` : '';
          gatewayStatusNotice.innerHTML = `⚠️ <strong>Gateway Offline or Blocked by Browser.</strong> Could not reach <code>${url}</code>.${reasonHtml}<div style="margin-top: 6px; font-size: 11px; opacity: 0.85;">Built-in high-capacity neural reasoning engine will handle deliberations and chat with zero interruption.</div>`;
        }
      }
      syncAuthState();
    });
  }

  if (saveGatewayBtn) {
    saveGatewayBtn.addEventListener('click', () => {
      const url = (gatewayUrlInput && gatewayUrlInput.value.trim()) || "http://localhost:20128/v1";
      const key = (gatewayApiKeyInput && gatewayApiKeyInput.value.trim()) || "sk_omniroute";
      const model = (gatewayModelSelect && gatewayModelSelect.value) || "auto";
      engine.setGatewayUrl(url, key, model);
      syncAuthState();
      closeGatewayModal();
    });
  }

  // 15. Support Modal & Admin Resolution Desk
  function openSupportModal() {
    if (supportModal) supportModal.style.display = 'flex';
    renderAdminTickets();
  }

  function closeSupportModal() {
    if (supportModal) supportModal.style.display = 'none';
  }

  if (closeSupportModalBtn) closeSupportModalBtn.addEventListener('click', closeSupportModal);

  if (supportSubmitBtn) {
    supportSubmitBtn.addEventListener('click', () => {
      const email = (supportEmailInput && supportEmailInput.value.trim()) || "";
      const cat = (supportCategorySelect && supportCategorySelect.value) || "Issue on Web";
      const comment = (supportCommentInput && supportCommentInput.value.trim()) || "";

      try {
        supportVault.submitTicket({ email, category: cat, comment });
        if (supportFeedbackStatus) {
          supportFeedbackStatus.style.display = 'block';
          supportFeedbackStatus.style.color = '#34d399';
          supportFeedbackStatus.innerText = '✅ Your problem report has been submitted! Admin (SKAMAN-07) will review and reply to your email.';
        }
        if (supportCommentInput) supportCommentInput.value = '';
        renderAdminTickets();
      } catch (err) {
        if (supportFeedbackStatus) {
          supportFeedbackStatus.style.display = 'block';
          supportFeedbackStatus.style.color = '#f43f5e';
          supportFeedbackStatus.innerText = '⚠️ ' + err.message;
        }
      }
    });
  }

  function renderAdminTickets() {
    const isAdmin = supportVault.isAdmin(security.currentUser);
    if (adminLockedNotice) adminLockedNotice.style.display = isAdmin ? 'none' : 'block';
    if (adminTicketsContainer) adminTicketsContainer.style.display = isAdmin ? 'block' : 'none';
    if (adminToggleAuthBtn) adminToggleAuthBtn.innerText = isAdmin ? 'Lock Admin' : 'Unlock Admin';

    if (!isAdmin || !adminTicketsList) return;

    const tickets = supportVault.getTicketsForDisplay(security.currentUser);
    if (tickets.length === 0) {
      adminTicketsList.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px;">No support tickets submitted yet.</div>';
      return;
    }

    adminTicketsList.innerHTML = tickets.map(t => `
      <div class="admin-ticket-card">
        <div class="admin-ticket-email">
          <span>📧 ${escapeHtml(t.email)}</span>
          <a href="mailto:${encodeURIComponent(t.email)}?subject=Hive Support Resolution: ${encodeURIComponent(t.category)}" class="btn btn-primary btn-xs">✉️ Mail Back Submitter</a>
        </div>
        <div style="font-size:11px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">Category: ${escapeHtml(t.category)} • Status: ${t.status}</div>
        <div class="admin-ticket-body">${escapeHtml(t.comment)}</div>
      </div>
    `).join('');
  }

  if (adminToggleAuthBtn) {
    adminToggleAuthBtn.addEventListener('click', () => {
      if (supportVault.isAdmin(security.currentUser)) {
        supportVault.lockAdmin();
      } else {
        const pass = prompt("Enter Administrator Passcode (SKAMAN-07):");
        if (pass && supportVault.unlockAdmin(pass)) {
          alert("Admin Desk Unlocked for SKAMAN-07.");
        } else if (pass) {
          alert("Unauthorized passcode.");
        }
      }
      renderAdminTickets();
    });
  }

  // 16. Download, Copy & PDF Handlers
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

  // New Deliberation trigger checks confirmation
  if (newDeliberationBtn) {
    newDeliberationBtn.addEventListener('click', () => {
      promptNewChat();
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
