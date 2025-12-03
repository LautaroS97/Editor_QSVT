export const ROLES = {
  OFICIALISMO: 1,
  OPOSICION: 2
};

export const ROLES_LABEL = {
  [ROLES.OFICIALISMO]: "Oficialismo",
  [ROLES.OPOSICION]: "Oposición"
};

export const CATEGORIES = ["econ", "soc", "cul", "dip"];

export const CATEGORY_LABEL = {
  econ: "Economía",
  soc: "Trabajo",
  cul: "Cultura",
  dip: "Diplomacia"
};

export const SCOPES = ["national", "international", "provincial"];

export const SCOPE_LABEL = {
  national: "Nacional",
  international: "Internacional",
  provincial: "Provincial"
};

export const PROVINCES = ["", "pba", "caba", "cordoba", "santa_fe", "cuyo", "norte", "mesopotamia", "patagonia"];

export const PROVINCE_LABEL = {
  "": "—",
  pba: "Buenos Aires",
  caba: "Capital Federal",
  cordoba: "Córdoba",
  santa_fe: "Santa Fe",
  cuyo: "Cuyo",
  norte: "Gran Norte",
  mesopotamia: "Mesopotamia",
  patagonia: "Patagonia"
};

export const EFFECT_TYPES = [
  "delta_public_image_pct",
  "delta_nucleo",
  "shift_pendulum",
  "add_supports",
  "remove_supports",
  "affect_force_stats",
  "force_support_loss"
];

export const FORCE_IDS = {
  peronismo: 0,
  republicanismo: 1,
  trotskismo: 2,
  libertarismo: 3,
  progresismo: 4,
  nacionalismo: 5
};

export const THIRD_SELECTOR_KINDS = {
  FORCE: "force",
  AGENDA: "agenda",
  OFFICIALISM: "officialism",
  SECTOR_SUPPORT: "sector_support"
};

export function isProvincial(scope) {
  return scope === "provincial";
}

export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

export function ensureOptionIds(options) {
  const ids = ["A", "B", "C", "D"];
  const out = [];
  for (let i = 0; i < 4; i++) {
    const base = Array.isArray(options) && options[i] ? options[i] : {};
    out.push({
      id: ids[i],
      label: base.label ?? "",
      tooltip: base.tooltip ?? "",
      effects: Array.isArray(base.effects) ? base.effects : [],
      next_question_id: base.next_question_id ?? ""
    });
  }
  return out;
}

export function parseCSV(s) {
  if (!s) return [];
  return String(s)
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);
}

export function parseCSVInts(s) {
  if (!s) return [];
  return String(s)
    .split(",")
    .map(x => parseInt(x.trim(), 10))
    .filter(n => Number.isInteger(n));
}

export function joinCSV(arr) {
  if (!Array.isArray(arr)) return "";
  return arr.join(", ");
}

export function emptyQuestion() {
  return {
    auto_id: 0,
    name: "",
    id: "",
    category: "",
    role_target: ROLES.OFICIALISMO,
    scope: "national",
    province: "",
    allowed_states: [],
    affinity_agenda: [],
    image_path: "",
    prompt: "",
    options: ensureOptionIds([]),
    nested_only: false
  };
}

export function nextAutoId(list) {
  if (!Array.isArray(list) || list.length === 0) return 1;
  let maxId = 0;
  for (const q of list) {
    const v = Number(q?.auto_id);
    if (Number.isInteger(v) && v > maxId) maxId = v;
  }
  return maxId + 1;
}

export function readThirdSelectorFrom(obj) {
  if (!obj || typeof obj !== "object") return null;
  const hasForce = Number.isInteger(obj.force_id) && obj.force_id >= 0;
  const hasAgenda = typeof obj.by_agenda === "string" && obj.by_agenda.trim().length > 0;
  const hasOfficialism = obj.by_officialism === true;
  const hasSector = typeof obj.by_sector_support === "string" && obj.by_sector_support.trim().length > 0;
  const count = (hasForce ? 1 : 0) + (hasAgenda ? 1 : 0) + (hasOfficialism ? 1 : 0) + (hasSector ? 1 : 0);
  if (count !== 1) return null;
  if (hasForce) return { kind: THIRD_SELECTOR_KINDS.FORCE, value: obj.force_id };
  if (hasAgenda) return { kind: THIRD_SELECTOR_KINDS.AGENDA, value: obj.by_agenda };
  if (hasOfficialism) return { kind: THIRD_SELECTOR_KINDS.OFFICIALISM, value: true };
  return { kind: THIRD_SELECTOR_KINDS.SECTOR_SUPPORT, value: obj.by_sector_support };
}

export function applyThirdSelectorTo(target, selector) {
  if (!target || typeof target !== "object") return target;
  delete target.force_id;
  delete target.by_agenda;
  delete target.by_officialism;
  delete target.by_sector_support;
  if (!selector || typeof selector !== "object") return target;
  const { kind, value } = selector;
  if (kind === THIRD_SELECTOR_KINDS.FORCE && Number.isInteger(value) && value >= 0) target.force_id = value;
  else if (kind === THIRD_SELECTOR_KINDS.AGENDA && typeof value === "string" && value.trim()) target.by_agenda = value.trim();
  else if (kind === THIRD_SELECTOR_KINDS.OFFICIALISM) target.by_officialism = true;
  else if (kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT && typeof value === "string" && value.trim()) target.by_sector_support = value.trim();
  return target;
}

export function thirdSelectorLabel(selector) {
  if (!selector) return "";
  const { kind, value } = selector;
  if (kind === THIRD_SELECTOR_KINDS.FORCE) return `Fuerza #${value}`;
  if (kind === THIRD_SELECTOR_KINDS.AGENDA) return `Agenda ${String(value)}`;
  if (kind === THIRD_SELECTOR_KINDS.OFFICIALISM) return "Oficialismo";
  if (kind === THIRD_SELECTOR_KINDS.SECTOR_SUPPORT) return `Sector ${String(value)}`;
  return "";
}
