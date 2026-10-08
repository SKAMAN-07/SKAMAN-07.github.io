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

  // Test 3: Deliberation on arbitrary non-banking prompt
  console.log('Test 3: Universal dynamic deliberation on non-templated prompt');
  const genericResult = await engine._deliberateFrontierCouncil({
    query: "Create a scalable supply chain system for organic bakery",
    files: [],
    memoryContext: null,
    currentTurn: 2,
    onMessage: null,
    onArbiterEvaluation: null
  });
  const genericDeliverable = genericResult.evaluation.final_output;
  assert.ok(genericDeliverable.length > 2500, `Length was ${genericDeliverable.length}`);
  assert.strictEqual(genericDeliverable.includes(genericPlaceholder1), false, 'Generic contains placeholder 1');
  assert.strictEqual(genericDeliverable.includes(genericPlaceholder2), false, 'Generic contains placeholder 2');
  console.log('✓ Universal dynamic deliberation passed with concrete content');

  // Test 4: Arbiter Consultation for "where is the work" (Screenshot 230033)
  console.log('Test 4: Arbiter consultation for "where is the work"');
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
  console.log('✓ Specific domain queries answered with deep technical accuracy');

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
  assert.strictEqual(mem.getTurnCount(), 2);
  engine.clearProjectMemory();
  assert.strictEqual(mem.getTurnCount(), 0);
  console.log('✓ Cloud burst verified');

  console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
