let _iconMapCache = null;

function loadIconMap() {
  if (_iconMapCache) return Promise.resolve(_iconMapCache);
  return fetch("assets/icon_map.json")
    .then(r => {
      if (!r.ok) throw new Error("icon_map.json no encontrado");
      return r.json();
    })
    .then(list => {
      const map = {};
      (Array.isArray(list) ? list : []).forEach(it => {
        if (it && it.id && it.icon) {
          map[it.id] = { path: `assets/icons/${it.icon}`, name: it.name || it.id };
        }
      });
      _iconMapCache = map;
      return _iconMapCache;
    });
}

function iconPathFor(id, map) {
  const entry = map[id];
  if (!entry) return "";
  if (typeof entry === "string") return `assets/icons/${entry}`;
  if (entry && typeof entry.path === "string") return entry.path;
  return "";
}

function buildModal() {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-head">
      <div class="title">Seleccionar apoyos sectoriales</div>
      <button class="icon" data-act="close">✕</button>
    </div>
    <div class="modal-toolbar">
      <input type="text" class="search" placeholder="Buscar..."/>
    </div>
    <div class="icon-grid"></div>
    <div class="modal-foot">
      <div class="left">
        <span class="count">0 seleccionados</span>
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

function renderGrid(grid, map, filterText, selectedSet) {
  grid.innerHTML = "";
  const ids = Object.keys(map).sort((a, b) => a.localeCompare(b));
  const q = String(filterText || "").toLowerCase().trim();
  ids.forEach(id => {
    if (q && !id.toLowerCase().includes(q) && !String(map[id].name || "").toLowerCase().includes(q)) return;
    const cell = document.createElement("div");
    cell.className = "icon-item" + (selectedSet.has(id) ? " selected" : "");
    cell.dataset.id = id;
    const p = iconPathFor(id, map);
    cell.innerHTML = `
      <div class="thumb">${p ? `<img src="${p}" alt="${id}">` : `<div class="noimg">${id[0] || "?"}</div>`}</div>
      <div class="label">${escapeHtml(map[id].name || id)}</div>
    `;
    cell.addEventListener("click", () => {
      if (selectedSet.has(id)) selectedSet.delete(id);
      else selectedSet.add(id);
      cell.classList.toggle("selected");
      updateCount(grid.parentElement.querySelector(".count"), selectedSet);
    });
    grid.appendChild(cell);
  });
}

function updateCount(node, set) {
  if (!node) return;
  node.textContent = `${set.size} seleccionados`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function openSectorPicker({ preselectedIds = [] } = {}) {
  return loadIconMap().then(map => {
    return new Promise(resolve => {
      const { backdrop, modal } = buildModal();
      const grid = modal.querySelector(".icon-grid");
      const search = modal.querySelector(".search");
      const btnOk = modal.querySelector('[data-act="ok"]');
      const btnCancel = modal.querySelector('[data-act="cancel"]');
      const btnClose = modal.querySelector('[data-act="close"]');
      const selected = new Set(Array.isArray(preselectedIds) ? preselectedIds.filter(Boolean) : []);
      renderGrid(grid, map, "", selected);
      updateCount(modal.querySelector(".count"), selected);

      function close(result) {
        backdrop.remove();
        resolve(result);
      }

      btnOk.addEventListener("click", () => close(Array.from(selected)));
      btnCancel.addEventListener("click", () => close(Array.from(preselectedIds || [])));
      btnClose.addEventListener("click", () => close(Array.from(preselectedIds || [])));
      backdrop.addEventListener("click", e => {
        if (e.target === backdrop) close(Array.from(preselectedIds || []));
      });
      search.addEventListener("input", () => {
        renderGrid(grid, map, search.value, selected);
      });

      document.body.appendChild(backdrop);
      setTimeout(() => backdrop.classList.add("show"), 0);
    });
  });
}
