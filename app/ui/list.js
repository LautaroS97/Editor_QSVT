import { ROLES_LABEL, CATEGORY_LABEL, SCOPE_LABEL, PROVINCE_LABEL } from "../lib/schema.js";
import { validateQuestion } from "../lib/validate.js";

export function mountList(container, { onSelect, onNew, onDelete, onDuplicate, onMoveUp, onMoveDown } = {}) {
  container.innerHTML = `
    <header>
      <div>Preguntas</div>
      <div class="actions">
        <button class="primary" data-new>Nuevo</button>
        <button class="secondary" data-open>Abrir</button>
        <button class="secondary" data-save>Guardar</button>
      </div>
    </header>
    <ul class="list"></ul>
    <div class="toolbar">
      <span class="hint">Seleccioná una pregunta para editar</span>
    </div>
  `;

  const ul = container.querySelector("ul");
  const btnNew = container.querySelector("[data-new]");

  if (btnNew) btnNew.addEventListener("click", () => onNew && onNew());

  function thirdPartyStats(q) {
    let byForce = 0, byAgenda = 0, byOfficialism = 0, bySector = 0;
    const opts = Array.isArray(q?.options) ? q.options : [];
    for (const o of opts) {
      const effs = Array.isArray(o?.effects) ? o.effects : [];
      for (const e of effs) {
        const t = String(e?.type || "");
        if (t !== "affect_force_stats" && t !== "force_support_loss") continue;
        if (Number.isInteger(e?.force_id) && e.force_id >= 0) byForce++;
        else if (typeof e?.by_agenda === "string" && e.by_agenda) byAgenda++;
        else if (e?.by_officialism === true) byOfficialism++;
        else if (typeof e?.by_sector_support === "string" && e.by_sector_support) bySector++;
      }
    }
    const total = byForce + byAgenda + byOfficialism + bySector;
    return {
      has: total > 0,
      title: `Por fuerza: ${byForce} · Por agenda: ${byAgenda} · Por rol oficialista: ${byOfficialism} · Por apoyo sectorial: ${bySector}`
    };
  }

  function renderItem(q, i, active) {
    const li = document.createElement("li");
    li.className = active ? "active" : "";
    const problems = validateQuestion(q);
    const hasIssues = !problems.ok;

    const role = q?.role_target;
    const cat = q?.category || "";
    const name = q?.name || "(sin nombre)";
    const auto = Number.isInteger(q?.auto_id) ? `#${q.auto_id}` : "";

    const roleLabel = ROLES_LABEL[role] || "";
    const catLabel = CATEGORY_LABEL[cat] || cat;
    const scopeLabel = q?.scope ? (SCOPE_LABEL[q.scope] || q.scope) : "";
    const provinceLabel = q?.scope === "provincial" && q.province ? (PROVINCE_LABEL[q.province] || q.province) : "";
    const third = thirdPartyStats(q);

    li.innerHTML = `
      <div class="left" style="display:flex;flex-direction:column;gap:2px">
        <div style="display:flex;align-items:center;gap:8px">
          <strong>${escapeHtml(name)}</strong>
          <span class="muted">${auto}</span>
          ${hasIssues ? `<span title="Problemas de validación" style="color:#b00020">⚠</span>` : ""}
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          ${roleLabel ? `<span class="pill">${escapeHtml(roleLabel)}</span>` : ""}
          ${cat ? `<span class="pill">${escapeHtml(catLabel)}</span>` : ""}
          ${q.scope ? `<span class="pill">${escapeHtml(scopeLabel)}</span>` : ""}
          ${provinceLabel ? `<span class="pill">${escapeHtml(provinceLabel)}</span>` : ""}
          ${third.has ? `<span class="pill" title="${escapeHtml(third.title)}">3ºs fuerzas</span>` : ""}
        </div>
      </div>
      <div class="actions">
        <button title="Subir" data-up>↑</button>
        <button title="Bajar" data-down>↓</button>
        <button title="Duplicar" data-dup>⧉</button>
        <button title="Eliminar" data-del>🗑</button>
      </div>
    `;

    li.addEventListener("click", e => {
      const target = e.target;
      if (target.closest("button")) return;
      onSelect && onSelect(i);
    });

    li.querySelector("[data-up]")?.addEventListener("click", e => {
      e.stopPropagation();
      onMoveUp && onMoveUp(i);
    });
    li.querySelector("[data-down]")?.addEventListener("click", e => {
      e.stopPropagation();
      onMoveDown && onMoveDown(i);
    });
    li.querySelector("[data-dup]")?.addEventListener("click", e => {
      e.stopPropagation();
      onDuplicate && onDuplicate(i);
    });
    li.querySelector("[data-del]")?.addEventListener("click", e => {
      e.stopPropagation();
      if (confirm("¿Eliminar esta pregunta?")) onDelete && onDelete(i);
    });

    return li;
  }

  function setData(arr, selectedIndex) {
    ul.innerHTML = "";
    if (!Array.isArray(arr) || arr.length === 0) {
      const empty = document.createElement("div");
      empty.style.padding = "12px";
      empty.textContent = "No hay preguntas. Creá una nueva.";
      ul.appendChild(empty);
      return;
    }
    arr.forEach((q, i) => {
      const li = renderItem(q, i, i === selectedIndex);
      ul.appendChild(li);
    });
  }

  return { setData };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
