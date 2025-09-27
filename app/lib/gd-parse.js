export function parseGdQuestions(text) {
  if (typeof text !== "string" || !text.trim()) return [];

  const raw = text.replace(/\r/g, "");

  const tryJSON = s => {
    try {
      const v = JSON.parse(s);
      if (Array.isArray(v)) return v;
      if (v && Array.isArray(v.Preguntas)) return v.Preguntas;
      return null;
    } catch {
      return null;
    }
  };

  const direct = tryJSON(raw);
  if (direct) return normalizeQuestions(direct);

  const noHashComments = raw
    .split("\n")
    .filter(line => !/^\s*#/.test(line))
    .join("\n");

  const pregIdx = noHashComments.indexOf("Preguntas");
  const arrayStart = pregIdx >= 0 ? noHashComments.indexOf("[", pregIdx) : -1;
  if (arrayStart < 0) return [];

  const arrayEnd = findMatchingBracket(noHashComments, arrayStart, "[", "]");
  if (arrayEnd < 0) return [];

  const arraySlice = noHashComments.slice(arrayStart, arrayEnd + 1).trim();

  const cleaned = arraySlice
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");

  const parsed = tryJSON(cleaned);
  if (parsed) return normalizeQuestions(parsed);

  return [];
}

function findMatchingBracket(s, startIndex, open = "[", close = "]") {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = startIndex; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) {
        esc = false;
      } else if (ch === "\\") {
        esc = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    }
    if (ch === '"') {
      inStr = true;
      esc = false;
      continue;
    }
    if (ch === open) {
      depth++;
    } else if (ch === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function normalizeQuestions(arr) {
  return arr
    .filter(x => x && typeof x === "object")
    .map(q => {
      const z = { ...q };
      if (!Array.isArray(z.options)) z.options = [];
      z.options = z.options
        .filter(o => o && typeof o === "object")
        .map(o => {
          const oo = { ...o };
          if (!Array.isArray(oo.effects)) oo.effects = [];
          oo.effects = oo.effects.filter(e => e && typeof e === "object");
          return oo;
        });
      return z;
    });
}
