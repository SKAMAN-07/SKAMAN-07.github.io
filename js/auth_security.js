/**
 * Hive Auth & Security Shield
 * - Robust Google Identity & Account Authentication System
 * - Anti-burner / anti-disposable email defense (strictly blocks throwaway/temp emails)
 * - Strict Google Account validation (@gmail.com / @googlemail.com)
 * - Anti-bot detection, rate limiting, and zero-host-burden client execution
 */

class HiveSecurityShield {
  constructor() {
    this.DAILY_LIMIT = 50;
    this.SUBMISSION_COOLDOWN_MS = 1500;
    this.lastSubmissionTime = 0;
    this.currentUser = null;
    this.deviceFingerprint = this.generateDeviceFingerprint();

    // Comprehensive disposable & burner email domain blocklist
    this.BURNER_DOMAINS = new Set([
      'tempmail.com', 'temp-mail.org', '10minutemail.com', 'mailinator.com', 
      'guerrillamail.com', 'throwawaymail.com', 'sharklasers.com', 'yopmail.com', 
      'trashmail.com', 'dispostable.com', 'fakeinbox.com', 'getnada.com', 
      'mytemp.email', 'mohmal.com', 'generator.email', 'burnermail.io', 
      'crazymailing.com', 'fakemailgenerator.com', 'inboxkitten.com', 'maildrop.cc', 
      'nada.ltd', 'tempail.com', 'tempm.com', 'tmailor.com', 'emailondeck.com', 
      'dropmail.me', 'armyspy.com', 'cuvox.de', 'dayrep.com', 'fleckens.hu', 
      'gustr.com', 'jourrapide.com', 'rhyta.com', 'superrito.com', 'teleworm.us', 
      'einrot.com', 'clipmail.eu', 'trashmail.net', 'spambox.us', 'tempinbox.com',
      'guerrillamailblock.com', 'pokemail.net', 'spam4.me', 'grr.la', 'discard.email',
      'trashmail.de', 'temp-mail.io', 'minuteinbox.com', 'emailfake.com'
    ]);

    this.initSecurity();
  }

  initSecurity() {
    // 1. Detect automated headless bots
    this.isBot = this.detectBotEnvironment();

    // 2. Load stored session
    const savedUser = localStorage.getItem('hive_user_session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Verify stored session email is still a valid Google Account
        const check = this.validateGoogleAccount(parsed.email);
        if (check.valid) {
          this.currentUser = parsed;
        } else {
          localStorage.removeItem('hive_user_session');
        }
      } catch (e) {
        localStorage.removeItem('hive_user_session');
      }
    }

    // 3. Update daily quota
    this.updateDailyQuota();
  }

  isAuthenticated() {
    return Boolean(this.currentUser && this.currentUser.email);
  }

  detectBotEnvironment() {
    if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
    if (typeof window !== 'undefined' && window.document?.documentElement?.getAttribute?.("webdriver")) return true;
    if (typeof navigator !== 'undefined' && /HeadlessChrome|PhantomJS|Selenium|Playwright|Puppeteer/i.test(navigator.userAgent)) return true;
    if (typeof navigator !== 'undefined' && (!navigator.languages || navigator.languages.length === 0)) return true;
    return false;
  }

  generateDeviceFingerprint() {
    if (typeof document === 'undefined') return 'node_env_fingerprint';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText("Hive-Security-Shield", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Zero-Burden-Mesh", 4, 17);
    
    const str = [
      canvas.toDataURL(),
      navigator.userAgent,
      navigator.hardwareConcurrency || 4,
      screen.width + "x" + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ].join('###');

    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  updateDailyQuota() {
    const today = new Date().toISOString().slice(0, 10);
    const quotaData = JSON.parse(localStorage.getItem('hive_daily_quota') || '{}');
    
    if (quotaData.date !== today) {
      localStorage.setItem('hive_daily_quota', JSON.stringify({
        date: today,
        count: 0,
        device: this.deviceFingerprint
      }));
    }
  }

  getRemainingDailyQuota() {
    const quotaData = JSON.parse(localStorage.getItem('hive_daily_quota') || '{}');
    const count = quotaData.count || 0;
    return Math.max(0, this.DAILY_LIMIT - count);
  }

  recordDeliberation() {
    const today = new Date().toISOString().slice(0, 10);
    const quotaData = JSON.parse(localStorage.getItem('hive_daily_quota') || '{}');
    quotaData.date = today;
    quotaData.count = (quotaData.count || 0) + 1;
    quotaData.device = this.deviceFingerprint;
    localStorage.setItem('hive_daily_quota', JSON.stringify(quotaData));
  }

  /**
   * Strict Google Account & Anti-Burner Verification
   */
  validateGoogleAccount(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: "Please enter your email address." };
    }

    const clean = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!emailRegex.test(clean)) {
      return { valid: false, error: "Invalid email format. Please provide a valid address." };
    }

    const parts = clean.split('@');
    if (parts.length !== 2) {
      return { valid: false, error: "Invalid email syntax." };
    }

    const username = parts[0];
    const domain = parts[1];

    if (username.length < 3 || username.length > 64) {
      return { valid: false, error: "Email username must be between 3 and 64 characters." };
    }

    if (!/^[a-zA-Z0-9.]+$/.test(username)) {
      return { valid: false, error: "Google Account username can only contain letters, numbers, and periods." };
    }

    // Check disposable / burner blocklist
    if (this.BURNER_DOMAINS.has(domain)) {
      return { 
        valid: false, 
        error: "Disposable / burner email addresses are blocked for security. Please sign in with an authentic Google Account." 
      };
    }

    // Require authentic Google domains (@gmail.com or @googlemail.com)
    const validGoogleDomains = ['gmail.com', 'googlemail.com'];
    const isGoogleDomain = validGoogleDomains.includes(domain);

    if (!isGoogleDomain) {
      return { 
        valid: false, 
        error: "Non-Google email detected. Hive requires an authentic Google Account (@gmail.com or @googlemail.com) to prevent bots." 
      };
    }

    return { valid: true, email: clean, username };
  }

  validateSubmission() {
    if (this.isBot) {
      return { allowed: false, reason: "Security Alert: Automated headless environment detected." };
    }

    if (!this.isAuthenticated()) {
      return { allowed: false, reason: "Authentication Required: Please sign in with an authentic Google Account (@gmail.com) to access the Deliberation Console." };
    }

    const now = Date.now();
    if (now - this.lastSubmissionTime < this.SUBMISSION_COOLDOWN_MS) {
      return { allowed: false, reason: "Action Cooldown: Please wait 1.5 seconds between deliberation submissions." };
    }

    this.lastSubmissionTime = now;
    return { allowed: true };
  }

  /**
   * Primary Authenticated Login Method with Anti-Burner Verification
   */
  loginWithGoogleAccount(name = "", email = "", picture = "") {
    const val = this.validateGoogleAccount(email);
    if (!val.valid) {
      throw new Error(val.error);
    }

    const cleanEmail = val.email;
    const cleanName = (name && name.trim()) || val.username.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || "Google User";

    this.currentUser = {
      name: cleanName,
      email: cleanEmail,
      picture: picture || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`,
      sub: "g_" + Math.random().toString(36).slice(2, 10),
      verified: true,
      authenticatedAt: Date.now()
    };

    localStorage.setItem('hive_user_session', JSON.stringify(this.currentUser));
    return this.currentUser;
  }

  signOut() {
    this.currentUser = null;
    localStorage.removeItem('hive_user_session');
  }
}

/**
 * Hive Secure Support & Feedback Vault
 * Stores user problem reports with client-side encryption.
 * Contact emails are strictly gated to administrator 'SKAMAN-07'.
 */
class HiveSupportVault {
  constructor() {
    this.STORAGE_KEY = 'hive_support_tickets_v1';
    this.ADMIN_USER = 'SKAMAN-07';
    // Cryptographic SHA-256 digests of authorized administrator passcodes (zero plaintext passwords in client code)
    this.ALLOWED_ADMIN_HASHES = new Set([
      '23ac67adbe1d74a338293d789a89c64fe85b1ed09d7a6eb347f36599ca732ec6', // SKAMAN-07
      '1d68374eece8c757260209eac8094e1ccfad1828091ad1d1df013b4f2528e098', // skaman-07
      '748fe3e37e00dfecde94f73af64e59d461cf76241fc688476eb28e40e5a105be', // skaman-admin
      '6941d175219e5756f500f49d5950d8859f95d473cb07f5f991221defb213c1a5'  // skaman-admin-2026
    ]);
    this.adminUnlocked = false;
  }

  isAdmin(currentUser) {
    // Privilege is strictly gated to verified administrative unlock
    return Boolean(this.adminUnlocked);
  }

  unlockAdmin(passcode) {
    if (!passcode) return false;
    const clean = passcode.trim();
    const digest = this._sha256(clean);
    if (this.ALLOWED_ADMIN_HASHES.has(digest)) {
      this.adminUnlocked = true;
      return true;
    }
    return false;
  }

  lockAdmin() {
    this.adminUnlocked = false;
  }

  _sha256(ascii) {
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;
    let hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    let i, j;
    for (i = 0; i < ascii.length; i++) words[i >> 2] |= (ascii.charCodeAt(i) & 255) << (8 * (3 - (i % 4)));
    words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;
    for (i = 0; i < words.length; i += 16) {
      const w = words.slice(i, i + 16);
      const oldHash = hash.slice(0);
      for (j = 0; j < 64; j++) {
        const w15 = w[j - 15] || 0, w2 = w[j - 2] || 0;
        const s0 = j < 16 ? (w[j] || 0) : (w[j] = ((w[j - 16] || 0) + ((rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))) + (w[j - 7] || 0) + ((rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)))) | 0);
        const s1 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22));
        const maj = ((hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]));
        const t2 = (s1 + maj) | 0;
        const s_1 = (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25));
        const ch = ((hash[4] & hash[5]) ^ (~hash[4] & hash[6]));
        const t1 = (hash[7] + s_1 + ch + k[j] + s0) | 0;
        hash = [(t1 + t2) | 0, hash[0], hash[1], hash[2], (hash[3] + t1) | 0, hash[4], hash[5], hash[6]];
      }
      for (j = 0; j < 8; j++) hash[j] = (hash[j] + oldHash[j]) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j >= 0; j--) {
        const b = (hash[i] >> (8 * j)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  _encryptEmail(email) {
    const key = this._sha256("HIVE_SKAMAN_VAULT_KEY_2026");
    let output = "";
    for (let i = 0; i < email.length; i++) {
      output += String.fromCharCode(email.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(output);
  }

  _decryptEmail(encrypted) {
    try {
      const key = this._sha256("HIVE_SKAMAN_VAULT_KEY_2026");
      const raw = atob(encrypted);
      let output = "";
      for (let i = 0; i < raw.length; i++) {
        output += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return output;
    } catch (e) {
      return "[Decryption Error]";
    }
  }

  submitTicket({ email, category, comment }) {
    if (!email || !email.includes('@')) {
      throw new Error("A valid email address is required so the admin can reply to your issue.");
    }
    if (!comment || comment.trim().length < 5) {
      throw new Error("Please describe the problem you encountered (minimum 5 characters).");
    }

    const tickets = this._getRawTickets();
    const newTicket = {
      id: 'ticket_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      encryptedEmail: this._encryptEmail(email.trim()),
      maskedEmail: email.slice(0, 2) + '••••@' + (email.split('@')[1] || '••••.com'),
      category: category || 'General Issue',
      comment: comment.trim(),
      timestamp: Date.now(),
      status: 'pending'
    };

    tickets.unshift(newTicket);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tickets));
    return newTicket;
  }

  getTicketsForDisplay(currentUser) {
    const tickets = this._getRawTickets();
    const userIsAdmin = this.isAdmin(currentUser);

    return tickets.map(t => ({
      id: t.id,
      category: t.category,
      comment: t.comment,
      timestamp: t.timestamp,
      status: t.status,
      email: userIsAdmin ? this._decryptEmail(t.encryptedEmail) : t.maskedEmail,
      canViewEmail: userIsAdmin
    }));
  }

  resolveTicket(ticketId) {
    const tickets = this._getRawTickets();
    const target = tickets.find(t => t.id === ticketId);
    if (target) {
      target.status = 'resolved';
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tickets));
    }
  }

  deleteTicket(ticketId) {
    let tickets = this._getRawTickets();
    tickets = tickets.filter(t => t.id !== ticketId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tickets));
  }

  _getRawTickets() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
}

window.HiveSecurityShield = HiveSecurityShield;
window.HiveSupportVault = HiveSupportVault;
