// Deterministic crops only: preserve the client's original fabric and collar artwork.
// Run with the two source directories once; later runs reuse the project originals.
import { mkdirSync, readdirSync, copyFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
const root = "public/images/bahan-kerah";
for (const folder of ["originals", "kain", "kerah"])
  mkdirSync(`${root}/${folder}`, { recursive: true });
for (const [index, category] of ["kain", "kerah"].entries()) {
  const source = process.argv[index + 2];
  if (source) {
    const files = readdirSync(source)
      .filter((f) => f.endsWith(".png"))
      .sort();
    files.forEach((file, i) =>
      copyFileSync(
        path.join(source, file),
        `${root}/originals/${category}-${i + 1}.png`,
      ),
    );
  }
}
// Crop boxes are [left, top, right, bottom] in the original 1122 x 1402 posters.
const fabrics = [
  ["Milano", 1, "FREE", [108, 475, 420, 675]],
  ["Rhabit", 1, "FREE", [585, 393, 1008, 675]],
  ["Brazil", 1, "FREE", [110, 795, 537, 1065]],
  ["Bintik", 1, "FREE", [585, 795, 1008, 1065]],
  ["Benzema", 2, "10K/STEL", [108, 345, 537, 663]],
  ["PolyMesh", 2, "10K/STEL", [583, 345, 1008, 663]],
  ["Drophiddle", 2, "10K/STEL", [108, 783, 537, 1100]],
  ["Smash", 2, "10K/STEL", [583, 783, 1008, 1100]],
  ["Airwalk", 3, "10K/STEL", [110, 383, 535, 663]],
  ["Embosh Topo", 3, "10K/STEL", [586, 383, 1008, 663]],
  ["Embosh Mixed", 3, "10K/STEL", [110, 784, 535, 1065]],
  ["Lotto", 3, "10K/STEL", [586, 784, 1008, 1065]],
  ["Superior", 4, "15K/STEL", [116, 402, 1007, 1045]],
  ["Embosh Sukul Drako", 5, "20K/STEL", [113, 402, 535, 1035]],
  ["Embosh Sukul Nano", 5, "20K/STEL", [588, 402, 1005, 1035]],
  ["Jacquard Camo", 6, "25K/STEL", [112, 383, 537, 666]],
  ["Jacquard Metro", 6, "25K/STEL", [586, 383, 1007, 666]],
  ["Jacquard Mesh Segitiga", 6, "25K/STEL", [326, 788, 795, 1098]],
  ["Adidas Ruh", 7, "30K/STEL", [110, 345, 535, 650]],
  ["Adidas Leopard", 7, "30K/STEL", [584, 345, 1014, 650]],
  ["BP Running", 7, "30K/STEL", [337, 775, 790, 1108]],
];
const collars = [
  [1, 2, "FREE", [73, 482, 378, 744]],
  [2, 2, "FREE", [404, 482, 715, 744]],
  [3, 2, "FREE", [738, 482, 1050, 744]],
  [4, 2, "FREE", [73, 800, 378, 1040]],
  [5, 2, "FREE", [404, 800, 715, 1040]],
  [6, 2, "FREE", [738, 800, 1050, 1040]],
  [7, 3, "+5K", [72, 557, 379, 800]],
  [8, 3, "+5K", [405, 557, 714, 800]],
  [9, 3, "+5K", [737, 557, 1048, 800]],
  [10, 3, "+5K", [198, 849, 530, 1100]],
  [11, 3, "+5K", [590, 849, 924, 1100]],
  [12, 1, "+10K", [160, 386, 540, 663]],
  [13, 1, "+10K", [600, 386, 960, 665]],
  [14, 1, "+15K", [177, 830, 515, 1118]],
  [15, 1, "+15K", [597, 830, 960, 1118]],
  [16, 4, "+20K", [184, 383, 539, 723]],
  [17, 4, "+20K", [590, 383, 935, 731]],
  [18, 4, "+25K", [245, 817, 530, 1165]],
  [19, 4, "+25K", [580, 817, 940, 1170]],
];
async function crop(category, sourceNumber, box, slug) {
  const [left, top, right, bottom] = box;
  let pixels = await sharp(`${root}/originals/${category}-${sourceNumber}.png`)
    .extract({ left, top, width: right - left, height: bottom - top })
    .png()
    .toBuffer();
  // Exclude only the poster's lower-left price ribbon. The collar pixels are retained.
  const ribbonCorners = {
    "kerah-12": [310, 632],
    "kerah-14": [303, 1080],
    "kerah-16": [300, 642],
    "kerah-18": [300, 1092],
  };
  if (ribbonCorners[slug]) {
    const [x, y] = ribbonCorners[slug];
    const w = right - left;
    const h = bottom - top;
    const mask = `<svg width="${w}" height="${h}"><path fill="white" d="M0 0H${w}V${h}H${x - left}V${y - top}H0Z"/></svg>`;
    pixels = await sharp(pixels)
      .composite([{ input: Buffer.from(mask), blend: "dest-in" }])
      .png()
      .toBuffer();
  }
  await sharp(pixels)
    .resize({
      width: 720,
      height: 720,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 90 })
    .toFile(`${root}/${category}/${slug}.webp`);
  return {
    image: `/images/bahan-kerah/${category}/${slug}.webp`,
    source: `/images/bahan-kerah/originals/${category}-${sourceNumber}.png`,
  };
}
const materials = [];
for (const [name, poster, priceLabel, box] of fabrics) {
  const id = name.toLowerCase().replaceAll(" ", "-");
  materials.push({
    id,
    name,
    priceLabel,
    alt: `Tekstur kain ${name}`,
    ...(await crop("kain", poster, box, id)),
  });
}
const collarOptions = [];
for (const [number, poster, priceLabel, box] of collars) {
  const label = String(number).padStart(2, "0");
  const id = `kerah-${label}`;
  collarOptions.push({
    id,
    number,
    name: `Kerah Model ${label}`,
    priceLabel,
    alt: `Bentuk kerah model ${label}`,
    ...(await crop("kerah", poster, box, id)),
  });
}
console.log(
  `Prepared ${materials.length} fabrics and ${collarOptions.length} collars.`,
);

console.log("Aset siap. Unggah gambar dan kelola data bahan/kerah melalui admin.");
