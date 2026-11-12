import { jsPDF } from "jspdf";

/**
 * Converts Markdown tables and text into clean, styled HTML
 */
function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const htmlLines: string[] = [];
  let inTable = false;
  let tableHeaderParsed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Table row detection
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      // Check if separator line (|---|---|)
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        tableHeaderParsed = true;
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaderParsed = false;
        htmlLines.push(
          '<table style="width:100%; border-collapse:collapse; margin:14pt 0; font-size:10pt;">'
        );
      }

      if (!tableHeaderParsed) {
        htmlLines.push("<thead><tr style='background-color:#f0fdf4;'>");
        cells.forEach((cell) => {
          htmlLines.push(
            `<th style="border:1px solid #cbd5e1; padding:7pt 9pt; text-align:left; color:#065f46; font-weight:bold;">${formatInlineMarkdown(
              cell
            )}</th>`
          );
        });
        htmlLines.push("</tr></thead><tbody>");
      } else {
        htmlLines.push("<tr style='border-bottom:1px solid #e2e8f0;'>");
        cells.forEach((cell, idx) => {
          const isFirst = idx === 0;
          htmlLines.push(
            `<td style="border:1px solid #e2e8f0; padding:6pt 9pt; text-align:left; color:#1e293b; ${
              isFirst ? "font-weight:600;" : ""
            }">${formatInlineMarkdown(cell)}</td>`
          );
        });
        htmlLines.push("</tr>");
      }
      continue;
    } else if (inTable) {
      htmlLines.push("</tbody></table>");
      inTable = false;
    }

    // Headers
    if (line.startsWith("# ")) {
      htmlLines.push(
        `<h1 style="color:#065f46; font-size:20pt; font-weight:bold; margin-top:20pt; margin-bottom:8pt; border-bottom:2px solid #10b981; padding-bottom:5pt;">${formatInlineMarkdown(
          line.slice(2)
        )}</h1>`
      );
    } else if (line.startsWith("## ")) {
      htmlLines.push(
        `<h2 style="color:#047857; font-size:15pt; font-weight:bold; margin-top:16pt; margin-bottom:6pt; border-left:4px solid #10b981; padding-left:8pt;">${formatInlineMarkdown(
          line.slice(3)
        )}</h2>`
      );
    } else if (line.startsWith("### ")) {
      htmlLines.push(
        `<h3 style="color:#0f766e; font-size:12pt; font-weight:bold; margin-top:12pt; margin-bottom:4pt;">${formatInlineMarkdown(
          line.slice(4)
        )}</h3>`
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      htmlLines.push(
        `<li style="margin-left:18pt; margin-bottom:3pt; color:#334155;">${formatInlineMarkdown(
          line.slice(2)
        )}</li>`
      );
    } else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, "");
      htmlLines.push(
        `<li style="margin-left:18pt; margin-bottom:4pt; color:#1e293b; font-weight:500;">${formatInlineMarkdown(
          content
        )}</li>`
      );
    } else if (line === "---") {
      htmlLines.push(
        '<hr style="border:none; border-top:1px solid #cbd5e1; margin:16pt 0;" />'
      );
    } else if (line.length > 0) {
      htmlLines.push(
        `<p style="margin-bottom:8pt; line-height:1.6; color:#334155; font-size:10.5pt;">${formatInlineMarkdown(
          line
        )}</p>`
      );
    } else {
      htmlLines.push('<div style="height:6pt;"></div>');
    }
  }

  if (inTable) {
    htmlLines.push("</tbody></table>");
  }

  return htmlLines.join("\n");
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#047857;">$1</a>');
}

/**
 * Exports document into a rich Microsoft Word compatible (.doc) file
 * with 242Agro header, styling, and table formatting.
 */
export function exportToWord(title: string, markdownContent: string) {
  const htmlBody = markdownToHtml(markdownContent);

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 2.5cm 2cm 2.5cm 2cm;
          mso-header-margin: 1.5cm;
          mso-footer-margin: 1.5cm;
        }
        body {
          font-family: 'Calibri', 'Segoe UI', 'Arial', sans-serif;
          font-size: 11pt;
          color: #1e293b;
          line-height: 1.5;
        }
        .header {
          border-bottom: 2px solid #059669;
          padding-bottom: 12pt;
          margin-bottom: 24pt;
        }
        .company-name {
          font-size: 18pt;
          font-weight: bold;
          color: #047857;
          margin: 0;
          letter-spacing: 0.5pt;
        }
        .company-subtitle {
          font-size: 9.5pt;
          color: #64748b;
          margin: 3pt 0;
        }
        .footer {
          margin-top: 36pt;
          border-top: 1px solid #cbd5e1;
          padding-top: 10pt;
          font-size: 8.5pt;
          color: #94a3b8;
          text-align: center;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 14pt 0;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 6pt 8pt;
          text-align: left;
          font-size: 9.5pt;
        }
        th {
          background-color: #f0fdf4;
          color: #065f46;
          font-weight: bold;
        }
        strong {
          color: #0f172a;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">242AGRO — SOLUTIONS D'AGRICULTURE URBAINE CIRCULAIRE</div>
        <div class="company-subtitle">Pointe-Noire, République du Congo | WhatsApp Direct : +242 06 874 22 77 | E-mail : 242agro@gmail.com | Web : https://242agropn.netlify.app/</div>
      </div>
      <div>
        ${htmlBody}
      </div>
      <div class="footer">
        Dossier officiel certifié par 242Agro Intelligence — Pointe-Noire (République du Congo) &middot; Document prêt pour transmission et contractualisation.
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + wordContent], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Opens a dedicated print preview with full official letterhead and invokes window.print()
 */
export function printDocument(title: string, markdownContent: string) {
  const htmlBody = markdownToHtml(markdownContent);
  const printWindow = window.open("", "_blank", "width=900,height=800");

  if (!printWindow) {
    alert("Veuillez autoriser les fenêtres contextuelles pour imprimer ce dossier.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 20mm 15mm 20mm 15mm;
        }
        body {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 10.5pt;
          color: #0f172a;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background: #ffffff;
        }
        .header {
          border-bottom: 2.5px solid #059669;
          padding-bottom: 12px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-symbol {
          background: #059669;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 20px;
        }
        .brand-text h1 {
          font-size: 16pt;
          font-weight: 800;
          color: #047857;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .brand-text p {
          font-size: 8.5pt;
          color: #64748b;
          margin: 2px 0 0 0;
        }
        .header-meta {
          text-align: right;
          font-size: 8.5pt;
          color: #64748b;
          line-height: 1.4;
        }
        .header-meta strong {
          color: #0f172a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          page-break-inside: avoid;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 7px 10px;
          font-size: 9.5pt;
          text-align: left;
        }
        th {
          background-color: #f0fdf4 !important;
          color: #065f46;
          font-weight: bold;
        }
        tr:nth-child(even) td {
          background-color: #fafafa;
        }
        h1, h2, h3 {
          page-break-after: avoid;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #cbd5e1;
          padding-top: 12px;
          font-size: 8.5pt;
          color: #94a3b8;
          text-align: center;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-box">
          <div class="logo-symbol">🌿</div>
          <div class="brand-text">
            <h1>242AGRO INTELLIGENCE</h1>
            <p>Agriculture Urbaine Circulaire &middot; Pointe-Noire, République du Congo</p>
          </div>
        </div>
        <div class="header-meta">
          <div><strong>WhatsApp :</strong> +242 06 874 22 77</div>
          <div><strong>E-mail :</strong> 242agro@gmail.com</div>
          <div><strong>Site :</strong> https://242agropn.netlify.app/</div>
        </div>
      </div>

      <div class="content">
        ${htmlBody}
      </div>

      <div class="footer">
        <span>242Agro &middot; Siège à Pointe-Noire, Congo</span>
        <span>Dossier officiel prêt à l'emploi</span>
        <span>Page 1 / 1</span>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Exports document to formatted PDF using jsPDF
 */
export function exportToPDF(title: string, markdownContent: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const maxLineWidth = pageWidth - margin * 2;

  // Header branding
  doc.setFillColor(6, 95, 70); // Emerald 800
  doc.rect(0, 0, pageWidth, 16, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("242AGRO INTELLIGENCE — DOSSIER OFFICIEL (POINTE-NOIRE, CONGO)", margin, 11);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.text(title.slice(0, 52), margin, 27);

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(margin, 30, pageWidth - margin, 30);

  // Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const cleanText = markdownContent
    .replace(/^#+ /gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\|/g, "  ");

  const lines = doc.splitTextToSize(cleanText, maxLineWidth);
  let cursorY = 37;

  for (let i = 0; i < lines.length; i++) {
    if (cursorY > pageHeight - 20) {
      doc.addPage();
      cursorY = 20;

      // Repeat header line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, cursorY - 4, pageWidth - margin, cursorY - 4);
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += 4.8;
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let j = 1; j <= totalPages; j++) {
    doc.setPage(j);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `242Agro — Solutions d'Agriculture Urbaine Circulaire &middot; Page ${j}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  doc.save(`${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`);
}
