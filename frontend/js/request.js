// ─────────────────────────────────────────────
//  js/request.js
//  Builds and sends the HTTP request to proxy
// ─────────────────────────────────────────────

const RequestBuilder = (() => {

  /** Read key-value table rows */
  function readKeyValueTable(tbodyId) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    const result = {};
    let count = 0;
    
    rows.forEach(row => {
      // Skip template rows or empty rows
      if (row.classList.contains('empty-row')) return;
      
      const inputs = row.querySelectorAll('input[type="text"]');
      if (inputs.length < 2) return;
      
      const key = inputs[0].value.trim();
      const val = inputs[1].value.trim();
      
      // Handle checkbox if it exists (for enable/disable)
      const checkbox = row.querySelector('.kv-checkbox');
      const isEnabled = checkbox ? checkbox.checked : true;
      
      if (key && isEnabled) {
        result[key] = val;
        count++;
      }
    });
    
    return { data: result, count };
  }

  /** Gather all data and prepare payload */
  function buildRequest() {
    // URL & Method
    const rawUrl = document.getElementById('url-input').value.trim();
    if (!rawUrl) throw new Error("URL is required");
    
    // Auto add http:// if missing
    const resolvedUrl = Environment.resolve(rawUrl);
    const url = /^https?:\/\//i.test(resolvedUrl) ? resolvedUrl : `http://${resolvedUrl}`;
    
    const method = document.getElementById('method-select').value;

    // Params
    const { data: params } = readKeyValueTable('params-body');

    // Headers
    const { data: rawHeaders } = readKeyValueTable('headers-body');
    const headers = {};
    for (const [k, v] of Object.entries(rawHeaders)) {
      headers[Environment.resolve(k)] = Environment.resolve(v);
    }

    // Auth
    const authType = document.getElementById('auth-type').value;
    const authHeaders = Auth.getAuthHeader(authType);
    for (const [k, v] of Object.entries(authHeaders)) {
      headers[k] = Environment.resolve(v); // Resolve env vars in auth too
    }

    // Body
    const bodyType = document.querySelector('input[name="body-type"]:checked').value;
    let body = null;

    if (bodyType === 'json' || bodyType === 'raw') {
      const rawBody = document.getElementById('body-raw-input').value;
      if (rawBody.trim()) {
        body = Environment.resolve(rawBody);
        if (bodyType === 'json') {
          headers['Content-Type'] = 'application/json';
          try {
            body = JSON.parse(body); // parse to object so axios handles it properly
          } catch (e) {
            throw new Error('Invalid JSON in body');
          }
        } else {
          headers['Content-Type'] = 'text/plain';
        }
      }
    } else if (bodyType === 'form-data' || bodyType === 'urlencoded') {
      const { data: formBody } = readKeyValueTable('form-body');
      if (Object.keys(formBody).length > 0) {
        body = formBody;
        if (bodyType === 'urlencoded') {
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
          headers['Content-Type'] = 'multipart/form-data';
        }
      }
    }

    return { 
      url, 
      method, 
      params, 
      headers, 
      body, 
      bodyType,
      rawUrl // keep original for saving
    };
  }

  /** Send to backend proxy */
  async function send() {
    let payload;
    try {
      payload = buildRequest();
    } catch (err) {
      showToast(err.message, 'error');
      return;
    }

    const btn = document.getElementById('btn-send');
    const btnText = btn.querySelector('.btn-text');
    
    btn.classList.add('sending');
    btnText.textContent = 'Sending...';
    btn.disabled = true;
    
    // Reset UI
    ResponseViewer.reset();

    try {
      // Use dynamic origin so it works on localhost AND when deployed
      const proxyUrl = `${window.location.origin}/proxy`;
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to proxy request');
      }
      
      ResponseViewer.render(data);
      
      // Bonus: Add to history (handled by app.js event)
      document.dispatchEvent(new CustomEvent('request-sent', { detail: payload }));

    } catch (err) {
      ResponseViewer.renderError(err.message);
    } finally {
      btn.classList.remove('sending');
      btnText.textContent = 'Send';
      btn.disabled = false;
    }
  }

  return { send, buildRequest, readKeyValueTable };
})();
