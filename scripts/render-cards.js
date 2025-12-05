/**
 * RENDER - Génère les PDFs A6 individuels via l'afficheur-cartes.html
 * 
 * PRINCIPE : Utilise l'afficheur HTML comme source unique de vérité (WYSIWYG)
 * - Lance un serveur HTTP local
 * - Puppeteer navigue vers afficheur-cartes.html?card=X&mode=print&face=Y
 * - Capture exactement ce qui est affiché
 * 
 * Usage: node scripts/render-cards.js [target]
 *   target: 'all' | 'roles' | 'moments' | 'sos'
 * 
 * Output: /print/cartes/{id}.pdf (2 pages : recto + verso)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer');

// Configuration
const CONFIG = {
  outputDir: 'print/cartes',
  indexPath: 'assets/data/cards-index.json',
  serverPort: 8765,
  
  // Dimensions A6 en mm
  pageWidth: 105,
  pageHeight: 148,
  
  // Timeouts
  navigationTimeout: 30000,
  readyTimeout: 10000
};

// Types à traiter selon le target
const TYPE_FILTERS = {
  all: ['role', 'moment', 'sos', 'affiche'],
  roles: ['role'],
  moments: ['moment'],
  sos: ['sos'],
  affiches: ['affiche']
};

/**
 * Serveur HTTP statique minimal
 */
function createStaticServer(rootDir) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.md': 'text/markdown; charset=utf-8'
  };
  
  return http.createServer((req, res) => {
    // Nettoyer l'URL (enlever les query params)
    let filePath = req.url.split('?')[0];
    if (filePath === '/') filePath = '/index.html';
    
    const fullPath = path.join(rootDir, filePath);
    const ext = path.extname(fullPath).toLowerCase();
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(fullPath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    
    // Lire et servir le fichier
    try {
      const content = fs.readFileSync(fullPath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    } catch (err) {
      res.writeHead(500);
      res.end('Server error');
    }
  });
}

/**
 * Charge l'index des cartes et filtre selon le target
 */
function getCardsToProcess(target) {
  const indexContent = fs.readFileSync(CONFIG.indexPath, 'utf-8');
  const index = JSON.parse(indexContent);
  
  const allowedTypes = TYPE_FILTERS[target] || TYPE_FILTERS.all;
  
  // Combiner cartes et affiches (mémos A6)
  const allItems = [...index.cards, ...(index.affiches || [])];
  
  return allItems.filter(item => 
    allowedTypes.includes(item.type) && item.path
  );
}

/**
 * Génère un PDF A6 pour une face de carte
 */
async function renderCardFace(page, cardId, face, baseUrl) {
  const url = `${baseUrl}/print-render.html?card=${cardId}&face=${face}`;
  
  // Naviguer
  await page.goto(url, { 
    waitUntil: 'networkidle0',
    timeout: CONFIG.navigationTimeout
  });
  
  // Attendre que la carte soit prête (classe .card-ready)
  try {
    await page.waitForSelector('body.card-ready', { 
      timeout: CONFIG.readyTimeout 
    });
  } catch (err) {
    // Vérifier s'il y a une erreur
    const hasError = await page.$('body.card-error');
    if (hasError) {
      throw new Error(`Erreur de chargement pour ${cardId} (${face})`);
    }
    // Debug : récupérer le contenu de la page
    const bodyClasses = await page.evaluate(() => document.body.className);
    const content = await page.evaluate(() => document.querySelector('.print-card-content')?.innerHTML?.substring(0, 200) || 'NO CONTENT');
    console.log(`  ⚠️ Timeout pour ${cardId} (${face}) - body classes: "${bodyClasses}" - content: "${content}"`);
    // Sinon attendre un peu et continuer
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Attendre les fonts
  await page.evaluateHandle('document.fonts.ready');
  
  // Petit délai pour le rendu final
  await new Promise(r => setTimeout(r, 200));
  
  // DEBUG: Capturer le contenu visible
  const debugInfo = await page.evaluate(() => {
    const content = document.querySelector('.print-card-content');
    const body = document.body;
    return {
      bodyClasses: body.className,
      hasContent: !!content,
      contentHTML: content ? content.innerHTML.substring(0, 300) : 'NO CONTENT ELEMENT',
      contentVisible: content ? getComputedStyle(content).display !== 'none' : false,
      bodyWidth: body.offsetWidth,
      bodyHeight: body.offsetHeight
    };
  });
  console.log(`  📊 Debug ${cardId} (${face}): body=${debugInfo.bodyClasses}, hasContent=${debugInfo.hasContent}, visible=${debugInfo.contentVisible}, size=${debugInfo.bodyWidth}x${debugInfo.bodyHeight}`);
  console.log(`     Content preview: ${debugInfo.contentHTML.substring(0, 150)}...`);
  
  // DEBUG: Screenshot pour voir ce qui est capturé
  const screenshotPath = `print/debug-${cardId}-${face}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`     Screenshot saved: ${screenshotPath}`);
  
  // Générer le PDF
  const pdfBuffer = await page.pdf({
    width: `${CONFIG.pageWidth}mm`,
    height: `${CONFIG.pageHeight}mm`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  return pdfBuffer;
}

/**
 * Génère un PDF A6 complet (recto + verso) pour une carte
 */
async function renderCard(browser, card, baseUrl) {
  const page = await browser.newPage();
  
  // Capturer les erreurs de la page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`  🚨 Console error: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    console.log(`  🚨 Page error: ${err.message}`);
  });
  page.on('requestfailed', req => {
    console.log(`  🚨 Request failed: ${req.url()} - ${req.failure()?.errorText}`);
  });
  
  // Viewport A6 en pixels (96 DPI)
  await page.setViewport({
    width: Math.round(CONFIG.pageWidth * 96 / 25.4),
    height: Math.round(CONFIG.pageHeight * 96 / 25.4),
    deviceScaleFactor: 2
  });
  
  try {
    // Générer recto et verso
    const rectoBuffer = await renderCardFace(page, card.id, 'recto', baseUrl);
    const versoBuffer = await renderCardFace(page, card.id, 'verso', baseUrl);
    
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
    
    // Sauvegarder - utiliser le nom du fichier source (sans extension)
    const baseName = path.basename(card.path, '.md');
    const outputPath = path.join(CONFIG.outputDir, `${baseName}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`  ✅ ${baseName}.pdf`);
    
  } catch (err) {
    console.log(`  ❌ ${card.id}: ${err.message}`);
  } finally {
    await page.close();
  }
}

/**
 * Main
 */
async function main() {
  const target = process.argv[2] || 'all';
  console.log(`\n🖨️  RENDER - Génération des PDFs A6 via afficheur`);
  console.log(`   Target: ${target}\n`);
  
  // S'assurer que le dossier output existe
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Lister les cartes
  const cards = getCardsToProcess(target);
  console.log(`   ${cards.length} cartes à générer\n`);
  
  if (cards.length === 0) {
    console.log('   Aucune carte trouvée (vérifier cards-index.json).');
    return;
  }
  
  // Démarrer le serveur HTTP
  const rootDir = process.cwd();
  const server = createStaticServer(rootDir);
  
  await new Promise((resolve, reject) => {
    server.listen(CONFIG.serverPort, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  console.log(`   📡 Serveur local : http://localhost:${CONFIG.serverPort}\n`);
  
  const baseUrl = `http://localhost:${CONFIG.serverPort}`;
  
  // Lancer Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    for (const card of cards) {
      await renderCard(browser, card, baseUrl);
    }
  } finally {
    await browser.close();
    server.close();
  }
  
  console.log(`\n✅ Render terminé : ${cards.length} PDFs générés dans ${CONFIG.outputDir}/\n`);
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
