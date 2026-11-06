// --- Интерактивное ядро «Код Добавки» (Версия 3.1) ---

// 1. Библиотека векторных SVG иконок (Строго 0 эмодзи)
const SVG_ICONS = {
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>`,
  shield: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  venus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 18h6"/></svg>`,
  mars: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="m21 3-6.75 6.75"/><circle cx="10" cy="14" r="5"/></svg>`
};

function getIcon(name) {
  return SVG_ICONS[name] || SVG_ICONS.shield;
}

// Тактильный отклик
function tactileTap() {
  if (navigator.vibrate) {
    try { navigator.vibrate(22); } catch (e) {}
  }
}

// Всплывающее уведомление
function showToast(text) {
  const toast = document.getElementById('cyberToast');
  const toastText = document.getElementById('cyberToastText');
  if (toast && toastText) {
    toastText.textContent = text;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2400);
  }
}

// 2. Управление экранами и вкладками
let currentTabIndex = 0;

function switchTab(idx) {
  tactileTap();
  currentTabIndex = idx;

  document.querySelectorAll('.screen-panel').forEach((panel, i) => {
    if (i === idx) panel.classList.add('active');
    else panel.classList.remove('active');
  });

  document.querySelectorAll('.dock-btn').forEach((btn, i) => {
    if (i === idx) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (idx === 1) {
    setTimeout(initCarouselObserver, 80);
  }
}

// 3. КАРУСЕЛЬ КАТАЛОГА (HORIZONTAL CAROUSEL)
let activeCatalogCat = 'all';
let catalogSearchText = '';

function filterCatalog(cat, elem) {
  tactileTap();
  activeCatalogCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (elem) elem.classList.add('active');
  renderCarouselCards();
}

function renderCarouselCards() {
  const track = document.getElementById('carouselCardsTrack');
  const dotsList = document.getElementById('carouselDotsList');
  const totalElem = document.getElementById('carouselTotal');
  const activeIdxElem = document.getElementById('carouselActiveIdx');

  if (!track) return;

  const filtered = SUPPLEMENTS_DATA.filter(item => {
    const matchesCat = (activeCatalogCat === 'all') || (item.categories && item.categories.includes(activeCatalogCat));
    const q = catalogSearchText.toLowerCase();
    const matchesSearch = !q ||
      item.name.toLowerCase().includes(q) ||
      item.latin_name.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q) ||
      (item.benefits && item.benefits.some(b => b.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  if (totalElem) totalElem.textContent = filtered.length;
  if (activeIdxElem) activeIdxElem.textContent = filtered.length > 0 ? '1' : '0';

  if (filtered.length === 0) {
    track.innerHTML = `
      <div style="flex: 1; text-align: center; padding: 48px 16px; background: #ffffff; border: 1px solid var(--card-border); border-radius: var(--radius-lg);">
        <p style="color: var(--text-sub); font-size: 14px;">Ничего не найдено по вашему запросу</p>
      </div>
    `;
    if (dotsList) dotsList.innerHTML = '';
    return;
  }

  track.innerHTML = filtered.map((item, idx) => `
    <div class="carousel-card-slide" data-idx="${idx + 1}" onclick="openModal('${item.id}')">
      <div class="card-top-row">
        <span class="cat-badge">${item.category_name}</span>
        <span style="color: var(--primary);">${getIcon(item.icon || 'shield')}</span>
      </div>
      <div class="card-img-container">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="card-name">${item.name}</div>
      <div class="card-latin">${item.latin_name}</div>
      <div class="card-tagline">${item.tagline}</div>
      <div class="card-bottom-row">
        <span style="font-size: 11.5px; color: var(--text-dim); font-weight: 700;">${item.brands ? item.brands.length + ' препарата' : ''}</span>
        <button type="button" class="card-more-btn">
          Подробнее ${getIcon('arrowRight')}
        </button>
      </div>
    </div>
  `).join('');

  if (dotsList) {
    dotsList.innerHTML = filtered.map((_, idx) => `
      <button type="button" class="carousel-dot-btn ${idx === 0 ? 'active' : ''}" onclick="goToCarouselSlide(${idx})" aria-label="Слайд ${idx + 1}"></button>
    `).join('');
  }

  track.scrollTo({ left: 0, behavior: 'instant' });
  initCarouselObserver();
}

function scrollCarousel(direction) {
  tactileTap();
  const track = document.getElementById('carouselCardsTrack');
  if (!track) return;
  const slide = track.querySelector('.carousel-card-slide');
  if (!slide) return;
  const slideWidth = slide.offsetWidth + 16;
  track.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
}

function goToCarouselSlide(index) {
  tactileTap();
  const track = document.getElementById('carouselCardsTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-card-slide');
  if (slides[index]) {
    track.scrollTo({ left: slides[index].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }
}

function initCarouselObserver() {
  const track = document.getElementById('carouselCardsTrack');
  if (!track) return;

  track.onscroll = () => {
    const slides = track.querySelectorAll('.carousel-card-slide');
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

    const dots = document.querySelectorAll('.carousel-dot-btn');
    dots.forEach((dot, idx) => {
      if (idx === closestIdx) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  };
}

// 4. МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ (100% БЕЗУСЛОВНОЕ ЗАКРЫТИЕ ПО КРЕСТИКУ)
function openModal(id) {
  tactileTap();
  const item = SUPPLEMENTS_DATA.find(s => s.id === id);
  if (!item) return;

  const modalLayer = document.getElementById('modalBackdropLayer');
  const target = document.getElementById('modalContentTarget');

  const allImages = [item.image, ...(item.additional_images || [])];

  target.innerHTML = `
    <!-- Фото-галерея -->
    <div class="modal-img-stage">
      <img id="modalHeroImg" src="${item.image}" alt="${item.name}">
    </div>
    ${allImages.length > 1 ? `
      <div class="modal-thumbs-track">
        ${allImages.map((img, idx) => `
          <button type="button" class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="switchModalPhoto('${img}', this)">
            <img src="${img}" alt="Фото ${idx + 1}">
          </button>
        `).join('')}
      </div>
    ` : ''}

    <!-- Название и понятие -->
    <span class="cat-badge" style="margin-bottom: 8px;">${item.category_name}</span>
    <h2 style="font-size: 22px; font-weight: 800; color: var(--navy); margin-bottom: 2px;">${item.name}</h2>
    <p style="font-size: 13px; color: var(--text-dim); font-style: italic; margin-bottom: 12px;">${item.latin_name}</p>
    <p style="font-size: 13.5px; color: var(--text-main); line-height: 1.55; margin-bottom: 16px;">${item.concept}</p>

    <!-- Свойства -->
    <div class="modal-props-grid">
      <div class="modal-prop-item">
        <div class="modal-prop-title">Формы и биодоступность</div>
        <div class="modal-prop-val">${item.forms}</div>
      </div>
      <div class="modal-prop-item">
        <div class="modal-prop-title">Правила приёма и дозировка</div>
        <div class="modal-prop-val">${item.dosage}</div>
      </div>
      <div class="modal-prop-item">
        <div class="modal-prop-title">КБЖУ и калорийность</div>
        <div class="modal-prop-val">${item.kbju}</div>
      </div>
      <div class="modal-prop-item">
        <div class="modal-prop-title">Условия хранения</div>
        <div class="modal-prop-val">${item.storage}</div>
      </div>
    </div>

    <!-- Биологические функции -->
    <div style="margin-top: 18px;">
      <div class="modal-prop-title" style="margin-bottom: 6px;">Что делает в организме:</div>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
        ${item.benefits ? item.benefits.map(b => `
          <li style="display: flex; gap: 8px; font-size: 13px; color: var(--text-sub);">
            <span style="color: var(--primary); flex-shrink: 0;">${getIcon('check')}</span>
            <span>${b}</span>
          </li>
        `).join('') : ''}
      </ul>
    </div>

    <!-- Препараты из файла -->
    ${item.brands && item.brands.length ? `
      <div style="margin-top: 20px;">
        <div class="modal-prop-title" style="margin-bottom: 6px;">Оригинальные препараты из файла:</div>
        <table class="brands-table-view">
          <thead>
            <tr>
              <th>Бренд / Продукт</th>
              <th>Состав и особенности</th>
            </tr>
          </thead>
          <tbody>
            ${item.brands.map(b => `
              <tr>
                <td style="width: 38%;">
                  <span class="brand-pill">${b.brand}</span>
                  <div style="font-weight: 700; color: var(--navy); margin-top: 4px;">${b.product}</div>
                </td>
                <td style="color: var(--text-sub);">${b.desc}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- Предостережения -->
    ${item.contraindications ? `
      <div style="margin-top: 18px; padding: 14px; background: rgba(225, 29, 72, 0.06); border: 1px solid rgba(225, 29, 72, 0.2); border-radius: var(--radius-md);">
        <div style="font-size: 11.5px; font-weight: 800; color: var(--accent-rose); margin-bottom: 4px;">Предостережения:</div>
        <div style="font-size: 12.5px; color: var(--text-main); line-height: 1.45;">${item.contraindications}</div>
      </div>
    ` : ''}

    <!-- Дополнительная кнопка закрытия снизу -->
    <div style="margin-top: 24px; text-align: center;">
      <button type="button" class="btn-quest-prev" onclick="forceCloseModal()" style="padding: 11px 32px; background: #edf5ef;">
        Закрыть карточку
      </button>
    </div>
  `;

  modalLayer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function switchModalPhoto(src, thumbBtn) {
  tactileTap();
  const hero = document.getElementById('modalHeroImg');
  if (hero) hero.src = src;
  document.querySelectorAll('.modal-thumb-btn').forEach(t => t.classList.remove('active'));
  if (thumbBtn) thumbBtn.classList.add('active');
}

// ГАРАНТИРОВАННОЕ ЗАКРЫТИЕ МОДАЛКИ
function forceCloseModal() {
  tactileTap();
  const modalLayer = document.getElementById('modalBackdropLayer');
  if (modalLayer) {
    modalLayer.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function handleBackdropClick(e) {
  if (e && e.target && e.target.id === 'modalBackdropLayer') {
    forceCloseModal();
  }
}

// 5. ОПРОСНИК (QUIZ ENGINE)
let currentStepNumber = 1;
const surveyAnswers = {
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
  const fillBar = document.getElementById('quizFillBar');
  const backBtn = document.getElementById('quizBackBtn');
  const forwardBtn = document.getElementById('quizForwardBtn');
  const cardBox = document.getElementById('quizCardBox');
  const resContainer = document.getElementById('quizResultsContainer');

  if (!container) return;

  if (currentStepNumber > 10) {
    cardBox.style.display = 'none';
    resContainer.style.display = 'block';
    renderQuizResults();
    return;
  }

  cardBox.style.display = 'block';
  resContainer.style.display = 'none';

  const q = QUIZ_QUESTIONS[currentStepNumber - 1];

  if (stepText) stepText.textContent = `Вопрос ${currentStepNumber} из 10`;
  if (fillBar) fillBar.style.width = `${(currentStepNumber / 10) * 100}%`;

  if (backBtn) backBtn.disabled = (currentStepNumber === 1);
  if (forwardBtn) {
    const span = forwardBtn.querySelector('span');
    if (span) span.textContent = (currentStepNumber === 10) ? 'Показать результат' : 'Далее';
  }

  let html = `
    <h3 class="quest-q-title">${q.title}</h3>
    <p class="quest-q-sub">${q.subtitle}</p>
  `;

  if (q.type === 'demographics') {
    html += `
      <div class="gender-row-grid">
        <div class="quest-choice-card ${surveyAnswers.gender === 'female' ? 'selected' : ''}" onclick="setGender('female', this)">
          <div class="quest-choice-icon">${getIcon('venus')}</div>
          <div class="quest-choice-label">Женский</div>
        </div>
        <div class="quest-choice-card ${surveyAnswers.gender === 'male' ? 'selected' : ''}" onclick="setGender('male', this)">
          <div class="quest-choice-icon">${getIcon('mars')}</div>
          <div class="quest-choice-label">Мужской</div>
        </div>
      </div>

      <div class="age-slider-card">
        <div class="age-meta-row">
          <span>Ваш возраст:</span>
          <span class="age-value-num" id="ageValElem">${surveyAnswers.age} лет</span>
        </div>
        <input type="range" class="age-range-input" min="16" max="85" value="${surveyAnswers.age}" oninput="setAge(this.value)">
      </div>
    `;
  } else if (q.type === 'single') {
    const key = getQuestionKey(q.id);
    html += `
      <div class="quest-opt-grid">
        ${q.options.map(opt => `
          <div class="quest-choice-card ${surveyAnswers[key] === opt.id ? 'selected' : ''}" onclick="setSingleOpt('${key}', '${opt.id}', this)">
            <div class="quest-choice-icon">${getIcon('check')}</div>
            <div class="quest-choice-body">
              <div class="quest-choice-label">${opt.label}</div>
              ${opt.desc ? `<div class="quest-choice-desc">${opt.desc}</div>` : ''}
            </div>
            <div class="quest-choice-radio">${getIcon('check')}</div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'multi') {
    const key = (q.id === 2) ? 'goals' : 'cautions';
    const sel = surveyAnswers[key] || [];
    html += `
      <div class="quest-opt-grid">
        ${q.options.map(opt => {
          const isSelected = sel.includes(opt.id);
          return `
            <div class="quest-choice-card ${isSelected ? 'selected' : ''}" onclick="toggleMultiOpt('${key}', '${opt.id}')">
              <div class="quest-choice-icon">${getIcon('check')}</div>
              <div class="quest-choice-body">
                <div class="quest-choice-label">${opt.label}</div>
                ${opt.desc ? `<div class="quest-choice-desc">${opt.desc}</div>` : ''}
              </div>
              <div class="quest-choice-radio">${getIcon('check')}</div>
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

function setGender(val, el) {
  tactileTap();
  surveyAnswers.gender = val;
  if (el) {
    const parent = el.closest('.gender-row-grid');
    if (parent) {
      parent.querySelectorAll('.quest-choice-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }
  } else {
    renderQuizStep();
  }
}

function setAge(val) {
  surveyAnswers.age = parseInt(val, 10);
  const disp = document.getElementById('ageValElem');
  if (disp) disp.textContent = `${val} лет`;
}

function setSingleOpt(key, val, el) {
  tactileTap();
  surveyAnswers[key] = val;
  if (el) {
    const parent = el.closest('.quest-opt-grid');
    if (parent) {
      parent.querySelectorAll('.quest-choice-card').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    }
  } else {
    renderQuizStep();
  }
}

function toggleMultiOpt(key, val) {
  tactileTap();
  if (!surveyAnswers[key]) surveyAnswers[key] = [];

  if (val === 'warn_none') {
    surveyAnswers[key] = ['warn_none'];
  } else {
    surveyAnswers[key] = surveyAnswers[key].filter(x => x !== 'warn_none');
    if (surveyAnswers[key].includes(val)) {
      surveyAnswers[key] = surveyAnswers[key].filter(x => x !== val);
      if (surveyAnswers[key].length === 0 && key === 'cautions') {
        surveyAnswers[key] = ['warn_none'];
      }
    } else {
      if (key === 'goals' && surveyAnswers[key].length >= 3) {
        surveyAnswers[key].shift();
      }
      surveyAnswers[key].push(val);
    }
  }
  renderQuizStep();
}

function handleQuizNext() {
  tactileTap();
  if (currentStepNumber <= 10) {
    currentStepNumber++;
    renderQuizStep();
    const box = document.getElementById('quizCardBox');
    if (box) {
      const rect = box.getBoundingClientRect();
      if (rect.top < 60) {
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

function handleQuizPrev() {
  tactileTap();
  if (currentStepNumber > 1) {
    currentStepNumber--;
    renderQuizStep();
    const box = document.getElementById('quizCardBox');
    if (box) {
      const rect = box.getBoundingClientRect();
      if (rect.top < 60) {
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

// 6. ЛОГИКА РЕКОМЕНДАЦИЙ
function calculateRecommendations() {
  const recs = [];
  const deficits = [];
  const schedule = { morning: [], day: [], evening: [] };
  const warnings = [];

  if (surveyAnswers.sun === 'sun_0' || surveyAnswers.sun === 'sun_spf' || surveyAnswers.sun === 'sun_15_30') {
    deficits.push('Острый дефицит синтеза Витамина D3 из-за низкой инсоляции');
    recs.push({
      id: 'vitamin_d',
      reason: 'При недостатке солнца — для костной системы и иммунитета',
      timing: 'Утро (с жирным завтраком)',
      period: 'morning'
    });
  }

  if (surveyAnswers.stress === 'stress_high' || surveyAnswers.stress === 'stress_severe') {
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
    if (surveyAnswers.stress === 'stress_severe') {
      recs.push({
        id: 'melatonin',
        reason: 'Быстрое восстановление циркадных ритмов и засыпания',
        timing: 'Перед сном в темноте',
        period: 'evening'
      });
    }
  }

  if (surveyAnswers.diet_veg === 'veg_0' || surveyAnswers.diet_veg === 'veg_1_2') {
    deficits.push('Недостаток натуральных антиоксидантов из свежих овощей');
    recs.push({
      id: 'vitamin_c',
      reason: 'Антиоксидантная защита и стимуляция синтеза коллагена',
      timing: 'Утро (после завтрака)',
      period: 'morning'
    });
  }

  if (surveyAnswers.skin === 'skin_mild' || surveyAnswers.skin === 'skin_severe') {
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

  if (surveyAnswers.fish === 'fish_0' || surveyAnswers.fish === 'fish_unsure' || surveyAnswers.fish === 'fish_1_2') {
    deficits.push('Нехватка полиненасыщенных жирных кислот Омега-3');
    recs.push({
      id: 'omega',
      reason: 'Для защиты сосудов, эластичности кожи и питания мозга',
      timing: 'Утро или Обед (с едой)',
      period: 'morning'
    });
  }

  if (surveyAnswers.training === 'train_3_4' || surveyAnswers.training === 'train_pro') {
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

  if (surveyAnswers.gut !== 'gut_ok') {
    deficits.push('Нарушение баланса микробиоты ЖКТ и всасывания нутриентов');
    recs.push({
      id: 'chlorophyll',
      reason: 'Мягкий утренний детокс ЖКТ и поддержка слизистых',
      timing: 'Утро со стаканом тёплой воды',
      period: 'morning'
    });
  }

  if (surveyAnswers.gender === 'female' && (surveyAnswers.goals.includes('energy') || surveyAnswers.skin !== 'skin_ok')) {
    recs.push({
      id: 'iron',
      reason: 'Восполнение скрытого дефицита железа и энергии',
      timing: 'Утро (отдельно от кофе, чая и молочных продуктов)',
      period: 'morning'
    });
  }

  if (surveyAnswers.age >= 35 || surveyAnswers.goals.includes('energy')) {
    recs.push({
      id: 'coq10',
      reason: 'Поддержка митохондрий, тонуса миокарда и антиэйдж',
      timing: 'Утро или Обед (с едой)',
      period: 'morning'
    });
  }

  const cautions = surveyAnswers.cautions || [];
  if (cautions.includes('warn_pregnancy')) {
    warnings.push('Беременность / Планирование: избегайте высоких доз готового Витамина А. Согласуйте добавки с врачом.');
  }
  if (cautions.includes('warn_anticoagulants')) {
    warnings.push('Прием антикоагулянтов: Омега-3 и Коэнзим Q10 в высоких дозах влияют на свертываемость. Принимайте под контролем врача.');
  }
  if (cautions.includes('warn_allergy')) {
    warnings.push('Аллергия на рыбий жир: используйте растительную Омегу-3 (из водорослей) либо исключите добавку.');
  }

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
  const { uniqueRecs, deficits, schedule, warnings } = calculateRecommendations();

  const genderStr = surveyAnswers.gender === 'female' ? 'Женщина' : 'Мужчина';

  container.innerHTML = `
    <div class="bento-card" style="padding: 28px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span class="cat-badge">Скрининг завершён</span>
        <h2 style="font-size: 22px; font-weight: 800; color: var(--navy); margin-top: 8px;">Ваш персональный план БАДов</h2>
        <p style="font-size: 13px; color: var(--text-sub); margin-top: 4px;">${genderStr}, ${surveyAnswers.age} лет • На основе питания, сна и физической активности</p>
      </div>

      ${deficits.length ? `
        <div style="padding: 14px; background: rgba(217, 119, 6, 0.08); border: 1px solid rgba(217, 119, 6, 0.25); border-radius: var(--radius-md); margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: 800; color: var(--accent-amber); margin-bottom: 6px;">Выявленные зоны внимания:</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px;">
            ${deficits.map(d => `<li style="font-size: 12.5px; color: var(--text-main);">• ${d}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="font-size: 14px; font-weight: 800; color: var(--navy); margin-bottom: 12px;">Рекомендованные препараты (${uniqueRecs.length}):</div>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
        ${uniqueRecs.map(r => {
          const item = SUPPLEMENTS_DATA.find(s => s.id === r.id);
          if (!item) return '';
          return `
            <div class="quest-choice-card" onclick="openModal('${item.id}')">
              <div class="quest-choice-icon">
                <img src="${item.image}" alt="${item.name}" style="width: 26px; height: 26px; object-fit: contain;">
              </div>
              <div class="quest-choice-body" style="min-width: 0;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px;">
                  <div class="quest-choice-label" style="white-space: normal; word-break: normal;">${item.name}</div>
                  <div class="timing-badge">${r.timing.split('(')[0].trim()}</div>
                </div>
                <div class="quest-choice-desc" style="white-space: normal; word-break: normal; line-height: 1.4;">${r.reason}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${warnings.length ? `
        <div style="padding: 14px; background: rgba(225, 29, 72, 0.06); border: 1px solid rgba(225, 29, 72, 0.2); border-radius: var(--radius-md); margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: 800; color: var(--accent-rose); margin-bottom: 4px;">Внимание: медицинские ограничения:</div>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 4px;">
            ${warnings.map(w => `<li style="font-size: 12px; color: var(--accent-rose);">• ${w}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button type="button" class="btn-quest-next" onclick="copyPlanText()">
          Скопировать план
        </button>
        <button type="button" class="btn-quest-prev" onclick="restartQuiz()">
          Пройти заново
        </button>
        <button type="button" class="btn-quest-prev" onclick="switchTab(1)">
          Открыть в карусели
        </button>
      </div>
    </div>
  `;
}

function copyPlanText() {
  tactileTap();
  const { uniqueRecs, schedule } = calculateRecommendations();
  let text = `Персональный план БАДов (Код Добавки)\n`;
  text += `Возраст: ${surveyAnswers.age} лет, Пол: ${surveyAnswers.gender === 'female' ? 'Женский' : 'Мужской'}\n\n`;
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
  currentStepNumber = 1;
  renderQuizStep();
}

// 7. ИНТРО-ЗАСТАВКА (PREMIUM BIO-CODE SPLASH)
let introSplashActive = true;

function runIntroAnimation() {
  const overlay = document.getElementById('introSplashOverlay');
  const fill = document.getElementById('introFillBar');
  const status = document.getElementById('introStatusText');
  const percent = document.getElementById('introPercentText');

  if (!overlay) return;

  const steps = [
    { pct: 28, text: 'Синтез базы нутрицевтиков...' },
    { pct: 58, text: 'Калибровка биодоступности...' },
    { pct: 88, text: '17 формул чистоты готово...' },
    { pct: 100, text: 'Баланс установлен' }
  ];

  let currentIdx = 0;
  const interval = setInterval(() => {
    if (!introSplashActive) {
      clearInterval(interval);
      return;
    }

    if (currentIdx < steps.length) {
      const s = steps[currentIdx];
      if (fill) fill.style.width = `${s.pct}%`;
      if (status) status.textContent = s.text;
      if (percent) percent.textContent = `${s.pct}%`;
      currentIdx++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        dismissIntroSplash();
      }, 400);
    }
  }, 420);
}

function dismissIntroSplash() {
  tactileTap();
  introSplashActive = false;
  const overlay = document.getElementById('introSplashOverlay');
  if (overlay) {
    overlay.classList.add('dismissed');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 500);
  }
}

// 8. Инициализация
document.addEventListener('DOMContentLoaded', () => {
  renderCarouselCards();
  renderQuizStep();
  runIntroAnimation();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      forceCloseModal();
      dismissIntroSplash();
    }
  });
});
