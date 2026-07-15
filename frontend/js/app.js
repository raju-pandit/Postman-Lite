// ─────────────────────────────────────────────
//  js/app.js
//  Main wiring and event listeners
// ─────────────────────────────────────────────

// Global Toast Function
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {

  // ── 0. Theme Toggle ──
  const themeToggle = document.getElementById('btn-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('pl_theme') || 'dark';
  
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('pl_theme', newTheme);
      themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
  }

  // ── 1. Key-Value Table Helpers ──
  window.addTableRow = function(tbodyId, key = '', val = '') {
    const tbody = document.getElementById(tbodyId);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align:center"><input type="checkbox" class="kv-checkbox" checked></td>
      <td><input type="text" placeholder="Key" value="${key}" /></td>
      <td><input type="text" placeholder="Value" value="${val}" /></td>
      <td style="text-align:center"><button class="btn-del-row" title="Remove">✕</button></td>
    `;
    tbody.appendChild(row);
    
    row.querySelector('.btn-del-row').addEventListener('click', () => {
      row.remove();
      updateHeaderCount();
    });
    
    // If it's headers table, update count on change
    if (tbodyId === 'headers-body') {
      const inputs = row.querySelectorAll('input');
      inputs.forEach(inp => inp.addEventListener('input', updateHeaderCount));
      inputs.forEach(inp => inp.addEventListener('change', updateHeaderCount));
    }
  };

  function updateHeaderCount() {
    const { count } = RequestBuilder.readKeyValueTable('headers-body');
    const badge = document.getElementById('headers-count');
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  // ── 2. Request Builder Tabs ──
  document.querySelectorAll('#request-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      document.querySelectorAll('#request-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#tab-content .tab-panel').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`tab-${tabName}`).classList.add('active');
    });
  });

  // ── 3. Response Viewer Tabs ──
  document.querySelectorAll('.res-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      document.querySelectorAll('.res-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.res-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });

  // ── 4. Form Actions ──
  document.getElementById('btn-send').addEventListener('click', RequestBuilder.send);
  
  document.getElementById('url-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') RequestBuilder.send();
  });
  
  // Method color update
  document.getElementById('method-select').addEventListener('change', (e) => {
    e.target.style.color = `var(--${e.target.value.toLowerCase()})`;
  });

  // Add row buttons
  document.getElementById('btn-add-param').addEventListener('click', () => addTableRow('params-body'));
  document.getElementById('btn-add-header').addEventListener('click', () => addTableRow('headers-body'));
  document.getElementById('btn-add-form-row').addEventListener('click', () => addTableRow('form-body'));

  // Auth Type
  document.getElementById('auth-type').addEventListener('change', (e) => {
    Auth.renderAuthFields(e.target.value);
  });

  // Body Type Logic
  document.querySelectorAll('input[name="body-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const type = e.target.value;
      const rawContainer = document.getElementById('body-raw-container');
      const formContainer = document.getElementById('body-form-container');
      const noneMsg = document.getElementById('body-none-msg');
      
      // Update UI selection
      document.querySelectorAll('.body-type-label').forEach(lbl => lbl.classList.remove('selected'));
      e.target.closest('.body-type-label').classList.add('selected');

      rawContainer.classList.add('hidden');
      formContainer.classList.add('hidden');
      noneMsg.classList.add('hidden');

      if (type === 'json' || type === 'raw') {
        rawContainer.classList.remove('hidden');
      } else if (type === 'form-data' || type === 'urlencoded') {
        formContainer.classList.remove('hidden');
      } else {
        noneMsg.classList.remove('hidden');
      }
    });
  });

  // ── 5. Environment Modal ──
  const envModal = document.getElementById('env-modal');
  
  document.getElementById('btn-env-modal').addEventListener('click', () => {
    envModal.classList.remove('hidden');
    renderEnvTable();
  });
  
  document.getElementById('btn-close-env').addEventListener('click', () => envModal.classList.add('hidden'));
  
  document.getElementById('btn-add-env').addEventListener('click', () => {
    const tbody = document.getElementById('env-body');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" placeholder="Variable Name" class="env-key" /></td>
      <td><input type="text" placeholder="Value" class="env-val" /></td>
      <td style="text-align:center"><button class="btn-del-row" style="background:none;border:none;color:var(--text-muted);cursor:pointer;">✕</button></td>
    `;
    tbody.appendChild(row);
    row.querySelector('.btn-del-row').addEventListener('click', () => row.remove());
  });
  
  document.getElementById('btn-save-env').addEventListener('click', () => {
    const vars = {};
    document.querySelectorAll('#env-body tr').forEach(row => {
      const key = row.querySelector('.env-key').value.trim();
      const val = row.querySelector('.env-val').value.trim();
      if (key) vars[key] = val;
    });
    Environment.save(vars);
    envModal.classList.add('hidden');
    showToast('Environment variables saved', 'success');
  });

  function renderEnvTable() {
    const vars = Environment.load();
    const tbody = document.getElementById('env-body');
    tbody.innerHTML = '';
    
    Object.entries(vars).forEach(([key, val]) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="text" class="env-key" value="${key}" /></td>
        <td><input type="text" class="env-val" value="${val}" /></td>
        <td style="text-align:center"><button class="btn-del-row" style="background:none;border:none;color:var(--text-muted);cursor:pointer;">✕</button></td>
      `;
      tbody.appendChild(row);
      row.querySelector('.btn-del-row').addEventListener('click', () => row.remove());
    });
    
    // Add one empty row if empty
    if(Object.keys(vars).length === 0) {
      document.getElementById('btn-add-env').click();
    }
  }

  // ── 6. Collections & Saving ──
  const saveModal = document.getElementById('save-modal');
  let currentLoadedRequestId = null; // Track if we are editing an existing request
  
  document.getElementById('btn-new-collection').addEventListener('click', () => {
    const name = prompt('Enter new collection name:');
    if (name && name.trim()) {
      Collections.addCollection(name.trim());
      showToast(`Collection '${name}' created`, 'success');
    }
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    const cols = Collections.load();
    if (cols.length === 0) {
      showToast('Please create a collection first', 'error');
      return;
    }
    
    saveModal.classList.remove('hidden');
    const select = document.getElementById('save-collection-select');
    select.innerHTML = '';
    cols.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
    
    // Try to prepopulate name if from history or existing
    const url = document.getElementById('url-input').value;
    if(!document.getElementById('save-request-name').value) {
      document.getElementById('save-request-name').value = url ? new URL('http://dummy/'+url).pathname.split('/').pop() || 'New Request' : 'New Request';
    }
  });

  document.getElementById('btn-cancel-save').addEventListener('click', () => saveModal.classList.add('hidden'));
  
  document.getElementById('btn-confirm-save').addEventListener('click', () => {
    const name = document.getElementById('save-request-name').value.trim();
    const colId = parseInt(document.getElementById('save-collection-select').value);
    
    if (!name) {
      showToast('Please enter a request name', 'error');
      return;
    }
    
    try {
      const payload = RequestBuilder.buildRequest();
      payload.name = name;
      if (currentLoadedRequestId) payload.id = currentLoadedRequestId;
      
      if(Collections.saveRequest(colId, payload)) {
        saveModal.classList.add('hidden');
        showToast('Request saved successfully', 'success');
        currentLoadedRequestId = payload.id;
      }
    } catch(err) {
      showToast(err.message, 'error');
    }
  });

  // Load request from sidebar click
  document.getElementById('collection-list').addEventListener('click', (e) => {
    const reqItem = e.target.closest('.request-item');
    if (!reqItem || e.target.classList.contains('btn-del-req')) return;
    
    const colId = parseInt(reqItem.dataset.col);
    const reqId = parseInt(reqItem.dataset.req);
    const req = Collections.getRequest(colId, reqId);
    
    if (req) {
      loadRequestToUI(req);
      currentLoadedRequestId = reqId;
      document.getElementById('save-request-name').value = req.name;
      showToast(`Loaded '${req.name}'`);
      
      // highlight active
      document.querySelectorAll('.request-item').forEach(i => i.classList.remove('active'));
      reqItem.classList.add('active');
    }
  });
  
  document.getElementById('btn-new-request').addEventListener('click', () => {
    currentLoadedRequestId = null;
    document.getElementById('save-request-name').value = '';
    document.getElementById('url-input').value = '';
    document.getElementById('method-select').value = 'GET';
    document.getElementById('method-select').dispatchEvent(new Event('change'));
    
    document.getElementById('params-body').innerHTML = '';
    addTableRow('params-body');
    
    document.getElementById('headers-body').innerHTML = '';
    addTableRow('headers-body');
    updateHeaderCount();
    
    document.getElementById('auth-type').value = 'none';
    Auth.renderAuthFields('none');
    
    document.querySelector('input[name="body-type"][value="none"]').click();
    document.getElementById('body-raw-input').value = '';
    document.getElementById('form-body').innerHTML = '';
    addTableRow('form-body');
    
    ResponseViewer.reset();
    document.querySelectorAll('.request-item').forEach(i => i.classList.remove('active'));
  });

  function loadRequestToUI(req) {
    document.getElementById('url-input').value = req.rawUrl || req.url;
    document.getElementById('method-select').value = req.method;
    document.getElementById('method-select').dispatchEvent(new Event('change'));
    
    // Params
    const pBody = document.getElementById('params-body');
    pBody.innerHTML = '';
    if (req.params && Object.keys(req.params).length > 0) {
      Object.entries(req.params).forEach(([k,v]) => addTableRow('params-body', k, v));
    } else {
      addTableRow('params-body');
    }
    
    // Headers
    const hBody = document.getElementById('headers-body');
    hBody.innerHTML = '';
    if (req.headers && Object.keys(req.headers).length > 0) {
      Object.entries(req.headers).forEach(([k,v]) => {
        if(k.toLowerCase() !== 'content-type' && k.toLowerCase() !== 'authorization') {
          addTableRow('headers-body', k, v);
        }
      });
    }
    if (hBody.innerHTML === '') addTableRow('headers-body');
    updateHeaderCount();
    
    // Auth (Simplified loading - assumes None if not found, since we don't save raw auth fields separately in this implementation, only resolved headers)
    // For a real app, you'd save authType and auth fields separately.
    document.getElementById('auth-type').value = 'none';
    Auth.renderAuthFields('none');
    
    // Body
    if (req.bodyType) {
      const radio = document.querySelector(`input[name="body-type"][value="${req.bodyType}"]`);
      if (radio) radio.click();
      
      if ((req.bodyType === 'json' || req.bodyType === 'raw') && req.body) {
        document.getElementById('body-raw-input').value = 
          typeof req.body === 'object' ? JSON.stringify(req.body, null, 2) : req.body;
      } else if ((req.bodyType === 'form-data' || req.bodyType === 'urlencoded') && req.body) {
        const fBody = document.getElementById('form-body');
        fBody.innerHTML = '';
        Object.entries(req.body).forEach(([k,v]) => addTableRow('form-body', k, v));
      }
    }
  }

  // ── 7. History (Bonus) ──
  const HISTORY_KEY = 'pl_history';
  
  function loadHistory() {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  }
  
  function saveHistory(history) {
    // Keep only last 20
    if(history.length > 20) history = history.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }
  
  function renderHistory() {
    const history = loadHistory();
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    
    if(history.length === 0) {
      list.innerHTML = '<div class="empty-msg" style="padding-left:12px;">No recent requests</div>';
      return;
    }
    
    history.forEach((h, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <span class="method-badge ${h.method.toLowerCase()}">${h.method}</span>
        <div style="flex:1; overflow:hidden;">
          <div class="history-url">${h.url}</div>
          <div class="history-time">${new Date(h.time).toLocaleTimeString()}</div>
        </div>
      `;
      div.addEventListener('click', () => {
        loadRequestToUI(h);
        showToast('Loaded from history');
      });
      list.appendChild(div);
    });
  }

  document.addEventListener('request-sent', (e) => {
    const payload = e.detail;
    const history = loadHistory();
    history.unshift({
      ...payload,
      time: Date.now()
    });
    saveHistory(history);
  });
  
  document.getElementById('btn-clear-history').addEventListener('click', () => {
    if(confirm('Clear history?')) {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    }
  });


  // ── Initialize ──
  Collections.render();
  renderHistory();
  document.getElementById('method-select').dispatchEvent(new Event('change'));
  
  // Add initial empty rows
  addTableRow('params-body');
  addTableRow('headers-body');
  addTableRow('form-body');
});
