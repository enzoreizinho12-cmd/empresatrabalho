import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const manifestSource = await readFile(resolve(root, "src/app/manifest.ts"), "utf8");
const worker = await readFile(resolve(root, "public/sw.js"), "utf8");
const layout = await readFile(resolve(root, "src/app/layout.tsx"), "utf8");
const required = ["PombalEmprega", "start_url", "scope", "standalone", "pt-BR", "theme_color", "maskable"];
for (const item of required) assert.ok(manifestSource.includes(item), "Manifest sem " + item);
assert.match(layout, /PwaControls|SiteHeader/);
assert.ok(worker.includes('request.mode === "navigate"'));
assert.match(worker, /isPublicStaticAsset/);
assert.match(worker, /request\.method !== "GET"/);
assert.match(worker, /url\.origin !== self\.location\.origin/);
assert.match(worker, /request\.mode === "navigate"[\s\S]*fetch\(request\)/);
assert.match(worker, /!isPublicStaticAsset\(url, request\)[\s\S]*return;/);
for (const [name, expected] of [["pombal-emprega-192.png",192],["pombal-emprega-512.png",512],["pombal-emprega-maskable-512.png",512],["pombal-emprega-apple-180.png",180]]) {
  const path = resolve(root, "public/icons", name);
  const file = await readFile(path);
  const size = await stat(path);
  assert.equal(file.readUInt32BE(16), expected, name + ": largura incorreta");
  assert.equal(file.readUInt32BE(20), expected, name + ": altura incorreta");
  assert.ok(size.size > 512, name + ": arquivo de ícone vazio");
}
console.log("Auditoria PWA: manifesto, proteção de páginas e APIs, service worker e 4 ícones aprovados.");
