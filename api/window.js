export default function handler(req, res) {
  const { type = "casement", width = 1200, height = 1500 } = req.query;
  const w = parseInt(width);
  const h = parseInt(height);
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  const scale = Math.min(300 / w, 400 / h);
  const sw = w * scale;
  const sh = h * scale;
  const bx = 50, by = 50;

  let sashLine = "";
  if (type === "sliding") {
    sashLine = `<line x1="${bx + sw/2}" y1="${by}" x2="${bx + sw/2}" y2="${by + sh}" stroke="#333" stroke-width="2"/>`;
  } else if (type === "casement") {
    sashLine = `<line x1="${bx}" y1="${by + sh/2}" x2="${bx + sw}" y2="${by + sh/2}" stroke="#333" stroke-width="2"/>`;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
      <rect x="${bx - 5}" y="${by - 5}" width="${sw + 10}" height="${sh + 10}" fill="#ccc" stroke="#000" stroke-width="2"/>
      <rect x="${bx}" y="${by}" width="${sw}" height="${sh}" fill="#e6f7ff" stroke="#000" stroke-width="1"/>
      ${sashLine}
      <text x="${bx}" y="${by - 10}" font-size="12">Width: ${w}mm</text>
      <text x="${bx + sw + 5}" y="${by + sh/2}" font-size="12" transform="rotate(90 ${bx + sw + 5},${by + sh/2})">Height: ${h}mm</text>
      <text x="${bx}" y="${by + sh + 25}" font-size="14" font-weight="bold">${typeLabel} Window</text>
    </svg>
  `;
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}
