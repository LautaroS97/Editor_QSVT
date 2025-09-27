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
  EFFECT_TARGET
} from "../lib/schema.js";
import { validateQuestion } from "../lib/validate.js";
import { openSectorPicker } from "../lib/sector-picker.js";
import { openAgendaPicker } from "../lib/agenda-picker.js";

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

function getEffectValue(effects, type, key = "value", def = 0, target = EFFECT_TARGET.SELF) {
  const e = Array.isArray(effects) ? effects.find(x => x && x.type === type && (x.target ?? EFFECT_TARGET.SELF) === target) : null;
  if (!e) return def;
  return Number.isFinite(e[key]) ? e[key] : def;
}

function getEffectIds(effects, type, target = EFFECT_TARGET.SELF) {
  const e = Array.isArray(effects) ? effects.find(x => x && x.type === type && (x.target ?? EFFECT_TARGET.SELF) === target) : null;
  return Array.isArray(e?.ids) ? [...e.ids] : [];
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

      <div class="row" data-role-ui="selector-target" style="margin-top:6px">
        <div class="col">
          <label class="small">A quién afectan los efectos</label>
          <div class="target-radios" data-field="target-radios">
            <label class="pill"><input type="radio" name="tgt-${uid}-${oid}" value="${EFFECT_TARGET.OFFICIALISM}"> Oficialismo</label>
            <label class="pill"><input type="radio" name="tgt-${uid}-${oid}" value="${EFFECT_TARGET.BY_SECTOR}"> Fuerza con apoyo sectorial</label>
            <label class="pill"><input type="radio" name="tgt-${uid}-${oid}" value="${EFFECT_TARGET.BY_AGENDA}"> Fuerza con agenda</label>
          </div>
        </div>
        <div class="col" style="display:flex;align-items:end;gap:8px">
          <button class="btn" data-act="pick-target" disabled>Seleccionar</button>
          <div class="chips" data-field="target-chip"></div>
        </div>
      </div>

      <div class="row" data-role-ui="metrics">
        <div class="col" data-role-ui="self-deltas">
          <label>Δ Imagen pública (%)</label>
          <input type="number" data-field="dimg" value="0"/>
        </div>
        <div class="col" data-role-ui="self-deltas">
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
        <div class="col" data-role-ui="rival-deltas">
          <label>Δ Imagen pública (%) del rival</label>
          <input type="number" data-field="r_dimg" value="0"/>
        </div>
        <div class="col" data-role-ui="rival-deltas">
          <label>Δ Núcleo duro (K) del rival</label>
          <input type="number" data-field="r_dnuc" step="100" value="0"/>
        </div>
      </div>

      <div class="row" style="align-items:center">
        <div class="col">
          <div class="small muted" style="margin-top:0.5rem;">+ Apoyos</div>
          <div class="chips" data-field="chips-add"></div>
          <button class="btn" data-act="pick-add">Seleccionar</button>
        </div>
        <div class="col">
          <div class="small muted" style="margin-top:0.5rem;">− Apoyos</div>
          <div class="chips" data-field="chips-rem"></div>
          <button class="btn" data-act="pick-rem">Seleccionar</button>
        </div>
        <div class="col" data-role-ui="rival-supports">
          <div class="small muted" style="margin-top:0.5rem;">+ Apoyos del rival</div>
          <div class="chips" data-field="chips-add-rival"></div>
          <button class="btn" data-act="pick-add-rival">Seleccionar</button>
        </div>
        <div class="col" data-role-ui="rival-supports">
          <div class="small muted" style="margin-top:0.5rem;">− Apoyos del rival</div>
          <div class="chips" data-field="chips-rem-rival"></div>
          <button class="btn" data-act="pick-rem-rival">Seleccionar</button>
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
      r_dimg: card.querySelector('[data-field="r_dimg"]'),
      r_dnuc: card.querySelector('[data-field="r_dnuc"]'),
      chipsAdd: card.querySelector('[data-field="chips-add"]'),
      chipsRem: card.querySelector('[data-field="chips-rem"]'),
      chipsAddRival: card.querySelector('[data-field="chips-add-rival"]'),
      chipsRemRival: card.querySelector('[data-field="chips-rem-rival"]'),
      btnPickAdd: card.querySelector('[data-act="pick-add"]'),
      btnPickRem: card.querySelector('[data-act="pick-rem"]'),
      btnPickAddRival: card.querySelector('[data-act="pick-add-rival"]'),
      btnPickRemRival: card.querySelector('[data-act="pick-rem-rival"]'),
      targetRadios: Array.from(card.querySelectorAll(`[name="tgt-${uid}-${oid}"]`)),
      btnPickTarget: card.querySelector('[data-act="pick-target"]'),
      targetChip: card.querySelector('[data-field="target-chip"]'),
      sectionPendulum: card.querySelector('[data-role-ui="pendulum"]'),
      sectionRivalDeltas: card.querySelectorAll('[data-role-ui="rival-deltas"]'),
      sectionRivalSupports: card.querySelectorAll('[data-role-ui="rival-supports"]'),
      sectionSelectorTarget: card.querySelector('[data-role-ui="selector-target"]'),
      sectionSelfDeltas: card.querySelectorAll('[data-role-ui="self-deltas"]')
    };

    ui.label.value = opt.label || "";
    ui.tooltip.value = opt.tooltip || "";
    ui.nextq.value = opt.next_question_id || "";

    const inferNonSelfFromEffects = () => {
      const e = Array.isArray(opt.effects) ? opt.effects.find(x => (x.target ?? EFFECT_TARGET.SELF) !== EFFECT_TARGET.SELF) : null;
      return e ? e.target : EFFECT_TARGET.OFFICIALISM;
    };
    let targetSel = opt._ui_target || inferNonSelfFromEffects();
    let targetId = opt._ui_target_id || (() => {
      const e = Array.isArray(opt.effects) ? opt.effects.find(x => (x.target ?? EFFECT_TARGET.SELF) !== EFFECT_TARGET.SELF && x.target_id) : null;
      return e?.target_id || "";
    })();

    ui.dimg.value = getEffectValue(opt.effects, "delta_public_image_pct", "value", 0, EFFECT_TARGET.SELF);
    ui.dnuc.value = getEffectValue(opt.effects, "delta_nucleo", "value", 0, EFFECT_TARGET.SELF);
    ui.p_workers.value = getEffectValue(opt.effects, "shift_pendulum", "workers", 0, EFFECT_TARGET.SELF);
    ui.p_capital.value = getEffectValue(opt.effects, "shift_pendulum", "capital", 0, EFFECT_TARGET.SELF);

    ui.r_dimg.value = getEffectValue(opt.effects, "delta_public_image_pct", "value", 0, targetSel);
    ui.r_dnuc.value = getEffectValue(opt.effects, "delta_nucleo", "value", 0, targetSel);

    let addIds = getEffectIds(opt.effects, "add_supports", EFFECT_TARGET.SELF);
    let remIds = getEffectIds(opt.effects, "remove_supports", EFFECT_TARGET.SELF);
    let addIdsRival = getEffectIds(opt.effects, "add_supports", targetSel);
    let remIdsRival = getEffectIds(opt.effects, "remove_supports", targetSel);

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
            : host === ui.chipsAddRival ? addIdsRival
            : remIdsRival;
          const idx = arr.indexOf(id);
          if (idx >= 0) arr.splice(idx, 1);
          renderChips(host, arr);
          changed();
        });
        host.appendChild(chip);
      });
    }

    function renderTargetChip() {
      ui.targetChip.innerHTML = "";
      if (targetSel === EFFECT_TARGET.BY_SECTOR || targetSel === EFFECT_TARGET.BY_AGENDA) {
        if (targetId) {
          const isAgenda = targetSel === EFFECT_TARGET.BY_AGENDA;
          const src = isAgenda ? agendaIconPathFor(targetId) : iconPathFor(targetId);
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.innerHTML = `${src ? `<img src="${src}" alt="">` : ""}<span>${targetId}</span><button class="x" title="Quitar">×</button>`;
          chip.querySelector(".x").addEventListener("click", () => {
            targetId = "";
            opt._ui_target_id = "";
            renderTargetChip();
            changed();
          });
          ui.targetChip.appendChild(chip);
        }
      }
    }

    function getCurrentRole() {
      return Number(root.querySelector(`input[name="role-${uid}"]:checked`)?.value || ROLES.OFICIALISMO);
    }

    function syncTargetUIAvailability() {
      const roleOpp = getCurrentRole() === ROLES.OPOSICION;
      ui.sectionSelectorTarget.style.display = roleOpp ? "" : "none";
      ui.sectionPendulum.style.display = roleOpp ? "none" : "";
      ui.sectionRivalDeltas.forEach(n => n.style.display = roleOpp ? "" : "none");
      ui.sectionRivalSupports.forEach(n => n.style.display = roleOpp ? "" : "none");
      ui.sectionSelfDeltas.forEach(n => n.style.display = "");
      const needPick = targetSel === EFFECT_TARGET.BY_SECTOR || targetSel === EFFECT_TARGET.BY_AGENDA;
      ui.btnPickTarget.disabled = !roleOpp || !needPick;
    }

    function setTargetRadiosValue(val) {
      const r = ui.targetRadios.find(x => x.value === val);
      if (r) r.checked = true;
    }

    setTargetRadiosValue(targetSel);
    renderChips(ui.chipsAdd, addIds);
    renderChips(ui.chipsRem, remIds);
    renderChips(ui.chipsAddRival, addIdsRival);
    renderChips(ui.chipsRemRival, remIdsRival);
    renderTargetChip();
    syncTargetUIAvailability();

    ui.label.addEventListener("input", () => { changed(); });
    ui.tooltip.addEventListener("input", () => { changed(); });
    ui.nextq.addEventListener("input", () => { changed(); });
    ui.dimg.addEventListener("input", () => changed());
    ui.dnuc.addEventListener("input", () => changed());
    ui.r_dimg.addEventListener("input", () => changed());
    ui.r_dnuc.addEventListener("input", () => changed());

    let syncingPendulum = false;
    function mirrorPendulum(from) {
      if (syncingPendulum) return;
      syncingPendulum = true;
      let w = parseInt(ui.p_workers.value, 10);
      let c = parseInt(ui.p_capital.value, 10);
      if (!Number.isFinite(w)) w = 0;
      if (!Number.isFinite(c)) c = 0;
      if (from === "workers") {
        ui.p_capital.value = String(-w);
      } else if (from === "capital") {
        ui.p_workers.value = String(-c);
      }
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
    ui.btnPickAddRival.addEventListener("click", async () => {
      await loadIconMap();
      const picked = await openSectorPicker({ preselectedIds: addIdsRival });
      addIdsRival = Array.isArray(picked) ? picked : [];
      renderChips(ui.chipsAddRival, addIdsRival);
      changed();
    });
    ui.btnPickRemRival.addEventListener("click", async () => {
      await loadIconMap();
      const picked = await openSectorPicker({ preselectedIds: remIdsRival });
      remIdsRival = Array.isArray(picked) ? picked : [];
      renderChips(ui.chipsRemRival, remIdsRival);
      changed();
    });

    ui.targetRadios.forEach(r => {
      r.addEventListener("change", () => {
        targetSel = r.value;
        opt._ui_target = targetSel;
        if (targetSel !== EFFECT_TARGET.BY_SECTOR && targetSel !== EFFECT_TARGET.BY_AGENDA) {
          targetId = "";
          opt._ui_target_id = "";
          renderTargetChip();
        }
        syncTargetUIAvailability();
        changed();
      });
    });

    ui.btnPickTarget.addEventListener("click", async () => {
      if (targetSel === EFFECT_TARGET.BY_SECTOR) {
        await loadIconMap();
        const picked = await openSectorPicker({ preselectedIds: targetId ? [targetId] : [] });
        targetId = Array.isArray(picked) && picked[0] ? picked[0] : "";
        opt._ui_target_id = targetId;
      } else if (targetSel === EFFECT_TARGET.BY_AGENDA) {
        await loadAgendaMap();
        const picked = await openAgendaPicker({ preselectedIds: targetId ? [targetId] : [] });
        targetId = Array.isArray(picked) && picked[0] ? picked[0] : "";
        opt._ui_target_id = targetId;
      }
      renderTargetChip();
      changed();
    });

    function collectEffects() {
      const effects = [];
      const vImg = Number(ui.dimg.value || 0);
      const vNuc = Number(ui.dnuc.value || 0);
      const vW = Number(ui.p_workers.value || 0);
      const vC = Number(ui.p_capital.value || 0);
      if (Number.isInteger(vImg) && vImg !== 0) effects.push({ type: "delta_public_image_pct", value: vImg, target: EFFECT_TARGET.SELF });
      if (Number.isInteger(vNuc) && vNuc !== 0) effects.push({ type: "delta_nucleo", value: vNuc, target: EFFECT_TARGET.SELF });
      if (Number.isInteger(vW) && Number.isInteger(vC) && (vW !== 0 || vC !== 0)) {
        effects.push({ type: "shift_pendulum", workers: vW, capital: vC, target: EFFECT_TARGET.SELF });
      }
      if (Array.isArray(addIds) && addIds.length) effects.push({ type: "add_supports", ids: [...addIds], target: EFFECT_TARGET.SELF });
      if (Array.isArray(remIds) && remIds.length) effects.push({ type: "remove_supports", ids: [...remIds], target: EFFECT_TARGET.SELF });

      const roleOpp = getCurrentRole() === ROLES.OPOSICION;
      if (roleOpp) {
        const rImg = Number(ui.r_dimg.value || 0);
        const rNuc = Number(ui.r_dnuc.value || 0);
        const t = targetSel || EFFECT_TARGET.OFFICIALISM;
        const payloadBase = {};
        if (t !== EFFECT_TARGET.SELF) payloadBase.target = t;
        if ((t === EFFECT_TARGET.BY_SECTOR || t === EFFECT_TARGET.BY_AGENDA) && targetId) {
          payloadBase.target_id = targetId;
        }
        if (Number.isInteger(rImg) && rImg !== 0) effects.push({ type: "delta_public_image_pct", value: rImg, ...payloadBase });
        if (Number.isInteger(rNuc) && rNuc !== 0) effects.push({ type: "delta_nucleo", value: rNuc, ...payloadBase });
        if (Array.isArray(addIdsRival) && addIdsRival.length) effects.push({ type: "add_supports", ids: [...addIdsRival], ...payloadBase });
        if (Array.isArray(remIdsRival) && remIdsRival.length) effects.push({ type: "remove_supports", ids: [...remIdsRival], ...payloadBase });
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
        out._ui_target = targetSel || "";
        out._ui_target_id = targetId || "";
        return out;
      },
      updateRoleUI: (roleVal) => {
        const roleOpp = roleVal === ROLES.OPOSICION;
        ui.sectionSelectorTarget.style.display = roleOpp ? "" : "none";
        ui.sectionPendulum.style.display = roleOpp ? "none" : "";
        ui.sectionRivalDeltas.forEach(n => n.style.display = roleOpp ? "" : "none");
        ui.sectionRivalSupports.forEach(n => n.style.display = roleOpp ? "" : "none");
        const needPick = targetSel === EFFECT_TARGET.BY_SECTOR || targetSel === EFFECT_TARGET.BY_AGENDA;
        ui.btnPickTarget.disabled = !roleOpp || !needPick;
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
    const roleVal = Number(root.querySelector(`input[name="role-${uid}"]:checked`)?.value || ROLES.OFICIALISMO);
    if (Array.isArray(ref.optionsHost._collectors)) {
      ref.optionsHost._collectors.forEach(c => c.updateRoleUI?.(roleVal));
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
