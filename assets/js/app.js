// --- Интерактивное ядро «НутриГайд» (Архитектура Genetic Shield) ---

// 1. Библиотека векторных SVG иконок (Строго 0 эмодзи)
const SVG_ICONS = {
  logo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m12 6 3 6-3 6-3-6z"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>`,
  clock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  pill: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
  shield: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  sun: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/></svg>`,
  moon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  zap: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  venus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 18h6"/></svg>`,
  mars: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="m21 3-6.75 6.75"/><circle cx="10" cy="14" r="5"/></svg>`,
  alert: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

function getIcon(name) {
  return SVG_ICONS[name] || SVG_ICONS.logo;
}

// 2. Тактильная отдача (Haptic Tap как в Genetic Shield)
function tactileTap() {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(22);
    } catch (e) {}
  }
}

// Всплывающее уведомление (Toast)
function showToast(text) {
  const toast = document.getElementById('cyberToast');
  const toastText = document.getElementById('cyberToastText');
  if (toast && toastText) {
    toastText.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }
}

// 3. Управление экранами (Screen Tabs)
const screens = ['home', 'catalog', 'quiz', 'plan', 'info'];
let currentTabIndex = 0;

function goToTab(toIdx) {
  if (toIdx < 0 || toIdx >= screens.length) return;
  tactileTap();
  currentTabIndex = toIdx;

  // Переключение активного экрана
  document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
  const sc = document.getElementById(`screen-${screens[toIdx]}`);
  if (sc) sc.classList.add('active');

  // Синхронизация десктопного навбара
  document.querySelectorAll('.desktop-nav-link').forEach((link, idx) => {
    if (idx === toIdx) link.classList.add('active');
    else link.classList.remove('active');
  });

  // Синхронизация мобильного плавающего дока
  document.querySelectorAll('.dock-btn').forEach((btn, idx) => {
    if (idx === toIdx) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // При переходе на каталог инициализируем карусель
  if (toIdx === 1) {
    setTimeout(initCarouselObserver, 80);
  }
}

// 4. КАРУСЕЛЬ КАТАЛОГА (HORIZONTAL CAROUSEL)
let activeCatalogCategory = 'all';
let catalogSearchQuery = '';
let currentVisibleSlideIdx = 1;

function filterCatalog(cat, elem) {
  tactileTap();
  activeCatalogCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  if (elem) elem.classList.add('active');
  renderCatalogCarousel();
}

function renderCatalogCarousel() {
  const track = document.getElementById('catalogCarouselTrack');
  const dotsBar = document.getElementById('carouselDotsBar');
  const totalCountElem = document.getElementById('carouselTotal');
  const activeIdxElem = document.getElementById('carouselActiveIdx');

  if (!track) return;

  const filtered = SUPPLEMENTS_DATA.filter(item => {
    const matchesCat = (activeCatalogCategory === 'all') || (item.categories && item.categories.includes(activeCatalogCategory));
    const q = catalogSearchQuery.toLowerCase();
    const matchesSearch = !q ||
      item.name.toLowerCase().includes(q) ||
      item.latin_name.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q) ||
      (item.benefits && item.benefits.some(b => b.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  if (totalCountElem) totalCountElem.textContent = filtered.length;
  if (activeIdxElem) activeIdxElem.textContent = filtered.length > 0 ? '1' : '0';

  if (filtered.length === 0) {
    track.innerHTML = `
      <div style="flex: 1; text-align: center; padding: 48px 16px; background: rgba(15,23,42,0.8); border: 1px solid var(--card-border); border-radius: var(--radius);">
        <p style="color: var(--text-sub); font-size: 14px;">Ничего не найдено по вашему запросу</p>
      </div>
    `;
    if (dotsBar) dotsBar.innerHTML = '';
    return;
  }

  // Рендерим слайды карусели
  track.innerHTML = filtered.map((item, idx) => `
    <div class="carousel-slide" data-idx="${idx + 1}" onclick="openModal('${item.id}')">
      <div class="slide-top">
        <span class="slide-badge">${item.category_name}</span>
        <span class="slide-icon">${getIcon(item.icon || 'shield')}</span>
      </div>
      <div class="slide-img-box">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="slide-title">${item.name}</div>
      <div class="slide-latin">${item.latin_name}</div>
      <div class="slide-desc">${item.tagline}</div>
      <div class="slide-footer">
        <span style="font-size: 11px; color: var(--text-dim);">${item.brands ? item.brands.length + ' препарата' : ''}</span>
        <button type="button" class="slide-btn">
          Подробнее ${getIcon('arrowRight')}
        </button>
      </div>
    </div>
  `).join('');

  // Рендерим точки-индикаторы
  if (dotsBar) {
    dotsBar.innerHTML = filtered.map((_, idx) => `
      <div class="carousel-dot ${idx === 0 ? 'active' : ''}" onclick="goToCarouselSlide(${idx})"></div>
    `).join('');
  }

  // Сбрасываем скролл в начало
  track.scrollTo({ left: 0, behavior: 'instant' });
  initCarouselObserver();
}

function scrollCarousel(direction) {
  tactileTap();
  const track = document.getElementById('catalogCarouselTrack');
  if (!track) return;
  const slide = track.querySelector('.carousel-slide');
  if (!slide) return;
  const slideWidth = slide.offsetWidth + 16;
  track.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
}

function goToCarouselSlide(index) {
  tactileTap();
  const track = document.getElementById('catalogCarouselTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  if (slides[index]) {
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }
}

// Отслеживание активного слайда при свайпе
function initCarouselObserver() {
  const track = document.getElementById('catalogCarouselTrack');
  if (!track) return;

  track.onscroll = () => {
    const slides = track.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    const trackCenter = track.scrollLeft + track.offsetWidth / 2;

    let closestIdx = 0;
    let closestDist = Infinity;

    slides.forEach((slide, idx) => {
      const slideCenter = slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(trackCenter - slideCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    const activeIdxElem = document.getElementById('carouselActiveIdx');
    if (activeIdxElem) activeIdxElem.textContent = closestIdx + 1;

    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      if (idx === closestIdx) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  };
}

// 5. МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ БАДА (С ФОТО-КАРУСЕЛЬЮ)
function openModal(id) {
  tactileTap();
  const item = SUPPLEMENTS_DATA.find(s => s.id === id);
  if (!item) return;

  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');

  const allImages = [item.image, ...(item.additional_images || [])];

  modalBody.innerHTML = `
    <!-- Фото-галерея БАДа -->
    <div class="modal-gallery-box">
      <div class="modal-hero-img-wrap">
        <img id="modalHeroImg" src="${item.image}" alt="${item.name}">
      </div>
      ${allImages.length > 1 ? `
        <div class="modal-thumbnails">
          ${allImages.map((img, idx) => `
            <div class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="switchModalPhoto('${img}', this)">
              <img src="${img}" alt="Фото ${idx + 1}">
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Заголовок и научное понятие -->
    <span class="slide-badge" style="margin-bottom: 8px;">${item.category_name}</span>
    <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 2px;">${item.name}</h2>
    <p style="font-size: 13px; color: var(--text-dim); font-style: italic; margin-bottom: 12px;">${item.latin_name}</p>
    <p style="font-size: 13.5px; color: var(--text-sub); line-height: 1.55; margin-bottom: 16px;">${item.concept}</p>

    <!-- Сетка параметров -->
    <div class="modal-grid-info">
      <div class="modal-info-card">
        <div class="modal-info-lbl">Формы и биодоступность</div>
        <div class="modal-info-txt">${item.forms}</div>
      </div>
      <div class="modal-info-card">
        <div class="modal-info-lbl">Правила приёма и дозировка</div>
        <div class="modal-info-txt">${item.dosage}</div>
      </div>
      <div class="modal-info-card">
        <div class="modal-info-lbl">КБЖУ и калорийность</div>
        <div class="modal-info-txt">${item.kbju}</div>
      </div>
      <div class="modal-info-card">
        <div class="modal-info-lbl">Условия хранения</div>
        <div class="modal-info-txt">${item.storage}</div>
      </div>
    </div>

    <!-- Биологические функции -->
    <div style="margin-top: 18px;">
      <div class="modal-info-lbl">Что делает в организме:</div>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
        ${item.benefits ? item.benefits.map(b => `
          <li style="display: flex; gap: 8px; font-size: 13px; color: var(--text-sub);">
            <span style="color: var(--accent); flex-shrink: 0;">${getIcon('check')}</span>
            <span>${b}</span>
          </li>
        `).join('') : ''}
      </ul>
    </div>

    <!-- Бренды и препараты из файла -->
    ${item.brands && item.brands.length ? `
      <div style="margin-top: 20px;">
        <div class="modal-info-lbl">Оригинальные препараты из базы:</div>
        <table class="brands-mini-table">
          <thead>
            <tr>
              <th>Бренд / Продукт</th>
              <th>Состав и действие</th>
            </tr>
          </thead>
          <tbody>
            ${item.brands.map(b => `
              <tr>
                <td style="width: 38%;">
                  <span class="brand-tag">${b.brand}</span>
                  <div style="font-weight: 700; color: #ffffff; margin-top: 4px;">${b.product}</div>
                </td>
                <td style="color: var(--text-sub);">${b.desc}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- Противопоказания -->
    ${item.contraindications ? `
      <div style="margin-top: 18px; padding: 14px; background: rgba(255, 82, 82, 0.08); border: 1px solid rgba(255, 82, 82, 0.25); border-radius: var(--radius-sm);">
        <div style="font-size: 11.5px; font-weight: 700; color: var(--coral); margin-bottom: 4px;">Предостережения:</div>
        <div style="font-size: 12.5px; color: var(--text-sub); line-height: 1.45;">${item.contraindications}</div>
      </div>
    ` : ''}
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function switchModalPhoto(src, thumbElem) {
  tactileTap();
  const hero = document.getElementById('modalHeroImg');
  if (hero) hero.src = src;
  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  if (thumbElem) thumbElem.classList.add('active');
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('.modal-close-btn')) return;
  tactileTap();
  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// 6. ПОШАГОВЫЙ ОПРОСНИК (QUIZ ENGINE)
let currentQuizStep = 1;
const userAnswers = {
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

function renderQuizStep() {
  const container = document.getElementById('quizStepContainer');
  const stepText = document.getElementById('quizStepText');
  const barFill = document.getElementById('quizBarFill');
  const backBtn = document.getElementById('quizBackBtn');
  const forwardBtn = document.getElementById('quizForwardBtn');
  const cardBox = document.getElementById('quizCardBox');
  const resContainer = document.getElementById('quizResultsContainer');

  if (!container) return;

  if (currentQuizStep > 10) {
    cardBox.style.display = 'none';
    resContainer.style.display = 'block';
    renderQuizResults();
    return;
  }

  cardBox.style.display = 'block';
  resContainer.style.display = 'none';

  const q = QUIZ_QUESTIONS[currentQuizStep - 1];

  if (stepText) stepText.textContent = `Вопрос ${currentQuizStep} из 10`;
  if (barFill) barFill.style.width = `${(currentQuizStep / 10) * 100}%`;

  if (backBtn) backBtn.disabled = (currentQuizStep === 1);
  if (forwardBtn) {
    const span = forwardBtn.querySelector('span');
    if (span) span.textContent = (currentQuizStep === 10) ? 'Показать результат' : 'Далее';
  }

  let html = `
    <h3 class="quest-q-title">${q.title}</h3>
    <p class="quest-q-subtitle">${q.subtitle}</p>
  `;

  if (q.type === 'demographics') {
    html += `
      <div class="demogr-gender-grid">
        <div class="quest-opt-item ${userAnswers.gender === 'female' ? 'selected' : ''}" onclick="setGender('female')">
          <div class="quest-opt-icon">${getIcon('venus')}</div>
          <div class="quest-opt-label">Женский</div>
        </div>
        <div class="quest-opt-item ${userAnswers.gender === 'male' ? 'selected' : ''}" onclick="setGender('male')">
          <div class="quest-opt-icon">${getIcon('mars')}</div>
          <div class="quest-opt-label">Мужской</div>
        </div>
      </div>

      <div class="demogr-age-box">
        <div class="demogr-age-meta">
          <span>Ваш возраст:</span>
          <span class="demogr-age-val" id="ageDisplay">${userAnswers.age} лет</span>
        </div>
        <input type="range" class="demogr-slider" min="16" max="85" value="${userAnswers.age}" oninput="setAge(this.value)">
      </div>
    `;
  } else if (q.type === 'single') {
    const key = getQuestionKey(q.id);
    html += `
      <div class="quest-options-list">
        ${q.options.map(opt => `
          <div class="quest-opt-item ${userAnswers[key] === opt.id ? 'selected' : ''}" onclick="setSingleOpt('${key}', '${opt.id}')">
            <div class="quest-opt-icon">${getIcon('check')}</div>
            <div class="quest-opt-content">
              <div class="quest-opt-label">${opt.label}</div>
              ${opt.desc ? `<div class="quest-opt-desc">${opt.desc}</div>` : ''}
            </div>
            <div class="quest-opt-check">${getIcon('check')}</div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'multi') {
    const key = (q.id === 2) ? 'goals' : 'cautions';
    const sel = userAnswers[key] || [];
    html += `
      <div class="quest-options-list">
        ${q.options.map(opt => {
          const isSelected = sel.includes(opt.id);
          return `
            <div class="quest-opt-item ${isSelected ? 'selected' : ''}" onclick="toggleMultiOpt('${key}', '${opt.id}')">
              <div class="quest-opt-icon">${getIcon('check')}</div>
              <div class="quest-opt-content">
                <div class="quest-opt-label">${opt.label}</div>
                ${opt.desc ? `<div class="quest-opt-desc">${opt.desc}</div>` : ''}
              </div>
              <div class="quest-opt-check">${getIcon('check')}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  container.innerHTML = html;
}

function getQuestionKey(id) {
  const map = { 3: 'diet_veg', 4: 'fish', 5: 'sun', 6: 'stress', 7: 'training', 8: 'skin', 9: 'gut' };
  return map[id] || 'unknown';
}

function setGender(val) {
  tactileTap();
  userAnswers.gender = val;
  renderQuizStep();
}

function setAge(val) {
  userAnswers.age = parseInt(val, 10);
  const disp = document.getElementById('ageDisplay');
  if (disp) disp.textContent = `${val} лет`;
}

function setSingleOpt(key, val) {
  tactileTap();
  userAnswers[key] = val;
  renderQuizStep();
}

function toggleMultiOpt(key, val) {
  tactileTap();
  if (!userAnswers[key]) userAnswers[key] = [];

  if (val === 'warn_none') {
    userAnswers[key] = ['warn_none'];
  } else {
    userAnswers[key] = userAnswers[key].filter(x => x !== 'warn_none');
    if (userAnswers[key].includes(val)) {
      userAnswers[key] = userAnswers[key].filter(x => x !== val);
      if (userAnswers[key].length === 0 && key === 'cautions') {
        userAnswers[key] = ['warn_none'];
      }
    } else {
      if (key === 'goals' && userAnswers[key].length >= 3) {
        userAnswers[key].shift();
      }
      userAnswers[key].push(val);
    }
  }
  renderQuizStep();
}

function handleQuizNext() {
  tactileTap();
  if (currentQuizStep <= 10) {
    currentQuizStep++;
    renderQuizStep();
  }
}

function handleQuizPrev() {
  tactileTap();
  if (currentQuizStep > 1) {
    currentQuizStep--;
    renderQuizStep();
  }
}

// 7. ЛОГИКА РЕКОМЕНДАЦИЙ (RECOMMENDATION ENGINE)
function calculateResults() {
  const recs = [];
  const deficits = [];
  const schedule = { morning: [], day: [], evening: [] };
  const warnings = [];

  // Анализ солнца
  if (userAnswers.sun === 'sun_0' || userAnswers.sun === 'sun_spf' || userAnswers.sun === 'sun_15_30') {
    deficits.push('Острый дефицит синтеза Витамина D3 из-за низкой инсоляции');
    recs.push({
      id: 'vitamin_d',
      reason: 'При недостатке солнца — для костной системы и иммунитета',
      timing: 'Утро (с жирным завтраком)',
      period: 'morning'
    });
  }

  // Стресс и сон
  if (userAnswers.stress === 'stress_high' || userAnswers.stress === 'stress_severe') {
    deficits.push('Повышенный уровень кортизола и истощение запасов магния');
    recs.push({
      id: 'magnesium',
      reason: 'Снижает тревожность, нормализует сон и мышечный тонус',
      timing: 'Вечер (с ужином)',
      period: 'evening'
    });
    recs.push({
      id: 'gaba',
      reason: 'Тормозящий медиатор для снятия ментального перевозбуждения',
      timing: 'Перед сном за 40 мин',
      period: 'evening'
    });
    if (userAnswers.stress === 'stress_severe') {
      recs.push({
        id: 'melatonin',
        reason: 'Быстрое восстановление циркадных ритмов и засыпания',
        timing: 'Перед сном в темноте',
        period: 'evening'
      });
    }
  }

  // Овощи и кожа
  if (userAnswers.diet_veg === 'veg_0' || userAnswers.diet_veg === 'veg_1_2') {
    deficits.push('Недостаток натуральных антиоксидантов из свежих овощей');
    recs.push({
      id: 'vitamin_c',
      reason: 'Антиоксидантная защита и стимуляция синтеза коллагена',
      timing: 'Утро (после завтрака)',
      period: 'morning'
    });
  }

  if (userAnswers.skin === 'skin_mild' || userAnswers.skin === 'skin_severe') {
    deficits.push('Снижение плотности дермы, ломкость волос и ногтей');
    recs.push({
      id: 'collagen',
      reason: 'Пептиды для упругости кожи и здоровья связок',
      timing: 'Утро натощак за 30 мин до еды',
      period: 'morning'
    });
    recs.push({
      id: 'zinc',
      reason: 'Нормализация работы сальных желез и чистота кожи',
      timing: 'День (во время обеда)',
      period: 'day'
    });
  }

  // Рыба и спорт
  if (userAnswers.fish === 'fish_0' || userAnswers.fish === 'fish_unsure' || userAnswers.fish === 'fish_1_2') {
    deficits.push('Нехватка полиненасыщенных жирных кислот Омега-3');
    recs.push({
      id: 'omega',
      reason: 'Для защиты сосудов, эластичности кожи и питания мозга',
      timing: 'Утро или Обед (с едой)',
      period: 'morning'
    });
  }

  if (userAnswers.training === 'train_3_4' || userAnswers.training === 'train_pro') {
    deficits.push('Высокий мышечный катаболизм и форсированный расход АТФ');
    recs.push({
      id: 'bcaa',
      reason: 'Аминокислоты для защиты мышц и быстрого восстановления',
      timing: 'Перед или во время тренировки',
      period: 'day'
    });
    recs.push({
      id: 'creatine',
      reason: 'Мгновенный ресинтез АТФ для взрывной мощности',
      timing: 'После тренировки',
      period: 'day'
    });
  }

  // ЖКТ и антибиотики
  if (userAnswers.gut !== 'gut_ok') {
    deficits.push('Нарушение баланса микробиоты ЖКТ и всасывания нутриентов');
    recs.push({
      id: 'chlorophyll',
      reason: 'Мягкий утренний детокс ЖКТ и поддержка слизистых',
      timing: 'Утро со стаканом тёплой воды',
      period: 'morning'
    });
  }

  // Коррекция пола и возраста
  if (userAnswers.gender === 'female' && (userAnswers.goals.includes('energy') || userAnswers.skin !== 'skin_ok')) {
    recs.push({
      id: 'iron',
      reason: 'Восполнение скрытого дефицита железа и энергии',
      timing: 'Утро (отдельно от кофе, чая и молочных продуктов)',
      period: 'morning'
    });
  }

  if (userAnswers.age >= 35 || userAnswers.goals.includes('energy')) {
    recs.push({
      id: 'coq10',
      reason: 'Поддержка митохондрий, тонуса миокарда и антиэйдж',
      timing: 'Утро или Обед (с едой)',
      period: 'morning'
    });
  }

  // Предостережения
  const cautions = userAnswers.cautions || [];
  if (cautions.includes('warn_pregnancy')) {
    warnings.push('Беременность / Планирование: избегайте высоких доз готового Витамина А. Согласуйте добавки с акушером-гинекологом.');
  }
  if (cautions.includes('warn_anticoagulants')) {
    warnings.push('Прием антикоагулянтов: Омега-3 и Коэнзим Q10 в высоких дозах влияют на свертываемость. Принимайте под контролем врача.');
  }
  if (cautions.includes('warn_allergy')) {
    warnings.push('Аллергия на рыбий жир: используйте растительную Омегу-3 (из микроводорослей) либо исключите добавку.');
  }

  // Дедупликация
  const uniqueRecs = [];
  const seen = new Set();
  recs.forEach(r => {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      uniqueRecs.push(r);
    }
  });

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
  const container = document.getElementById('quizResultsContainer');
  const { uniqueRecs, deficits, schedule, warnings } = calculateResults();

  const genderStr = userAnswers.gender === 'female' ? 'Женщина' : 'Мужчина';

  container.innerHTML = `
    <div class="bento-card" style="padding: 28px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span class="slide-badge" style="color: var(--accent); border-color: rgba(0,242,254,0.3);">Скрининг завершён</span>
        <h2 style="font-size: 22px; font-weight: 800; margin-top: 8px;">Ваш персональный план БАДов</h2>
        <p style="font-size: 13px; color: var(--text-sub); margin-top: 4px;">${genderStr}, ${userAnswers.age} лет • На основе питания, сна и физической активности</p>
      </div>

      ${deficits.length ? `
        <div style="padding: 14px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: var(--radius-sm); margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--amber); margin-bottom: 6px;">Выявленные зоны внимания:</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px;">
            ${deficits.map(d => `<li style="font-size: 12.5px; color: #ffffff;">• ${d}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Рекомендованные препараты (${uniqueRecs.length}):</div>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
        ${uniqueRecs.map(r => {
          const item = SUPPLEMENTS_DATA.find(s => s.id === r.id);
          if (!item) return '';
          return `
            <div class="quest-opt-item" onclick="openModal('${item.id}')">
              <div class="quest-opt-icon">
                <img src="${item.image}" alt="${item.name}" style="width: 24px; height: 24px; object-fit: contain;">
              </div>
              <div class="quest-opt-content">
                <div class="quest-opt-label">${item.name}</div>
                <div class="quest-opt-desc">${r.reason}</div>
              </div>
              <div style="font-size: 11px; font-weight: 700; color: var(--accent);">${r.timing.split('(')[0]}</div>
            </div>
          `;
        }).join('')}
      </div>

      ${warnings.length ? `
        <div style="padding: 14px; background: rgba(255, 82, 82, 0.08); border: 1px solid rgba(255, 82, 82, 0.25); border-radius: var(--radius-sm); margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--coral); margin-bottom: 4px;">Внимание: медицинские ограничения:</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px;">
            ${warnings.map(w => `<li style="font-size: 12px; color: #fca5a5;">${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button type="button" class="btn-cyber-next" onclick="copyPlanText()">
          Скопировать план
        </button>
        <button type="button" class="btn-cyber-prev" onclick="restartQuiz()">
          Пройти заново
        </button>
        <button type="button" class="btn-cyber-prev" onclick="goToTab(1)">
          Открыть в карусели
        </button>
      </div>
    </div>
  `;
}

function copyPlanText() {
  tactileTap();
  const { uniqueRecs, schedule } = calculateResults();
  let text = `Персональный план БАДов (НутриГайд)\n`;
  text += `Возраст: ${userAnswers.age} лет, Пол: ${userAnswers.gender === 'female' ? 'Женский' : 'Мужской'}\n\n`;
  text += `Рекомендованные БАДы:\n`;
  uniqueRecs.forEach(r => {
    const item = SUPPLEMENTS_DATA.find(s => s.id === r.id);
    text += `• ${item ? item.name : r.id}: ${r.timing}\n`;
  });
  text += `\nГрафик приёма:\n`;
  if (schedule.morning.length) text += `Утро: ${schedule.morning.join(', ')}\n`;
  if (schedule.day.length) text += `День: ${schedule.day.join(', ')}\n`;
  if (schedule.evening.length) text += `Вечер: ${schedule.evening.join(', ')}\n`;
  text += `\n*Не является лекарственным средством. Перед применением рекомендуется сдать анализы.`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('План скопирован в буфер обмена');
  }).catch(() => {
    showToast('Сделайте скриншот экрана');
  });
}

function restartQuiz() {
  tactileTap();
  currentQuizStep = 1;
  renderQuizStep();
}

// 8. Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  renderCatalogCarousel();
  renderQuizStep();

  const searchInput = document.getElementById('catalogSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      catalogSearchQuery = e.target.value.trim();
      renderCatalogCarousel();
    });
  }

  // Закрытие модалки по Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
