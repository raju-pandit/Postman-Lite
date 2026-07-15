// ─────────────────────────────────────────────
//  js/collections.js
//  Manages collections and saved requests via localStorage
// ─────────────────────────────────────────────

const Collections = (() => {
  const STORAGE_KEY = 'pl_collections';

  /** Load all collections */
  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  /** Persist collections */
  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /** Create a new collection */
  function addCollection(name) {
    const collections = load();
    collections.push({ id: Date.now(), name, requests: [] });
    save(collections);
    render();
    return true;
  }

  /** Delete a collection */
  function deleteCollection(collectionId) {
    const collections = load().filter(c => c.id !== collectionId);
    save(collections);
    render();
  }

  /** Save or update a request inside a collection */
  function saveRequest(collectionId, requestData) {
    const collections = load();
    const col = collections.find(c => c.id === collectionId);
    if (!col) return false;

    const existingIndex = col.requests.findIndex(r => r.id === requestData.id);
    if (existingIndex >= 0) {
      col.requests[existingIndex] = requestData;
    } else {
      requestData.id = Date.now();
      col.requests.push(requestData);
    }

    save(collections);
    render();
    return true;
  }

  /** Delete a specific request */
  function deleteRequest(collectionId, requestId) {
    const collections = load();
    const col = collections.find(c => c.id === collectionId);
    if (col) {
      col.requests = col.requests.filter(r => r.id !== requestId);
      save(collections);
      render();
    }
  }

  /** Get a request by ID */
  function getRequest(colId, reqId) {
    const col = load().find(c => c.id === colId);
    return col?.requests.find(r => r.id === reqId);
  }

  /** Re-render the sidebar list */
  function render() {
    const list = document.getElementById('collection-list');
    if (!list) return;
    
    const collections = load();
    list.innerHTML = '';

    if (collections.length === 0) {
      list.innerHTML = `<li class="empty-msg">No collections yet.<br/>Click "+" to create one.</li>`;
      return;
    }

    collections.forEach(col => {
      const li = document.createElement('li');
      li.className = 'collection-item';
      
      const hasRequests = col.requests && col.requests.length > 0;
      
      li.innerHTML = `
        <div class="col-header">
          <span class="col-toggle">▶</span>
          <span class="col-name">📁 ${col.name}</span>
          <button class="btn-del-col" title="Delete collection" data-id="${col.id}">🗑</button>
        </div>
        <ul class="request-list hidden">
          ${!hasRequests 
            ? '<li class="empty-msg" style="padding-left:12px;">Empty collection</li>'
            : col.requests.map(req => `
              <li class="request-item" data-col="${col.id}" data-req="${req.id}">
                <span class="method-badge ${req.method.toLowerCase()}">${req.method}</span>
                <span class="req-name">${req.name}</span>
                <button class="btn-del-req" data-col="${col.id}" data-req="${req.id}" title="Delete">✕</button>
              </li>`).join('')}
        </ul>
      `;
      list.appendChild(li);
    });

    // Toggle expand/collapse
    document.querySelectorAll('.col-header').forEach(header => {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.btn-del-col')) return;
        const ul = header.nextElementSibling;
        const toggle = header.querySelector('.col-toggle');
        ul.classList.toggle('hidden');
        toggle.textContent = ul.classList.contains('hidden') ? '▶' : '▼';
      });
    });

    // Delete collection
    document.querySelectorAll('.btn-del-col').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this collection and all its requests?')) {
          deleteCollection(parseInt(btn.dataset.id));
        }
      });
    });

    // Delete request
    document.querySelectorAll('.btn-del-req').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this request?')) {
          deleteRequest(parseInt(btn.dataset.col), parseInt(btn.dataset.req));
        }
      });
    });
  }

  return { load, save, addCollection, saveRequest, getRequest, render };
})();
