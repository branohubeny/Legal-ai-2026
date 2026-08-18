document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const queryInput = document.getElementById('query');
  const resultsList = document.getElementById('resultsList');
  const docsList = document.getElementById('docsList');

  // Initialize Materialize components if present
  if (M && M.AutoInit) M.AutoInit();

  async function fetchDocs() {
    try {
      const res = await fetch('/api/legal-documents');
      if (!res.ok) return;
      const docs = await res.json();
      docsList.innerHTML = '';
      docs.forEach(d => {
        const item = document.createElement('a');
        item.href = '#';
        item.className = 'collection-item';
        item.innerHTML = `<span class="title">${d.document_number} — ${d.title}</span><p>${d.jurisdiction} • ${d.authority || ''}</p>`;
        docsList.appendChild(item);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function doSearch() {
    const q = queryInput.value.trim();
    if (!q) return M.toast({html: 'Please enter a query.'});

    searchBtn.classList.add('disabled');
    resultsList.innerHTML = '<p class="grey-text">Searching…</p>';

    try {
      const res = await fetch('/api/v1/search', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: q, limit: 10})
      });

      if (res.status === 503) {
        const err = await res.json();
        resultsList.innerHTML = `<p class="red-text">${err.detail}</p>`;
        return;
      }

      const data = await res.json();
      resultsList.innerHTML = '';

      if (!data.results || data.results.length === 0) {
        resultsList.innerHTML = '<p class="grey-text">No results found.</p>';
      } else {
        data.results.forEach(r => {
          const col = document.createElement('div');
          col.className = 'col s12';
          col.innerHTML = `
            <div class="card">
              <div class="card-content">
                <span class="card-title">${r.title || r.section_number}</span>
                <p class="grey-text">${(r.text || '').slice(0,300)}${(r.text||'').length>300?'...':''}</p>
              </div>
              <div class="card-action">
                <a href="#">Open</a>
                <span class="right grey-text">dist: ${r.vector_distance?.toFixed(3) ?? ''}</span>
              </div>
            </div>
          `;
          resultsList.appendChild(col);
        });
      }
    } catch (err) {
      resultsList.innerHTML = `<p class="red-text">Error: ${err.message}</p>`;
    } finally {
      searchBtn.classList.remove('disabled');
    }
  }

  searchBtn.addEventListener('click', doSearch);
  queryInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') doSearch(); });
  clearBtn.addEventListener('click', () => { queryInput.value=''; resultsList.innerHTML=''; });

  // Load documents on start
  fetchDocs();
});
