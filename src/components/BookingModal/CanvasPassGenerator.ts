import { BookingPassData } from "@/types/booking";
import { LAB_CONTACT } from "@/data/testsData";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | { tl: number; tr: number; br: number; bl: number }
) {
  const radii = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
  ctx.beginPath();
  ctx.moveTo(x + radii.tl, y);
  ctx.lineTo(x + w - radii.tr, y);
  ctx.arcTo(x + w, y, x + w, y + radii.tr, radii.tr);
  ctx.lineTo(x + w, y + h - radii.br);
  ctx.arcTo(x + w, y + h, x + w - radii.br, y + h, radii.br);
  ctx.lineTo(x + radii.bl, y + h);
  ctx.arcTo(x, y + h, x, y + h - radii.bl, radii.bl);
  ctx.lineTo(x, y + radii.tl);
  ctx.arcTo(x, y, x + radii.tl, y, radii.tl);
  ctx.closePath();
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function dashedLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y: number,
  x2: number
) {
  ctx.save();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.8;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

export function generateBookingCardCanvas(
  data: BookingPassData,
  logoImage?: HTMLImageElement | null
): HTMLCanvasElement {
  const W = 800;
  const PAD = 44;

  const measureCanvas = document.createElement("canvas");
  const mctx = measureCanvas.getContext("2d");
  if (mctx) {
    mctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  }

  const patientName = data.name || "Patient Name";
  const addrText = data.address || "Patna, Bihar";
  const addrLines = mctx ? wrapLines(mctx, addrText, W - PAD * 2 - 20) : [addrText];

  // Heights
  const headerH = 150;
  const patientBlockH = 95;
  const rowH = 48;
  const numRows = 5;
  const addrHeaderH = 28;
  const addrContentH = addrLines.length * 26 + 12;
  const discountH = 64;
  const footerH = 100;
  const paddingSafetyH = 75;

  const H =
    headerH +
    patientBlockH +
    rowH * numRows +
    addrHeaderH +
    addrContentH +
    discountH +
    footerH +
    paddingSafetyH;

  const dpr = typeof window !== "undefined" ? Math.max(window.devicePixelRatio || 1, 2) : 2;
  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.scale(dpr, dpr);

  // 1. Base White Card Background
  ctx.save();
  roundRect(ctx, 0, 0, W, H, 32);
  ctx.clip();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // 2. Header Gradient
  const headerGrad = ctx.createLinearGradient(0, 0, W, headerH);
  headerGrad.addColorStop(0, "#047857");
  headerGrad.addColorStop(0.5, "#059669");
  headerGrad.addColorStop(1, "#10b981");
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, W, headerH);

  // Decorative diagonal lines
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < W; i += 38) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 45, headerH);
  }
  ctx.stroke();
  ctx.restore();

  // Official Logo Drawing in Header
  let textX = PAD;
  if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(PAD + 28, 54, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.clip();
    ctx.drawImage(logoImage, PAD, 26, 56, 56);
    ctx.restore();
    textX = PAD + 68;
  }

  // Lab Title
  ctx.fillStyle = "#ffffff";
  ctx.font = '700 27px "Space Grotesk", sans-serif';
  ctx.fillText("KARIM PATH LAB", textX, 51);

  ctx.font = '700 10.5px "JetBrains Mono", monospace';
  ctx.fillStyle = "#ecfdf5";
  ctx.fillText("D O O R S T E P   B L O O D   &   U R I N E   T E S T I N G", textX, 73);

  // 20% OFF Badge top right
  ctx.save();
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, W - PAD - 130, 32, 130, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#047857";
  ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("20% OFF", W - PAD - 65, 55);
  ctx.textAlign = "left";
  ctx.restore();

  // Status & Ref Code
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillStyle = "#ffffff";
  ctx.fillText("● OFFICIAL DIGITAL BOOKING PASS", PAD, 126);
  ctx.fillText(`REF: ${data.refCode}`, W - PAD - 165, 126);

  // 3. Patient Profile Section
  let y = headerH + 20;

  ctx.save();
  ctx.fillStyle = "#f8fafc";
  roundRect(ctx, PAD, y, W - PAD * 2, 75, 18);
  ctx.fill();
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1.5;
  roundRect(ctx, PAD, y, W - PAD * 2, 75, 18);
  ctx.stroke();
  ctx.restore();

  // Date Tag inside box
  ctx.save();
  ctx.fillStyle = "#ecfdf5";
  roundRect(ctx, W - PAD - 170, y + 20, 150, 34, 12);
  ctx.fill();
  ctx.strokeStyle = "#a7f3d0";
  ctx.lineWidth = 1;
  roundRect(ctx, W - PAD - 170, y + 20, 150, 34, 12);
  ctx.stroke();

  ctx.fillStyle = "#047857";
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("📅 " + (data.date || "Today"), W - PAD - 95, y + 41);
  ctx.textAlign = "left";
  ctx.restore();

  // Patient Avatar Circle
  const avatarCenterX = PAD + 42;
  const avatarCenterY = y + 37.5;
  ctx.save();
  ctx.fillStyle = "#059669";
  ctx.beginPath();
  ctx.arc(avatarCenterX, avatarCenterY, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = '700 18px "Space Grotesk", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(data.initials || "PT", avatarCenterX, avatarCenterY + 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.restore();

  // Patient Label
  ctx.font = '800 11px "JetBrains Mono", monospace';
  ctx.fillStyle = "#047857";
  ctx.fillText("PATIENT NAME", PAD + 82, y + 26);

  // Patient Name
  let nameFontSize = 24;
  if (patientName.length > 28) nameFontSize = 17;
  else if (patientName.length > 20) nameFontSize = 20;

  ctx.font = `800 ${nameFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = "#0f172a";
  ctx.fillText(patientName, PAD + 82, y + 54);

  y += 95;

  // Divider
  dashedLine(ctx, PAD, y, W - PAD);
  y += 24;

  // 4. Structured details rows
  const drawDetailRow = (
    label: string,
    value: string,
    icon: string,
    valColor = "#0f172a"
  ) => {
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = "#334155";
    ctx.fillText(icon + "  " + label, PAD, y);

    ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = valColor;
    const valW = ctx.measureText(value).width;
    ctx.fillText(value, W - PAD - valW, y);

    y += rowH;
  };

  drawDetailRow(
    "MOBILE NUMBER",
    data.mobile ? `+91 ${data.mobile}` : "Pending",
    "📞"
  );
  drawDetailRow("SELECTED TEST", data.test || "Select Test", "🔬", "#047857");

  // Price & Discount breakdown row
  const saved = data.originalPrice - data.price;
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#334155";
  ctx.fillText("💵  TEST FEE & SAVINGS", PAD, y);

  const strPayable = `₹${data.price} NET`;
  const strSaved = `Save ₹${saved} (20% OFF)`;
  const strMRP = `MRP ₹${data.originalPrice}`;

  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  const wPayable = ctx.measureText(strPayable).width;
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  const wSaved = ctx.measureText(strSaved).width;
  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  const wMRP = ctx.measureText(strMRP).width;

  let rx = W - PAD;
  rx -= wPayable;
  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#15803d";
  ctx.fillText(strPayable, rx, y);

  rx -= 14;
  ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("·", rx + 4, y - 1);

  rx -= wSaved;
  ctx.fillStyle = "#0d9488";
  ctx.fillText(strSaved, rx, y);

  rx -= 14;
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("·", rx + 4, y - 1);

  rx -= wMRP;
  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(strMRP, rx, y);

  // Red Strikethrough Line
  ctx.save();
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(rx, y - 4);
  ctx.lineTo(rx + wMRP, y - 4);
  ctx.stroke();
  ctx.restore();

  y += rowH;

  drawDetailRow("APPOINTMENT DATE", data.date || "Today", "📅", "#047857");
  drawDetailRow(
    "COLLECTION TIME SLOT",
    data.slot || "Morning (6:00 AM – 9:00 AM)",
    "⏰"
  );

  // Collection Address
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#334155";
  ctx.fillText("📍  COLLECTION ADDRESS", PAD, y);
  y += 26;

  ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#0f172a";
  addrLines.forEach((line) => {
    ctx.fillText(line, PAD, y);
    y += 26;
  });
  y += 12;

  // Divider
  dashedLine(ctx, PAD, y, W - PAD);
  y += 30;

  // Discount Banner
  ctx.save();
  ctx.fillStyle = "#f0fdf4";
  roundRect(ctx, PAD, y - 22, W - PAD * 2, 46, 14);
  ctx.fill();
  ctx.strokeStyle = "#a7f3d0";
  ctx.lineWidth = 1.5;
  roundRect(ctx, PAD, y - 22, W - PAD * 2, 46, 14);
  ctx.stroke();

  ctx.fillStyle = "#047857";
  ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    "🏷️  FLAT 20% DISCOUNT APPLIED — PROMO CODE PATNA20",
    PAD + 16,
    y + 5
  );
  ctx.restore();
  y += 64;

  // Footer Phlebotomist Box
  ctx.save();
  ctx.fillStyle = "#f8fafc";
  roundRect(ctx, PAD, y - 10, W - PAD * 2, 76, 16);
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  roundRect(ctx, PAD, y - 10, W - PAD * 2, 76, 16);
  ctx.stroke();

  ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#0f172a";
  ctx.fillText(
    `Phlebotomist: ${LAB_CONTACT.phlebotomist}  ·  ${LAB_CONTACT.phone}`,
    PAD + 16,
    y + 16
  );

  ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = "#475569";
  ctx.fillText(
    "100% Sterile Vacuum Tubes · Doorstep Sample Pick-up in Patna",
    PAD + 16,
    y + 40
  );

  // Barcode lines
  ctx.fillStyle = "#0f172a";
  const barX = W - PAD - 130;
  const barY = y + 8;
  const barWidths = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2];
  let curX = barX;
  barWidths.forEach((bw) => {
    ctx.fillRect(curX, barY, bw, 32);
    curX += bw + 2;
  });
  ctx.restore();

  // Outer border
  ctx.restore();
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, W - 2, H - 2, 32);
  ctx.stroke();

  return canvas;
}

export function buildWhatsAppMessage(data: BookingPassData): string {
  const saved = data.originalPrice - data.price;
  return `━━━━━━━━━━━━━━━━━━━
🧪 *NEW LAB TEST BOOKING* 🧪
*Ref Code:* ${data.refCode}
*Lab:* Karim Path Lab (Patna)
👤 *Patient Name:* ${data.name}
📞 *Phone:* +91 ${data.mobile}
🔬 *Test Package:* ${data.test}
💰 *Original MRP:* ₹${data.originalPrice}
🎁 *20% Discount:* -₹${saved} Saved (PATNA20)
✅ *Net Payable:* *₹${data.price} ONLY*
📅 *Date:* ${data.date}
⏰ *Time Slot:* ${data.slot}
📍 *Address:* ${data.address}
━━━━━━━━━━━━━━━━━━━`;
}
