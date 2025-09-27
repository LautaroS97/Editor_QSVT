import { emptyQuestion, nextAutoId, ensureOptionIds } from "./lib/schema.js";

let _questions = [];
let _selectedIndex = -1;
const _subs = new Set();

function notify() {
  const snapshot = getQuestions();
  _subs.forEach(fn => {
    try { fn({ questions: snapshot, selectedIndex: _selectedIndex }); } catch {}
  });
}

export function initStore(initial = []) {
  setAll(initial);
}

export function subscribe(fn) {
  if (typeof fn === "function") {
    _subs.add(fn);
    fn({ questions: getQuestions(), selectedIndex: _selectedIndex });
  }
  return () => _subs.delete(fn);
}

export function getQuestions() {
  return JSON.parse(JSON.stringify(_questions));
}

export function getSelectedIndex() {
  return _selectedIndex;
}

export function setSelectedIndex(i) {
  const n = Number(i);
  if (Number.isInteger(n) && n >= 0 && n < _questions.length) {
    if (_selectedIndex !== n) {
      _selectedIndex = n;
      notify();
    }
  }
}

export function setAll(list) {
  const arr = Array.isArray(list) ? JSON.parse(JSON.stringify(list)) : [];
  let nextId = 1;
  for (const q of arr) {
    if (!Number.isInteger(q.auto_id) || q.auto_id <= 0) {
      q.auto_id = nextId++;
    } else {
      nextId = Math.max(nextId, q.auto_id + 1);
    }
    q.options = ensureOptionIds(q.options);
  }
  _questions = arr;
  _selectedIndex = _questions.length ? 0 : -1;
  notify();
}

export function addQuestion(q = null) {
  const nq = q ? JSON.parse(JSON.stringify(q)) : emptyQuestion();
  nq.auto_id = nextAutoId(_questions);
  nq.options = ensureOptionIds(nq.options);
  _questions.push(nq);
  _selectedIndex = _questions.length - 1;
  notify();
  return _selectedIndex;
}

export function updateQuestion(index, q) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= _questions.length) return;
  const prev = _questions[i];
  const nx = JSON.parse(JSON.stringify(q));
  if (!Number.isInteger(nx.auto_id) || nx.auto_id <= 0) nx.auto_id = prev.auto_id;
  nx.options = ensureOptionIds(nx.options);

  const same = (() => {
    try { return JSON.stringify(prev) === JSON.stringify(nx); } catch { return false; }
  })();
  if (same) return;

  _questions[i] = nx;
  notify();
}

export function deleteQuestion(index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= _questions.length) return;
  _questions.splice(i, 1);
  if (_questions.length === 0) {
    _selectedIndex = -1;
  } else if (_selectedIndex >= _questions.length) {
    _selectedIndex = _questions.length - 1;
  }
  notify();
}

export function moveQuestion(fromIndex, toIndex) {
  const from = Number(fromIndex);
  const to = Number(toIndex);
  if (!Number.isInteger(from) || !Number.isInteger(to)) return;
  if (from < 0 || from >= _questions.length) return;
  if (to < 0 || to >= _questions.length) return;
  if (from === to) return;
  const [item] = _questions.splice(from, 1);
  _questions.splice(to, 0, item);
  if (_selectedIndex === from) _selectedIndex = to;
  else if (from < _selectedIndex && to >= _selectedIndex) _selectedIndex -= 1;
  else if (from > _selectedIndex && to <= _selectedIndex) _selectedIndex += 1;
  notify();
}

export function moveUp(index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i <= 0 || i >= _questions.length) return;
  moveQuestion(i, i - 1);
}

export function moveDown(index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= _questions.length - 1) return;
  moveQuestion(i, i + 1);
}

export function duplicateQuestion(index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= _questions.length) return;
  const src = JSON.parse(JSON.stringify(_questions[i]));
  src.auto_id = nextAutoId(_questions);
  if (src.name) src.name = src.name + " (copia)";
  _questions.splice(i + 1, 0, src);
  _selectedIndex = i + 1;
  notify();
  return _selectedIndex;
}
