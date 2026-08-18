const queryInput = document.getElementById('queryInput');
const searchBtn = document.getElementById('searchBtn');
const resultList = document.getElementById('resultList');
const documentList = document.getElementById('documentList');
const documentCount = document.getElementById('documentCount');
const resultCount = document.getElementById('resultCount');
const sourceBadge = document.getElementById('sourceBadge');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

const defaultQuery = 'zmluva';

function formatDate(dateString) {
  if (!dateString) return 'Neuvedené';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function setActiveTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === tabName);
  });
}

function appendMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;

  const bubble = document.createElement('p');
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderDocumentCards(documents) {
  documentCount.textContent = documents.length;

  if (!documents.length) {
    documentList.innerHTML = '<div class="empty-state">Žiadne dokumenty neboli nájdené.</div>';
    return;
  }

  documentList.innerHTML = documents
    .map(
      (doc) => `
        <article class="document-item">
          <div class="document-top">
            <span class="doc-tag">${doc.document_type || 'dokument'}</span>
            <span class="document-meta">${doc.jurisdiction || 'SK'}</span>
          </div>
          <h4>${doc.title}</h4>
          <p class="document-meta">${doc.document_number}</p>
          <p class="document-meta">Publikované: ${formatDate(doc.publication_date)}</p>
          <button type="button" data-doc="${doc.title}">Otvoriť</button>
        </article>
      `
    )
    .join('');

  documentList.querySelectorAll('button[data-doc]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.doc || defaultQuery;
      queryInput.value = value;
      setActiveTab('home');
      searchLegal(value);
    });
  });
}

function renderResults(results) {
  resultCount.textContent = results.length;

  if (!results.length) {
    resultList.innerHTML = '<div class="empty-state">Neboli nájdené žiadne relevantné pasáže.</div>';
    return;
  }

  resultList.innerHTML = results
    .map((item) => {
      const score = item.vector_distance !== undefined ? `~ ${(1 - item.vector_distance).toFixed(2)}` : 'Relevantné';
      return `
        <article class="result-item">
          <div class="result-header">
            <span class="result-title">${item.title || 'Právna pasáž'}</span>
            <span class="result-score">${score}</span>
          </div>
          <p class="result-text">${item.text}</p>
        </article>
      `;
    })
    .join('');
}

async function searchLegal(query) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return;
  }

  sourceBadge.textContent = 'Hľadám…';

  try {
    const response = await fetch('/api/v1/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: trimmed,
        jurisdiction: 'SK',
        limit: 5,
      }),
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    const results = data.results || [];
    renderResults(results);
    sourceBadge.textContent = data.source === 'fallback' ? 'Lokálny fallback' : 'Semantický výsledok';

    if (results.length) {
      const first = results[0];
      const summary = `${first.title || 'Právna pasáž'}: ${first.text.slice(0, 140)}${first.text.length > 140 ? '…' : ''}`;
      const assistantMessage = `Na základe vyhľadávania „${trimmed}“ je relevantná pasáž: ${summary}`;
      const existingChat = chatMessages.querySelectorAll('.message').length;
      if (existingChat > 1) {
        appendMessage('assistant', assistantMessage);
      }
    }
  } catch (error) {
    renderResults([]);
    sourceBadge.textContent = 'Offline režim';
  }
}

async function loadDocuments() {
  try {
    const response = await fetch('/api/legal-documents');
    if (!response.ok) {
      throw new Error('Documents failed');
    }

    const documents = await response.json();
    renderDocumentCards(Array.isArray(documents) ? documents : []);
  } catch (error) {
    renderDocumentCards([]);
  }
}

function handleChatSubmit(event) {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  appendMessage('user', text);
  chatInput.value = '';

  const reply = `Z pohľadu slovenského práva by bolo vhodné najskôr preveriť: ${text}. V prípade potreby odporúčam zamerať sa na relevantné paragrafy, zmluvné podmienky a prípadné povinnosti v súlade s platnou právnou úpravou.`;
  setTimeout(() => appendMessage('assistant', reply), 300);

  if (text.toLowerCase().includes('zmluva') || text.toLowerCase().includes('smlouva')) {
    searchLegal('zmluva');
  }
}

searchBtn.addEventListener('click', () => searchLegal(queryInput.value));
queryInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchLegal(queryInput.value);
  }
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    queryInput.value = chip.dataset.query;
    searchLegal(queryInput.value);
  });
});

tabButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab));
});

chatForm.addEventListener('submit', handleChatSubmit);

loadDocuments();
searchLegal(defaultQuery);
