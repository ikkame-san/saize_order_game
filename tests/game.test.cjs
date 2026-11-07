const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function setup(random = Math.random, initialStorage = {}) {
  const timers = new Map();
  let timerID = 0;
  let now = 0;
  class Element {
    constructor(tagName = '') { this.tagName = tagName.toUpperCase(); this._textContent = ''; this.disabled = false; this.open = false; this.events = {}; this.attrs = {}; this.children = []; this.dataset = {}; this.classes = new Set(); this.classList = { add: (v) => this.classes.add(v), remove: (v) => this.classes.delete(v), toggle: (v, on) => on ? this.classes.add(v) : this.classes.delete(v) }; }
    get textContent() { return this._textContent + this.children.map((child) => child.textContent).join(''); }
    set textContent(value) { this._textContent = String(value); this.children = []; }
    addEventListener(name, handler) { (this.events[name] ??= []).push(handler); }
    fire(name, event = {}) { (this.events[name] || []).forEach((handler) => handler(event)); }
    click() { if (!this.disabled) this.fire('click'); }
    setAttribute(name, value) { this.attrs[name] = value; }
    replaceChildren(...items) { this.children = items; }
    append(...items) { this.children.push(...items); }
    querySelectorAll() { return []; }
    showModal() { this.open = true; }
    close() { this.open = false; this.fire('close'); }
    closest() { return null; }
    focus() {}
  }
  const nodes = new Map();
  const get = (id) => { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); };
  const keys = [...'123456789', 'clear', '0', 'back'].map((value) => { const key = new Element(); key.dataset.key = value; return key; });
  const dialogs = ['help', 'menu', 'result'].map((name) => get(`#${name}-dialog`));
  const document = new Element();
  document.hidden = false;
  document.body = new Element();
  document.querySelector = (selector) => {
    const id = selector.match(/^#([\w-]+)/)?.[1];
    if (id && !page.includes(`id="${id}"`)) throw new Error(`Missing DOM element: ${selector}`);
    return get(selector);
  };
  document.querySelectorAll = (selector) => ({ '[data-key]': keys, dialog: dialogs })[selector];
  document.createElement = (tagName) => new Element(tagName);
  const storage = new Map(Object.entries(initialStorage));
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8'), {
    document, window: {}, console, performance: { now: () => now },
    Math: Object.assign(Object.create(Math), { random }),
    localStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    setTimeout: (fn, delay) => { timers.set(++timerID, { fn, at: now + delay }); return timerID; },
    clearTimeout: (id) => timers.delete(id),
  });
  const tick = (ms) => {
    const end = now + ms;
    while (true) {
      const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
      if (!next || next[1].at > end) break;
      now = Math.max(now, next[1].at);
      timers.delete(next[0]);
      next[1].fn();
    }
    now = end;
  };
  const key = (value) => keys.find((item) => item.dataset.key === value).click();
  const type = (code) => [...code].forEach(key);
  const start = () => get('#start-button').click();
  const submit = () => get('#submit-button').click();
  const customers = () => get('.customer-area').children;
  const speech = (index) => customers()[index].children[0].textContent;
  const allCodes = () => customers().map((card) => card.children[0].textContent.match(/\d{4}$/)[0]);
  const jump = (ms) => { now += ms; };
  const number = () => get('#number-value').textContent;
  return { get, tick, jump, key, type, start, submit, customers, speech, allCodes, document, storage, number };
}


test('開始までは進まず、3枠の注文が4秒間隔で始まり、400msずつ文字送りする', () => {
  const app = setup();
  assert.equal(app.get('#submit-button').disabled, true);
  app.tick(10000);
  assert.equal(app.customers().length, 0);
  assert.equal(app.get('#time-left').textContent, '1:00');
  app.start();
  assert.equal(app.customers().length, 3);
  assert.equal(app.get('#start-screen').hidden, true);
  app.start();
  assert.equal(app.customers().length, 3);
  assert.equal(app.customers()[0].hidden, false);
  assert.equal(app.customers()[1].hidden, true);
  assert.equal(app.customers()[2].hidden, true);
  app.tick(399);
  app.customers().forEach((card) => assert.equal(card.children[0].textContent, ''));
  app.tick(1);
  assert.equal([...app.speech(0)].length, 1);
  assert.equal(app.speech(1), '');
  app.tick(3600);
  assert.equal(app.customers()[1].hidden, false);
  assert.equal(app.speech(1), '');
  app.tick(399); assert.equal(app.speech(1), '');
  app.tick(1); assert.equal([...app.speech(1)].length, 1);
  app.tick(3600); assert.equal(app.customers()[2].hidden, false);
  app.tick(400); assert.equal([...app.speech(2)].length, 1);
  app.tick(30000);
  assert.equal(app.customers().length, 3);
  assert.equal(new Set(app.allCodes()).size, 3);
  assert.equal(app.get('#score').textContent, '0');
});

test('正解した枠だけを補充し、他の2件の会話は維持する。不正解は補充しない', () => {
  const app = setup(() => 0.999999); app.start(); app.tick(20000);
  const before = [...app.customers()];
  const codes = app.allCodes();
  app.type(codes[1]); app.submit();
  assert.equal(app.get('#score').textContent, '1');
  assert.equal(app.customers().length, 3);
  assert.equal(app.customers()[0], before[0]);
  assert.equal(app.customers()[2], before[2]);
  assert.equal(app.customers()[1], before[1]);
  assert.equal(app.customers()[1].classes.has('order-correct'), true);
  app.type(codes[1]); app.submit();
  assert.equal(app.get('#score').textContent, '1');
  assert.match(app.get('#menu-preview').textContent, /違う/);
  assert.equal(app.get('#menu-preview').classes.has('order-error'), true);
  app.tick(700);
  assert.notEqual(app.customers()[1], before[1]);
  assert.equal(app.speech(1), '');
  assert.equal(app.customers()[1].hidden, true);
  app.tick(799);
  assert.equal(app.customers()[1].hidden, true);
  app.tick(1);
  assert.equal(app.customers()[1].hidden, false);
  app.tick(399);
  assert.equal(app.speech(1), '');
  app.tick(1);
  assert.equal([...app.speech(1)].length, 1);
});

test('5品を超えて注文でき、60秒で終了。ベストは注文数を新しい保存先に記録する', () => {
  const app = setup(() => 0.999999, { 'saize-order-best': '700' });
  assert.equal(app.get('#best').textContent, '—');
  app.start();
  for (let index = 0; index < 8; index += 1) {
    app.tick(index === 0 ? 0 : index === 1 ? 12000 : 4000);
    app.type(['3901', '1405', '2301', '2203', '1401', '1202', '2101', '3914'][index]); app.submit();
    assert.equal(app.customers().length, 3);
    assert.equal(app.get('#score').textContent, String(index + 1));
  }
  assert.equal(app.get('#score').textContent, '8');
  assert.equal(app.get('#result-dialog').open, false);
  app.tick(23999);
  assert.equal(app.get('#time-left').textContent, '0:01');
  assert.equal(app.get('#result-dialog').open, false);
  app.tick(1);
  assert.equal(app.get('#time-left').textContent, '0:00');
  assert.equal(app.get('#result-dialog').open, true);
  assert.equal(app.get('#result-score').textContent, '8品');
  assert.equal(app.get('#result-accuracy').textContent, '100%');
  assert.equal(app.storage.get('saize-order-timeattack-best'), '8');
  assert.equal(app.storage.get('saize-order-best'), '700');
  const cards = [...app.customers()]; app.tick(10000);
  cards.forEach((card, index) => assert.equal(app.customers()[index], card));
  app.type('3901'); assert.equal(app.number(), '');
});

test('ブラウザのタイマーが遅延しても、期限ちょうどの送信を加算しない', () => {
  const app = setup(() => 0.999999); app.start(); app.type('3901');
  app.jump(60000); // No timer callback runs during this jump.
  app.submit();
  assert.equal(app.get('#score').textContent, '0');
  assert.equal(app.get('#result-dialog').open, true);
  assert.equal(app.get('#result-score').textContent, '0品');
  assert.equal(app.get('#result-accuracy').textContent, '0%');
});

test('メニュー・背景タブでは文字送りだけ停止し、60秒の時計は止めない', () => {
  const app = setup(); app.start(); app.tick(400);
  app.get('#menu-button').click(); app.tick(10000);
  assert.equal([...app.speech(0)].length, 1);
  assert.equal(app.get('#time-left').textContent, '0:50');
  app.get('#menu-dialog').close(); app.tick(400);
  assert.equal([...app.speech(0)].length, 2);
  app.document.hidden = true; app.document.fire('visibilitychange');
  app.jump(60000);
  app.document.hidden = false; app.document.fire('visibilitychange');
  assert.equal(app.get('#result-dialog').open, true);
  assert.equal(app.get('#time-left').textContent, '0:00');
});

test('メニュー表示中の時間切れは結果表示を待ち、閉じた後に結果を出す', () => {
  const app = setup(); app.start();
  app.get('#menu-button').click(); app.tick(60000);
  assert.equal(app.get('#result-dialog').open, false);
  assert.equal(app.get('#time-left').textContent, '0:00');
  app.get('#menu-dialog').close();
  assert.equal(app.get('#result-dialog').open, true);
});

test('再プレイは新しい60秒・3件・注文数ゼロから始まりベストを維持する', () => {
  const app = setup(() => 0.999999); app.start();
  app.type('3901'); app.submit(); app.tick(60000);
  app.get('#replay-button').click();
  assert.equal(app.get('#result-dialog').open, false);
  assert.equal(app.get('#time-left').textContent, '1:00');
  assert.equal(app.get('#score').textContent, '0');
  assert.equal(app.get('#best').textContent, '1');
  assert.equal(app.customers().length, 3);
  app.tick(59999); assert.equal(app.get('#result-dialog').open, false);
  app.tick(1); assert.equal(app.get('#result-dialog').open, true);
});

test('デザートはすぐに／あとでを明言し、別の番号で扱う', () => {
  const app = setup(() => 0.999999); app.start(); app.tick(20000);
  assert.match(app.speech(0), /^私はあとでティラミス クラシコが食べたい！注文番号は3901$/);
  const dessertNow = setup(() => 0.99); dessertNow.start(); dessertNow.tick(20000);
  assert.match(dessertNow.speech(0), /^私はすぐにティラミス クラシコが食べたい！注文番号は3201$/);
  app.type('3201');
  assert.equal(app.get('#menu-preview').textContent, 'ティラミス クラシコ（すぐに）');
  app.submit();
  assert.match(app.speech(0), /3901$/);
  app.type('3901'); app.submit();
  assert.equal(app.get('#score').textContent, '1');
  dessertNow.type('3201'); dessertNow.submit();
  assert.equal(dessertNow.get('#score').textContent, '1');
});

test('追加メニューや飲み物も出題され、飲み物は飲みたいと伝える', () => {
  const food = setup(() => 0); food.start(); food.tick(20000);
  assert.match(food.speech(0), /蒸し鶏の香味ソースが食べたい！注文番号は1408$/);
  const drink = setup(() => 26.5 / 105); drink.start(); drink.tick(20000);
  assert.match(drink.speech(0), /キッズドリンクバーが飲みたい！注文番号は5102$/);
  drink.type('5102'); drink.submit();
  assert.equal(drink.get('#score').textContent, '1');
});

test('注文外でも品名は表示し、削除・4桁制限・PC入力・誤注文判定を維持する', () => {
  const app = setup(() => 0.999999); app.start();
  app.type('1408');
  assert.equal(app.get('#menu-preview').textContent, '蒸し鶏の香味ソース');
  app.type('9'); assert.equal(app.number(), '1408');
  app.key('back'); assert.equal(app.number(), '140');
  assert.equal(app.get('#menu-preview').hidden, true);
  app.key('clear'); app.type('1408'); app.submit();
  assert.equal(app.get('#score').textContent, '0');
  assert.match(app.get('#menu-preview').textContent, /違う/);
  assert.equal(app.get('#menu-preview').hidden, false);
  const press = (key) => app.document.fire('keydown', { key, target: app.document.body, preventDefault() {} });
  press('3'); assert.equal(app.get('#menu-preview').hidden, true);
  [...'901'].forEach(press); press('Enter');
  assert.equal(app.get('#score').textContent, '1');
  app.tick(60000);
  assert.equal(app.get('#result-accuracy').textContent, '50%');
});

test('連続で注文を済ませると各枠で1.5秒後に補充し、開始待ちの番号は正解にしない', () => {
  const app = setup(() => 0.999999); app.start(); app.tick(20000);
  app.allCodes().forEach((code) => { app.type(code); app.submit(); });
  assert.equal(app.get('#score').textContent, '3');
  assert.equal(app.customers().length, 3);
  app.customers().forEach((card) => assert.equal(card.classes.has('order-correct'), true));
  app.type('2328'); app.submit();
  assert.equal(app.get('#score').textContent, '3');
  app.tick(700);
  app.customers().forEach((card) => assert.equal(card.hidden, true));
  app.tick(799);
  app.customers().forEach((card) => assert.equal(card.hidden, true));
  app.tick(1);
  app.customers().forEach((card) => assert.equal(card.hidden, false));
  assert.equal(app.speech(0), '');
  app.tick(399); assert.equal(app.speech(0), '');
  app.tick(1);
  app.customers().forEach((card, index) => assert.equal([...app.speech(index)].length, 1));
});

test('最初の開始待ちがある間も、正解した枠は1.5秒で補充する', () => {
  const app = setup(() => 0.999999); app.start();
  app.type('3901'); app.submit();
  app.tick(1499);
  assert.equal(app.customers()[0].hidden, true);
  assert.equal(app.customers()[1].hidden, true);
  app.tick(1);
  assert.equal(app.customers()[0].hidden, false);
  assert.equal(app.customers()[1].hidden, true);
  app.tick(2500);
  assert.equal(app.customers()[1].hidden, false);
  assert.equal(app.customers()[2].hidden, true);
});

test('注文番号は別の行に移り、4桁は強調しながら400msずつ表示される', () => {
  const app = setup(() => 0.999999); app.start();
  const intro = '私はあとでティラミス クラシコが食べたい！';
  const text = app.customers()[0].children[0];
  const body = text.children[0];
  const line = text.children[1];
  const label = line.children[0];
  const number = line.children[1];
  app.tick([...intro].length * 400);
  assert.equal(body.textContent, intro);
  assert.equal(line.hidden, true);
  app.tick(399); assert.equal(line.hidden, true);
  app.tick(1);
  assert.equal(line.hidden, false);
  assert.equal(label.textContent, '注');
  assert.equal(number.textContent, '');
  app.tick(1600);
  assert.equal(label.textContent, '注文番号は');
  assert.equal(number.textContent, '');
  app.tick(400); assert.equal(number.textContent, '3');
  app.tick(1200);
  assert.equal(number.textContent, '3901');
  assert.equal(number.className, 'order-number');
  assert.equal(number.classes.has('typing'), false);
  assert.equal(app.customers()[0].children[1].textContent, `${intro}\n注文番号は3901`);
});

test('料理名だけを太字にし、文字送り中も料理名が1文字ずつ現れる', () => {
  const app = setup(() => 0.999999); app.start();
  const introduction = app.customers()[0].children[0].children[0];
  const [prefix, menuName, suffix] = introduction.children;
  const name = 'ティラミス クラシコ';
  assert.equal(menuName.tagName, 'STRONG');
  assert.equal(menuName.className, 'menu-name-emphasis');
  app.tick(2000);
  assert.equal(prefix.textContent, '私はあとで');
  assert.equal(menuName.textContent, '');
  assert.equal(suffix.textContent, '');
  app.tick(399); assert.equal(menuName.textContent, '');
  app.tick(1); assert.equal(menuName.textContent, 'テ');
  app.tick(([...name].length - 1) * 400);
  assert.equal(menuName.textContent, name);
  assert.equal(suffix.textContent, '');
  app.tick(400);
  assert.equal(suffix.textContent, 'が');
  assert.equal(introduction.textContent, `私はあとで${name}が`);
});
