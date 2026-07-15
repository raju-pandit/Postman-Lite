// ─────────────────────────────────────────────
//  js/response.js
//  Displays response data, formats JSON
// ─────────────────────────────────────────────

const ResponseViewer = (() => {

  function reset() {
    document.getElementById('res-status').textContent = '...';
    document.getElementById('res-status').className = '';
    document.getElementById('res-time').textContent = '...';
    document.getElementById('res-size').textContent = '...';
    document.getElementById('res-empty-state').classList.remove('hidden');
    
    const errorState = document.getElementById('res-error-state');
    if (errorState) errorState.classList.add('hidden');
    
    document.getElementById('response-body-content').classList.add('hidden');
    document.getElementById('response-body-content').innerHTML = '';
    document.getElementById('response-headers-content').innerHTML = '';
    document.getElementById('btn-copy-response').disabled = true;
  }

  function render(data) {
    document.getElementById('res-empty-state').classList.add('hidden');
    
    const errorState = document.getElementById('res-error-state');
    if (errorState) errorState.classList.add('hidden');
    
    const bodyContent = document.getElementById('response-body-content');
    bodyContent.classList.remove('hidden');
    
    // 1. Status badge
    const statusEl = document.getElementById('res-status');
    statusEl.textContent = `${data.status} ${data.statusText || ''}`.trim();
    statusEl.className = getStatusClass(data.status);

    // 2. Meta
    document.getElementById('res-time').textContent = `${data.time} ms`;
    document.getElementById('res-size').textContent = formatBytes(data.size);

    // 3. Body formatting (Syntax highlighting simulation)
    let rawString = '';
    if (typeof data.data === 'object' && data.data !== null) {
      rawString = JSON.stringify(data.data, null, 2);
      bodyContent.innerHTML = syntaxHighlight(rawString);
    } else {
      rawString = String(data.data);
      // Basic HTML escaping
      bodyContent.textContent = rawString;
    }

    // 4. Headers
    const headersContent = document.getElementById('response-headers-content');
    headersContent.innerHTML = syntaxHighlight(JSON.stringify(data.headers || {}, null, 2));
    
    // Enable copy button
    const copyBtn = document.getElementById('btn-copy-response');
    copyBtn.disabled = false;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(rawString);
      showToast('Response copied to clipboard', 'success');
    };
  }

  function renderError(message) {
    document.getElementById('res-empty-state').classList.add('hidden');
    const bodyContent = document.getElementById('response-body-content');
    bodyContent.classList.add('hidden');
    
    const errorState = document.getElementById('res-error-state');
    if (errorState) {
      errorState.classList.remove('hidden');
      document.getElementById('res-error-msg').textContent = message;
    } else {
      bodyContent.classList.remove('hidden');
      bodyContent.textContent = message;
      bodyContent.style.color = 'var(--red)';
    }
    
    const statusEl = document.getElementById('res-status');
    statusEl.textContent = 'Error';
    statusEl.className = 'status-error';
    
    document.getElementById('res-time').textContent = '0 ms';
    document.getElementById('res-size').textContent = '0 B';
    
    document.getElementById('btn-copy-response').disabled = true;
  }

  // Color mapping
  function getStatusClass(status) {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-redirect';
    if (status >= 400 && status < 500) return 'status-client';
    return 'status-server';
  }

  function formatBytes(bytes) {
    if (bytes === 0 || !bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  // Basic regex syntax highlighter for JSON
  function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-bool';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  return { render, renderError, reset };
})();
