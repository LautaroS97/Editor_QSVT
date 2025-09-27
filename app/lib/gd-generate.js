function esc(s) {
  return String(s ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "\\r")
    .replaceAll('"', '\\"');
}

function emitString(s) {
  return `"${esc(s)}"`;
}

function emitBool(b) {
  return b ? "true" : "false";
}

function emitInt(n, def = 0) {
  const v = Number.isFinite(n) ? Math.trunc(n) : def;
  return String(v);
}

function emitStrArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "[]";
  return "[ " + arr.map(x => emitString(String(x))).join(", ") + " ]";
}

function emitIntArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "[]";
  return "[ " + arr.map(x => emitInt(x)).join(", ") + " ]";
}

function emitKVIfPresent(key, value, stringy = true) {
  if (value === undefined || value === null || value === "") return "";
  const v = stringy ? emitString(String(value)) : String(value);
  return `, "${key}": ${v}`;
}

function emitTargetFields(e) {
  const t = e.target;
  const tid = e.target_id;
  let out = "";
  if (t && t !== "self") out += emitKVIfPresent("target", t, true);
  if (tid) out += emitKVIfPresent("target_id", tid, true);
  return out;
}

function emitEffect(e) {
  if (!e || typeof e !== "object") return "{}";
  const t = e.type;
  if (t === "delta_public_image_pct" || t === "delta_nucleo") {
    return `{ "type": ${emitString(t)}, "value": ${emitInt(e.value, 0)}${emitTargetFields(e)} }`;
  }
  if (t === "shift_pendulum") {
    return `{ "type": ${emitString(t)}, "workers": ${emitInt(e.workers, 0)}, "capital": ${emitInt(e.capital, 0)}${emitTargetFields(e)} }`;
  }
  if (t === "add_supports" || t === "remove_supports") {
    return `{ "type": ${emitString(t)}, "ids": ${emitStrArray(e.ids)}${emitTargetFields(e)} }`;
  }
  return `{ "type": ${emitString(String(t))}${emitTargetFields(e)} }`;
}

function emitOption(o) {
  if (!o || typeof o !== "object") o = {};
  const id = emitString(o.id ?? "");
  const label = emitString(o.label ?? "");
  const tooltip = emitString(o.tooltip ?? "");
  const nextq = emitString(o.next_question_id ?? "");
  const effects = Array.isArray(o.effects) ? o.effects.map(emitEffect).join(", ") : "";
  return [
    "{",
    `  "id": ${id},`,
    `  "label": ${label},`,
    `  "tooltip": ${tooltip},`,
    `  "next_question_id": ${nextq},`,
    `  "effects": [${effects ? "\n    " + effects.split("\n").join("\n    ") + "\n  " : ""}]`,
    "}"
  ].join("\n");
}

function emitOptions(opts) {
  const arr = Array.isArray(opts) ? opts : [];
  const out = arr.map(emitOption).join(",\n    ");
  return "[\n    " + out + "\n  ]";
}

function emitQuestion(q) {
  const parts = [];
  parts.push("{");
  parts.push(`  "id": ${emitString(q.id || "")},`);
  parts.push(`  "name": ${emitString(q.name || "")},`);
  parts.push(`  "category": ${emitString(q.category || "")},`);
  parts.push(`  "role_target": ${emitInt(q.role_target, 1)},`);
  parts.push(`  "scope": ${emitString(q.scope || "national")},`);
  if ((q.scope || "national") === "provincial" && q.province) {
    parts.push(`  "province": ${emitString(q.province)},`);
  } else {
    parts.push(`  "province": ${emitString("")},`);
  }
  parts.push(`  "allowed_states": ${emitIntArray(q.allowed_states)},`);
  parts.push(`  "affinity_agenda": ${emitStrArray(q.affinity_agenda)},`);
  parts.push(`  "image_path": ${emitString(q.image_path || "")},`);
  parts.push(`  "prompt": ${emitString(q.prompt || "")},`);
  parts.push(`  "options": ${emitOptions(q.options)},`);
  parts.push(`  "nested_only": ${emitBool(!!q.nested_only)}`);
  parts.push("}");
  return parts.join("\n");
}

export function generateGdQuestions(questions) {
  const arr = Array.isArray(questions) ? questions : [];
  const body = arr.map(emitQuestion).join(",\n\n");
  const header = `# Auto-generado por Editor de Preguntas\n# Guardar este archivo dentro de data/\n`;
  const content = `${header}var Preguntas = [\n${body ? "  " + body.split("\n").join("\n  ") + "\n" : ""}]\n`;
  return content;
}
