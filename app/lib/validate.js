import { SCOPES, PROVINCES, ROLES, EFFECT_TYPES, EFFECT_TARGET, isValidEffectTarget, targetNeedsId, isProvincial, ensureOptionIds } from "./schema.js";

export function validateQuestion(q) {
  const problems = [];
  if (!q || typeof q !== "object") {
    return { ok: false, problems: ["estructura inválida"] };
  }

  if (!isNonEmptyString(q.name)) problems.push("name vacío");
  if (!isNonEmptyString(q.id)) problems.push("id vacío");
  if (!isNonEmptyString(q.category)) problems.push("category vacío");

  if (!Number.isInteger(q.role_target) || (q.role_target !== ROLES.OFICIALISMO && q.role_target !== ROLES.OPOSICION)) {
    problems.push("role_target inválido (debe ser Oficialismo u Oposición)");
  }

  if (!SCOPES.includes(q.scope)) problems.push("scope inválido");
  if (isProvincial(q.scope)) {
    if (!PROVINCES.includes(q.province) || q.province === "") problems.push("province inválido para scope='provincial'");
  }

  if (!Array.isArray(q.allowed_states)) problems.push("allowed_states debe ser array");
  else if (!q.allowed_states.every(n => Number.isInteger(n))) problems.push("allowed_states debe contener enteros");

  if (!Array.isArray(q.affinity_agenda)) problems.push("affinity_agenda debe ser array");
  else if (!q.affinity_agenda.every(isNonEmptyString)) problems.push("affinity_agenda debe contener strings no vacíos");

  if (!isNonEmptyString(q.prompt)) problems.push("prompt vacío");

  if (!Array.isArray(q.options)) problems.push("options debe ser array");
  else {
    const opts = ensureOptionIds(q.options);
    if (opts.length !== 4) problems.push("se esperan 4 opciones (A,B,C,D)");
    const ids = new Set();
    for (const o of opts) {
      const pr = validateOption(o, q.role_target);
      problems.push(...pr);
      if (o && o.id) {
        if (ids.has(o.id)) problems.push(`opciones con id duplicado: ${o.id}`);
        ids.add(o.id);
      }
    }
  }

  if (q.auto_id !== undefined && !(Number.isInteger(q.auto_id) && q.auto_id >= 1)) {
    problems.push("auto_id inválido");
  }

  return { ok: problems.length === 0, problems };
}

function validateOption(o, roleTarget) {
  const problems = [];
  if (!o || typeof o !== "object") return ["opción inválida"];
  if (!isNonEmptyString(o.id)) problems.push("opción sin id");
  if (!isNonEmptyString(o.label)) problems.push(`opción ${o.id || "?"} con label vacío`);
  if (!Array.isArray(o.effects)) problems.push(`opción ${o.id || "?"} effects debe ser array`);
  else {
    for (const e of o.effects) {
      const pr = validateEffect(e, roleTarget);
      problems.push(...pr.map(p => `opción ${o.id || "?"}: ${p}`));
    }
  }
  if (o.next_question_id !== undefined && typeof o.next_question_id !== "string") {
    problems.push(`opción ${o.id || "?"} next_question_id debe ser string`);
  }
  return problems;
}

function validateEffect(e, roleTarget) {
  const problems = [];
  if (!e || typeof e !== "object") return ["efecto inválido"];
  if (!EFFECT_TYPES.includes(e.type)) return ["tipo de efecto inválido"];

  const t = e.target ?? EFFECT_TARGET.SELF;
  if (!isValidEffectTarget(t)) problems.push("target inválido");
  if (targetNeedsId(t)) {
    if (!isNonEmptyString(e.target_id)) problems.push("target_id requerido para target seleccionado");
  }

  switch (e.type) {
    case "delta_public_image_pct":
    case "delta_nucleo":
      if (!Number.isInteger(e.value)) problems.push("value debe ser entero");
      break;
    case "shift_pendulum":
      if (!Number.isInteger(e.workers)) problems.push("workers debe ser entero");
      if (!Number.isInteger(e.capital)) problems.push("capital debe ser entero");
      if (roleTarget === ROLES.OPOSICION) problems.push("shift_pendulum no permitido para preguntas de oposición");
      break;
    case "add_supports":
    case "remove_supports":
      if (!Array.isArray(e.ids)) problems.push("ids debe ser array");
      else if (!e.ids.every(isNonEmptyString)) problems.push("ids debe contener strings no vacíos");
      break;
    default:
      break;
  }
  return problems;
}

function isNonEmptyString(s) {
  return typeof s === "string" && s.trim().length > 0;
}
