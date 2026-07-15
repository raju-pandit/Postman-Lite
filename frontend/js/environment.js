// ─────────────────────────────────────────────
//  js/environment.js
//  Manages environment variables stored in localStorage.
//  Resolves {{VAR}} placeholders in URLs and headers.
// ─────────────────────────────────────────────

const Environment = (() => {
  const STORAGE_KEY = 'pl_env_vars';

  /** Load all saved env variables from localStorage */
  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load environments", e);
      return {};
    }
  }

  /** Persist env variables to localStorage */
  function save(vars) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
    } catch (e) {
      console.error("Failed to save environments", e);
    }
  }

  /**
   * Replace {{VARIABLE_NAME}} patterns in a string
   * with the corresponding saved value.
   */
  function resolve(str) {
    if (typeof str !== 'string') return str;
    const vars = load();
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return vars[key] !== undefined ? vars[key] : match;
    });
  }

  return { load, save, resolve };
})();
