(() => {
  'use strict';
  const ORDER_MENUS = [
    { name: 'ミラノ風ドリア', code: '2101', emoji: '🥘' },
    { name: '小エビのサラダ', code: '1202', emoji: '🥗' },
    { name: '辛味チキン', code: '1401', emoji: '🍗' },
    { name: 'バッファローモッツァレラのマルゲリータピザ', code: '2203', emoji: '🍕' },
    { name: 'タラコソースシシリー風', code: '2301', emoji: '🍝' },
    { name: 'エスカルゴのオーブン焼き', code: '1405', emoji: '🐚' },
    { name: 'イカの墨入りセピアソース', code: '2328', emoji: '🍝' },
    { name: '柔らか青豆の温サラダ', code: '1425', emoji: '🫛' },
    { name: 'ティラミス クラシコ', code: '3201', emoji: '🍰', timing: 'すぐに' },
    { name: 'ティラミス クラシコ', code: '3901', emoji: '🍰', timing: 'あとで' },
  ];
  // Product lookup is independent of the active requests in a game.
  // Additional numbers: official popular-menu list and the supplied order-pad photo (1408).
  const MENU_CATALOG = [
    ...ORDER_MENUS,
    { name: '蒸し鶏の香味ソース', code: '1408', emoji: '🍗' },
    { name: '若鶏のディアボラ風', code: '2402', emoji: '🍗' },
    { name: 'たまねぎのズッパ', code: '1307', emoji: '🥣' },
    { name: 'ハンバーグステーキ', code: '2406', emoji: '🍽️' },
    { name: 'ほうれん草のソテー', code: '1403', emoji: '🥬' },
    { name: 'ペペロンチーノ', code: '2303', emoji: '🍝' },
    { name: 'イタリアンプリン', code: '3206', emoji: '🍮', timing: 'すぐに' },
    { name: 'イタリアンプリン', code: '3906', emoji: '🍮', timing: 'あとで' },
    { name: 'セットドリンクバー', code: '5101', emoji: '🥤' },
    { name: 'ムール貝のガーリック焼き', code: '1410', emoji: '🐚' },
    { name: 'ディアボラ風ハンバーグ', code: '2407', emoji: '🍽️' },
    { name: '野菜ときのこのピザ', code: '2204', emoji: '🍕' },
    { name: '田舎風ミネストローネ', code: '1305', emoji: '🥣' },
    { name: 'カルボナーラ', code: '2305', emoji: '🍝' },
    { name: 'パルマ風スパゲッティ', code: '2304', emoji: '🍝' },
    { name: 'アロスティチーニ', code: '1402', emoji: '🍖' },
    { name: 'チョリソー', code: '1407', emoji: '🍽️' },
    { name: 'ペンネアラビアータ', code: '2325', emoji: '🍝' },
    { name: 'グラスワイン（赤）', code: '3401', emoji: '🍷' },
    { name: 'グラスワイン（白）', code: '3402', emoji: '🍷' },
    { name: 'ドンラファエロ', code: '3413', emoji: '🍷' },
    { name: 'ランブルスコロゼ', code: '3412', emoji: '🍷' },
    { name: 'ランブルスコセッコ', code: '3414', emoji: '🍷' },
    { name: 'ベルデッキオ', code: '3415', emoji: '🍷' },
    { name: 'キャンティ', code: '3416', emoji: '🍷' },
    { name: 'キャンティルフィナ', code: '3419', emoji: '🍷' },
  ];
  // Grand menu numbers listed by the accessible menu, last updated 2026-02-20.
  const ADDITIONAL_MENUS = [
    {"name":"セットドリンクバー","code":"5101","emoji":"🥤"},
    {"name":"キッズドリンクバー","code":"5102","emoji":"🥤"},
    {"name":"ドリンクバー（単品）","code":"5103","emoji":"🥤"},
    {"name":"生ビール ジョッキ","code":"3301","emoji":"🥤"},
    {"name":"グラスビール","code":"3302","emoji":"🥤"},
    {"name":"ノンアルコールビール アサヒドライゼロ","code":"3303","emoji":"🥤"},
    {"name":"キリン 氷結 シチリア産レモン","code":"3304","emoji":"🥤"},
    {"name":"グラッパ 30ml","code":"3306","emoji":"🥤"},
    {"name":"グラスワイン 120ml 赤","code":"3401","emoji":"🥤"},
    {"name":"グラスワイン 120ml 白","code":"3402","emoji":"🥤"},
    {"name":"デカンタ小 250ml 赤","code":"3403","emoji":"🥤"},
    {"name":"デカンタ小 250ml 白","code":"3404","emoji":"🥤"},
    {"name":"デカンタ大 500ml 赤","code":"3405","emoji":"🥤"},
    {"name":"デカンタ大 500ml 白","code":"3406","emoji":"🥤"},
    {"name":"マグナム 1500ml 赤","code":"3407","emoji":"🥤"},
    {"name":"マグナム 1500ml 白","code":"3408","emoji":"🥤"},
    {"name":"ボトルワイン750ml ドンラファエロ","code":"3413","emoji":"🥤"},
    {"name":"ボトルワイン750ml ランブルスコロゼ","code":"3412","emoji":"🥤"},
    {"name":"ボトルワイン750ml ランブルスコセッコ","code":"3414","emoji":"🥤"},
    {"name":"ボトルワイン750ml ベルデッキオ","code":"3415","emoji":"🥤"},
    {"name":"ボトルワイン750ml キャンティ","code":"3416","emoji":"🥤"},
    {"name":"ボトルワイン750ml キャンティ ルフィナ","code":"3419","emoji":"🥤"},
    {"name":"生ハムとバッファローモッツァレラの盛合せ","code":"1423","emoji":"🍽️"},
    {"name":"生ハム","code":"1422","emoji":"🍽️"},
    {"name":"バッファローモッツァレラのカプレーゼ","code":"1417","emoji":"🍽️"},
    {"name":"蒸し鶏の香味ソース","code":"1408","emoji":"🍽️"},
    {"name":"小エビのカクテル","code":"1406","emoji":"🍽️"},
    {"name":"辛味チキン","code":"1401","emoji":"🍽️"},
    {"name":"エスカルゴのオーブン焼き","code":"1405","emoji":"🍽️"},
    {"name":"ムール貝のガーリック焼き","code":"1410","emoji":"🍽️"},
    {"name":"チョリソー","code":"1407","emoji":"🍽️"},
    {"name":"ポップコーンシュリンプ","code":"1404","emoji":"🍽️"},
    {"name":"アロスティチーニ","code":"1402","emoji":"🍽️"},
    {"name":"アロスティチーニ Wサイズ","code":"1452","emoji":"🍽️"},
    {"name":"ほうれん草のソテー","code":"1403","emoji":"🍽️"},
    {"name":"ポテトのグリル","code":"1416","emoji":"🍽️"},
    {"name":"柔らか青豆の温サラダ","code":"1425","emoji":"🍽️"},
    {"name":"キャロットラペ","code":"1413","emoji":"🍽️"},
    {"name":"小エビのサラダ","code":"1202","emoji":"🍽️"},
    {"name":"チキンのサラダ","code":"1209","emoji":"🍽️"},
    {"name":"わかめのサラダ","code":"1205","emoji":"🍽️"},
    {"name":"サイゼリヤドレッシング 500ml","code":"5305","emoji":"🍽️"},
    {"name":"たまねぎのズッパ","code":"1307","emoji":"🍽️"},
    {"name":"コーンクリームスープ","code":"1301","emoji":"🍽️"},
    {"name":"田舎風ミネストローネ","code":"1305","emoji":"🍽️"},
    {"name":"フォッカチオ","code":"3110","emoji":"🍽️"},
    {"name":"ガーリックフォッカチオ","code":"3111","emoji":"🍽️"},
    {"name":"タラコフォッカチオ","code":"3113","emoji":"🍽️"},
    {"name":"チーズフォッカチオ","code":"3114","emoji":"🍽️"},
    {"name":"シナモンフォッカチオ","code":"3112","emoji":"🍽️"},
    {"name":"バッファローモッツァレラのマルゲリータピザ","code":"2203","emoji":"🍽️"},
    {"name":"ソーセージピザ","code":"2208","emoji":"🍽️"},
    {"name":"たっぷりコーンのピザ","code":"2206","emoji":"🍽️"},
    {"name":"野菜ときのこのピザ","code":"2204","emoji":"🍽️"},
    {"name":"ミラノ風ドリア","code":"2101","emoji":"🍽️"},
    {"name":"半熟卵のミラノ風ドリア","code":"2103","emoji":"🍽️"},
    {"name":"焼チーズ ミラノ風ドリア","code":"2108","emoji":"🍽️"},
    {"name":"タラコとポップコーンシュリンプのドリア","code":"2110","emoji":"🍽️"},
    {"name":"ポップコーンシュリンプとタラコのクリームグラタン","code":"2115","emoji":"🍽️"},
    {"name":"タラコソース シシリー風","code":"2301","emoji":"🍽️"},
    {"name":"カルボナーラ","code":"2305","emoji":"🍽️"},
    {"name":"半熟卵のカルボナーラ","code":"2318","emoji":"🍽️"},
    {"name":"小エビのタラコソース","code":"2320","emoji":"🍽️"},
    {"name":"パルマ風スパゲッティ","code":"2304","emoji":"🍽️"},
    {"name":"きのことほうれん草のクリームスパゲッティ","code":"2321","emoji":"🍽️"},
    {"name":"イカの墨入りセピアソース","code":"2328","emoji":"🍽️"},
    {"name":"ミートソース ボロニア風","code":"2306","emoji":"🍽️"},
    {"name":"半熟卵のミートソース ボロニア風","code":"2316","emoji":"🍽️"},
    {"name":"スープ入り塩味ボンゴレ","code":"2310","emoji":"🍽️"},
    {"name":"ペペロンチーノ","code":"2303","emoji":"🍽️"},
    {"name":"半熟卵のペペロンチーノ","code":"2317","emoji":"🍽️"},
    {"name":"ペンネアラビアータ","code":"2325","emoji":"🍽️"},
    {"name":"トッピング粉チーズ","code":"4307","emoji":"🍽️"},
    {"name":"トッピング半熟卵","code":"4301","emoji":"🍽️"},
    {"name":"エクストラ・バージン・オリーブオイル 500ml","code":"5306","emoji":"🍽️"},
    {"name":"ミックスグリル","code":"2418","emoji":"🍽️"},
    {"name":"ハンバーグステーキ","code":"2406","emoji":"🍽️"},
    {"name":"イタリアンハンバーグ","code":"2403","emoji":"🍽️"},
    {"name":"ディアボラ風ハンバーグ","code":"2407","emoji":"🍽️"},
    {"name":"若鶏のディアボラ風","code":"2402","emoji":"🍽️"},
    {"name":"柔らかチキンのチーズ焼き","code":"2404","emoji":"🍽️"},
    {"name":"ビーフステーキ","code":"2419","emoji":"🍽️"},
    {"name":"ラム(仔羊)のランプステーキ","code":"2417","emoji":"🍽️"},
    {"name":"トッピング野菜ソース","code":"4304","emoji":"🍽️"},
    {"name":"ライス","code":"3101","emoji":"🍽️"},
    {"name":"ラージライス","code":"3102","emoji":"🍽️"},
    {"name":"スモールライス","code":"3103","emoji":"🍽️"},
    {"name":"イタリアンプリン","code":"3206","emoji":"🍰","timing":"すぐに"},
    {"name":"イタリアンプリン","code":"3906","emoji":"🍰","timing":"あとで"},
    {"name":"プリンとティラミス クラシコの盛合せ","code":"3212","emoji":"🍰","timing":"すぐに"},
    {"name":"プリンとティラミス クラシコの盛合せ","code":"3912","emoji":"🍰","timing":"あとで"},
    {"name":"ティラミス クラシコ","code":"3201","emoji":"🍰","timing":"すぐに"},
    {"name":"ティラミス クラシコ","code":"3901","emoji":"🍰","timing":"あとで"},
    {"name":"ミルクジェラート","code":"3205","emoji":"🍰","timing":"すぐに"},
    {"name":"ミルクジェラート","code":"3905","emoji":"🍰","timing":"あとで"},
    {"name":"チョコレートケーキ＆ミルクジェラート","code":"3216","emoji":"🍰","timing":"すぐに"},
    {"name":"チョコレートケーキ＆ミルクジェラート","code":"3916","emoji":"🍰","timing":"あとで"},
    {"name":"チョコレートケーキ","code":"3207","emoji":"🍰","timing":"すぐに"},
    {"name":"チョコレートケーキ","code":"3907","emoji":"🍰","timing":"あとで"},
    {"name":"トリフアイスクリーム","code":"3213","emoji":"🍰","timing":"すぐに"},
    {"name":"トリフアイスクリーム","code":"3913","emoji":"🍰","timing":"あとで"},
    {"name":"コーヒーゼリー＆ミルクジェラート","code":"3215","emoji":"🍰","timing":"すぐに"},
    {"name":"コーヒーゼリー＆ミルクジェラート","code":"3915","emoji":"🍰","timing":"あとで"},
    {"name":"ジェラート＆シナモンフォッカチオ","code":"3214","emoji":"🍰","timing":"すぐに"},
    {"name":"ジェラート＆シナモンフォッカチオ","code":"3914","emoji":"🍰","timing":"あとで"},
  ];
  const knownCodes = new Set(MENU_CATALOG.map((menu) => menu.code));
  MENU_CATALOG.push(...ADDITIONAL_MENUS.filter((menu) => !knownCodes.has(menu.code)));
  const REQUEST_MENUS = [
    ...MENU_CATALOG.slice(ORDER_MENUS.length),
    ...ORDER_MENUS,
  ];
  const MAX_PENDING = 3;
  const GAME_DURATION = 60_000;
  const CHARACTER_DELAY = 400;
  const ORDER_START_INTERVAL = 4000;
  const BEST_KEY = 'saize-order-timeattack-best';
  const $ = (selector) => document.querySelector(selector);
  const keys = [...document.querySelectorAll('[data-key]')];
  const dialogs = [...document.querySelectorAll('dialog')];
  const state = {
    phase: 'ready', code: '', errorMessage: '', combo: 0, maxCombo: 0, mistakes: 0,
    orders: [], customers: [], requestCounts: {}, speakerSequence: 0, deadline: 0, nextRequestStartAt: 0,
    tickTimer: null, pendingResult: false, sound: false, audio: null, best: 0,
  };
  try { state.best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch { /* Storage is optional. */ }
  $('#best').textContent = state.best || '—';

  function beep(success = false) {
    if (!state.sound) return;
    try {
      state.audio ??= new (window.AudioContext || window.webkitAudioContext)();
      if (state.audio.state === 'suspended') state.audio.resume();
      const oscillator = state.audio.createOscillator();
      const gain = state.audio.createGain();
      oscillator.connect(gain);
      gain.connect(state.audio.destination);
      oscillator.frequency.setValueAtTime(success ? 660 : 410, state.audio.currentTime);
      if (success) oscillator.frequency.setValueAtTime(880, state.audio.currentTime + 0.12);
      gain.gain.setValueAtTime(0.05, state.audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, state.audio.currentTime + (success ? 0.35 : 0.08));
      oscillator.start();
      oscillator.stop(state.audio.currentTime + (success ? 0.36 : 0.09));
    } catch { /* Sound is optional. */ }
  }
  function feedback(message, kind = '') {
    state.errorMessage = kind === 'error' ? message : '';
    $('#feedback').textContent = kind === 'error' ? '' : message;
    $('#feedback').className = `feedback ${kind}`;
  }
  function menuLabel(menu) { return menu.name + (menu.timing ? `（${menu.timing}）` : ''); }
  function readingPaused() { return document.hidden || dialogs.some((dialog) => dialog.open); }
  function stopTicker() { clearTimeout(state.tickTimer); state.tickTimer = null; }

  function renderTime() {
    const seconds = state.phase === 'ready' ? 60 : Math.max(0, Math.ceil((state.deadline - performance.now()) / 1000));
    $('#time-left').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    $('#time-left').setAttribute('aria-label', `残り${seconds}秒`);
    $('#time-left').classList.toggle('time-warning', seconds <= 10);
  }
  function timeAvailable() {
    if (state.phase !== 'playing') return false;
    if (performance.now() >= state.deadline) { finishGame(); return false; }
    renderTime();
    return true;
  }
  function renderCode() {
    $('#number-value').textContent = state.code;
    $('#code-display').setAttribute('aria-label', `注文番号 ${state.code ? [...state.code].join(' ') : '未入力'}`);
    const playing = state.phase === 'playing';
    const complete = state.code.length === 4;
    const menu = complete ? MENU_CATALOG.find((item) => item.code === state.code) : null;
    $('#order-emblem').hidden = complete || Boolean(state.errorMessage);
    $('#menu-preview').hidden = !complete && !state.errorMessage;
    $('#menu-preview').textContent = state.errorMessage || (menu ? menuLabel(menu) : '番号を確認');
    $('#menu-preview').classList.toggle('unknown-menu', complete && !menu);
    $('#menu-preview').classList.toggle('order-error', Boolean(state.errorMessage));
    keys.forEach((key) => { key.disabled = !playing; });
    $('#submit-button').hidden = state.phase === 'ready' || (playing && !complete);
    $('#submit-button').disabled = playing ? !complete : state.phase !== 'finished';
  }

  function createRequest(excludeCode, startDelay = ORDER_START_INTERVAL) {
    const activeCodes = new Set(state.customers.flatMap((customer) => [customer.menu.code, customer.replacement?.menu.code].filter(Boolean)));
    const candidates = REQUEST_MENUS.filter((menu) => !activeCodes.has(menu.code) && menu.code !== excludeCode);
    // Prefer the dishes requested least often; choose randomly among ties.
    const leastRequested = Math.min(...candidates.map((menu) => state.requestCounts[menu.name] || 0));
    const balanced = candidates.filter((menu) => (state.requestCounts[menu.name] || 0) === leastRequested);
    const menu = balanced[Math.floor(Math.random() * balanced.length)];
    state.requestCounts[menu.name] = (state.requestCounts[menu.name] || 0) + 1;
    const person = state.speakerSequence++ % 2 === 0 ? '私' : '僕';
    const action = /^(33|34|51)/.test(menu.code) ? '飲みたい' : /^(43|53)/.test(menu.code) ? '欲しい' : '食べたい';
    const introduction = `${person}は${menu.name}が${action}！${menu.timing ? `${menu.timing}持ってきて！` : ''}`;
    const orderLabel = '注文番号は';
    const prefixLength = [...`${person}は`].length;
    const menuNameLength = [...menu.name].length;
    const introductionLength = [...introduction].length;
    const labelLength = [...orderLabel].length;
    const characters = [...introduction, ...orderLabel, ...menu.code];
    const now = performance.now();
    const startsAt = Math.max(now + startDelay, state.nextRequestStartAt);
    state.nextRequestStartAt = startsAt + ORDER_START_INTERVAL;
    const card = document.createElement('article');
    card.className = 'speech-bubble rush-customer';
    card.hidden = startsAt > now;
    card.setAttribute('aria-label', '友達の注文');
    const text = document.createElement('p');
    text.setAttribute('aria-hidden', 'true');
    const introductionText = document.createElement('span');
    introductionText.className = 'typing';
    const prefixText = document.createElement('span');
    const menuNameText = document.createElement('strong');
    menuNameText.className = 'menu-name-emphasis';
    const suffixText = document.createElement('span');
    introductionText.append(prefixText, menuNameText, suffixText);
    const orderLine = document.createElement('span');
    orderLine.className = 'order-number-line';
    orderLine.hidden = true;
    const labelText = document.createElement('span');
    const orderNumber = document.createElement('strong');
    orderNumber.className = 'order-number';
    orderLine.append(labelText, orderNumber);
    text.append(introductionText, orderLine);
    const accessible = document.createElement('span');
    accessible.className = 'sr-only';
    accessible.setAttribute('role', 'status');
    accessible.setAttribute('aria-live', 'polite');
    card.append(text, accessible);
    return { menu, characters, prefixLength, menuNameLength, introductionLength, labelLength, index: 0, startsAt, nextCharacterAt: startsAt + CHARACTER_DELAY, card, text, introductionText, prefixText, menuNameText, suffixText, orderLine, labelText, orderNumber, accessible };
  }
  function renderRequests() {
    $('.customer-area').replaceChildren(...state.customers.map((customer) => customer.card));
    $('#rush-status').textContent = `注文待ち${state.customers.length}件`;
  }

  // Use a monotonic deadline, so delayed browser callbacks cannot extend a round.
  // Menus/background tabs pause the speech animation; the 60-second clock continues.
  function scheduleTick() {
    stopTicker();
    if (state.phase !== 'playing') return;
    const now = performance.now();
    const nextCharacter = readingPaused() ? 100 : Math.min(...state.customers.map((customer) => customer.served ? Math.max(1, customer.deliverUntil - now) : customer.startsAt > now ? customer.startsAt - now : customer.index < customer.characters.length ? Math.max(1, customer.nextCharacterAt - now) : 100));
    const delay = Math.max(0, Math.min(100, state.deadline - now, nextCharacter));
    state.tickTimer = setTimeout(() => {
      state.tickTimer = null;
      if (!timeAvailable()) return;
      const currentTime = performance.now();
      const paused = readingPaused();
      let requestsChanged = false;
      state.customers.forEach((customer, index) => {
        if (customer.served) {
          if (currentTime >= customer.deliverUntil) {
            state.customers[index] = customer.replacement;
            requestsChanged = true;
          }
          return;
        }
        customer.card.hidden = currentTime < customer.startsAt;
        if (paused) { customer.nextCharacterAt = Math.max(customer.startsAt, currentTime) + CHARACTER_DELAY; return; }
        if (customer.index >= customer.characters.length || currentTime < customer.nextCharacterAt) return;
        customer.index += 1;
        customer.nextCharacterAt = currentTime + CHARACTER_DELAY;
        const visible = customer.characters.slice(0, customer.index);
        const orderPart = visible.slice(customer.introductionLength);
        const introPart = visible.slice(0, customer.introductionLength);
        const nameEnd = customer.prefixLength + customer.menuNameLength;
        customer.prefixText.textContent = introPart.slice(0, customer.prefixLength).join('');
        customer.menuNameText.textContent = introPart.slice(customer.prefixLength, nameEnd).join('');
        customer.suffixText.textContent = introPart.slice(nameEnd).join('');
        customer.orderLine.hidden = orderPart.length === 0;
        customer.labelText.textContent = orderPart.slice(0, customer.labelLength).join('');
        customer.orderNumber.textContent = orderPart.slice(customer.labelLength).join('');
        customer.introductionText.classList.toggle('typing', orderPart.length === 0);
        customer.orderNumber.classList.toggle('typing', orderPart.length > 0);
        if (customer.index === customer.characters.length) {
          customer.introductionText.classList.remove('typing');
          customer.orderNumber.classList.remove('typing');
          customer.accessible.textContent = `${customer.characters.slice(0, customer.introductionLength).join('')}\n${customer.characters.slice(customer.introductionLength).join('')}`;
        }
      });
      if (requestsChanged) renderRequests();
      scheduleTick();
    }, delay);
  }
  function startGame() {
    stopTicker();
    const now = performance.now();
    Object.assign(state, { phase: 'playing', code: '', combo: 0, maxCombo: 0, mistakes: 0, orders: [], customers: [], requestCounts: {}, speakerSequence: 0, deadline: now + GAME_DURATION, nextRequestStartAt: now, pendingResult: false });
    $('#score').textContent = '0';
    $('#submit-button span').textContent = '次へ進む';
    $('#start-screen').hidden = true;
    $('#start-button').disabled = true;
    document.body.classList.remove('is-ready');
    document.body.classList.add('is-playing');
    $('.order-panel').classList.remove('celebrate');
    $('.customer-area').classList.add('rush-mode');
    $('.customer-area').scrollTop = 0;
    $('#rush-status').hidden = false;
    for (let index = 0; index < MAX_PENDING; index += 1) state.customers.push(createRequest(undefined, 0));
    renderRequests();
    feedback('');
    renderCode();
    renderTime();
    scheduleTick();
    $('#code-display').focus();
  }
  function inputKey(key) {
    if (!timeAvailable() || readingPaused()) return;
    if (key === 'clear') state.code = '';
    else if (key === 'back') state.code = state.code.slice(0, -1);
    else if (/^\d$/.test(key) && state.code.length < 4) { state.code += key; beep(); }
    else return;
    $('.order-panel').classList.remove('celebrate');
    feedback('');
    renderCode();
  }
  function submitOrder() {
    if (state.phase === 'finished') { startGame(); return; }
    if (!timeAvailable() || readingPaused() || state.code.length !== 4) return;
    const index = state.customers.findIndex((customer) => !customer.served && customer.menu.code === state.code && performance.now() >= customer.startsAt);
    if (index < 0) {
      state.mistakes += 1;
      state.combo = 0;
      feedback('番号が違うよ', 'error');
      $('#code-display').classList.remove('shake');
      void $('#code-display').offsetWidth;
      $('#code-display').classList.add('shake');
    } else {
      const customer = state.customers[index];
      state.orders.push(customer.menu);
      state.combo += 1;
      state.maxCombo = Math.max(state.maxCombo, state.combo);
      // Reserve the next request immediately, while the success effect plays.
      customer.replacement = createRequest(customer.menu.code);
      customer.served = true;
      customer.deliverUntil = performance.now() + 700;
      customer.card.classList.add('order-correct');
      customer.accessible.textContent = '正解！';
      $('#score').textContent = String(state.orders.length);
      feedback('✓', 'success');
      $('.order-panel').classList.add('celebrate');
      beep(true);
    }
    state.code = '';
    renderCode();
  }
  function finishGame() {
    if (state.phase !== 'playing') return;
    state.phase = 'finished';
    state.code = '';
    stopTicker();
    state.customers.forEach((customer) => {
      customer.introductionText.classList.remove('typing');
      customer.orderNumber.classList.remove('typing');
    });
    const count = state.orders.length;
    const attempts = count + state.mistakes;
    $('#result-score').textContent = `${count}品`;
    $('#result-accuracy').textContent = `${attempts ? Math.round(count / attempts * 100) : 0}%`;
    $('#result-combo').textContent = String(state.maxCombo);
    const newBest = count > state.best;
    if (newBest) {
      state.best = count;
      try { localStorage.setItem(BEST_KEY, String(state.best)); } catch { /* Storage is optional. */ }
      $('#best').textContent = String(state.best);
    }
    $('#best-message').textContent = newBest ? 'ベスト更新！' : '';
    $('#submit-button span').textContent = 'もう一度';
    renderCode();
    renderTime();
    if (!dialogs.some((dialog) => dialog.open)) $('#result-dialog').showModal();
    else state.pendingResult = true;
  }
  function menuRow(menu) {
    const row = document.createElement('div');
    row.className = 'menu-row';
    const emoji = document.createElement('span');
    emoji.className = 'menu-emoji';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent = menu.emoji;
    const name = document.createElement('span');
    name.className = 'menu-name';
    name.textContent = menuLabel(menu);
    const code = document.createElement('code');
    code.textContent = menu.code;
    row.append(emoji, name, code);
    return row;
  }
  function openDialog(selector) {
    if (state.phase === 'playing' && !timeAvailable()) return;
    $(selector).showModal();
  }
  $('#menu-list').replaceChildren(...MENU_CATALOG.map(menuRow));
  keys.forEach((key) => key.addEventListener('click', () => inputKey(key.dataset.key)));
  $('#start-button').addEventListener('click', () => { if (state.phase === 'ready') startGame(); });
  $('#submit-button').addEventListener('click', submitOrder);
  $('#help-button').addEventListener('click', () => openDialog('#help-dialog'));
  $('#menu-button').addEventListener('click', () => openDialog('#menu-dialog'));
  $('#sound-toggle').addEventListener('click', () => {
    state.sound = !state.sound;
    $('#sound-toggle').setAttribute('aria-pressed', String(state.sound));
    $('#sound-toggle').setAttribute('aria-label', `効果音を${state.sound ? 'オフ' : 'オン'}にする`);
    $('#sound-toggle').classList.toggle('sound-off', !state.sound);
    beep();
  });
  dialogs.forEach((dialog) => {
    dialog.querySelectorAll('.close-dialog, .close-dialog-action').forEach((button) => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      if (state.phase === 'playing' && !timeAvailable()) return;
      if (state.pendingResult && !dialogs.some((item) => item.open)) {
        state.pendingResult = false;
        $('#result-dialog').showModal();
      }
    });
    dialog.addEventListener('click', (event) => {
      if (dialog.id === 'result-dialog') return;
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  });
  $('#replay-button').addEventListener('click', () => { $('#result-dialog').close(); startGame(); });
  $('#result-close').addEventListener('click', () => $('#result-dialog').close());
  document.addEventListener('visibilitychange', () => {
    if (state.phase === 'playing' && timeAvailable()) {
      state.customers.forEach((customer) => { customer.nextCharacterAt = Math.max(customer.startsAt, performance.now()) + CHARACTER_DELAY; });
      scheduleTick();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing || dialogs.some((dialog) => dialog.open)) return;
    if (/^\d$/.test(event.key)) { event.preventDefault(); inputKey(event.key); }
    else if (event.key === 'Backspace') { event.preventDefault(); inputKey('back'); }
    else if (event.key === 'Delete') { event.preventDefault(); inputKey('clear'); }
    else if (event.key === 'Enter' && (event.target === document.body || event.target === $('#code-display') || (state.phase === 'playing' && event.target.closest('[data-key]')))) {
      event.preventDefault();
      submitOrder();
    }
  });
  renderCode();
  renderTime();
})();
