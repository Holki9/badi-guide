/**
 * СИСТЕМА КОНТРОЛЯ И ИДЕНТИФИКАЦИИ УЗЛОВ ДОСТУПА «КОНТУР-ТЕЛЕМЕТРИЯ» v5.1
 * Полный аппаратно-сетевой аудит клиентского терминала.
 */

// 1. Звуковой синтезатор на Web Audio API (без внешних файлов)
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

  playBeep(freq = 880, duration = 0.05, type = 'sine') {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playSweep() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }

  playAlarm() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch (e) {}
  }
}

const audio = new CyberAudio();
window.addEventListener('click', () => audio.init(), { once: true });
window.addEventListener('touchstart', () => audio.init(), { once: true });

// Глобальный объект собранных данных
const TelemetryDossier = {
  session: {
    id: 'INC-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString().slice(-4),
    timestamp: new Date().toISOString(),
    status: 'IN_PROGRESS'
  },
  network: {},
  tunnel: {},
  hardware: {},
  display: {},
  fingerprint: {}
};

// Вспомогательная функция хеширования строки (DJB2 / Murmur-lite)
function computeStringHash(str) {
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }
  return (Math.abs(hash1).toString(16) + Math.abs(hash2).toString(16)).toUpperCase();
}

// 2. Терминальный лог с эффектом печати
const terminalEl = document.getElementById('terminalLogs');

function logTerminal(message, type = 'info') {
  if (!terminalEl) return;
  const line = document.createElement('div');
  line.className = `term-line term-${type}`;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
  line.innerHTML = `<span class="term-time">[${timeStr}]</span> <span class="term-msg">${message}</span>`;
  terminalEl.appendChild(line);
  terminalEl.scrollTop = terminalEl.scrollHeight;
  audio.playBeep(type === 'alert' ? 440 : 1200, 0.03);
}

// 3. Сбор WebRTC локального IP (STUN Candidate Leak)
function detectWebRTCLocalIP() {
  return new Promise((resolve) => {
    try {
      const RTCPC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      if (!RTCPC) {
        resolve({ localIp: 'Не поддерживается WebRTC', candidate: null });
        return;
      }

      const pc = new RTCPC({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }]
      });

      let found = false;
      pc.createDataChannel('');
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => resolve({ localIp: 'Заблокировано sandbox', candidate: null }));

      const timer = setTimeout(() => {
        if (!found) {
          pc.close();
          resolve({ localIp: 'Защищено браузерным рандомизатором', candidate: null });
        }
      }, 2500);

      pc.onicecandidate = (event) => {
        if (event && event.candidate && event.candidate.candidate) {
          const cand = event.candidate.candidate;
          const match = cand.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
          if (match && match[1]) {
            const ip = match[1];
            if (!ip.startsWith('0.') && !ip.startsWith('127.')) {
              found = true;
              clearTimeout(timer);
              pc.close();
              resolve({ localIp: ip, candidate: cand });
            }
          }
        }
      };
    } catch (e) {
      resolve({ localIp: 'Изолировано (Sandbox Policy)', candidate: null });
    }
  });
}

// 4. Сбор аппаратных характеристик WebGL (видеокарта)
function detectGPU() {
  const result = {
    renderer: 'Не определен',
    vendor: 'Не определен',
    webglVersion: 'Отключен',
    extensionsCount: 0,
    maxTextureSize: 'Н/Д'
  };

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      result.webglVersion = gl.getParameter(gl.VERSION) || 'WebGL 1.0';
      result.maxTextureSize = `${gl.getParameter(gl.MAX_TEXTURE_SIZE)} px`;
      result.extensionsCount = (gl.getSupportedExtensions() || []).length;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        result.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Драйвер скрыт';
        result.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Вендор скрыт';
      } else {
        result.renderer = gl.getParameter(gl.RENDERER) || 'Базовый рендерер';
        result.vendor = gl.getParameter(gl.VENDOR) || 'Базовый вендор';
      }
    }
  } catch (e) {
    result.renderer = 'Аппаратный контекст заблокирован';
  }

  return result;
}

// 5. Canvas Fingerprint
function computeCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'CTX_UNAVAILABLE';

    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial', 'Segoe UI', sans-serif";
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Контур-Аудит [ID:772]', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Telemetry // 2026', 4, 35);

    const dataUri = canvas.toDataURL();
    return computeStringHash(dataUri);
  } catch (e) {
    return 'HASH_SANDBOXED';
  }
}

// 6. AudioContext Fingerprint
function computeAudioFingerprint() {
  return new Promise((resolve) => {
    try {
      const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!OfflineCtx) {
        resolve('AUDIO_UNAVAILABLE');
        return;
      }

      const context = new OfflineCtx(1, 44100, 44100);
      const osc = context.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(10000, context.currentTime);

      const compressor = context.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, context.currentTime);
      compressor.knee.setValueAtTime(40, context.currentTime);
      compressor.ratio.setValueAtTime(12, context.currentTime);
      compressor.attack.setValueAtTime(0, context.currentTime);
      compressor.release.setValueAtTime(0.25, context.currentTime);

      osc.connect(compressor);
      compressor.connect(context.destination);
      osc.start(0);

      context.startRendering().then((buffer) => {
        let sum = 0;
        const channel = buffer.getChannelData(0);
        for (let i = 4500; i < 5000; i++) {
          sum += Math.abs(channel[i]);
        }
        resolve(computeStringHash('AUDIO_' + sum.toFixed(8)));
      }).catch(() => resolve('AUDIO_RENDER_ERR'));
    } catch (e) {
      resolve('AUDIO_MUTED');
    }
  });
}

// 7. Замер герцовки дисплея (FPS Benchmark)
function benchmarkDisplayRefreshRate() {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    function tick() {
      frames++;
      if (frames < 36) {
        requestAnimationFrame(tick);
      } else {
        const delta = performance.now() - start;
        const fps = Math.round((frames / delta) * 1000);
        resolve(fps);
      }
    }
    requestAnimationFrame(tick);
  });
}

// 8. Запрос публичного IP и геолокации через несколько провайдеров
async function fetchNetworkGeo() {
  // Провайдер 1: ipwho.is (богатая детальная телеметрия без ключа)
  try {
    const res = await fetch('https://ipwho.is/?lang=ru', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        return {
          ip: data.ip,
          country: data.country,
          countryCode: data.country_code,
          region: data.region,
          city: data.city,
          postal: data.postal || 'Не указан',
          latitude: data.latitude,
          longitude: data.longitude,
          isp: data.connection?.isp || data.connection?.org || 'Узел связи',
          asn: data.connection?.asn ? `AS${data.connection.asn}` : 'Н/Д',
          org: data.connection?.org || data.connection?.isp || 'Н/Д',
          timezone: data.timezone?.id || 'Н/Д',
          utcOffset: data.timezone?.utc || 'Н/Д'
        };
      }
    }
  } catch (e) {}

  // Провайдер 2: ipapi.co (резервный)
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return {
        ip: data.ip,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        postal: data.postal || 'Не указан',
        latitude: data.latitude,
        longitude: data.longitude,
        isp: data.org || 'Узел связи',
        asn: data.asn || 'Н/Д',
        org: data.org || 'Н/Д',
        timezone: data.timezone || 'Н/Д',
        utcOffset: data.utc_offset || 'Н/Д'
      };
    }
  } catch (e) {}

  // Провайдер 3: api64.ipify.org (только базовый IP)
  try {
    const res = await fetch('https://api64.ipify.org?format=json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return {
        ip: data.ip,
        country: 'Маршрутизация определена',
        countryCode: 'XX',
        region: 'Шлюз провайдера',
        city: 'Транзитный узел',
        postal: 'Н/Д',
        latitude: '0.00',
        longitude: '0.00',
        isp: 'Пакетный оператор',
        asn: 'Н/Д',
        org: 'Транзитный шлюз',
        timezone: 'Europe/Moscow',
        utcOffset: '+03:00'
      };
    }
  } catch (e) {}

  return {
    ip: '127.0.0.1 (Туннелировано)',
    country: 'Неизвестно',
    countryCode: 'XX',
    region: 'Скрыто протоколом',
    city: 'Прокси-узел',
    postal: 'Н/Д',
    latitude: 'Н/Д',
    longitude: 'Н/Д',
    isp: 'Шифрованный туннель',
    asn: 'Н/Д',
    org: 'Инкогнито',
    timezone: 'UTC',
    utcOffset: '+00:00'
  };
}

// 9. Полный запуск аудита и заполнение дашборда
async function runFullTelemetryAudit() {
  logTerminal('Инициализация сеанса криптографического аудита узла...', 'info');
  audio.playSweep();

  // Обновление идентификатора сессии
  document.getElementById('metaSessionId').textContent = TelemetryDossier.session.id;
  document.getElementById('metaTimestamp').textContent = new Date().toLocaleTimeString('ru-RU');

  // 1. Аппаратный профиль GPU
  logTerminal('Опрос графического ускорителя и шейдерного конвейера...', 'info');
  const gpu = detectGPU();
  TelemetryDossier.hardware.gpu = gpu;
  document.getElementById('valGpuRenderer').textContent = gpu.renderer;
  document.getElementById('valGpuVendor').textContent = gpu.vendor;
  document.getElementById('valGpuTexture').textContent = gpu.maxTextureSize;

  // 2. ЦПУ и Память
  const cores = navigator.hardwareConcurrency || 'Не определено';
  const memory = navigator.deviceMemory ? `${navigator.deviceMemory} ГБ` : 'Защищено sandboxing';
  TelemetryDossier.hardware.cores = cores;
  TelemetryDossier.hardware.memory = memory;
  document.getElementById('valCpuCores').textContent = `${cores} логических ядер`;
  document.getElementById('valDeviceRam').textContent = memory;

  // 3. Батарея
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      const level = Math.round(battery.level * 100);
      const status = battery.charging ? 'Подключено к сети' : 'Автономное питание';
      TelemetryDossier.hardware.battery = { level: `${level}%`, charging: battery.charging };
      document.getElementById('valBattery').textContent = `${level}% (${status})`;
      logTerminal(`Датчик питания: заряд ${level}%, статус: ${status}`, 'info');
    } catch (e) {
      document.getElementById('valBattery').textContent = 'Стационарный ПК / API скрыт';
    }
  } else {
    document.getElementById('valBattery').textContent = 'Стационарный терминал (Сеть 220V)';
  }

  // 4. Дисплейная матрица и FPS
  logTerminal('Калибровка разрешения матрицы и частоты развёртки...', 'info');
  const dpr = window.devicePixelRatio || 1;
  const physW = Math.round(screen.width * dpr);
  const physH = Math.round(screen.height * dpr);
  const colorDepth = screen.colorDepth || 24;
  const touchPoints = navigator.maxTouchPoints || 0;
  const touchType = touchPoints > 0 ? `Сенсорный (${touchPoints} точек)` : 'Курсор / Клавиатура';

  document.getElementById('valResolution').textContent = `${physW} × ${physH} px (Viewport: ${window.innerWidth}×${window.innerHeight})`;
  document.getElementById('valDpr').textContent = `${dpr.toFixed(2)}x (${colorDepth}-bit HDR/SDR)`;
  document.getElementById('valTouch').textContent = touchType;

  benchmarkDisplayRefreshRate().then((fps) => {
    TelemetryDossier.display.fps = `${fps} Hz`;
    document.getElementById('valFps').textContent = `${fps} Hz (Кадровая синхронизация)`;
    logTerminal(`Частота обновления дисплея: ${fps} кадр/сек`, 'info');
  });

  // 5. Сетевой интерфейс браузера
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    const netType = conn.effectiveType ? conn.effectiveType.toUpperCase() : 'LAN/Wi-Fi';
    const downlink = conn.downlink ? `${conn.downlink} Мбит/с` : 'Н/Д';
    const rtt = conn.rtt ? `${conn.rtt} мс` : 'Н/Д';
    TelemetryDossier.network.connection = { netType, downlink, rtt };
    document.getElementById('valNetType').textContent = `${netType} (Шлюз)`;
    document.getElementById('valDownlink').textContent = downlink;
    document.getElementById('valRtt').textContent = rtt;
  } else {
    document.getElementById('valNetType').textContent = 'Ethernet / Оптоволокно';
    document.getElementById('valDownlink').textContent = 'Скрыто политикой ОС';
    document.getElementById('valRtt').textContent = '< 15 мс';
  }

  // 6. WebRTC STUN Leak (Локальный IP)
  logTerminal('Запрос STUN-маршрута: поиск локального сетевого адреса...', 'info');
  const rtcData = await detectWebRTCLocalIP();
  TelemetryDossier.network.webrtc = rtcData;
  document.getElementById('valLocalIp').textContent = rtcData.localIp;
  if (rtcData.localIp && rtcData.localIp.includes('.')) {
    logTerminal(`WebRTC Leak: обнаружен внутренний шлюз подсети ${rtcData.localIp}`, 'warn');
  }

  // 7. Внешний IP и Геолокация
  logTerminal('Запрос BGP-маршрутизации и публичного IP...', 'info');
  const geo = await fetchNetworkGeo();
  TelemetryDossier.network.geo = geo;

  document.getElementById('valPublicIp').textContent = geo.ip;
  document.getElementById('valIsp').textContent = `${geo.isp} (${geo.asn})`;
  document.getElementById('valLocation').textContent = `${geo.country}, ${geo.region}, г. ${geo.city}`;
  document.getElementById('valCoords').textContent = `${geo.latitude}, ${geo.longitude}`;
  document.getElementById('valCountryCode').textContent = geo.countryCode;

  // 8. Детектор VPN / Proxy (Сверка часовых поясов и системного времени)
  logTerminal('Проверка расхождения временных зон и BGP-маршрута...', 'info');
  const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Moscow';
  const systemOffsetMinutes = -new Date().getTimezoneOffset();
  const systemOffsetHours = systemOffsetMinutes / 60;
  const sysOffsetStr = `UTC${systemOffsetHours >= 0 ? '+' : ''}${systemOffsetHours}`;

  document.getElementById('valSystemTz').textContent = `${systemTz} (${sysOffsetStr})`;

  // Анализируем несоответствие
  let vpnDetected = false;
  let vpnReason = '';

  const ipTz = geo.timezone || '';
  const isHostingIsp = /(hosting|datacenter|cloud|vultr|digitalocean|hetzner|m247|ovh|amazon|google|microsoft|oracle|tailscale|wireguard|vpn|server)/i.test(geo.isp + ' ' + geo.org);

  // Сравнение часовых поясов
  if (ipTz && systemTz && ipTz !== systemTz) {
    vpnDetected = true;
    vpnReason = `Несовпадение таймзоны: IP зарегистрирован в зоне [${ipTz}], однако системные часы терминала настроены на [${systemTz}].`;
  } else if (isHostingIsp) {
    vpnDetected = true;
    vpnReason = `Провайдер узла (${geo.isp}) классифицирован как датацентр/хостинг-провайдер с туннелированием трафика.`;
  }

  const vpnStatusCard = document.getElementById('vpnStatusAlert');
  const vpnStatusTitle = document.getElementById('vpnAlertTitle');
  const vpnStatusDesc = document.getElementById('vpnAlertDesc');

  if (vpnDetected) {
    audio.playAlarm();
    vpnStatusCard.className = 'status-box status-danger';
    vpnStatusTitle.textContent = 'ОБНАРУЖЕН МАСКИРУЮЩИЙ СЕТЕВОЙ ТУННЕЛЬ (VPN / PROXY)';
    vpnStatusDesc.innerHTML = `<strong>Внимание:</strong> ${vpnReason}<br>Реальный системный профиль терминала частично скомпрометирован сквозной телеметрией.`;
    logTerminal(`ТРЕВОГА: Зафиксирован искусственный туннель: IP=${geo.ip} [${geo.country}], но Timezone=${systemTz}`, 'alert');
  } else {
    vpnStatusCard.className = 'status-box status-warning';
    vpnStatusTitle.textContent = 'ПРЯМОЙ МАРШРУТ (БЕЗ МАСКИРУЮЩЕГО ТУННЕЛИРОВАНИЯ)';
    vpnStatusDesc.textContent = `Пакеты поступают напрямую через публичный узел оператора связи ${geo.isp}. Совпадение региональных параметров подтверждено.`;
    logTerminal(`Маршрут прямой: ${geo.isp}, таймзона ${systemTz} синхронизирована`, 'info');
  }

  // 9. Цифровые криптографические отпечатки
  logTerminal('Синтез хэшей Canvas2D и AudioContext...', 'info');
  const canvasHash = computeCanvasFingerprint();
  const audioHash = await computeAudioFingerprint();
  const languages = navigator.languages ? navigator.languages.join(', ') : navigator.language;
  const platform = navigator.platform || 'Н/Д';

  TelemetryDossier.fingerprint = {
    canvasHash,
    audioHash,
    languages,
    platform,
    userAgent: navigator.userAgent
  };

  document.getElementById('valCanvasHash').textContent = `0x${canvasHash}`;
  document.getElementById('valAudioHash').textContent = `0x${audioHash}`;
  document.getElementById('valLanguages').textContent = languages;
  document.getElementById('valPlatform').textContent = `${platform} (${navigator.vendor || 'OS Core'})`;

  logTerminal('Формирование реестра цифрового отпечатка завершено.', 'info');
  logTerminal('ДОСТУП К ЦЕЛЕВОМУ РЕСУРСУ ЗАБЛОКИРОВАН ДО ОКОНЧАНИЯ РЕГЛАМЕНТНЫХ РАБОТ.', 'alert');

  TelemetryDossier.session.status = 'COMPLETED';
}

// 10. Скачивание диагностического дампа в формате JSON
function downloadAuditDump() {
  audio.playBeep(1600, 0.08);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(TelemetryDossier, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `AUDIT_TELEMETRY_${TelemetryDossier.session.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  logTerminal('Диагностический дамп успешно экспортирован в JSON.', 'info');
}

// 11. Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  runFullTelemetryAudit();

  const retestBtn = document.getElementById('btnRetest');
  if (retestBtn) {
    retestBtn.addEventListener('click', () => {
      audio.playSweep();
      if (terminalEl) terminalEl.innerHTML = '';
      runFullTelemetryAudit();
    });
  }

  const exportBtn = document.getElementById('btnExport');
  if (exportBtn) {
    exportBtn.addEventListener('click', downloadAuditDump);
  }
});
