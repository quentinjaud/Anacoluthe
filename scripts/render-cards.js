/**
 * RENDER - Génère les PDFs A6 individuels via print-render.html
 * 
 * Usage: node scripts/render-cards.js [target]
 *   target: 'all' | 'roles' | 'moments' | 'sos' | 'affiches'
 * 
 * Output: /print/cartes/{id}.pdf (2 pages : recto + verso)
 * 
 * Variables d'environnement:
 *   DEBUG=true  Active le mode debug (screenshots)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer');

// Configuration
const CONFIG = {
  outputDir: 'print/cartes',
  affichesDir: 'print/affiches',
  indexPath: 'assets/data/cards-index.json',
  serverPort: 8765,
  pageWidth: 105,  // A6 mm
  pageHeight: 148,
  navigationTimeout: 30000,
  readyTimeout: 10000,
  deviceScaleFactor: 3
};

const DEBUG = process.env.DEBUG === 'true';

const stats = {
  startTime: Date.now(),
  cardsProcessed: 0,
  cardsSuccess: 0,
  cardsFailed: 0,
  errors: []
};

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
    let filePath = req.url.split('?')[0];
    if (filePath === '/') filePath = '/index.html';
    
    const fullPath = path.join(rootDir, filePath);
    const ext = path.extname(fullPath).toLowerCase();
    
    if (!fs.existsSync(fullPath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    
    try {
      const content = fs.readFileSync(fullPath);
      res.writeHead(200, { 
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
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
  
  await page.goto(url, { 
    waitUntil: 'networkidle0',
    timeout: CONFIG.navigationTimeout
  });
  
  // Attendre que la carte soit prête
  try {
    await page.waitForSelector('body.card-ready', { timeout: CONFIG.readyTimeout });
  } catch (err) {
    const hasError = await page.$('body.card-error');
    if (hasError) {
      throw new Error(`Erreur de chargement pour ${cardId} (${face})`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 200));
  
  // Screenshot en mode debug
  if (DEBUG) {
    const screenshotPath = `print/debug-${cardId}-${face}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`      📸 ${face}: ${screenshotPath}`);
  }
  
  return await page.pdf({
    width: `${CONFIG.pageWidth}mm`,
    height: `${CONFIG.pageHeight}mm`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
}

/**
 * Génère un PDF A6 complet (recto + verso) pour une carte
 */
async function renderCard(browser, card, baseUrl) {
  stats.cardsProcessed++;
  
  const page = await browser.newPage();
  
  // Capturer les erreurs
  page.on('pageerror', err => {
    stats.errors.push(`Page error (${card.id}): ${err.message}`);
  });
  
  // Viewport A6 en pixels
  await page.setViewport({
    width: Math.round(CONFIG.pageWidth * 96 / 25.4),
    height: Math.round(CONFIG.pageHeight * 96 / 25.4),
    deviceScaleFactor: CONFIG.deviceScaleFactor
  });
  
  try {
    const rectoBuffer = await renderCardFace(page, card.id, 'recto', baseUrl);
    const versoBuffer = await renderCardFace(page, card.id, 'verso', baseUrl);
    
    // Fusionner les 2 pages
    const { PDFDocument } = require('pdf-lib');
    
    const mergedPdf = await PDFDocument.create();
    const rectoPdf = await PDFDocument.load(rectoBuffer);
    const versoPdf = await PDFDocument.load(versoBuffer);
    
    const [rectoPage] = await mergedPdf.copyPages(rectoPdf, [0]);
    const [versoPage] = await mergedPdf.copyPages(versoPdf, [0]);
    
    mergedPdf.addPage(rectoPage);
    mergedPdf.addPage(versoPage);
    
    const pdfBytes = await mergedPdf.save();
    
    // Sauvegarder
    const baseName = path.basename(card.path, '.md');
    const outputDir = card.type === 'affiche' ? CONFIG.affichesDir : CONFIG.outputDir;
    const outputPath = path.join(outputDir, `${baseName}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    
    stats.cardsSuccess++;
    console.log(`  ✅ ${baseName}.pdf`);
    
  } catch (err) {
    stats.cardsFailed++;
    stats.errors.push(`${card.id}: ${err.message}`);
    console.log(`  ❌ ${card.id}: ${err.message}`);
  } finally {
    await page.close();
  }
}

/**
 * Point d'entrée
 */
async function main() {
  const target = process.argv[2] || 'all';
  
  console.log(`\n🖨️  Anacoluthe PDF Renderer`);
  console.log(`   Target: ${target}`);
  if (DEBUG) console.log(`   Mode: DEBUG`);
  
  // Vérifier/créer les dossiers de sortie
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.affichesDir)) {
    fs.mkdirSync(CONFIG.affichesDir, { recursive: true });
  }
  
  // Charger les cartes à traiter
  const cards = getCardsToProcess(target);
  console.log(`   Cartes à traiter: ${cards.length}\n`);
  
  if (cards.length === 0) {
    console.log('❌ Aucune carte trouvée pour ce target');
    process.exit(1);
  }
  
  // Démarrer le serveur HTTP
  const server = createStaticServer(process.cwd());
  await new Promise(resolve => server.listen(CONFIG.serverPort, resolve));
  const baseUrl = `http://localhost:${CONFIG.serverPort}`;
  
  // Lancer Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
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
  
  // Résumé
  const totalTime = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  console.log(`\n📊 Résumé: ${stats.cardsSuccess}/${stats.cardsProcessed} en ${totalTime}s`);
  
  if (stats.errors.length > 0) {
    console.log(`\n❌ Erreurs (${stats.errors.length}):`);
    stats.errors.forEach(e => console.log(`   - ${e}`));
  }
  
  process.exit(stats.cardsFailed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
