export const ROLES = {
  OFICIALISMO: 1,
  OPOSICION: 2
};

export const ROLES_LABEL = {
  [ROLES.OFICIALISMO]: "Oficialismo",
  [ROLES.OPOSICION]: "Oposición"
};

export const CATEGORIES = ["econ", "soc", "cul", "dip"];

export const SCOPES = ["national", "international", "provincial"];

export const PROVINCES = ["", "pba", "caba", "cordoba", "santa_fe", "cuyo", "norte", "mesopotamia", "patagonia"];

export const EFFECT_TYPES = [
  "delta_public_image_pct",
  "delta_nucleo",
  "shift_pendulum",
  "add_supports",
  "remove_supports"
];

export const EFFECT_TARGET = {
  SELF: "self",
  OFFICIALISM: "officialism",
  BY_SECTOR: "by_sector",
  BY_AGENDA: "by_agenda"
};

export const EFFECT_TARGET_LABEL = {
  [EFFECT_TARGET.SELF]: "Propio",
  [EFFECT_TARGET.OFFICIALISM]: "Oficialismo",
  [EFFECT_TARGET.BY_SECTOR]: "Por apoyo sectorial",
  [EFFECT_TARGET.BY_AGENDA]: "Por agenda"
};

export function isValidEffectTarget(t) {
  return t === EFFECT_TARGET.SELF || t === EFFECT_TARGET.OFFICIALISM || t === EFFECT_TARGET.BY_SECTOR || t === EFFECT_TARGET.BY_AGENDA;
}

export function targetNeedsId(t) {
  return t === EFFECT_TARGET.BY_SECTOR || t === EFFECT_TARGET.BY_AGENDA;
}

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

export function emptyEffect() {
  return { type: "delta_public_image_pct", value: 0, target: EFFECT_TARGET.SELF };
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

export const CATEGORY_LABEL = {
  econ: "Economía",
  soc: "Trabajo",
  cul: "Cultura",
  dip: "Diplomacia"
};

export const SCOPE_LABEL = {
  national: "Nacional",
  international: "Internacional",
  provincial: "Provincial"
};

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
