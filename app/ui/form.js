import {
  ROLES,
  CATEGORIES,
  SCOPES,
  PROVINCES,
  CATEGORY_LABEL,
  SCOPE_LABEL,
  PROVINCE_LABEL,
  isProvincial,
  ensureOptionIds,
  parseCSVInts,
  slugify,
  THIRD_SELECTOR_KINDS,
  readThirdSelectorFrom
} from "../lib/schema.js";
import { validateQuestion } from "../lib/validate.js";
import { openSectorPicker } from "../lib/sector-picker.js";
import { openAgendaPicker } from "../lib/agenda-picker.js";
import { openForcePicker } from "../ui/force-picker.js";

let _iconMapCache = null;
let _agendaMapCache = null;

function loadIconMap() {
  if (_iconMapCache) return Promise.resolve(_iconMapCache);
  return fetch("assets/icon_map.json")
    .then(r => (r.ok ? r.json() : []))
    .then(list => {
      const map = {};
      (Array.isArray(list) ? list : []).forEach(it => {
        if (it && it.id && it.icon) {
          map[it.id] = { path: `assets/icons/${it.icon}`, name: it.name || it.id };
        }
      });
      _iconMapCache = map;
      return _iconMapCache;
    })
    .catch(() => ({}));
}

function iconPathFor(id) {
  const entry = (_iconMapCache || {})[id];
  if (!entry) return "";
  if (typeof entry === "string") return `assets/icons/${entry}`;
  if (entry && typeof entry.path === "string") return entry.path;
  return "";
}

function loadAgendaMap() {
  if (_agendaMapCache) return Promise.resolve(_agendaMapCache);
  return fetch("assets/agendas_map.json")
    .then(r => (r.ok ? r.json() : []))
    .then(list => {
      const map = {};
      (Array.isArray(list) ? list : []).forEach(it => {
        if (it && it.id && it.icon) {
          map[it.id] = { path: `assets/agendas/${it.icon}`, name: it.name || it.id };
        }
      });
      _agendaMapCache = map;
      return _agendaMapCache;
    })
    .catch(() => ({}));
}

function agendaIconPathFor(id) {
  const entry = (_agendaMapCache || {})[id];
  if (!entry) return "";
  if (typeof entry === "string") return `assets/agendas/${entry}`;
  if (entry && typeof entry.path === "string") return entry.path;
  return "";
}

// Íconos de fuerzas
const FORCE_SLUGS = ["peronismo","republicanismo","trotskismo","libertarismo","progresismo","nacionalismo"];
function forceIconPathFor(index) {
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= FORCE_SLUGS.length) return "";
  return `assets/forces/${FORCE_SLUGS[i]}.png`;
}

function getEffectValueSelf(effects, type, key = "value", def = 0) {
  const e = Array.isArray(effects) ? effects.find(x => x && x.type === type) : null;
  if (!e) return def;
  return Number.isFinite(e[key]) ? e[key] : def;
}

function findThirdSelectorInEffects(effects) {
  if (!Array.isArray(effects)) return null;
  for (const e of effects) {
    if (!e || typeof e !== "object") continue;
    if (e.type === "affect_force_stats" || e.type === "force_support_loss") {
      const sel = readThirdSelectorFrom(e);
      if (sel) return sel;
    }
  }
  return null;
}

function getThirdDeltasFromEffects(effects) {
  if (!Array.isArray(effects)) return { dimg: 0, dnuc: 0 };
  const e = effects.find(x => x && x.type === "affect_force_stats");
  if (!e) return { dimg: 0, dnuc: 0 };
  const dimg = Number.isInteger(Number(e.imagen_delta)) ? Number(e.imagen_delta) : 0;
  const dnuc = Number.isInteger(Number(e.nucleo_delta)) ? Number(e.nucleo_delta) : 0;
  return { dimg, dnuc };
}

function getThirdLostSupportsFromEffects(effects) {
  if (!Array.isArray(effects)) return [];
  const ids = [];
  effects.forEach(e => {
    if (e && e.type === "force_support_loss" && typeof e.support_id === "string" && e.support_id.trim()) {
      ids.push(e.support_id.trim());
    }
  });
  return ids;
}

// Normaliza el valor según el tipo elegido
function normalizeThirdSelOnKind(sel) {
  const kind = sel?.kind;
  if (kind === THIRD_SELECTOR_KINDS.OFFICIALISM) {
    return { kind, value: true };
  }
  if (kind === THIRD_SELECTOR_KINDS.FORCE) {
    return { kind, value: Number.isInteger(sel?.value) ? sel.value : null };
  }
  if (kind === THIRD_SELECTOR_KINDS.AGENDA) {
    return { kind, value: typeof sel?.value === "string" ? sel.value : "" };
  }
  if (kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT) {
    return { kind, value: typeof sel?.value === "string" ? sel.value : "" };
  }
  return { kind: THIRD_SELECTOR_KINDS.OFFICIALISM, value: true };
}

export function mountForm(container, { onChange } = {}) {
  let q = null;
  let qIndex = -1;
  let agendaIds = [];
  const uid = String(Date.now());

  const root = document.createElement("div");
  root.className = "card form";
  root.innerHTML = `
    <div class="row">
      <div class="col">
        <label>#</label>
        <input type="text" data-field="auto_id" disabled />
      </div>
      <div class="col">
        <label>Nombre</label>
        <input type="text" data-field="name" />
      </div>
      <div class="col">
        <label>Slug (id)</label>
        <input type="text" data-field="id" placeholder="auto desde Nombre si se deja vacío"/>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <label>Categoría</label>
        <select data-field="category">
          ${["", ...CATEGORIES].map(c => `<option value="${c}">${CATEGORY_LABEL[c] || c}</option>`).join("")}
        </select>
      </div>
      <div class="col">
        <label>Rol</label>
        <div>
          <label class="pill"><input type="radio" name="role-${uid}" value="${ROLES.OFICIALISMO}"> Oficialismo</label>
          <label class="pill"><input type="radio" name="role-${uid}" value="${ROLES.OPOSICION}"> Oposición</label>
        </div>
      </div>
      <div class="col">
        <label>Ámbito</label>
        <div>
          ${SCOPES.map(s => `<label class="pill"><input type="radio" name="scope-${uid}" value="${s}"> ${SCOPE_LABEL[s] || s}</label>`).join("")}
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <label>Provincia</label>
        <select data-field="province">
          ${PROVINCES.map(p => `<option value="${p}">${PROVINCE_LABEL[p] || p}</option>`).join("")}
        </select>
      </div>
      <div class="col">
        <label>Estados permitidos</label>
        <input type="text" data-field="allowed_states" placeholder="e.g. 0 ó 3,4,5"/>
      </div>
      <div class="col">
        <label>Agendas</label>
        <div class="agenda-box">
          <div class="chips" data-field="agenda-chips"></div>
          <button class="btn" data-act="pick-agendas">Seleccionar</button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <label>Imagen</label>
        <input type="text" data-field="image_path" placeholder="res://..."/>
      </div>
      <div class="col" style="display:flex;align-items:end">
        <label><input type="checkbox" data-field="nested_only"> Sólo pregunta anidada</label>
      </div>
    </div>

    <label>Pregunta</label>
    <textarea data-field="prompt" maxlength="180"></textarea>

    <div class="options"></div>

    <div class="card" style="margin-top:12px">
      <strong>Validación</strong>
      <ul class="problems"></ul>
    </div>
  `;
  container.innerHTML = "";
  container.appendChild(root);

  const ref = {
    auto_id: root.querySelector('[data-field="auto_id"]'),
    name: root.querySelector('[data-field="name"]'),
    id: root.querySelector('[data-field="id"]'),
    category: root.querySelector('[data-field="category"]'),
    roleRadios: Array.from(root.querySelectorAll(`input[name="role-${uid}"]`)),
    scopeRadios: Array.from(root.querySelectorAll(`input[name="scope-${uid}"]`)),
    province: root.querySelector('[data-field="province"]'),
    allowed_states: root.querySelector('[data-field="allowed_states"]'),
    image_path: root.querySelector('[data-field="image_path"]'),
    nested_only: root.querySelector('[data-field="nested_only"]'),
    prompt: root.querySelector('[data-field="prompt"]'),
    optionsHost: root.querySelector(".options"),
    problems: root.querySelector(".problems"),
    agendaChips: root.querySelector('[data-field="agenda-chips"]'),
    btnPickAgendas: root.querySelector('[data-act="pick-agendas"]')
  };

  function renderAgendaChips() {
    ref.agendaChips.innerHTML = "";
    agendaIds.forEach(id => {
      const chip = document.createElement("span");
      chip.className = "chip";
      const src = agendaIconPathFor(id);
      chip.innerHTML = `${src ? `<img src="${src}" alt="">` : ""}<span>${id}</span><button class="x" title="Quitar">×</button>`;
      chip.querySelector(".x").addEventListener("click", () => {
        const idx = agendaIds.indexOf(id);
        if (idx >= 0) agendaIds.splice(idx, 1);
        renderAgendaChips();
        changed();
      });
      ref.agendaChips.appendChild(chip);
    });
  }

  ref.btnPickAgendas.addEventListener("click", async () => {
    await loadAgendaMap();
    const picked = await openAgendaPicker({ preselectedIds: agendaIds });
    agendaIds = Array.isArray(picked) ? picked : [];
    renderAgendaChips();
    changed();
  });

  function renderOptionCard(opt, i) {
    const oid = opt.id || ["A", "B", "C", "D"][i];

    const card = document.createElement("div");
    card.className = "option";
    card.innerHTML = `
      <div class="opt-head"><strong>${oid}</strong></div>
      <label>Respuesta</label>
      <textarea data-field="label" maxlength="90"></textarea>
      <label>Tooltip</label>
      <input type="text" maxlength="90" data-field="tooltip"/>

      <label>Siguiente pregunta (id)</label>
      <input type="text" data-field="nextq"/>

      <div class="row" data-role-ui="self-metrics">
        <div class="col">
          <label>Δ Imagen pública (%)</label>
          <input type="number" data-field="dimg" value="0"/>
        </div>
        <div class="col">
          <label>Δ Núcleo duro (K)</label>
          <input type="number" data-field="dnuc" step="100" value="0"/>
        </div>
        <div class="col" data-role-ui="pendulum">
          <label>Shift péndulo</label>
          <div class="row" style="gap:6px">
            <input type="number" data-field="p_workers" placeholder="workers" value="0" style="flex:1"/>
            <input type="number" data-field="p_capital" placeholder="capital" value="0" style="flex:1"/>
          </div>
        </div>
      </div>

      <div class="row" style="align-items:center">
        <div class="col">
          <div class="small muted" style="margin-top:0.5rem;">+ Apoyos propios</div>
          <div class="chips" data-field="chips-add"></div>
          <button class="btn" data-act="pick-add">Seleccionar</button>
        </div>
        <div class="col">
          <div class="small muted" style="margin-top:0.5rem;">− Apoyos propios</div>
          <div class="chips" data-field="chips-rem"></div>
          <button class="btn" data-act="pick-rem">Seleccionar</button>
        </div>
      </div>

      <div class="card" style="margin-top:10px" data-role-ui="third-wrapper">
        <div class="row" style="align-items:center">
          <div class="col" style="display:flex;align-items:center;gap:10px">
            <label style="margin:0"><input type="checkbox" data-field="third_enabled"> Afecta a terceras fuerzas políticas</label>
          </div>
        </div>

        <div class="row" data-role-ui="third-section" style="margin-top:8px">
          <div class="col">
            <label class="small">Identificar por</label>
            <div class="target-radios" data-field="third-kind">
              <label class="pill"><input type="radio" name="third-${uid}-${oid}" value="${THIRD_SELECTOR_KINDS.FORCE}"> Por fuerza</label>
              <label class="pill"><input type="radio" name="third-${uid}-${oid}" value="${THIRD_SELECTOR_KINDS.AGENDA}"> Por agenda</label>
              <label class="pill"><input type="radio" name="third-${uid}-${oid}" value="${THIRD_SELECTOR_KINDS.OFFICIALISM}"> Por rol oficialista</label>
              <label class="pill"><input type="radio" name="third-${uid}-${oid}" value="${THIRD_SELECTOR_KINDS.SECTOR_SUPPORT}"> Por apoyo sectorial</label>
            </div>
            <div class="chips" data-field="target-third-chip" style="margin-top:8px"></div>
            <button class="btn" data-act="pick-third" style="margin-top:8px" disabled>Seleccionar</button>
          </div>
        </div>

        <div class="row" data-role-ui="third-metrics">
          <div class="col">
            <label>Δ Imagen del tercero (%)</label>
            <input type="number" data-field="t_dimg" value="0"/>
          </div>
          <div class="col">
            <label>Δ Núcleo del tercero (K)</label>
            <input type="number" data-field="t_dnuc" step="100" value="0"/>
          </div>
          <div class="col">
            <div class="small muted" style="margin-top:0.5rem;">− Apoyos del tercero</div>
            <div class="chips" data-field="chips-third-rem"></div>
            <button class="btn" data-act="pick-third-rem">Seleccionar</button>
          </div>
        </div>
      </div>
    `;

    const ui = {
      label: card.querySelector('[data-field="label"]'),
      tooltip: card.querySelector('[data-field="tooltip"]'),
      nextq: card.querySelector('[data-field="nextq"]'),
      dimg: card.querySelector('[data-field="dimg"]'),
      dnuc: card.querySelector('[data-field="dnuc"]'),
      p_workers: card.querySelector('[data-field="p_workers"]'),
      p_capital: card.querySelector('[data-field="p_capital"]'),
      chipsAdd: card.querySelector('[data-field="chips-add"]'),
      chipsRem: card.querySelector('[data-field="chips-rem"]'),
      btnPickAdd: card.querySelector('[data-act="pick-add"]'),
      btnPickRem: card.querySelector('[data-act="pick-rem"]'),
      thirdWrapper: card.querySelector('[data-role-ui="third-wrapper"]'),
      thirdEnabled: card.querySelector('[data-field="third_enabled"]'),
      thirdSection: card.querySelector('[data-role-ui="third-section"]'),
      thirdKindRadios: Array.from(card.querySelectorAll(`input[name="third-${uid}-${oid}"]`)),
      btnPickThird: card.querySelector('[data-act="pick-third"]'),
      targetThirdChip: card.querySelector('[data-field="target-third-chip"]'),
      thirdMetrics: card.querySelector('[data-role-ui="third-metrics"]'),
      t_dimg: card.querySelector('[data-field="t_dimg"]'),
      t_dnuc: card.querySelector('[data-field="t_dnuc"]'),
      chipsThirdRem: card.querySelector('[data-field="chips-third-rem"]'),
      btnPickThirdRem: card.querySelector('[data-act="pick-third-rem"]'),
      sectionPendulum: card.querySelector('[data-role-ui="pendulum"]')
    };

    ui.label.value = opt.label || "";
    ui.tooltip.value = opt.tooltip || "";
    ui.nextq.value = opt.next_question_id || "";

    ui.dimg.value = getEffectValueSelf(opt.effects, "delta_public_image_pct", "value", 0);
    ui.dnuc.value = getEffectValueSelf(opt.effects, "delta_nucleo", "value", 0);
    ui.p_workers.value = getEffectValueSelf(opt.effects, "shift_pendulum", "workers", 0);
    ui.p_capital.value = getEffectValueSelf(opt.effects, "shift_pendulum", "capital", 0);

    let addIds = Array.isArray(opt.effects) ? (opt.effects.find(e => e && e.type === "add_supports")?.ids || []) : [];
    addIds = Array.isArray(addIds) ? [...addIds] : [];
    let remIds = Array.isArray(opt.effects) ? (opt.effects.find(e => e && e.type === "remove_supports")?.ids || []) : [];
    remIds = Array.isArray(remIds) ? [...remIds] : [];

    const inferThirdSel = () => {
      if (opt._third_kind) return { kind: opt._third_kind, value: opt._third_value };
      const s = findThirdSelectorInEffects(opt.effects);
      if (!s) return null;
      return { kind: s.kind, value: s.value };
    };
    let thirdSel = inferThirdSel();
    let thirdEnabled = !!opt._third_enabled || !!thirdSel || getThirdLostSupportsFromEffects(opt.effects).length > 0 || (() => {
      const d = getThirdDeltasFromEffects(opt.effects);
      return d.dimg !== 0 || d.dnuc !== 0;
    })();
    if (!thirdSel) thirdSel = { kind: THIRD_SELECTOR_KINDS.OFFICIALISM, value: true };
    thirdSel = normalizeThirdSelOnKind(thirdSel);

    const thirdDeltas = getThirdDeltasFromEffects(opt.effects);
    ui.t_dimg.value = thirdDeltas.dimg;
    ui.t_dnuc.value = thirdDeltas.dnuc;
    let thirdRemIds = getThirdLostSupportsFromEffects(opt.effects);

    function renderChips(host, ids) {
      host.innerHTML = "";
      ids.forEach(id => {
        const chip = document.createElement("span");
        chip.className = "chip";
        const src = iconPathFor(id);
        chip.innerHTML = `${src ? `<img src="${src}" alt="">` : ""}<span>${id}</span><button class="x" title="Quitar">×</button>`;
        chip.querySelector(".x").addEventListener("click", () => {
          const arr = host === ui.chipsAdd ? addIds
            : host === ui.chipsRem ? remIds
            : host === ui.chipsThirdRem ? thirdRemIds
            : [];
          const idx = arr.indexOf(id);
          if (idx >= 0) arr.splice(idx, 1);
          renderChips(host, arr);
          changed();
        });
        host.appendChild(chip);
      });
    }

    function setThirdKindRadio(val) {
      const r = ui.thirdKindRadios.find(x => x.value === val);
      if (r) r.checked = true;
    }

    function renderTargetThirdChip() {
      ui.targetThirdChip.innerHTML = "";
      if (!thirdSel) return;
      const doRender = () => {
        if (thirdSel.kind === THIRD_SELECTOR_KINDS.OFFICIALISM) {
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.innerHTML = `<span>Oficialismo</span>`;
          ui.targetThirdChip.appendChild(chip);
        } else if (thirdSel.kind === THIRD_SELECTOR_KINDS.FORCE) {
          const idx = Number.isInteger(thirdSel.value) ? thirdSel.value : -1;
          const src = forceIconPathFor(idx);
          const label = idx >= 0 && idx < FORCE_SLUGS.length ? FORCE_SLUGS[idx] : "Fuerza";
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.innerHTML = `${src ? `<img src="${src}" alt="">` : ""}<span>${label}</span><button class="x" title="Quitar">×</button>`;
          chip.querySelector(".x").addEventListener("click", () => {
            thirdSel.value = null;
            renderTargetThirdChip();
            syncThirdPickAvailability();
            changed();
          });
          ui.targetThirdChip.appendChild(chip);
        } else if (thirdSel.kind === THIRD_SELECTOR_KINDS.AGENDA) {
          const id = String(thirdSel.value || "");
          const src = agendaIconPathFor(id);
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.innerHTML = `${src ? `<img src="${src}" alt="">` : ""}<span>${id || "Agenda"}</span><button class="x" title="Quitar">×</button>`;
          chip.querySelector(".x").addEventListener("click", () => {
            thirdSel.value = "";
            renderTargetThirdChip();
            syncThirdPickAvailability();
            changed();
          });
          ui.targetThirdChip.appendChild(chip);
          } else if (thirdSel.kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT) {
            const id = String(thirdSel.value || "");
            const src = iconPathFor(id);
            const chip = document.createElement("span");
            chip.className = "chip";
            chip.innerHTML = `${src ? `<img src="${src}" alt="">` : ""}<span>${id || "Sector"}</span><button class="x" title="Quitar">×</button>`;
            chip.querySelector(".x").addEventListener("click", () => {
              thirdSel.value = "";
              renderTargetThirdChip();
              syncThirdPickAvailability();
              changed();
            });
            ui.targetThirdChip.appendChild(chip);
          }
      };
      if (thirdSel.kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT && !_iconMapCache) {
        loadIconMap().then(doRender);
      } else {
        doRender();
      }
    }

    function syncThirdVisibility() {
      ui.thirdSection.style.display = thirdEnabled ? "" : "none";
      ui.thirdMetrics.style.display = thirdEnabled ? "" : "none";
      ui.thirdEnabled.checked = thirdEnabled;
    }

    function needPickForThird() {
      return thirdSel && (thirdSel.kind === THIRD_SELECTOR_KINDS.FORCE || thirdSel.kind === THIRD_SELECTOR_KINDS.AGENDA || thirdSel.kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT);
    }

    function syncThirdPickAvailability() {
      ui.btnPickThird.disabled = !thirdEnabled || !needPickForThird();
    }

    function getCurrentRole() {
      return Number(root.querySelector(`input[name="role-${uid}"]:checked`)?.value || ROLES.OFICIALISMO);
    }

    function updatePendulumAvailability() {
      const roleOpp = getCurrentRole() === ROLES.OPOSICION;
      ui.sectionPendulum.style.display = roleOpp ? "none" : "";
    }

    setThirdKindRadio(thirdSel.kind);
    renderChips(ui.chipsAdd, addIds);
    renderChips(ui.chipsRem, remIds);
    renderChips(ui.chipsThirdRem, thirdRemIds);
    renderTargetThirdChip();
    syncThirdVisibility();
    syncThirdPickAvailability();
    updatePendulumAvailability();

    ui.label.addEventListener("input", () => changed());
    ui.tooltip.addEventListener("input", () => changed());
    ui.nextq.addEventListener("input", () => changed());
    ui.dimg.addEventListener("input", () => changed());
    ui.dnuc.addEventListener("input", () => changed());

    let syncingPendulum = false;
    function mirrorPendulum(from) {
      if (syncingPendulum) return;
      syncingPendulum = true;
      let w = parseInt(ui.p_workers.value, 10);
      let c = parseInt(ui.p_capital.value, 10);
      if (!Number.isFinite(w)) w = 0;
      if (!Number.isFinite(c)) c = 0;
      if (from === "workers") ui.p_capital.value = String(-w);
      else if (from === "capital") ui.p_workers.value = String(-c);
      syncingPendulum = false;
      changed();
    }
    ui.p_workers.addEventListener("input", () => mirrorPendulum("workers"));
    ui.p_capital.addEventListener("input", () => mirrorPendulum("capital"));

    ui.btnPickAdd.addEventListener("click", async () => {
      await loadIconMap();
      const picked = await openSectorPicker({ preselectedIds: addIds });
      addIds = Array.isArray(picked) ? picked : [];
      renderChips(ui.chipsAdd, addIds);
      changed();
    });
    ui.btnPickRem.addEventListener("click", async () => {
      await loadIconMap();
      const picked = await openSectorPicker({ preselectedIds: remIds });
      remIds = Array.isArray(picked) ? picked : [];
      renderChips(ui.chipsRem, remIds);
      changed();
    });

    ui.thirdEnabled.addEventListener("change", () => {
      thirdEnabled = !!ui.thirdEnabled.checked;
      syncThirdVisibility();
      syncThirdPickAvailability();
      changed();
    });

    ui.thirdKindRadios.forEach(r => {
      r.addEventListener("change", () => {
        thirdSel = normalizeThirdSelOnKind({ kind: r.value, value: null });
        renderTargetThirdChip();
        syncThirdPickAvailability();
        changed();
      });
    });

    ui.btnPickThird.addEventListener("click", async () => {
      if (!thirdEnabled) return;
      if (thirdSel.kind === THIRD_SELECTOR_KINDS.FORCE) {
        const picked = await openForcePicker({ preselectedIndex: Number.isInteger(thirdSel.value) ? thirdSel.value : null });
        if (typeof picked === "number") thirdSel.value = picked;
        else if (picked && typeof picked.index === "number") thirdSel.value = picked.index;
      } else if (thirdSel.kind === THIRD_SELECTOR_KINDS.AGENDA) {
        await loadAgendaMap();
        const picked = await openAgendaPicker({ preselectedIds: thirdSel.value ? [thirdSel.value] : [] });
        thirdSel.value = Array.isArray(picked) && picked[0] ? picked[0] : "";
      } else if (thirdSel.kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT) {
        await loadIconMap();
        const picked = await openSectorPicker({ preselectedIds: thirdSel.value ? [thirdSel.value] : [] });
        thirdSel.value = Array.isArray(picked) && picked[0] ? picked[0] : "";
      }
      renderTargetThirdChip();
      syncThirdPickAvailability();
      changed();
    });

    ui.t_dimg.addEventListener("input", () => changed());
    ui.t_dnuc.addEventListener("input", () => changed());

    ui.btnPickThirdRem.addEventListener("click", async () => {
      await loadIconMap();
      const picked = await openSectorPicker({ preselectedIds: thirdRemIds });
      thirdRemIds = Array.isArray(picked) ? picked : [];
      renderChips(ui.chipsThirdRem, thirdRemIds);
      changed();
    });

    function collectEffects() {
      const effects = [];
      const vImg = Number(ui.dimg.value || 0);
      const vNuc = Number(ui.dnuc.value || 0);
      const vW = Number(ui.p_workers.value || 0);
      const vC = Number(ui.p_capital.value || 0);
      if (Number.isInteger(vImg) && vImg !== 0) effects.push({ type: "delta_public_image_pct", value: vImg });
      if (Number.isInteger(vNuc) && vNuc !== 0) effects.push({ type: "delta_nucleo", value: vNuc });
      const roleOpp = getCurrentRole() === ROLES.OPOSICION;
      if (!roleOpp && Number.isInteger(vW) && Number.isInteger(vC) && (vW !== 0 || vC !== 0)) {
        effects.push({ type: "shift_pendulum", workers: vW, capital: vC });
      }
      if (Array.isArray(addIds) && addIds.length) effects.push({ type: "add_supports", ids: [...addIds] });
      if (Array.isArray(remIds) && remIds.length) effects.push({ type: "remove_supports", ids: [...remIds] });

      if (thirdEnabled && thirdSel) {
        const tImg = Number(ui.t_dimg.value || 0);
        const tNuc = Number(ui.t_dnuc.value || 0);
        const base = {};
        if (thirdSel.kind === THIRD_SELECTOR_KINDS.FORCE && Number.isInteger(thirdSel.value)) base.force_id = thirdSel.value;
        else if (thirdSel.kind === THIRD_SELECTOR_KINDS.AGENDA && typeof thirdSel.value === "string" && thirdSel.value.trim()) base.by_agenda = thirdSel.value.trim();
        else if (thirdSel.kind === THIRD_SELECTOR_KINDS.OFFICIALISM) base.by_officialism = true;
        else if (thirdSel.kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT && typeof thirdSel.value === "string" && thirdSel.value.trim()) base.by_sector_support = thirdSel.value.trim();

        if (Object.keys(base).length > 0) {
          if ((Number.isInteger(tImg) && tImg !== 0) || (Number.isInteger(tNuc) && tNuc !== 0)) {
            effects.push({ type: "affect_force_stats", imagen_delta: Number.isInteger(tImg) ? tImg : 0, nucleo_delta: Number.isInteger(tNuc) ? tNuc : 0, ...base });
          }
          if (Array.isArray(thirdRemIds) && thirdRemIds.length) {
            thirdRemIds.forEach(id => {
              if (typeof id === "string" && id.trim()) {
                effects.push({ type: "force_support_loss", support_id: id.trim(), ...base });
              }
            });
          }
        }
      }

      return effects;
    }

    return {
      card,
      collectEffects,
      syncIntoOption() { opt.effects = collectEffects(); },
      collectOption() {
        const out = {
          id: oid,
          label: ui.label.value || "",
          tooltip: ui.tooltip.value || "",
          next_question_id: ui.nextq.value || "",
          effects: collectEffects()
        };
        out._third_enabled = !!thirdEnabled;
        out._third_kind = thirdSel?.kind || "";
        out._third_value = thirdSel?.value ?? null;
        return out;
      },
      updateRoleUI: () => {
        updatePendulumAvailability();
      }
    };
  }

  function renderOptions() {
    ref.optionsHost.innerHTML = "";
    if (!q) return;
    q.options = ensureOptionIds(q.options);
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const opt = q.options[i];
      const row = renderOptionCard(opt, i);
      rows.push(row);
      ref.optionsHost.appendChild(row.card);
    }
    ref.optionsHost._collectors = rows;
    updateRoleDrivenUI();
  }

  function updateRoleDrivenUI() {
    if (Array.isArray(ref.optionsHost._collectors)) {
      ref.optionsHost._collectors.forEach(c => c.updateRoleUI?.());
    }
  }

  function applyToForm() {
    if (!q) {
      ref.auto_id.value = "";
      ref.name.value = "";
      ref.id.value = "";
      ref.category.value = "";
      ref.province.disabled = true;
      ref.province.value = "";
      ref.allowed_states.value = "0";
      ref.image_path.value = "";
      ref.nested_only.checked = false;
      ref.prompt.value = "";
      agendaIds = [];
      renderAgendaChips();
      ref.optionsHost.innerHTML = "";
      renderValidation();
      return;
    }
    ref.auto_id.value = q.auto_id ? String(q.auto_id) : "";
    ref.name.value = q.name || "";
    ref.id.value = q.id || "";
    ref.category.value = q.category || "";
    const r = ref.roleRadios.find(x => Number(x.value) === Number(q.role_target || ROLES.OFICIALISMO));
    if (r) r.checked = true;
    const sc = q.scope || "national";
    const s = ref.scopeRadios.find(x => x.value === sc);
    if (s) s.checked = true;
    ref.province.disabled = !isProvincial(sc);
    ref.province.value = q.province || "";
    ref.allowed_states.value = Array.isArray(q.allowed_states) && q.allowed_states.length
      ? q.allowed_states.join(",")
      : "0";
    ref.image_path.value = q.image_path || "";
    ref.nested_only.checked = !!q.nested_only;
    ref.prompt.value = q.prompt || "";
    agendaIds = Array.isArray(q.affinity_agenda) ? [...q.affinity_agenda] : [];
    loadAgendaMap().then(() => renderAgendaChips());
    (_iconMapCache ? Promise.resolve() : loadIconMap()).then(() => renderOptions());
    renderValidation();
  }

  function readFromForm() {
    if (!q) return null;
    const prev = q;
    const next = { ...q };
    next.auto_id = Number(ref.auto_id.value || 0);
    next.name = String(ref.name.value || "");
    next.id = String(ref.id.value || "");
    if (!next.id && next.name) next.id = slugify(next.name);
    next.category = String(ref.category.value || "");
    next.role_target = Number(root.querySelector(`input[name="role-${uid}"]:checked`)?.value || ROLES.OFICIALISMO);
    const scopeSel = root.querySelector(`input[name="scope-${uid}"]:checked`)?.value || "national";
    next.scope = scopeSel;
    next.province = isProvincial(scopeSel) ? String(ref.province.value || "") : "";
    next.allowed_states = parseCSVInts(ref.allowed_states.value);
    next.affinity_agenda = Array.isArray(agendaIds) ? [...agendaIds] : [];

    const formImagePath = String(ref.image_path.value || "");
    if (formImagePath) {
      next.image_path = formImagePath;
    } else if (!prev?.image_path && next.id) {
      next.image_path = `${next.id}.jpg`;
    } else {
      next.image_path = prev?.image_path || "";
    }

    next.nested_only = !!ref.nested_only.checked;
    next.prompt = String(ref.prompt.value || "");

    if (Array.isArray(ref.optionsHost._collectors)) {
      const fromUI = ref.optionsHost._collectors.map(row => row.collectOption());
      next.options = ensureOptionIds(fromUI);
    } else {
      next.options = ensureOptionIds(next.options);
    }
    return next;
  }

  function renderValidation() {
    const res = validateQuestion(q);
    ref.problems.innerHTML = "";
    if (res.ok) return;
    res.problems.forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      ref.problems.appendChild(li);
    });
  }

  function changed() {
    q = readFromForm();
    renderValidation();
    if (typeof onChange === "function") onChange({ question: q, index: qIndex });
  }

  function wire() {
    function applyNameSideEffects() {
      const nameVal = String(ref.name.value || "").trim();
      if (!String(ref.id.value || "").trim() && nameVal) {
        ref.id.value = slugify(nameVal);
      }
      if (!String(ref.image_path.value || "").trim() && String(ref.id.value || "").trim()) {
        ref.image_path.value = `${ref.id.value}.jpg`;
      }
      changed();
    }

    [ref.name, ref.id].forEach(n => n.addEventListener("input", changed));

    ref.name.addEventListener("change", applyNameSideEffects);
    ref.name.addEventListener("blur", applyNameSideEffects);
    ref.name.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyNameSideEffects();
        ref.id?.focus?.();
      }
    });

    ref.category.addEventListener("change", changed);
    ref.roleRadios.forEach(r => r.addEventListener("change", () => { updateRoleDrivenUI(); changed(); }));
    ref.scopeRadios.forEach(r => r.addEventListener("change", () => {
      ref.province.disabled = !isProvincial(r.value);
      if (ref.province.disabled) ref.province.value = "";
      changed();
    }));
    ref.province.addEventListener("change", changed);
    ref.allowed_states.addEventListener("input", changed);
    ref.image_path.addEventListener("input", changed);
    ref.nested_only.addEventListener("change", changed);
    ref.prompt.addEventListener("input", changed);
  }

  wire();

  function setQuestion(question, index = -1) {
    q = question ? (structuredClone ? structuredClone(question) : JSON.parse(JSON.stringify(question))) : null;
    qIndex = index;
    applyToForm();
  }

  function getQuestion() {
    return readFromForm();
  }

  return { setQuestion, getQuestion, root };
}
