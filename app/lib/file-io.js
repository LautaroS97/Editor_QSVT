export function openTextFile(accept = ".gd,.json") {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return reject(new Error("no file selected"));
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error || new Error("read error"));
      reader.onload = () => resolve({ name: file.name, text: String(reader.result || "") });
      reader.readAsText(file, "utf-8");
    };
    input.click();
  });
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function loadJSON(input) {
  if (typeof input === "string") {
    const res = await fetch(input, { cache: "no-cache" });
    const txt = await res.text();
    return JSON.parse(txt);
  }
  if (input instanceof File) {
    const txt = await input.text();
    return JSON.parse(txt);
  }
  if (input && input.text) {
    return JSON.parse(String(input.text));
  }
  throw new Error("unsupported input");
}
