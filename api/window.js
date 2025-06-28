export default function handler(req, res) {
  const {
    type = "casement",
    width = 1200,
    height = 1500,
    panels = 1,
    exportFormat = "svg"
  } = req.query;

  const w = parseInt(width);
  const h = parseInt(height);
  const numPanels = parseInt(panels);
  const scale = Math.min(300 / w, 400 / h);
  const sw = w * scale;
  const sh = h * scale;
  const bx = 50, by = 50;
  const panelWidth = sw / numPanels;

  let panelLines = '';
  let openArrows = '';
  const lowerType = type.toLowerCase();

  // Draw internal panel divisions
  for (let i = 1; i < numPanels; i++) {
    const x = bx + i * panelWidth;
    panelLines += `<line x1="${x}" y1="${by}" x2="${x}" y2="${by + sh}" stroke="#333" stroke-width="1"/>`;
  }

  // Add arrows based on window type
  if (lowerType === "sliding") {
    for (let i = 0; i < numPanels; i++) {
      const cx = bx + i * panelWidth + panelWidth / 2;
      openArrows += `<text x="${cx - 5}" y="${by + sh + 15}" font-size="12">⇆</text>`;
    }
  } else if (lowerType === "openable" || lowerType === "casement") {
    for (let i = 0; i < numPanels; i++) {
      const cy = by + sh / 2;
      openArrows += `<text x="${bx + i * panelWidth + 5}" y="${cy}" font-size="14">⇄</text>`;
    }
  } else if (lowerType === "tiltturn" || lowerType === "tiltandturn") {
    openArrows += `<text x="${bx + sw/2 - 10}" y="${by + sh/2}" font-size="14">⤡</text>`;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
      <!-- Outer Frame -->
      <rect x="${bx - 5}" y="${by - 5}" width="${sw + 10}" height="${sh + 10}" fill="#ccc" stroke="#000" stroke-width="2"/>
      
      <!-- Glass Area -->
      <rect x="${bx}" y="${by}" width="${sw}" height="${sh}" fill="#e6f7ff" stroke="#000" stroke-width="1"/>
      
      <!-- Panel Lines -->
      ${panelLines}

      <!-- Opening Arrows -->
      ${openArrows}

      <!-- Labels -->
      <text x="${bx}" y="${by - 10}" font-size="12">Width: ${w}mm</text>
      <text x="${bx + sw + 5}" y="${by + sh / 2}" font-size="12" transform="rotate(90 ${bx + sw + 5},${by + sh / 2})">Height: ${h}mm</text>
      <text x="${bx}" y="${by + sh + 30}" font-size="14" font-weight="bold">${type} Window (${numPanels} panel${numPanels > 1 ? "s" : ""})</text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
}
