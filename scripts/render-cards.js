/**
 * RENDER - Génère les PDFs A6 individuels depuis les fichiers Markdown
 * 
 * Usage: node scripts/render-cards.js [target]
 *   target: 'all' | 'roles' | 'moments' | 'sos'
 * 
 * Output: /print/cartes/{id}.pdf (2 pages : recto + verso)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

// Configuration
const CONFIG = {
  sourcesDir: 'sources/cartes',
  outputDir: 'print/cartes',
  cssPath: 'assets/css/print.css',
  
  // Dimensions A6 en mm
  pageWidth: 105,
  pageHeight: 148,
  
  // Mapping des types vers les dossiers
  types: {
    roles: { dir: 'roles', prefix: 'R' },
    moments: { dir: 'moments', prefix: 'M' },
    sos: { dir: 'sos', prefix: 'S' }
  }
};

// Couleurs par type (pour le fond)
const TYPE_COLORS = {
  role: { bg: '#fff8f0', accent: '#c96a30' },
  moment: { bg: '#e8f4f3', accent: '#3d8b87' },
  sos: { bg: '#fff5f2', accent: '#d9634a' }
};

/**
 * Lit et parse un fichier markdown de carte
 */
function parseCardMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Séparer avec <!-- FLIP -->
  const flipMarker = '<!-- FLIP -->';
  let recto, verso;
  
  if (content.includes(flipMarker)) {
    const parts = content.split(flipMarker);
    recto = parts[0].replace('<!-- HEAD -->', '').trim();
    verso = parts.slice(1).join(flipMarker).replace('<!-- HEAD -->', '').trim();
  } else {
    recto = content.replace('<!-- HEAD -->', '').trim();
    verso = '*Verso non défini*';
  }
  
  return { recto, verso };
}

/**
 * Génère le HTML d'une face de carte
 */
function generateCardHtml(markdown, type, face) {
  const colors = TYPE_COLORS[type] || TYPE_COLORS.role;
  const html = marked.parse(markdown);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Merriweather+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js"></script>
  <style>
    @page {
      size: 105mm 148mm;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      width: 105mm;
      height: 148mm;
      overflow: hidden;
    }
    
    body {
      font-family: 'Merriweather', serif;
      font-weight: 300;
      font-size: 9pt;
      line-height: 1.4;
      color: #2D3748;
      background: ${colors.bg};
      padding: 5mm;
    }
    
    /* Titres */
    h1 {
      font-family: 'Merriweather Sans', sans-serif;
      font-size: 14pt;
      font-weight: 800;
      color: ${colors.accent};
      margin-bottom: 2mm;
      line-height: 1.2;
    }
    
    h6 {
      font-family: 'Merriweather', serif;
      font-size: 9pt;
      font-weight: 400;
      font-style: italic;
      color: ${colors.accent};
      opacity: 0.8;
      margin-bottom: 3mm;
    }
    
    h2 {
      font-family: 'Merriweather Sans', sans-serif;
      font-size: 10pt;
      font-weight: 700;
      color: ${colors.accent};
      margin-top: 3mm;
      margin-bottom: 1.5mm;
      padding-bottom: 1mm;
      border-bottom: 0.5pt solid ${colors.accent};
    }
    
    h3 {
      font-family: 'Merriweather Sans', sans-serif;
      font-size: 9pt;
      font-weight: 600;
      margin-top: 2mm;
      margin-bottom: 1mm;
    }
    
    p {
      margin-bottom: 2mm;
    }
    
    blockquote {
      font-style: italic;
      padding-left: 3mm;
      border-left: 2pt solid #D1D5DB;
      margin-bottom: 2mm;
    }
    
    ul, ol {
      margin-left: 4mm;
      margin-bottom: 2mm;
    }
    
    li {
      margin-bottom: 0.5mm;
    }
    
    strong {
      font-weight: 700;
    }
    
    em {
      font-style: italic;
    }
    
    hr {
      border: none;
      border-top: 0.5pt solid #D1D5DB;
      margin: 2mm 0;
    }
    
    a {
      color: inherit;
      text-decoration: none;
    }
    
    /* Twemoji */
    img.emoji {
      height: 1em;
      width: 1em;
      margin: 0 0.05em 0 0.1em;
      vertical-align: -0.1em;
    }
    
    h1 img.emoji {
      height: 1.2em;
      width: 1.2em;
    }
    
    /* Footer discret */
    .card-content > p:last-child em {
      font-size: 7pt;
      color: #718096;
    }
  </style>
</head>
<body>
  <div class="card-content">
    ${html}
  </div>
  <script>
    twemoji.parse(document.body, { folder: 'svg', ext: '.svg' });
  </script>
</body>
</html>
  `;
}

/**
 * Génère un PDF A6 pour une carte (2 pages : recto + verso)
 */
async function renderCard(browser, cardPath, outputPath, type) {
  const { recto, verso } = parseCardMarkdown(cardPath);
  
  const page = await browser.newPage();
  
  // Créer un PDF avec 2 pages
  const rectoHtml = generateCardHtml(recto, type, 'recto');
  const versoHtml = generateCardHtml(verso, type, 'verso');
  
  // Page 1 : Recto
  await page.setContent(rectoHtml, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.fonts.ready);
  
  const rectoBuffer = await page.pdf({
    width: '105mm',
    height: '148mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  // Page 2 : Verso
  await page.setContent(versoHtml, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.fonts.ready);
  
  const versoBuffer = await page.pdf({
    width: '105mm',
    height: '148mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await page.close();
  
  // Fusionner les 2 pages avec pdf-lib
  const { PDFDocument } = require('pdf-lib');
  
  const mergedPdf = await PDFDocument.create();
  
  const rectoPdf = await PDFDocument.load(rectoBuffer);
  const versoPdf = await PDFDocument.load(versoBuffer);
  
  const [rectoPage] = await mergedPdf.copyPages(rectoPdf, [0]);
  const [versoPage] = await mergedPdf.copyPages(versoPdf, [0]);
  
  mergedPdf.addPage(rectoPage);
  mergedPdf.addPage(versoPage);
  
  const pdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, pdfBytes);
  
  console.log(`  ✅ ${path.basename(outputPath)}`);
}

/**
 * Liste les cartes à traiter selon le target
 */
function getCardsToProcess(target) {
  const cards = [];
  
  const typesToProcess = target === 'all' 
    ? Object.keys(CONFIG.types)
    : [target];
  
  for (const typeName of typesToProcess) {
    const typeConfig = CONFIG.types[typeName];
    if (!typeConfig) continue;
    
    const typeDir = path.join(CONFIG.sourcesDir, typeConfig.dir);
    if (!fs.existsSync(typeDir)) continue;
    
    const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const id = path.basename(file, '.md');
      const cardType = typeName === 'roles' ? 'role' : 
                       typeName === 'moments' ? 'moment' : 'sos';
      
      cards.push({
        id,
        type: cardType,
        sourcePath: path.join(typeDir, file),
        outputPath: path.join(CONFIG.outputDir, `${id}.pdf`)
      });
    }
  }
  
  return cards;
}

/**
 * Main
 */
async function main() {
  const target = process.argv[2] || 'all';
  console.log(`\n🖨️  RENDER - Génération des PDFs A6`);
  console.log(`   Target: ${target}\n`);
  
  // S'assurer que le dossier output existe
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Lister les cartes
  const cards = getCardsToProcess(target);
  console.log(`   ${cards.length} cartes à générer\n`);
  
  if (cards.length === 0) {
    console.log('   Aucune carte trouvée.');
    return;
  }
  
  // Lancer Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    for (const card of cards) {
      await renderCard(browser, card.sourcePath, card.outputPath, card.type);
    }
  } finally {
    await browser.close();
  }
  
  console.log(`\n✅ Render terminé : ${cards.length} PDFs générés dans ${CONFIG.outputDir}/\n`);
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
