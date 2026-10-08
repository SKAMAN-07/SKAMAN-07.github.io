const fs = require('fs');
const assert = require('assert');

// Mock browser environment for node
global.window = {};
global.sessionStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

// Load multimodel_engine.js
const code = fs.readFileSync('./js/multimodel_engine.js', 'utf8');
eval(code);

const { MultiModelEngine, ProjectMemory } = window;

async function runTests() {
  console.log('=== RUNNING MULTIMODEL ENGINE UNIT TESTS ===');
  const engine = new MultiModelEngine();

  // Test 1: Configuration & Defaults
  console.log('Test 1: Default configuration');
  assert.strictEqual(engine.localGatewayUrl, 'http://localhost:20128/v1');
  assert.strictEqual(engine.gatewayApiKey, 'sk_omniroute');
  assert.strictEqual(engine.gatewayModel, 'auto');
  engine.setGatewayUrl('https://my-gateway.com/v1', 'custom_key', 'claude-3-7-sonnet');
  assert.strictEqual(engine.localGatewayUrl, 'https://my-gateway.com/v1');
  assert.strictEqual(engine.gatewayApiKey, 'custom_key');
  assert.strictEqual(engine.gatewayModel, 'claude-3-7-sonnet');
  console.log('✓ Configuration passed');

  // Test 2: Deliberation on Banking prompt (Screenshot 230110)
  console.log('Test 2: Deliberation on "Describe details about investment in banks"');
  let messages = [];
  let evaluated = null;
  const bankResult = await engine._deliberateFrontierCouncil({
    query: "Describe details  about investment in banks",
    files: [],
    memoryContext: null,
    currentTurn: 1,
    onMessage: (m) => messages.push(m),
    onArbiterEvaluation: (e) => { evaluated = e; }
  });

  const deliverable = bankResult.evaluation.final_output;
  assert.ok(deliverable.length > 5000, `Deliverable length was ${deliverable.length}`);
  assert.strictEqual(evaluated.verdict, 'APPROVED');

  // Must contain real domain content
  assert.ok(deliverable.includes('Net Interest Margin (NIM)'), 'Missing NIM analysis');
  assert.ok(deliverable.includes('Basel III'), 'Missing Basel III analysis');
  assert.ok(deliverable.includes('CET1'), 'Missing CET1 ratio');
  assert.ok(deliverable.includes('Silicon Valley Bank'), 'Missing SVB risk audit');
  assert.ok(deliverable.includes('Return on Equity (ROE)'), 'Missing ROE metrics');
  assert.ok(deliverable.includes('Price-to-Tangible-Book (P/TBV)'), 'Missing P/TBV');

  // MUST NOT contain the generic placeholder babble from Screenshot 230110
  const genericPlaceholder1 = "First-Principles Framing: Deconstructing the domain into its core constitutive elements";
  const genericPlaceholder2 = "Specific operational benchmarks and thresholds required to validate high performance";
  assert.strictEqual(deliverable.includes(genericPlaceholder1), false, 'Contains generic placeholder meta-babble 1');
  assert.strictEqual(deliverable.includes(genericPlaceholder2), false, 'Contains generic placeholder meta-babble 2');
  console.log('✓ Banking deliberation passed with publication-grade domain content');

  // Test 2B: Deliberation on User Prompt (AI Human Clone for Digital World - Screenshot 2026-10-09)
  console.log('Test 2B: Deliberation on AI clone prompt from Screenshots & Deliverable');
  const cloneQuery = "make a structural plan on how to make a model ai clone of an human which can easily do things as the human but inside the digital world .";
  let cloneCouncilMessages = [];
  let cloneEvaluated = null;
  const cloneResult = await engine._deliberateFrontierCouncil({
    query: cloneQuery,
    files: [],
    memoryContext: null,
    currentTurn: 2,
    onMessage: (m) => cloneCouncilMessages.push(m),
    onArbiterEvaluation: (e) => { cloneEvaluated = e; }
  });

  const cloneDeliverable = cloneResult.evaluation.final_output;
  assert.ok(cloneDeliverable.length > 5000, `Deliverable length was ${cloneDeliverable.length}`);
  assert.strictEqual(cloneEvaluated.verdict, 'APPROVED');

  // MUST NOT contain irrelevant FlashAttention/Transformer pretraining formulas
  assert.strictEqual(cloneDeliverable.includes('FlashAttention-2'), false, 'Contains FlashAttention-2');
  assert.strictEqual(cloneDeliverable.includes('\\text{softmax}'), false, 'Contains Attention formula');
  assert.strictEqual(cloneDeliverable.includes('Mixture of Experts (MoE) Routing'), false, 'Contains MoE routing');

  // MUST NOT contain generic meta-process templates
  assert.strictEqual(cloneDeliverable.includes('Core Operational Workflow & Sequence'), false, 'Contains generic operational workflow');
  assert.strictEqual(cloneDeliverable.includes('Primary Initiation & Scoping'), false, 'Contains generic scoping');
  assert.strictEqual(cloneDeliverable.includes('Phase 1: Foundation & Alignment: map out dependencies'), false, 'Contains generic checklist');

  // MUST contain concrete AI clone architecture
  assert.ok(cloneDeliverable.includes('Multi-Modal Digital Perception') || cloneDeliverable.includes('VLM Screen Grounding') || cloneDeliverable.includes('sub-pixel coordinate'), 'Missing perception layer');
  assert.ok(cloneDeliverable.includes('Cognitive Persona & Hierarchical Memory') || cloneDeliverable.includes('Episodic Memory') || cloneDeliverable.includes('Procedural Memory'), 'Missing memory architecture');
  assert.ok(cloneDeliverable.includes('Computer-Use') || cloneDeliverable.includes('Playwright') || cloneDeliverable.includes('Chrome DevTools Protocol') || cloneDeliverable.includes('Virtual Mouse'), 'Missing computer-use action grounding');
  assert.ok(cloneDeliverable.includes('Zero-Knowledge Credential Vault') || cloneDeliverable.includes('Human-in-the-Loop Interlocks'), 'Missing security architecture');
  assert.ok(cloneDeliverable.includes('UI-TARS') || cloneDeliverable.includes('LangGraph') || cloneDeliverable.includes('Qdrant'), 'Missing production tech stack');

  // Verify Council Messages: Must give concrete domain answers, NOT meta-descriptions
  const archMsg = cloneCouncilMessages.find(m => m.role_type === 'architect');
  assert.ok(archMsg && (archMsg.content.includes('5-Layer Digital Human Architecture') || archMsg.content.includes('Perception Layer')), 'Architect did not give digital human architecture');
  const skepMsg = cloneCouncilMessages.find(m => m.role_type === 'skeptic');
  assert.ok(skepMsg && (skepMsg.content.includes('Sub-Pixel Drift') || skepMsg.content.includes('Action Hallucination')), 'Skeptic did not critique digital clone failure modes');
  const verMsg = cloneCouncilMessages.find(m => m.role_type === 'verifier');
  assert.ok(verMsg && (verMsg.content.includes('Grounding Accuracy') || verMsg.content.includes('IoU')), 'Verifier did not provide grounding accuracy invariants');

  console.log('✓ AI Clone deliberation passed with concrete digital human architecture and substantive council answers');

  // Test 3: Deliberation on arbitrary non-banking prompt
  console.log('Test 3: Universal dynamic deliberation on non-templated prompt');
  const genericResult = await engine._deliberateFrontierCouncil({
    query: "Create a scalable supply chain system for organic bakery",
    files: [],
    memoryContext: null,
    currentTurn: 3,
    onMessage: null,
    onArbiterEvaluation: null
  });
  const genericDeliverable = genericResult.evaluation.final_output;
  assert.ok(genericDeliverable.length > 2500, `Length was ${genericDeliverable.length}`);
  assert.strictEqual(genericDeliverable.includes(genericPlaceholder1), false, 'Generic contains placeholder 1');
  assert.strictEqual(genericDeliverable.includes(genericPlaceholder2), false, 'Generic contains placeholder 2');
  assert.strictEqual(genericDeliverable.includes('Core Operational Workflow & Sequence'), false, 'Generic contains generic workflow');
  assert.strictEqual(genericDeliverable.includes('Primary Initiation & Scoping'), false, 'Generic contains generic scoping');
  console.log('✓ Universal dynamic deliberation passed with concrete content');

  // Test 4: Arbiter Consultation for "where is the work" (Screenshot 230033)
  console.log('Test 4: Arbiter consultation for "where is the work" on banking');
  const chatWork = engine._conversationalArbiterDialogue({
    message: "where is the work",
    deliverable: deliverable,
    history: []
  });

  const roboticSnippet1 = "Invariant constraints remain stable. Theoretical blueprints and practical trade-offs have been harmonized.";
  const roboticSnippet2 = "The Council verified this problem across parallel nodes (Architect, Skeptic, Verifier, Synthesizer).";
  assert.strictEqual(chatWork.reply.includes(roboticSnippet1), false, 'Contains robotic snippet 1');
  assert.strictEqual(chatWork.reply.includes(roboticSnippet2), false, 'Contains robotic snippet 2');
  assert.ok(chatWork.reply.includes('Verified Deliverable Output'), 'Did not point to UI location above chat');
  assert.ok(chatWork.reply.includes('Net Interest Margin') || chatWork.reply.includes('CET1') || chatWork.reply.includes('Silicon Valley Bank'), 'Missing executive walkthrough of work');
  console.log('✓ "Where is the work" returned natural walkthrough without robotic script');

  // Test 4B: Arbiter Consultation for "where is the work" on AI Clone
  console.log('Test 4B: Arbiter consultation for "where is the work" on AI Clone');
  const chatWorkClone = engine._conversationalArbiterDialogue({
    message: "where is the work",
    deliverable: cloneDeliverable,
    history: []
  });
  assert.ok(chatWorkClone.reply.includes('5-Layer Digital Human Architecture') || chatWorkClone.reply.includes('Sensory Grounding'), 'Missing AI clone walkthrough');
  assert.ok(chatWorkClone.reply.includes('Computer-Use'), 'Missing Computer-Use in walkthrough');
  console.log('✓ AI Clone "where is the work" returned detailed digital twin architecture');

  // Test 5: Arbiter Consultation for "i want to read the work" (Screenshot 230042)
  console.log('Test 5: Arbiter consultation for "i want to read the work"');
  const chatRead = engine._conversationalArbiterDialogue({
    message: "i want to read the work",
    deliverable: deliverable,
    history: []
  });
  assert.strictEqual(chatRead.reply.includes(roboticSnippet1), false, 'Contains robotic snippet 1');
  assert.strictEqual(chatRead.reply.includes(roboticSnippet2), false, 'Contains robotic snippet 2');
  assert.ok(chatRead.reply.includes('Silicon Valley Bank') || chatRead.reply.includes('Basel III') || chatRead.reply.includes('Net Interest Margin'), 'Missing domain summary');
  console.log('✓ "I want to read the work" returned rich summary');

  // Test 6: Skepticism / Bot Complaint handling
  console.log('Test 6: Bot complaint handling');
  const chatBot = engine._conversationalArbiterDialogue({
    message: "you look like a bot and are just phrasing taught things, talk properly",
    deliverable: deliverable,
    history: []
  });
  assert.strictEqual(chatBot.reply.includes(roboticSnippet1), false);
  assert.ok(chatBot.reply.includes('colleague') || chatBot.reply.includes('partner'), 'Did not adopt human partner tone');
  console.log('✓ Bot complaint handled conversationally');

  // Test 7: Specific questions (NIM, SVB, Valuation)
  console.log('Test 7: Specific domain questions');
  const chatSvb = engine._conversationalArbiterDialogue({
    message: "why did svb collapse?",
    deliverable: deliverable,
    history: []
  });
  assert.ok(chatSvb.reply.includes('Duration Mismatch') || chatSvb.reply.includes('Held to Maturity'), 'Missing SVB mechanics');

  const chatNim = engine._conversationalArbiterDialogue({
    message: "how do banks make money and what is NIM?",
    deliverable: deliverable,
    history: []
  });
  assert.ok(chatNim.reply.includes('Net Interest Margin') || chatNim.reply.includes('spread'), 'Missing NIM mechanics');

  const chatVal = engine._conversationalArbiterDialogue({
    message: "what is roe and price to tangible book?",
    deliverable: deliverable,
    history: []
  });
  assert.ok(chatVal.reply.includes('Return on Equity') || chatVal.reply.includes('P/TBV'), 'Missing valuation mechanics');

  // Test 7B: Specific questions on AI Clone (Mouse/Keyboard & Safety)
  console.log('Test 7B: Specific domain questions on AI Clone');
  const chatMouse = engine._conversationalArbiterDialogue({
    message: "how does mouse and keyboard simulation and computer use work?",
    deliverable: cloneDeliverable,
    history: []
  });
  assert.ok(chatMouse.reply.includes('Sub-Pixel Coordinate Grounding') || chatMouse.reply.includes('Playwright'), 'Missing mouse/keyboard mechanics');
  assert.ok(chatMouse.reply.includes('Credential Vault') || chatMouse.reply.includes('Interlocks'), 'Missing safety interlocks');
  console.log('✓ Specific AI Clone queries answered with deep technical accuracy');

  // Test 8: Directive to modify deliverable
  console.log('Test 8: Directive to modify deliverable');
  const chatMod = engine._conversationalArbiterDialogue({
    message: "add a section about bank deposit insurance limits",
    deliverable: deliverable,
    history: []
  });
  assert.strictEqual(chatMod.action, 'modify');
  assert.ok(chatMod.updatedDeliverable.includes('*Directive:* "add a section about bank deposit insurance limits"'));
  console.log('✓ Deliverable modification compiled correctly');

  // Test 9: Cloud Burst
  console.log('Test 9: Project Memory and Cloud Burst');
  const mem = engine.getMemory();
  assert.strictEqual(mem.getTurnCount(), 3);
  engine.clearProjectMemory();
  assert.strictEqual(mem.getTurnCount(), 0);
  console.log('✓ Cloud burst verified');

  // Test 10: Security Controls & Hardening Verification
  console.log('Test 10: Security Controls & Hardening Verification');
  const authCode = fs.readFileSync('./js/auth_security.js', 'utf8');
  eval(authCode);
  const { HiveSecurityShield, HiveSupportVault } = window;

  const shield = new HiveSecurityShield();
  assert.strictEqual(shield.validateGoogleAccount('user@burnermail.io').valid, false);
  assert.strictEqual(shield.validateGoogleAccount('user@yahoo.com').valid, false);
  assert.strictEqual(shield.validateGoogleAccount('valid.user@gmail.com').valid, true);
  assert.strictEqual(shield.validateGoogleAccount('bad<script>@gmail.com').valid, false);

  // Gateway URL protocol enforcement
  assert.throws(() => {
    engine.setGatewayUrl('javascript:alert(1)');
  }, /Gateway URL must begin with http:\/\/ or https:\/\//);

  // Admin privilege isolation (No substring escalation)
  const vault = new HiveSupportVault();
  assert.strictEqual(vault.isAdmin({ name: 'skaman attacker', email: 'attacker@gmail.com' }), false);
  assert.strictEqual(vault.unlockAdmin('wrong-passcode'), false);
  assert.strictEqual(vault.isAdmin(null), false);
  assert.strictEqual(vault.unlockAdmin('SKAMAN-07'), true);
  assert.strictEqual(vault.isAdmin(null), true);
  vault.lockAdmin();
  assert.strictEqual(vault.isAdmin(null), false);
  console.log('✓ Security hardening and isolation verified');

  console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
