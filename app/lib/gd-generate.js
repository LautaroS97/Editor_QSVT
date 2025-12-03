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

function kvIf(key, value, valueEmitter) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" && value === "") return "";
  return `, "${key}": ${valueEmitter(value)}`;
}

function emitThirdPartySelectors(e) {
  let out = "";
  if (Number.isInteger(e.force_id) && e.force_id >= 0) out += kvIf("force_id", e.force_id, emitInt);
  if (typeof e.by_agenda === "string" && e.by_agenda) out += kvIf("by_agenda", e.by_agenda, emitString);
  if (e.by_officialism === true) out += `, "by_officialism": true`;
  if (typeof e.by_sector_support === "string" && e.by_sector_support) out += kvIf("by_sector_support", e.by_sector_support, emitString);
  return out;
}

function emitEffect(e) {
  if (!e || typeof e !== "object") return "{}";
  const t = String(e.type || "");
  if (t === "delta_public_image_pct") {
    return `{ "type": ${emitString(t)}, "value": ${emitInt(e.value, 0)} }`;
  }
  if (t === "delta_nucleo") {
    return `{ "type": ${emitString(t)}, "value": ${emitInt(e.value, 0)} }`;
  }
  if (t === "shift_pendulum") {
    return `{ "type": ${emitString(t)}, "workers": ${emitInt(e.workers, 0)}, "capital": ${emitInt(e.capital, 0)} }`;
  }
  if (t === "add_supports" || t === "remove_supports") {
    return `{ "type": ${emitString(t)}, "ids": ${emitStrArray(e.ids)} }`;
  }
  if (t === "affect_force_stats") {
    const imagen = emitInt(e.imagen_delta, 0);
    const nucleo = emitInt(e.nucleo_delta, 0);
    return `{ "type": ${emitString(t)}, "imagen_delta": ${imagen}, "nucleo_delta": ${nucleo}${emitThirdPartySelectors(e)} }`;
  }
  if (t === "force_support_loss") {
    const sid = String(e.support_id || "");
    return `{ "type": ${emitString(t)}, "support_id": ${emitString(sid)}${emitThirdPartySelectors(e)} }`;
  }
  return `{ "type": ${emitString(t)} }`;
}

function emitOption(o) {
  const id = emitString(o?.id ?? "");
  const label = emitString(o?.label ?? "");
  const tooltip = emitString(o?.tooltip ?? "");
  const nextq = emitString(o?.next_question_id ?? "");
  const effects = Array.isArray(o?.effects) ? o.effects.map(emitEffect).join(", ") : "";
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
  parts.push(`  "auto_id": ${emitInt(q.auto_id, 0)},`);
  parts.push(`  "name": ${emitString(q.name || "")},`);
  parts.push(`  "id": ${emitString(q.id || "")},`);
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
  parts.push(`  "nested_only": ${emitBool(!!q.nested_only)},`);
  parts.push(`  "prompt": ${emitString(q.prompt || "")},`);
  parts.push(`  "options": ${emitOptions(q.options)}`);
  parts.push("}");
  return parts.join("\n");
}

export function generateGdQuestions(questions) {
  const arr = Array.isArray(questions) ? questions : [];
  const body = arr.map(emitQuestion).join(",\n\n");
  const content = `var Preguntas = [\n${body ? "  " + body.split("\n").join("\n  ") + "\n" : ""}]\n`;
  return content;
}
