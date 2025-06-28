export default async function handler(req, res) {
  const { layout = "2x1" } = req.query;
  const [cols, rows] = layout.split("x").map(Number);
  const spacing = 40;

  let svgWindows = "";
  let maxWidth = 0;
  let maxHeight = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col + 1;
      const type = req.query[`type${i}`] || "casement";
      const width = parseInt(req.query[`width${i}`] || 1000);
      const height = parseInt(req.query[`height${i}`] || 1500);
      const panels = parseInt(req.query[`panels${i}`] || 1);
      const label = req.query[`label${i}`] || "";
      const jobId = req.query[`jobId${i}`] || "";

      const scale = Math.min(250 / width, 250 / height);
      const sw = width * scale;
      const sh = height * scale;
      const bx = col * (sw + spacing) + spacing;
      const by = row * (sh + spacing) + spacing;

      maxWidth = Math.max(maxWidth, bx + sw + spacing);
      maxHeight = Math.max(maxHeight, by + sh + 100);

      let panelLines = "";
      for (let p = 1; p < panels; p++) {
        const x = bx + p * (sw / panels);
        panelLines += `<line x1="${x}" y1="${by}" x2="${x}" y2="${by + sh}" stroke="#333" stroke-width="1"/>`;
      }

      svgWindows += `
        <rect x="${bx - 5}" y="${by - 5}" width="${sw + 10}" height="${sh + 10}" fill="#ccc" stroke="#000" stroke-width="2"/>
        <rect x="${bx}" y="${by}" width="${sw}" height="${sh}" fill="#e6f7ff" stroke="#000" stroke-width="1"/>
        ${panelLines}
        <text x="${bx}" y="${by - 10}" font-size="12">${type}</text>
        <text x="${bx}" y="${by + sh + 15}" font-size="12">${label}</text>
        <text x="${bx}" y="${by + sh + 30}" font-size="10">${jobId}</text>
      `;
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${maxWidth}" height="${maxHeight}">
      ${svgWindows}
    </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
