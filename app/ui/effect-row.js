import { EFFECT_TYPES } from "../lib/schema.js";

export function mountEffectRow(container, effect, { onChange, onDelete } = {}) {
  const row = document.createElement("div");
  row.className = "effect-row";
  row.innerHTML = `
    <div class="effect">
      <div>
        <label class="small">Tipo</label>
        <select data-field="type"></select>
      </div>
      <div>
        <label class="small">value</label>
        <input type="number" data-field="value" value="0"/>
      </div>
      <div>
        <label class="small">workers</label>
        <input type="number" step="0.1" data-field="workers" value="0"/>
      </div>
      <div>
        <label class="small">capital</label>
        <input type="number" step="0.1" data-field="capital" value="0"/>
      </div>
      <div>
        <label class="small">ids</label>
        <input type="text" data-field="ids" placeholder="id1,id2"/>
      </div>
      <div>
        <button type="button" class="btn" data-del>Quitar</button>
      </div>
    </div>
  `;
  const selType = row.querySelector('[data-field="type"]');
  EFFECT_TYPES.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    selType.appendChild(opt);
  });
  const fields = {
    type: row.querySelector('[data-field="type"]'),
    value: row.querySelector('[data-field="value"]'),
    workers: row.querySelector('[data-field="workers"]'),
    capital: row.querySelector('[data-field="capital"]'),
    ids: row.querySelector('[data-field="ids"]'),
    del: row.querySelector('[data-del]')
  };
  fields.type.value = effect.type || EFFECT_TYPES[0];
  fields.value.value = Number(effect.value ?? 0);
  fields.workers.value = Number(effect.workers ?? 0);
  fields.capital.value = Number(effect.capital ?? 0);
  fields.ids.value = Array.isArray(effect.ids) ? effect.ids.join(",") : "";

  const emit = () => {
    const next = {
      ...effect,
      type: fields.type.value,
      value: Number(fields.value.value || 0),
      workers: Number(fields.workers.value || 0),
      capital: Number(fields.capital.value || 0),
      ids: String(fields.ids.value || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    };
    if (typeof onChange === "function") onChange(next);
  };

  fields.type.addEventListener("change", emit);
  fields.value.addEventListener("input", emit);
  fields.workers.addEventListener("input", emit);
  fields.capital.addEventListener("input", emit);
  fields.ids.addEventListener("input", emit);
  fields.del.addEventListener("click", () => {
    if (typeof onDelete === "function") onDelete();
    row.remove();
  });

  container.appendChild(row);
  return row;
}
