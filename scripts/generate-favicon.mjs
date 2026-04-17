import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "..", "public");
const svg = readFileSync(resolve(publicDir, "favicon.svg"));
const sizes = [16, 32, 48];

const pngs = await Promise.all(
    sizes.map((size) =>
        sharp(svg, { density: 384 }).resize(size, size).png().toBuffer(),
    ),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

const entries = Buffer.alloc(16 * sizes.length);
let offset = 6 + 16 * sizes.length;
for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const png = pngs[i];
    const base = i * 16;
    entries.writeUInt8(size === 256 ? 0 : size, base + 0);
    entries.writeUInt8(size === 256 ? 0 : size, base + 1);
    entries.writeUInt8(0, base + 2);
    entries.writeUInt8(0, base + 3);
    entries.writeUInt16LE(1, base + 4);
    entries.writeUInt16LE(32, base + 6);
    entries.writeUInt32LE(png.length, base + 8);
    entries.writeUInt32LE(offset, base + 12);
    offset += png.length;
}

const ico = Buffer.concat([header, entries, ...pngs]);
writeFileSync(resolve(publicDir, "favicon.ico"), ico);
console.log(`Wrote favicon.ico (${ico.length} bytes, sizes: ${sizes.join(", ")})`);
