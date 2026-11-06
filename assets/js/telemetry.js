/**
 * КОНТУР-ТЕЛЕМЕТРИЯ v5.3 // ЧИСТЫЙ ТЕРМИНАЛЬНЫЙ РЕЖИМ
 * Полный аппаратно-сетевой аудит узла доступа с анимацией печати и прогресс-баром.
 */

// 1. Звуковой синтезатор на Web Audio API
class CyberAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  click() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 + Math.random() * 400, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.015);
    } catch (e) {}
  }

  beep(freq = 880, dur = 0.04) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch (e) {}
  }
}

const audio = new CyberAudio();
window.addEventListener('click', () => audio.init(), { once: true });
window.addEventListener('touchstart', () => audio.init(), { once: true });

// Глобальное досье
const Dossier = {
  session: {
    id: 'INC-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString().slice(-4),
    timestamp: new Date().toISOString()
  },
  network: {},
  hardware: {},
  display: {},
  fingerprint: {}
};

// Хэш
function hashString(str) {
  let h1 = 5381, h2 = 52711;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = (h1 * 33) ^ ch;
    h2 = (h2 * 33) ^ ch;
  }
  return (Math.abs(h1).toString(16) + Math.abs(h2).toString(16)).toUpperCase();
}

// 2. Детекторы аппаратуры
function getGPU() {
  const res = { renderer: 'Скрыто песочницей', vendor: 'Не определен' };
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        res.renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'Драйвер скрыт';
        res.vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || 'Вендор скрыт';
      }
    }
  } catch (e) {}
  return res;
}

function getWebRTCLocalIP() {
  return new Promise((resolve) => {
    try {
      const RTCPC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      if (!RTCPC) return resolve('Не поддерживается WebRTC');
      const pc = new RTCPC({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      let done = false;
      pc.createDataChannel('');
      pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => resolve('Заблокировано'));
      const timer = setTimeout(() => {
        if (!done) { pc.close(); resolve('Скрыто рандомизатором'); }
      }, 2000);
      pc.onicecandidate = (e) => {
        if (e && e.candidate && e.candidate.candidate) {
          const match = e.candidate.candidate.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
          if (match && match[1] && !match[1].startsWith('0.') && !match[1].startsWith('127.')) {
            done = true;
            clearTimeout(timer);
            pc.close();
            resolve(match[1]);
          }
        }
      };
    } catch (e) {
      resolve('Изолировано (Sandbox)');
    }
  });
}

function getAudioHash() {
  return new Promise((resolve) => {
    try {
      const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!Ctx) return resolve('HASH_MUTED');
      const ctx = new Ctx(1, 44100, 44100);
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(10000, ctx.currentTime);
      const comp = ctx.createDynamicsCompressor();
      osc.connect(comp);
      comp.connect(ctx.destination);
      osc.start(0);
      ctx.startRendering().then((buf) => {
        let sum = 0;
        const ch = buf.getChannelData(0);
        for (let i = 4500; i < 5000; i++) sum += Math.abs(ch[i]);
        resolve(hashString('AUD_' + sum.toFixed(7)));
      }).catch(() => resolve('HASH_ERR'));
    } catch (e) {
      resolve('HASH_SECURED');
    }
  });
}

function getCanvasHash() {
  try {
    const cvs = document.createElement('canvas');
    cvs.width = 200; cvs.height = 40;
    const ctx = cvs.getContext('2d');
    if (!ctx) return 'CTX_ERR';
    ctx.font = '14px monospace';
    ctx.fillStyle = '#f60';
    ctx.fillRect(100, 2, 50, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('TRACE//2026', 2, 18);
    return hashString(cvs.toDataURL());
  } catch (e) {
    return 'CVS_SANDBOX';
  }
}

function getFPS() {
  return new Promise((resolve) => {
    let f = 0;
    const t0 = performance.now();
    function step() {
      f++;
      if (f < 30) requestAnimationFrame(step);
      else resolve(Math.round((f / (performance.now() - t0)) * 1000));
    }
    requestAnimationFrame(step);
  });
}

async function fetchGeo() {
  try {
    const r = await fetch('https://ipwho.is/?lang=ru', { cache: 'no-store' });
    if (r.ok) {
      const d = await r.json();
      if (d.success !== false) {
        return {
          ip: d.ip,
          country: d.country,
          region: d.region,
          city: d.city,
          lat: d.latitude,
          lon: d.longitude,
          isp: d.connection?.isp || 'Узел связи',
          asn: d.connection?.asn ? `AS${d.connection.asn}` : 'Н/Д',
          tz: d.timezone?.id || 'UTC'
        };
      }
    }
  } catch (e) {}

  try {
    const r = await fetch('https://api64.ipify.org?format=json', { cache: 'no-store' });
    if (r.ok) {
      const d = await r.json();
      return { ip: d.ip, country: 'Маршрутизировано', region: 'Шлюз', city: 'Транзит', lat: '0', lon: '0', isp: 'Сетевой оператор', asn: 'Н/Д', tz: 'Europe/Moscow' };
    }
  } catch (e) {}

  return { ip: '127.0.0.1 (VPN Tunnel)', country: 'Неизвестно', region: 'Скрыто', city: 'Прокси-узел', lat: '0', lon: '0', isp: 'Шифрованный туннель', asn: 'Н/Д', tz: 'UTC' };
}

// 3. Терминальный движок печати и прогресс-бара
const container = document.getElementById('termOutput');
let skipAnimation = false;

window.addEventListener('click', () => { skipAnimation = true; });
window.addEventListener('keydown', () => { skipAnimation = true; });

function printLine(htmlText) {
  const line = document.createElement('div');
  line.className = 'term-line';
  line.innerHTML = htmlText;
  container.appendChild(line);
  window.scrollTo(0, document.body.scrollHeight);
  audio.click();
}

function delay(ms) {
  if (skipAnimation) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Генератор ASCII-прогрессбара: [████████████░░░░░░░░] 60%
function makeAsciiBar(pct, totalChars = 26) {
  const filled = Math.round((pct / 100) * totalChars);
  const empty = totalChars - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

// 4. Главная анимированная последовательность терминала
async function runHackerTerminal() {
  container.innerHTML = '';
  skipAnimation = false;

  printLine('<span class="c-cyan c-bold">>>> ИНИЦИАЛИЗАЦИЯ ШЛЮЗА ПРОВЕРКИ ПОДЛИННОСТИ СЕССИИ...</span>');
  await delay(140);
  printLine('<span class="c-dim">[OK] Загрузка криптографических таблиц ядра...</span>');
  await delay(120);
  printLine(`<span class="c-dim">[OK] Регистрация сеанса: </span><span class="c-white">${Dossier.session.id}</span>`);
  await delay(160);

  // Создаем динамический блок прогресс-бара
  const progressBox = document.createElement('div');
  progressBox.className = 'progress-container';
  progressBox.innerHTML = `
    <div id="progLabel" class="progress-label">СКАНИРОВАНИЕ АППАРАТНЫХ РЕГИСТРОВ...</div>
    <div>
      <span class="c-dim">[</span><span id="progBar" class="progress-bar-ascii">${makeAsciiBar(0)}</span><span class="c-dim">]</span>
      <span id="progPct" class="progress-pct">0%</span>
    </div>
  `;
  container.appendChild(progressBox);

  const progLabel = document.getElementById('progLabel');
  const progBar = document.getElementById('progBar');
  const progPct = document.getElementById('progPct');

  // Шаги прогресса параллельно со сбором данных
  const updateProgress = async (pct, labelText) => {
    if (progLabel) progLabel.textContent = labelText;
    if (progBar) progBar.textContent = makeAsciiBar(pct);
    if (progPct) progPct.textContent = `${pct}%`;
    audio.click();
    await delay(skipAnimation ? 10 : 80);
  };

  await updateProgress(12, 'ОПРОС ГРАФИЧЕСКОГО КОНТЕКСТА WEBGL & GPU...');
  const gpu = getGPU();
  Dossier.hardware.gpu = gpu;

  await updateProgress(28, 'ИЗМЕРЕНИЕ РАЗРЕШЕНИЯ МАТРИЦЫ & БЕНЧМАРК FPS...');
  const dpr = window.devicePixelRatio || 1;
  const physW = Math.round(screen.width * dpr);
  const physH = Math.round(screen.height * dpr);
  const fps = await getFPS();

  await updateProgress(45, 'ПЕНЕТРАЦИЯ STUN-МАРШРУТА WebRTC (ПОИСК ЛОКАЛЬНОГО IP)...');
  const localIp = await getWebRTCLocalIP();
  Dossier.network.localIp = localIp;

  await updateProgress(62, 'ГЕНЕРАЦИЯ ЦИФРОВЫХ ХЭШЕЙ CANVAS2D & AUDIOCONTEXT...');
  const canvasHash = getCanvasHash();
  const audioHash = await getAudioHash();

  await updateProgress(78, 'ЗАПРОС BGP-ТЕЛЕМЕТРИИ, ПУБЛИЧНОГО IP & АНАЛИЗ ISP...');
  const geo = await fetchGeo();
  Dossier.network.geo = geo;

  // Опрос батареи
  let batteryText = 'Стационарный терминал (Сеть 220V)';
  if (navigator.getBattery) {
    try {
      const b = await navigator.getBattery();
      batteryText = `${Math.round(b.level * 100)}% [${b.charging ? 'ЗАРЯДКА ОТ СЕТИ' : 'АВТОНОМНОЕ ПИТАНИЕ'}]`;
    } catch (e) {}
  }

  await updateProgress(94, 'СВЕРКА СИСТЕМНОГО ВРЕМЕНИ И ГЕОЛОКАЦИОННОЙ ТАЙМЗОНЫ...');
  const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Moscow';
  const sysOffsetH = (-new Date().getTimezoneOffset()) / 60;
  const sysOffsetStr = `UTC${sysOffsetH >= 0 ? '+' : ''}${sysOffsetH}`;

  await updateProgress(100, 'АУДИТ УЗЛА ЗАВЕРШЕН. ФОРМИРОВАНИЕ ДОСЬЕ...');
  audio.beep(1200, 0.08);
  await delay(200);

  // Выводим структурированный отчет в терминале
  printLine('<div class="term-hr">================================================================================</div>');
  printLine('<span class="c-cyan c-bold">РЕЗУЛЬТАТЫ СКВОЗНОГО АУДИТА ЦИФРОВОГО ПРОФИЛЯ УЗЛА СВЯЗИ</span>');
  printLine('<span class="c-dim">СТАНДАРТ: ГОСТ Р ИСО/МЭК 27001 // СИСТЕМА КОНТУР-ТЕЛЕМЕТРИЯ v5.3</span>');
  printLine('<div class="term-hr">================================================================================</div>');
  await delay(120);

  // Блок 1: Сеть и геолокация
  printLine('<span class="c-white c-bold">[+] СЕТЕВОЙ МАРШРУТ И ГЕОЛОКАЦИЯ:</span>');
  printLine(`  <span class="c-dim">• Внешний IPv4/IPv6:</span>     <span class="c-cyan c-bold">${geo.ip}</span>`);
  printLine(`  <span class="c-dim">• Локальный IP (STUN):</span>   <span class="c-amber c-bold">${localIp}</span>`);
  printLine(`  <span class="c-dim">• Оператор связи (ISP):</span>  <span class="c-white">${geo.isp} (${geo.asn})</span>`);
  printLine(`  <span class="c-dim">• Геолокация:</span>            <span class="c-white">${geo.country}, ${geo.region}, г. ${geo.city}</span>`);
  printLine(`  <span class="c-dim">• Координаты узла:</span>       <span class="c-dim">${geo.lat}, ${geo.lon}</span>`);
  printLine(`  <span class="c-dim">• Таймзона системы:</span>      <span class="c-cyan">${systemTz} (${sysOffsetStr})</span>`);
  await delay(160);

  // Блок 2: VPN / Proxy анализ
  let isVpn = false;
  let vpnMsg = '';
  const isHosting = /(hosting|datacenter|cloud|vultr|digitalocean|hetzner|m247|ovh|amazon|google|microsoft|oracle|tailscale|wireguard|vpn|server)/i.test(geo.isp);

  if (geo.tz && systemTz && geo.tz !== systemTz) {
    isVpn = true;
    vpnMsg = `Несовпадение часового пояса: IP зарегистрирован в [${geo.tz}], но системный хронометр устройства: [${systemTz}]`;
  } else if (isHosting) {
    isVpn = true;
    vpnMsg = `Узел маршрутизируется через ЦОД/Хостинг (${geo.isp}) с маскирующим туннелем`;
  }

  if (isVpn) {
    audio.beep(440, 0.12);
    printLine(`
      <div class="term-alert-box">
        <span class="c-red c-bold">>>> ВНИМАНИЕ: ОБНАРУЖЕН МАСКИРУЮЩИЙ СЕТЕВОЙ ТУННЕЛЬ (VPN / PROXY) <<<</span><br>
        <span class="c-dim">• Анализ аномалии:</span> <span class="c-white">${vpnMsg}</span><br>
        <span class="c-dim">• Статус защиты:</span> <span class="c-amber">Исходный узел частично деанонимизирован сквозной телеметрией.</span>
      </div>
    `);
  } else {
    printLine('  <span class="c-green">[OK] Прямой маршрут подтверждён (без признаков маскирующего туннелирования)</span>');
  }
  await delay(160);

  // Блок 3: Железо и графический процессор
  printLine('<span class="c-white c-bold">[+] АППАРАТНАЯ СИГНАТУРА ТЕРМИНАЛА (HARDWARE):</span>');
  printLine(`  <span class="c-dim">• Видеокарта (GPU):</span>      <span class="c-cyan c-bold">${gpu.renderer}</span>`);
  printLine(`  <span class="c-dim">• Вендор GPU:</span>            <span class="c-dim">${gpu.vendor}</span>`);
  printLine(`  <span class="c-dim">• Процессор (CPU):</span>       <span class="c-white">${navigator.hardwareConcurrency || 4} логических ядер</span>`);
  printLine(`  <span class="c-dim">• Оперативная память:</span>    <span class="c-white">${navigator.deviceMemory ? navigator.deviceMemory + ' ГБ' : 'Защищено sandboxing'}</span>`);
  printLine(`  <span class="c-dim">• Состояние питания:</span>     <span class="c-green">${batteryText}</span>`);
  await delay(160);

  // Блок 4: Дисплейная матрица
  const touchPts = navigator.maxTouchPoints || 0;
  const touchStr = touchPts > 0 ? `Мультитач (${touchPts} точек касания)` : 'Курсор / Клавиатура';
  printLine('<span class="c-white c-bold">[+] ДИСПЛЕЙНАЯ МАТРИЦА И СЕНСОРЫ:</span>');
  printLine(`  <span class="c-dim">• Физические пиксели:</span>    <span class="c-white">${physW} × ${physH} px (Viewport: ${window.innerWidth}×${window.innerHeight})</span>`);
  printLine(`  <span class="c-dim">• Коэффициент Retina:</span>    <span class="c-white">${dpr.toFixed(2)}x DPR</span>`);
  printLine(`  <span class="c-dim">• Частота развёртки:</span>    <span class="c-cyan">${fps} Hz (Кадровая синхронизация)</span>`);
  printLine(`  <span class="c-dim">• Тип устройства:</span>        <span class="c-white">${touchStr}</span>`);
  await delay(160);

  // Блок 5: Цифровые отпечатки
  printLine('<span class="c-white c-bold">[+] ЦИФРОВЫЕ КРИПТОГРАФИЧЕСКИЕ ОТПЕЧАТКИ:</span>');
  printLine(`  <span class="c-dim">• Canvas2D Signature:</span>    <span class="c-amber">0x${canvasHash}</span>`);
  printLine(`  <span class="c-dim">• AudioContext Hash:</span>     <span class="c-amber">0x${audioHash}</span>`);
  printLine(`  <span class="c-dim">• Системные языки:</span>       <span class="c-white">${navigator.languages ? navigator.languages.join(', ') : navigator.language}</span>`);
  printLine(`  <span class="c-dim">• Платформа ОС:</span>          <span class="c-dim">${navigator.platform || 'Н/Д'}</span>`);
  await delay(180);

  // Финальный вердикт
  printLine('<div class="term-hr">================================================================================</div>');
  printLine('<span class="c-red c-bold">>>> СТАТУС: ДОСТУП К ЗАПРАШИВАЕМОМУ РЕСУРСУ ВРЕМЕННО ОГРАНИЧЕН</span>');
  printLine('<span class="c-dim">ПРИЧИНА: Ведутся плановые регламентные работы на магистральном шлюзе инфраструктуры.</span>');
  printLine('<span class="c-dim">Сетевой профиль и аппаратная сигнатура узла успешно зафиксированы в журнале аудита.</span>');
  printLine('<div class="term-hr">================================================================================</div>');

  // Интерактивные кнопки
  const promptBox = document.createElement('div');
  promptBox.className = 'term-prompt-row';
  promptBox.innerHTML = `
    <button type="button" id="btnRetest" class="cmd-btn">
      <span>[ ПОВТОРИТЬ ОПРОС УЗЛА ]</span>
    </button>
    <button type="button" id="btnExport" class="cmd-btn secondary">
      <span>[ ВЫГРУЗИТЬ ДАМП JSON ]</span>
    </button>
    <span class="cursor"></span>
  `;
  container.appendChild(promptBox);

  const skipHint = document.createElement('div');
  skipHint.className = 'skip-hint';
  skipHint.textContent = 'Подсказка: клик в любой точке экрана завершает вывод мгновенно.';
  container.appendChild(skipHint);

  window.scrollTo(0, document.body.scrollHeight);

  document.getElementById('btnRetest')?.addEventListener('click', (e) => {
    e.stopPropagation();
    runHackerTerminal();
  });

  document.getElementById('btnExport')?.addEventListener('click', (e) => {
    e.stopPropagation();
    exportJson();
  });
}

function exportJson() {
  audio.beep(1600, 0.08);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(Dossier, null, 2));
  const dl = document.createElement('a');
  dl.setAttribute('href', dataStr);
  dl.setAttribute('download', `AUDIT_${Dossier.session.id}.json`);
  document.body.appendChild(dl);
  dl.click();
  dl.remove();
}

document.addEventListener('DOMContentLoaded', () => {
  runHackerTerminal();
});
