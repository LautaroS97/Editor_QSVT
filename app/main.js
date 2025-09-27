import { parseGdQuestions } from "./lib/gd-parse.js";
import { generateGdQuestions } from "./lib/gd-generate.js";
import { openTextFile, downloadTextFile } from "./lib/file-io.js";
import { initStore, subscribe, getQuestions, setSelectedIndex, addQuestion, updateQuestion, deleteQuestion, duplicateQuestion, moveUp, moveDown } from "./store.js";
import { mountList } from "./ui/list.js";
import { mountForm } from "./ui/form.js";

const listRoot = document.getElementById("list-root");
const formRoot = document.getElementById("form-root");

const listUI = mountList(listRoot, {
  onSelect: i => setSelectedIndex(i),
  onNew: () => addQuestion(),
  onDelete: i => deleteQuestion(i),
  onDuplicate: i => duplicateQuestion(i),
  onMoveUp: i => moveUp(i),
  onMoveDown: i => moveDown(i)
});

const formUI = mountForm(formRoot, {
  onChange: ({ question, index }) => {
    if (Number.isInteger(index) && index >= 0) updateQuestion(index, question);
  }
});

function wireHeaderButtons() {
  const btnOpen = listRoot.querySelector("[data-open]");
  const btnSave = listRoot.querySelector("[data-save]");
  if (btnOpen) btnOpen.addEventListener("click", onOpen);
  if (btnSave) {
    btnSave.addEventListener("click", e => onSave({ perCategory: e.shiftKey }));
    btnSave.title = "Guardar (Shift = por categoría)";
  }
}

async function onOpen() {
  try {
    const file = await openTextFile(".gd,.tres,.txt,.json");
    if (!file) return;
    const arr = parseGdQuestions(file.text) || [];
    const normalized = arr.map((q, i) => {
      const x = { ...q };
      if (!x.name || !x.name.trim()) x.name = x.id || `pregunta_${i + 1}`;
      return x;
    });
    initStore(normalized);
  } catch {}
}

function onSave({ perCategory = false } = {}) {
  const data = getQuestions();
  if (!perCategory) {
    const gd = generateGdQuestions(data);
    downloadTextFile("Preguntas.gd", gd);
    return;
  }
  const byCat = data.reduce((m, q) => {
    const k = (q.category || "misc").toLowerCase();
    (m[k] ||= []).push(q);
    return m;
  }, {});
  for (const [cat, arr] of Object.entries(byCat)) {
    const gd = generateGdQuestions(arr);
    const name = `Preguntas${cat.charAt(0).toUpperCase()}${cat.slice(1)}.gd`;
    downloadTextFile(name, gd);
  }
}

function jsonEqual(a, b) {
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
}

subscribe(({ questions, selectedIndex }) => {
  listUI.setData(questions, selectedIndex);

  const ae = document.activeElement;
  const isTyping =
    ae &&
    formUI.root?.contains?.(ae) &&
    (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA");

  if (selectedIndex >= 0 && selectedIndex < questions.length) {
    const incoming = questions[selectedIndex];
    const current = formUI.getQuestion?.();
    if (!isTyping) {
      if (!current || !jsonEqual(current, incoming)) {
        formUI.setQuestion(incoming, selectedIndex);
      }
    }
  } else {
    if (!isTyping) formUI.setQuestion(null, -1);
  }
});

initStore([]);
wireHeaderButtons();
