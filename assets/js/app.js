// --- Интерактивное приложение «НутриГайд» ---

// 1. Библиотека чистых SVG иконок (Никаких эмодзи!)
const SVG_ICONS = {
  logo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="m12 6 3 6-3 6-3-6z"/></svg>`,
  grid: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
  compass: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  eye: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  sparkle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
  sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  leaf: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  bone: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10c.7-.7 1.6-1 2.5-1a3.5 3.5 0 1 1 0 7c-.9 0-1.8-.3-2.5-1l-10 1c-.7.7-1.6 1-2.5 1a3.5 3.5 0 1 1 0-7c.9 0 1.8.3 2.5 1z"/></svg>`,
  activity: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  flame: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  "heart-pulse": `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
  droplet: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`,
  "shield-check": `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  "arrow-right": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  "arrow-left": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  "alert-triangle": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  venus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 18h6"/></svg>`,
  mars: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="m21 3-6.75 6.75"/><circle cx="10" cy="14" r="5"/></svg>`,
  target: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  apple: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`,
  fish: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a1 1 0 0 1-1.66.73l-4.12-3.8A8.04 8.04 0 0 0 6.5 12a8.04 8.04 0 0 0 3.72-2.86l4.12-3.8A1 1 0 0 1 16 6.07Z"/></svg>`,
  clock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  pill: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
  microscope: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="m14 22 3-3-3-3"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  refresh: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>`,
  checkCircle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
};

function getIcon(name) {
  return SVG_ICONS[name] || SVG_ICONS.logo;
}

// 2. Состояние приложения (State)
let currentTab = 'catalog';
let activeFilter = 'all';
let searchQuery = '';
let currentQuizStep = 1;
const quizAnswers = {
  gender: 'female',
  age: 28,
  goals: ['energy'],
  diet_veg: 'veg_1_2',
  fish: 'fish_1_2',
  sun: 'sun_15_30',
  stress: 'stress_med',
  training: 'train_1_2',
  skin: 'skin_ok',
  gut: 'gut_ok',
  cautions: ['warn_none']
};

// 3. Инициализация DOM
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupCatalog();
  setupModal();
  renderCatalog();
});

// Навигация между Каталогом и Тестом
function setupNavigation() {
  const btnCatalog = document.getElementById('navCatalog');
  const btnQuiz = document.getElementById('navQuiz');
  const catalogView = document.getElementById('catalogView');
  const quizView = document.getElementById('quizView');

  function switchTab(tab) {
    currentTab = tab;
    if (tab === 'catalog') {
      btnCatalog.classList.add('active');
      btnQuiz.classList.remove('active');
      catalogView.style.display = 'block';
      quizView.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      btnQuiz.classList.add('active');
      btnCatalog.classList.remove('active');
      catalogView.style.display = 'none';
      quizView.style.display = 'block';
      renderQuizStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  btnCatalog.addEventListener('click', () => switchTab('catalog'));
  btnQuiz.addEventListener('click', () => switchTab('quiz'));

  const heroQuizBtn = document.getElementById('heroQuizBtn');
  if (heroQuizBtn) {
    heroQuizBtn.addEventListener('click', () => switchTab('quiz'));
  }
}

// Настройка фильтрации и поиска каталога
function setupCatalog() {
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderCatalog();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderCatalog();
    });
  });
}

// Отрисовка сетки карточек каталога
function renderCatalog() {
  const grid = document.getElementById('supplementsGrid');
  if (!grid) return;

  const filtered = SUPPLEMENTS_DATA.filter(item => {
    const matchesFilter = (activeFilter === 'all') || (item.categories && item.categories.includes(activeFilter));
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery) ||
      item.latin_name.toLowerCase().includes(searchQuery) ||
      item.tagline.toLowerCase().includes(searchQuery) ||
      (item.benefits && item.benefits.some(b => b.toLowerCase().includes(searchQuery)));
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;" class="glass-panel">
        <div style="color: var(--text-dim); margin-bottom: 12px;">${getIcon('search')}</div>
        <h3 style="font-size: 1.2rem; margin-bottom: 6px;">Ничего не найдено</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Попробуйте изменить поисковый запрос или сбросить фильтр</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="glass-panel supplement-card" onclick="openModal('${item.id}')">
      <div class="card-top">
        <span class="card-category-badge">${item.category_name}</span>
        <span style="color: var(--primary);">${getIcon(item.icon || 'shield')}</span>
      </div>
      <div class="card-image-box">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <h3 class="card-title">${item.name}</h3>
      <p class="card-latin">${item.latin_name}</p>
      <p class="card-tagline">${item.tagline}</p>
      <div class="card-footer">
        <span style="font-size: 0.78rem; color: var(--text-dim);">${item.brands ? item.brands.length + ' бренда в базе' : ''}</span>
        <button class="card-link-btn" type="button">
          Подробнее ${getIcon('arrow-right')}
        </button>
      </div>
    </article>
  `).join('');
}

// 4. Модальное окно с деталями добавки
let currentActiveModalId = null;

function setupModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal(id) {
  const item = SUPPLEMENTS_DATA.find(s => s.id === id);
  if (!item) return;
  currentActiveModalId = id;

  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');

  const allImages = [item.image, ...(item.additional_images || [])];

  modalBody.innerHTML = `
    <div class="modal-header">
      <div class="modal-img-col">
        <div class="modal-main-img">
          <img id="modalMainImgElem" src="${item.image}" alt="${item.name}">
        </div>
        ${allImages.length > 1 ? `
          <div class="modal-thumbs">
            ${allImages.map((img, idx) => `
              <div class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="switchModalThumb('${img}', this)">
                <img src="${img}" alt="Фото ${idx + 1}">
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="modal-title-col">
        <span class="card-category-badge" style="margin-bottom: 8px;">${item.category_name}</span>
        <h2 class="modal-title">${item.name}</h2>
        <p class="modal-latin">${item.latin_name}</p>
        <p class="modal-concept">${item.concept}</p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <div class="chip-item" style="font-size: 0.8rem;">
            ${getIcon('clock')} Дозировка: ${item.dosage ? item.dosage.split('.')[0] : 'Индивидуально'}
          </div>
        </div>
      </div>
    </div>

    <!-- Биологические функции -->
    <h3 class="modal-section-title">${getIcon('activity')} Что делает в организме</h3>
    <ul class="modal-bullet-list">
      ${item.benefits ? item.benefits.map(b => `
        <li class="modal-bullet-item">
          <span class="modal-bullet-icon">${getIcon('check')}</span>
          <span>${b}</span>
        </li>
      `).join('') : ''}
    </ul>

    <!-- Информационная сетка -->
    <div class="modal-info-grid">
      <div class="info-block">
        <div class="info-block-label">${getIcon('pill')} Основные формы и виды</div>
        <div class="info-block-value">${item.forms}</div>
      </div>

      <div class="info-block">
        <div class="info-block-label">${getIcon('clock')} Правила приёма</div>
        <div class="info-block-value">${item.dosage}</div>
      </div>

      <div class="info-block">
        <div class="info-block-label">${getIcon('target')} КБЖУ и калорийность</div>
        <div class="info-block-value">${item.kbju}</div>
      </div>

      <div class="info-block">
        <div class="info-block-label">${getIcon('shield')} Условия хранения</div>
        <div class="info-block-value">${item.storage}</div>
      </div>
    </div>

    <!-- Популярные производители -->
    ${item.brands && item.brands.length ? `
      <h3 class="modal-section-title">${getIcon('award')} Популярные производители из файла</h3>
      <table class="brands-table">
        <thead>
          <tr>
            <th>Бренд & Продукт</th>
            <th>Состав и особенности</th>
          </tr>
        </thead>
        <tbody>
          ${item.brands.map(b => `
            <tr>
              <td style="width: 35%;">
                <span class="brand-badge">${b.brand}</span>
                <div style="font-weight: 600; margin-top: 4px; color: var(--text-main);">${b.product}</div>
              </td>
              <td style="color: var(--text-muted);">${b.desc}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <!-- Предостережения -->
    ${item.contraindications ? `
      <div class="warnings-card" style="margin-top: 24px; margin-bottom: 0;">
        <div class="warnings-title">${getIcon('alert-triangle')} Противопоказания и предостережения</div>
        <div class="warnings-desc">${item.contraindications}</div>
      </div>
    ` : ''}
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function switchModalThumb(src, elem) {
  const mainImg = document.getElementById('modalMainImgElem');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  if (elem) elem.classList.add('active');
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// 5. Интерактивный опросник (Quiz System)
function renderQuizStep() {
  const qContainer = document.getElementById('quizStepContainer');
  const resultView = document.getElementById('quizResultView');
  const quizFormView = document.getElementById('quizFormView');
  const progressText = document.getElementById('quizProgressText');
  const progressBar = document.getElementById('quizProgressBar');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');

  if (!qContainer) return;

  if (currentQuizStep > 10) {
    quizFormView.style.display = 'none';
    resultView.style.display = 'block';
    renderQuizResults();
    return;
  }

  quizFormView.style.display = 'block';
  resultView.style.display = 'none';

  const q = QUIZ_QUESTIONS[currentQuizStep - 1];

  progressText.textContent = `Вопрос ${currentQuizStep} из 10`;
  progressBar.style.width = `${(currentQuizStep / 10) * 100}%`;

  prevBtn.disabled = (currentQuizStep === 1);
  nextBtn.textContent = (currentQuizStep === 10) ? 'Показать результат' : 'Далее';

  let optionsHtml = '';

  if (q.type === 'demographics') {
    optionsHtml = `
      <div class="demographics-form">
        <div>
          <label style="display:block; font-size: 0.9rem; font-weight:600; color:var(--text-muted); margin-bottom:12px;">Ваш пол:</label>
          <div class="gender-select">
            <div class="option-item ${quizAnswers.gender === 'female' ? 'selected' : ''}" onclick="selectGender('female')">
              <div class="option-icon-box">${getIcon('venus')}</div>
              <div class="option-label">Женский</div>
            </div>
            <div class="option-item ${quizAnswers.gender === 'male' ? 'selected' : ''}" onclick="selectGender('male')">
              <div class="option-icon-box">${getIcon('mars')}</div>
              <div class="option-label">Мужской</div>
            </div>
          </div>
        </div>

        <div class="age-input-group">
          <label>Ваш возраст:</label>
          <div class="age-control">
            <input type="range" class="age-slider" min="16" max="85" value="${quizAnswers.age}" oninput="updateAge(this.value)">
            <span class="age-number-display" id="ageValDisplay">${quizAnswers.age} лет</span>
          </div>
        </div>
      </div>
    `;
  } else if (q.type === 'single') {
    const key = getQuestionKey(q.id);
    optionsHtml = `
      <div class="options-list">
        ${q.options.map(opt => `
          <div class="option-item ${quizAnswers[key] === opt.id ? 'selected' : ''}" onclick="selectSingleOption('${key}', '${opt.id}')">
            <div class="option-icon-box">${getIcon(opt.icon || 'checkCircle')}</div>
            <div class="option-text">
              <div class="option-label">${opt.label}</div>
              ${opt.desc ? `<div class="option-desc">${opt.desc}</div>` : ''}
            </div>
            <div class="option-check">${getIcon('check')}</div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'multi') {
    const key = (q.id === 2) ? 'goals' : 'cautions';
    const selectedArr = quizAnswers[key] || [];
    optionsHtml = `
      <div class="options-list">
        ${q.options.map(opt => {
          const isSelected = selectedArr.includes(opt.id);
          return `
            <div class="option-item ${isSelected ? 'selected' : ''}" onclick="toggleMultiOption('${key}', '${opt.id}')">
              <div class="option-icon-box">${getIcon(opt.icon || 'checkCircle')}</div>
              <div class="option-text">
                <div class="option-label">${opt.label}</div>
                ${opt.desc ? `<div class="option-desc">${opt.desc}</div>` : ''}
              </div>
              <div class="option-check">${getIcon('check')}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  qContainer.innerHTML = `
    <h2 class="quiz-q-title">${q.title}</h2>
    <p class="quiz-q-subtitle">${q.subtitle}</p>
    ${optionsHtml}
  `;
}

function getQuestionKey(id) {
  const map = {
    3: 'diet_veg',
    4: 'fish',
    5: 'sun',
    6: 'stress',
    7: 'training',
    8: 'skin',
    9: 'gut'
  };
  return map[id] || 'unknown';
}

function selectGender(val) {
  quizAnswers.gender = val;
  renderQuizStep();
}

function updateAge(val) {
  quizAnswers.age = parseInt(val, 10);
  const disp = document.getElementById('ageValDisplay');
  if (disp) disp.textContent = `${val} лет`;
}

function selectSingleOption(key, val) {
  quizAnswers[key] = val;
  renderQuizStep();
}

function toggleMultiOption(key, val) {
  if (!quizAnswers[key]) quizAnswers[key] = [];

  if (val === 'warn_none') {
    quizAnswers[key] = ['warn_none'];
  } else {
    // убираем warn_none если выбран конкретный риск
    quizAnswers[key] = quizAnswers[key].filter(x => x !== 'warn_none');
    if (quizAnswers[key].includes(val)) {
      quizAnswers[key] = quizAnswers[key].filter(x => x !== val);
      if (quizAnswers[key].length === 0 && key === 'cautions') {
        quizAnswers[key] = ['warn_none'];
      }
    } else {
      if (key === 'goals' && quizAnswers[key].length >= 3) {
        // максимум 3 цели
        quizAnswers[key].shift();
      }
      quizAnswers[key].push(val);
    }
  }
  renderQuizStep();
}

function handleQuizNext() {
  if (currentQuizStep <= 10) {
    currentQuizStep++;
    renderQuizStep();
    window.scrollTo({ top: 150, behavior: 'smooth' });
  }
}

function handleQuizPrev() {
  if (currentQuizStep > 1) {
    currentQuizStep--;
    renderQuizStep();
    window.scrollTo({ top: 150, behavior: 'smooth' });
  }
}

// 6. Логика генерации персонального отчета (Recommendation Engine)
function calculateRecommendations() {
  const recs = [];
  const deficits = [];
  const schedule = {
    morning: [],
    day: [],
    evening: []
  };
  const warnings = [];

  // Анализ солнца (Вопрос 5)
  if (quizAnswers.sun === 'sun_0' || quizAnswers.sun === 'sun_spf' || quizAnswers.sun === 'sun_15_30') {
    deficits.push('Острый дефицит эндогенного синтеза Витамина D3 из-за низкой инсоляции');
    recs.push({
      id: 'vitamin_d',
      reason: 'При недостатке солнца в дневные часы (для иммунитета и усвоения кальция)',
      timing: 'Утро (с жирным завтраком)',
      period: 'morning'
    });
  }

  // Стресс и сон (Вопрос 6)
  if (quizAnswers.stress === 'stress_high' || quizAnswers.stress === 'stress_severe') {
    deficits.push('Повышенный уровень кортизола и форсированный расход запасов магния');
    recs.push({
      id: 'magnesium',
      reason: 'Снижает уровень тревожности, стабилизирует нервную систему и предотвращает судороги',
      timing: 'Вечер (с ужином)',
      period: 'evening'
    });
    recs.push({
      id: 'gaba',
      reason: 'Тормозящий нейромедиатор для снятия ментального перевозбуждения перед сном',
      timing: 'Перед сном за 40 мин',
      period: 'evening'
    });
    if (quizAnswers.stress === 'stress_severe') {
      recs.push({
        id: 'melatonin',
        reason: 'Экспресс-восстановление глубокой фазы сна и циркадных ритмов',
        timing: 'Перед сном в темноте',
        period: 'evening'
      });
    }
  }

  // Овощи и кожа (Вопрос 3 + Вопрос 8)
  if (quizAnswers.diet_veg === 'veg_0' || quizAnswers.diet_veg === 'veg_1_2') {
    deficits.push('Недостаток натуральных антиоксидантов и биофлавоноидов из свежих овощей');
    recs.push({
      id: 'vitamin_c',
      reason: 'Базовый антиоксидант и стимулятор эндогенного синтеза собственного коллагена',
      timing: 'Утро (после завтрака)',
      period: 'morning'
    });
  }

  if (quizAnswers.skin === 'skin_mild' || quizAnswers.skin === 'skin_severe') {
    deficits.push('Снижение плотности дермы, ломкость ногтей и микровоспаления');
    recs.push({
      id: 'collagen',
      reason: 'Гидролизованные пептиды для упругости кожи, укрепления волосяных фолликулов и суставов',
      timing: 'Утро натощак за 30 мин до еды',
      period: 'morning'
    });
    recs.push({
      id: 'zinc',
      reason: 'Нормализует работу сальных желез, подавляет бактерии акне и ускоряет регенерацию',
      timing: 'День (во время обеда)',
      period: 'day'
    });
  }

  // Рыба и спорт (Вопрос 4 + Вопрос 7)
  if (quizAnswers.fish === 'fish_0' || quizAnswers.fish === 'fish_unsure' || quizAnswers.fish === 'fish_1_2') {
    deficits.push('Дефицит незаменимых омега-3 жирных кислот (ЭПК/ДГК) для мозга и сосудов');
    recs.push({
      id: 'omega',
      reason: 'Для защиты эндотелия сосудов, питания клеток мозга и увлажненности кожи',
      timing: 'Утро или Обед (с едой)',
      period: 'morning'
    });
  }

  if (quizAnswers.training === 'train_3_4' || quizAnswers.training === 'train_pro') {
    deficits.push('Высокий мышечный катаболизм и повышенный расход клеточного АТФ при тренировках');
    recs.push({
      id: 'bcaa',
      reason: 'Аминокислоты с разветвленной цепью для защиты мышц и снижения крепатуры',
      timing: 'Перед или во время тренировки',
      period: 'day'
    });
    recs.push({
      id: 'creatine',
      reason: 'Мгновенный ресинтез АТФ для взрывной силы и силовой выносливости',
      timing: 'После тренировки с углеводами',
      period: 'day'
    });
  }

  // ЖКТ и антибиотики (Вопрос 9)
  if (quizAnswers.gut !== 'gut_ok') {
    deficits.push('Подавление полезной микробиоты ЖКТ и нарушение кишечной абсорбции нутриентов');
    recs.push({
      id: 'chlorophyll',
      reason: 'Мягкий детокс ЖКТ, подавление гнилостных бактерий и свежесть',
      timing: 'Утро (1 ч.л. на стакан теплой воды)',
      period: 'morning'
    });
  }

  // Гендерные и возрастные корректировки
  if (quizAnswers.gender === 'female' && (quizAnswers.goals.includes('energy') || quizAnswers.skin !== 'skin_ok')) {
    recs.push({
      id: 'iron',
      reason: 'Восполнение скрытого дефицита железа, повышение уровня ферритина и тонуса',
      timing: 'Утро (отдельно от кофе, чая и кальция)',
      period: 'morning'
    });
  }

  if (quizAnswers.age >= 35 || quizAnswers.goals.includes('energy')) {
    recs.push({
      id: 'coq10',
      reason: 'Поддержка выработки энергии в митохондриях клеток миокарда и антиэйдж',
      timing: 'Утро или День (с жирной пищей)',
      period: 'morning'
    });
  }

  // Ограничения и предостережения (Вопрос 10)
  const cautions = quizAnswers.cautions || [];
  if (cautions.includes('warn_pregnancy')) {
    warnings.push('Беременность / Планирование: избегайте высоких доз готового Витамина А (ретиноидов). Любые добавки согласуйте с ведущим акушером-гинекологом.');
  }
  if (cautions.includes('warn_anticoagulants')) {
    warnings.push('Прием антикоагулянтов: Омега-3 и Коэнзим Q10 в высоких дозах влияют на свертываемость крови. Принимайте только под контролем коагулограммы (МНО).');
  }
  if (cautions.includes('warn_allergy')) {
    warnings.push('Аллергия на морепродукты: выбирайте Омегу-3 исключительно растительного происхождения (из микроводорослей) или исключите рыбий жир.');
  }

  // Убираем дубликаты БАДов
  const uniqueRecs = [];
  const seenIds = new Set();
  recs.forEach(r => {
    if (!seenIds.has(r.id)) {
      seenIds.add(r.id);
      uniqueRecs.push(r);
    }
  });

  // Распределяем по графику
  uniqueRecs.forEach(r => {
    const item = SUPPLEMENTS_DATA.find(s => s.id === r.id);
    const title = item ? item.name : r.id;
    if (r.period === 'morning') schedule.morning.push(`${title} — ${r.timing}`);
    else if (r.period === 'day') schedule.day.push(`${title} — ${r.timing}`);
    else if (r.period === 'evening') schedule.evening.push(`${title} — ${r.timing}`);
  });

  return { uniqueRecs, deficits, schedule, warnings };
}

function renderQuizResults() {
  const resultView = document.getElementById('quizResultView');
  const { uniqueRecs, deficits, schedule, warnings } = calculateRecommendations();

  const genderStr = quizAnswers.gender === 'female' ? 'Женщина' : 'Мужчина';

  resultView.innerHTML = `
    <div class="glass-panel result-card">
      <div class="result-header">
        <span class="result-badge">${getIcon('check')} Скрининг завершен</span>
        <h2 class="result-title">Ваш персональный нутрицевтический профиль</h2>
        <p class="result-subtitle">Профиль: ${genderStr}, ${quizAnswers.age} лет • Базируется на анализе питания, уровня стресса и активности</p>
      </div>

      <!-- Выявленные риски дефицитов -->
      ${deficits.length ? `
        <div class="deficits-section">
          <div class="deficits-title">${getIcon('info')} Выявленные зоны внимания и риски дефицитов:</div>
          <ul class="deficits-list">
            ${deficits.map(d => `<li class="deficit-item">${getIcon('alert-triangle')} ${d}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Сетка рекомендованных БАДов -->
      <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 16px;">
        Рекомендованные БАДы и витамины (${uniqueRecs.length}):
      </h3>
      <div class="rec-grid">
        ${uniqueRecs.map(rec => {
          const item = SUPPLEMENTS_DATA.find(s => s.id === rec.id);
          if (!item) return '';
          return `
            <div class="rec-card" onclick="openModal('${item.id}')" style="cursor: pointer;">
              <div class="rec-card-top">
                <div class="rec-card-img">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="rec-card-info">
                  <h4>${item.name}</h4>
                  <p>${item.latin_name}</p>
                </div>
              </div>
              <p class="rec-card-reason">${rec.reason}</p>
              <div class="rec-timing-badge">${getIcon('clock')} ${rec.timing}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Расписание приема (Утро, День, Вечер) -->
      <div class="timeline-section">
        <h3 class="timeline-title">${getIcon('clock')} Умный график приёма (без конфликтов):</h3>
        <div class="timeline-grid">
          <div class="timeline-col">
            <div class="timeline-header">${getIcon('sun')} Утро (Завтрак)</div>
            <ul class="timeline-items">
              ${schedule.morning.length ? schedule.morning.map(s => `<li>• ${s}</li>`).join('') : '<li style="color:var(--text-dim);">Нет утренних добавок</li>'}
            </ul>
          </div>
          <div class="timeline-col">
            <div class="timeline-header">${getIcon('zap')} День (Обед / Тренировка)</div>
            <ul class="timeline-items">
              ${schedule.day.length ? schedule.day.map(s => `<li>• ${s}</li>`).join('') : '<li style="color:var(--text-dim);">Нет дневных добавок</li>'}
            </ul>
          </div>
          <div class="timeline-col">
            <div class="timeline-header">${getIcon('moon')} Вечер (Ужин / Сон)</div>
            <ul class="timeline-items">
              ${schedule.evening.length ? schedule.evening.map(s => `<li>• ${s}</li>`).join('') : '<li style="color:var(--text-dim);">Нет вечерних добавок</li>'}
            </ul>
          </div>
        </div>
      </div>

      <!-- Предостережения при особых состояниях -->
      ${warnings.length ? `
        <div class="warnings-card">
          <div class="warnings-title">${getIcon('alert-triangle')} Внимание: важные медицинские ограничения</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            ${warnings.map(w => `<li style="font-size: 0.88rem; color: #fca5a5;">${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Кнопки действий -->
      <div class="result-actions">
        <button class="btn-primary" onclick="copyPersonalPlan()">
          ${getIcon('copy')} Скопировать мой план
        </button>
        <button class="btn-secondary" onclick="restartQuiz()">
          ${getIcon('refresh')} Пройти заново
        </button>
        <button class="btn-secondary" onclick="switchToCatalogView()">
          ${getIcon('grid')} Открыть каталог БАДов
        </button>
      </div>
    </div>
  `;
}

function copyPersonalPlan() {
  const { uniqueRecs, schedule } = calculateRecommendations();
  let text = `Мой персональный план БАДов (НутриГайд)\n`;
  text += `Возраст: ${quizAnswers.age} лет, Пол: ${quizAnswers.gender === 'female' ? 'Женский' : 'Мужской'}\n\n`;
  text += `Рекомендованные БАДы:\n`;
  uniqueRecs.forEach(r => {
    const item = SUPPLEMENTS_DATA.find(s => s.id === r.id);
    text += `• ${item ? item.name : r.id}: ${r.timing}\n`;
  });
  text += `\nГрафик приёма:\n`;
  if (schedule.morning.length) text += `Утро: ${schedule.morning.join(', ')}\n`;
  if (schedule.day.length) text += `День: ${schedule.day.join(', ')}\n`;
  if (schedule.evening.length) text += `Вечер: ${schedule.evening.join(', ')}\n`;
  text += `\n*Не является лекарственным средством. Рекомендуется сдать анализы перед приемом.`;

  navigator.clipboard.writeText(text).then(() => {
    alert('План успешно скопирован в буфер обмена!');
  }).catch(() => {
    alert('Не удалось скопировать. Пожалуйста, сделайте скриншот.');
  });
}

function restartQuiz() {
  currentQuizStep = 1;
  renderQuizStep();
}

function switchToCatalogView() {
  document.getElementById('navCatalog').click();
}
