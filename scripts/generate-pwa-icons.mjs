import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const output = fileURLToPath(new URL("../public/icons/", import.meta.url));
await mkdir(output, { recursive: true });
const logo = "<circle cx=\"28\" cy=\"10\" r=\"8\" fill=\"#fff\"/><path d=\"M13 43c0-10 6-17 15-17s15 7 15 17\" fill=\"#fff\"/><circle cx=\"9\" cy=\"18\" r=\"6\" fill=\"#34D399\"/><path d=\"M0 43c0-9 4-15 11-17 2 0 4 1 6 2-4 4-6 9-6 15\" fill=\"#34D399\"/><circle cx=\"47\" cy=\"18\" r=\"6\" fill=\"#34D399\"/><path d=\"M56 43c0-9-4-15-11-17-2 0-4 1-6 2 4 4 6 9 6 15\" fill=\"#34D399\"/>";
async function render(name, size, scale, background, corner) {
  const draw = Math.round(size * scale);
  const x = Math.round((size - draw) / 2);
  const y = Math.round((size - draw * 48 / 56) / 2);
  const rx = corner ? Math.round(size * corner) : 0;
  const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + size + "\" height=\"" + size + "\" viewBox=\"0 0 " + size + " " + size + "\"><rect width=\"" + size + "\" height=\"" + size + "\" rx=\"" + rx + "\" fill=\"" + background + "\"/><g transform=\"translate(" + x + " " + y + ") scale(" + draw / 56 + ")\">" + logo + "</g></svg>";
  await sharp(Buffer.from(svg)).png().toFile(join(output, name));
}
await render("pombal-emprega-192.png", 192, .78, "#0755D8", .22);
await render("pombal-emprega-512.png", 512, .78, "#0755D8", .22);
await render("pombal-emprega-maskable-512.png", 512, .68, "#0755D8", 0);
await render("pombal-emprega-apple-180.png", 180, .8, "#0755D8", .22);
console.log("Ícones PombalEmprega gerados com composições ajustadas para cada tamanho e máscara.");
