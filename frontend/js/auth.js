// ─────────────────────────────────────────────
//  js/auth.js
//  Handles authentication types and injects headers
// ─────────────────────────────────────────────

const Auth = (() => {

  /** Returns an object containing the auth header based on the selected auth type. */
  function getAuthHeader(authType) {
    switch (authType) {
      case 'bearer': {
        const token = document.getElementById('input-bearer-token')?.value.trim();
        return token ? { Authorization: `Bearer ${token}` } : {};
      }
      case 'basic': {
        const user    = document.getElementById('input-basic-user')?.value || '';
        const pass    = document.getElementById('input-basic-pass')?.value || '';
        const encoded = btoa(`${user}:${pass}`);
        return { Authorization: `Basic ${encoded}` };
      }
      case 'apikey': {
        const keyName = document.getElementById('input-apikey-name')?.value.trim();
        const keyVal  = document.getElementById('input-apikey-value')?.value.trim();
        return keyName ? { [keyName]: keyVal } : {};
      }
      default:
        return {}; 
    }
  }

  /** Dynamically renders the input fields for the selected auth type */
  function renderAuthFields(authType) {
    const container = document.getElementById('auth-fields');
    if (!container) return;
    
    container.innerHTML = '';

    if (authType === 'bearer') {
      container.innerHTML = `
        <div class="auth-field-group">
          <label>Token</label>
          <input id="input-bearer-token" type="text" placeholder="Enter Bearer Token" class="auth-input" />
        </div>`;
    } else if (authType === 'basic') {
      container.innerHTML = `
        <div class="auth-field-group">
          <label>Username</label>
          <input id="input-basic-user" type="text" placeholder="Username" class="auth-input" />
        </div>
        <div class="auth-field-group">
          <label>Password</label>
          <input id="input-basic-pass" type="password" placeholder="Password" class="auth-input" />
        </div>`;
    } else if (authType === 'apikey') {
      container.innerHTML = `
        <div class="auth-field-group">
          <label>Header Name</label>
          <input id="input-apikey-name" type="text" placeholder="e.g. X-API-Key" class="auth-input" value="x-api-key" />
        </div>
        <div class="auth-field-group">
          <label>API Key Value</label>
          <input id="input-apikey-value" type="text" placeholder="Your API Key" class="auth-input" />
        </div>`;
    } else {
      container.innerHTML = `<p class="auth-none-msg">No authentication will be sent with this request.</p>`;
    }
  }

  return { getAuthHeader, renderAuthFields };
})();
