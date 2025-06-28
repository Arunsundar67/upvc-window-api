import QRCode from 'qrcode';

export default async function handler(req, res) {
  const {
    type = "casement",
    width = 1200,
    height = 1500,
    panels = 1,
    frameColor = "#cccccc",
    glassColor = "#e6f7ff",
    label = "",
    notes = "",
    openDirection = "",
    jobId = "",
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
  const lowerType = type.toLowerCase();

  let panelLines = '', openArrows = '';

  for (let i = 1; i < numPanels; i++) {
    const x = bx + i * panelWidth;
    panelLines += `<line x1="${x}" y1="${by}" x2="${x}" y2="${by + sh}" stroke="#333" stroke-width="1"/>`;
  }

  if (["sliding", "openable", "casement"].includes(lowerType)) {
    for (let i = 0; i < numPanels; i++) {
      const cx = bx + i * panelWidth + panelWidth / 2;
      if (lowerType === "sliding") {
        openArrows += `<text x="${cx - 5}" y="${by + sh + 15}" font-size="12">⇆</text>`;
      } else {
        openArrows += `<text x="${cx - 8}" y="${by + sh + 15}" font-size="12">${openDirection === "left" ? "←" : openDirection === "right" ? "→" : openDirection === "top" ? "↑" : openDirection === "bottom" ? "↓" : "⇄"}</text>`;
      }
    }
  }

  if (lowerType === "tiltturn") {
    openArrows += `<text x="${bx + sw/2 - 10}" y="${by + sh/2}" font-size="14">⤡</text>`;
  }

  // QR code as base64
  let qrImage = '';
  if (jobId) {
    const qrData = await QRCode.toDataURL(jobId);
    qrImage = `<image href="${qrData}" x="${bx + sw - 60}" y="${by + sh + 40}" width="50" height="50"/>`;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="550">
      <!-- Frame -->
      <rect x="${bx - 5}" y="${by - 5}" width="${sw + 10}" height="${sh + 10}" fill="${frameColor}" stroke="#000" stroke-width="2"/>

      <!-- Glass -->
      <rect x="${bx}" y="${by}" width="${sw}" height="${sh}" fill="${glassColor}" stroke="#000" stroke-width="1"/>

      ${panelLines}
      ${openArrows}

      <!-- Labels -->
      <text x="${bx}" y="${by - 10}" font-size="12">Width: ${w}mm</text>
      <text x="${bx + sw + 5}" y="${by + sh / 2}" font-size="12" transform="rotate(90 ${bx + sw + 5},${by + sh / 2})">Height: ${h}mm</text>
      <text x="${bx}" y="${by + sh + 30}" font-size="14" font-weight="bold">${type} (${numPanels} panel${numPanels > 1 ? "s" : ""})</text>
      <text x="${bx}" y="${by + sh + 50}" font-size="12">${label}</text>
      <text x="${bx}" y="${by + sh + 65}" font-size="10" fill="gray">${notes}</text>

      ${qrImage}
    </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
