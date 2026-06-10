import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, "public");

async function svgToPng(svgPath, outPath, size) {
  const svg = await readFile(svgPath);
  const buf = await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(outPath, buf);
  console.log(`✓ ${outPath} (${buf.length} bytes)`);
}

await svgToPng(join(pub, "icon.svg"), join(pub, "icon-192.png"), 192);
await svgToPng(join(pub, "icon.svg"), join(pub, "icon-512.png"), 512);
// Maskable: pakai icon-maskable.svg yang sudah full-bleed dengan safe zone 40%
await svgToPng(join(pub, "icon-maskable.svg"), join(pub, "icon-maskable-192.png"), 192);
await svgToPng(join(pub, "icon-maskable.svg"), join(pub, "icon-maskable-512.png"), 512);
await svgToPng(join(pub, "icon.svg"), join(pub, "apple-touch-icon.png"), 180);

console.log("Done.");
