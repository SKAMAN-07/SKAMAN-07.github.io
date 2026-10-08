/**
 * Hive Auth & Anti-Bot Security Shield
 * - Google Identity Services (GIS) OAuth 2.0 Sign-In
 * - Device Fingerprinting & Daily Creation/Deliberation Quotas
 * - Anti-Bot Verification (Headless detection, token bucket rate limiter)
 * - Zero Host Device Burden: 100% Client-Side Local Storage & BYOK execution
 */

class HiveSecurityShield {
  constructor() {
    this.DAILY_LIMIT = 5; // Free deliberations per device/day
    this.SUBMISSION_COOLDOWN_MS = 3000;
    this.lastSubmissionTime = 0;
    this.currentUser = null;
    this.deviceFingerprint = this.generateDeviceFingerprint();
    this.initSecurity();
  }

  initSecurity() {
    // 1. Detect automated headless bots / web scrapers
    this.isBot = this.detectBotEnvironment();

    // 2. Load stored session
    const savedUser = localStorage.getItem('hive_user_session');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem('hive_user_session');
      }
    }

    // 3. Check and reset daily quota
    this.updateDailyQuota();
  }

  detectBotEnvironment() {
    // Check common automated headless browser properties
    if (navigator.webdriver) return true;
    if (window.document.documentElement.getAttribute("webdriver")) return true;
    if (/HeadlessChrome|PhantomJS|Selenium|Playwright|Puppeteer/i.test(navigator.userAgent)) return true;
    if (!navigator.languages || navigator.languages.length === 0) return true;
    return false;
  }

  generateDeviceFingerprint() {
    // Fast lightweight client-side hardware & canvas fingerprint
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

    // Simple FNV-1a hash
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
   * Rate limiting verification before submitting queries
   */
  validateSubmission(hasCustomKey = false) {
    if (this.isBot) {
      return { allowed: false, reason: "Security Alert: Automated headless environment detected. Access blocked." };
    }

    const now = Date.now();
    if (now - this.lastSubmissionTime < this.SUBMISSION_COOLDOWN_MS) {
      return { allowed: false, reason: "Please wait a moment before sending another query." };
    }

    // If visitor has entered their own API key or uses local desktop daemon, unlimited access
    if (hasCustomKey) {
      this.lastSubmissionTime = now;
      return { allowed: true };
    }

    // Otherwise check daily quota
    const remaining = this.getRemainingDailyQuota();
    if (remaining <= 0) {
      return {
        allowed: false,
        reason: `Daily free quota reached (${this.DAILY_LIMIT}/${this.DAILY_LIMIT}). Enter your own free Gemini API key in Settings or connect to your local desktop Hive instance to continue with unlimited requests.`
      };
    }

    this.lastSubmissionTime = now;
    return { allowed: true, remaining: remaining - 1 };
  }

  /**
   * Google Identity Services Authentication Handler
   */
  handleGoogleCredential(response) {
    try {
      // Decode JWT token payload without external libraries
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const profile = JSON.parse(jsonPayload);
      this.currentUser = {
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        sub: profile.sub,
        authenticatedAt: Date.now()
      };

      localStorage.setItem('hive_user_session', JSON.stringify(this.currentUser));
      return this.currentUser;
    } catch (e) {
      console.error("Failed to parse Google credentials:", e);
      return null;
    }
  }

  signOut() {
    this.currentUser = null;
    localStorage.removeItem('hive_user_session');
  }
}

window.HiveSecurityShield = HiveSecurityShield;
