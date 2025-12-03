let _forceMapCache = null;

const FORCE_CATALOG = [
  { id: 0, slug: "peronismo", name: "Peronismo" },
  { id: 1, slug: "republicanismo", name: "Republicanismo" },
  { id: 2, slug: "trotskismo", name: "Trotskismo" },
  { id: 3, slug: "libertarismo", name: "Libertarismo" },
  { id: 4, slug: "progresismo", name: "Progresismo" },
  { id: 5, slug: "nacionalismo", name: "Nacionalismo" }
];

function buildForceMap() {
  if (_forceMapCache) return _forceMapCache;
  const map = {};
  FORCE_CATALOG.forEach(it => {
    map[String(it.id)] = {
      id: it.id,
      slug: it.slug,
      name: it.name,
      path: `assets/forces/${it.slug}.png`
    };
  });
  _forceMapCache = map;
  return _forceMapCache;
}

function iconPathFor(key, map) {
  const entry = map[key];
  if (!entry) return "";
  if (typeof entry.path === "string") return entry.path;
  return "";
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildModal() {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-head">
      <div class="title">Seleccionar fuerza política</div>
      <button class="icon" data-act="close">✕</button>
    </div>
    <div class="modal-toolbar">
      <input type="text" class="search" placeholder="Buscar..."/>
    </div>
    <div class="icon-grid"></div>
    <div class="modal-foot">
      <div class="left">
        <span class="count">0 seleccionado</span>
      </div>
      <div class="right">
        <button class="btn" data-act="cancel">Cancelar</button>
        <button class="btn primary" data-act="ok">Aceptar</button>
      </div>
    </div>
  `;
  backdrop.appendChild(modal);
  return { backdrop, modal };
}

function renderGrid(grid, map, filterText, selectedIdRef) {
  grid.innerHTML = "";
  const ids = Object.keys(map).sort((a, b) => Number(a) - Number(b));
  const q = String(filterText || "").toLowerCase().trim();
  ids.forEach(idKey => {
    const entry = map[idKey];
    const idStr = String(entry.id);
    const name = String(entry.name || idStr);
    const slug = String(entry.slug || "");
    if (
      q &&
      !idStr.includes(q) &&
      !name.toLowerCase().includes(q) &&
      !slug.toLowerCase().includes(q)
    ) return;
    const cell = document.createElement("div");
    cell.className = "icon-item" + (selectedIdRef.value === idKey ? " selected" : "");
    cell.dataset.id = idKey;
    const p = iconPathFor(idKey, map);
    cell.innerHTML = `
      <div class="thumb">${p ? `<img src="${p}" alt="${escapeHtml(name)}">` : `<div class="noimg">${escapeHtml(name[0] || "?")}</div>`}</div>
      <div class="label">${escapeHtml(name)} <span class="muted">#${idStr}</span></div>
    `;
    cell.addEventListener("click", () => {
      if (selectedIdRef.value === idKey) {
        selectedIdRef.value = null;
        cell.classList.remove("selected");
      } else {
        selectedIdRef.value = idKey;
        Array.from(grid.children).forEach(n => n.classList.remove("selected"));
        cell.classList.add("selected");
      }
      const countNode = grid.parentElement.querySelector(".count");
      updateCount(countNode, selectedIdRef, map);
    });
    grid.appendChild(cell);
  });
}

function updateCount(node, selectedIdRef, map) {
  if (!node) return;
  if (selectedIdRef.value == null) {
    node.textContent = "0 seleccionado";
    return;
  }
  const entry = map[selectedIdRef.value];
  const label = entry ? entry.name : selectedIdRef.value;
  node.textContent = `1 seleccionado: ${label}`;
}

export function openForcePicker({ preselectedId = null } = {}) {
  const map = buildForceMap();
  return new Promise(resolve => {
    const { backdrop, modal } = buildModal();
    const grid = modal.querySelector(".icon-grid");
    const search = modal.querySelector(".search");
    const btnOk = modal.querySelector('[data-act="ok"]');
    const btnCancel = modal.querySelector('[data-act="cancel"]');
    const btnClose = modal.querySelector('[data-act="close"]');
    const selectedIdRef = { value: Number.isInteger(preselectedId) ? String(preselectedId) : null };

    renderGrid(grid, map, "", selectedIdRef);
    updateCount(modal.querySelector(".count"), selectedIdRef, map);

    function close(result) {
      backdrop.remove();
      resolve(result);
    }

    btnOk.addEventListener("click", () => {
      if (selectedIdRef.value == null) return close(null);
      const n = parseInt(selectedIdRef.value, 10);
      close(Number.isFinite(n) ? n : null);
    });
    btnCancel.addEventListener("click", () => {
      const n = Number.isInteger(preselectedId) ? preselectedId : null;
      close(n);
    });
    btnClose.addEventListener("click", () => {
      const n = Number.isInteger(preselectedId) ? preselectedId : null;
      close(n);
    });
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) {
        const n = Number.isInteger(preselectedId) ? preselectedId : null;
        close(n);
      }
    });
    search.addEventListener("input", () => {
      renderGrid(grid, map, search.value, selectedIdRef);
    });

    document.body.appendChild(backdrop);
    setTimeout(() => backdrop.classList.add("show"), 0);
  });
}
