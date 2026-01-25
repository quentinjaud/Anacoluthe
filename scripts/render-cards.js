/**
 * RENDER - Génère les PDFs A6 et A4 via print-render.html / print-render-a4.html
 *
 * Usage: node scripts/render-cards.js [target]
 *   target: 'all' | 'roles' | 'moments' | 'joker' | 'affiches'
 *
 * Output:
 *   - Cartes A6 : /print/cartes/{id}.pdf (2 pages : recto + verso)
 *   - Affiches A4 : /print/affiches/{id}.pdf (1 page)
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
  navigationTimeout: 30000,
  readyTimeout: 10000,
  deviceScaleFactor: 3,

  // Formats supportés
  formats: {
    'A6': {
      width: 105,
      height: 148,
      renderPage: 'print-render.html',
      paramName: 'card'
    },
    'A4-landscape': {
      width: 297,
      height: 210,
      renderPage: 'print-render-a4.html',
      paramName: 'affiche'
    },
    'A4-portrait': {
      width: 210,
      height: 297,
      renderPage: 'print-render-a4.html',
      paramName: 'affiche'
    }
  },
  defaultFormat: 'A6'
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
  all: ['role', 'moment', 'joker', 'affiche'],
  roles: ['role'],
  moments: ['moment'],
  joker: ['joker'],
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
  let indexContent;
  try {
    indexContent = fs.readFileSync(CONFIG.indexPath, 'utf-8');
  } catch (err) {
    console.error(`Erreur lecture ${CONFIG.indexPath}: ${err.message}`);
    process.exit(1);
  }

  let index;
  try {
    index = JSON.parse(indexContent);
  } catch (err) {
    console.error(`JSON invalide dans ${CONFIG.indexPath}: ${err.message}`);
    process.exit(1);
  }

  const allowedTypes = TYPE_FILTERS[target] || TYPE_FILTERS.all;
  const allItems = [...index.cards, ...(index.affiches || [])];

  return allItems.filter(item => {
    if (!allowedTypes.includes(item.type)) return false;
    // Pour les affiches A4 (landscape ou portrait), on vérifie htmlPath
    if (item.format === 'A4-landscape' || item.format === 'A4-portrait') {
      return item.htmlPath;
    }
    // Pour les cartes A6, on vérifie path (markdown)
    return item.path;
  });
}

/**
 * Génère un PDF A6 pour une face de carte (markdown)
 */
async function renderCardFace(page, cardId, face, baseUrl, formatConfig) {
  const url = `${baseUrl}/${formatConfig.renderPage}?${formatConfig.paramName}=${cardId}&face=${face}`;

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
    width: `${formatConfig.width}mm`,
    height: `${formatConfig.height}mm`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
}

/**
 * Génère un PDF A4 pour une affiche HTML (supporte multi-pages)
 */
async function renderAfficheA4(page, card, baseUrl, formatConfig) {
  const url = `${baseUrl}/${formatConfig.renderPage}?${formatConfig.paramName}=${card.id}`;

  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: CONFIG.navigationTimeout
  });

  // Attendre que l'affiche soit prête
  try {
    await page.waitForSelector('body.affiche-ready', { timeout: CONFIG.readyTimeout });
  } catch (err) {
    const hasError = await page.$('body.affiche-error');
    if (hasError) {
      throw new Error(`Erreur de chargement pour l'affiche ${card.id}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // Détecter le nombre de pages (divs .affiche-a4 ou .affiche-a4-portrait)
  const pageCount = await page.evaluate(() => {
    return document.querySelectorAll('.affiche-a4, .affiche-a4-portrait').length;
  });

  // Ajuster le viewport pour les multi-pages
  if (pageCount > 1) {
    const viewportWidth = Math.round(formatConfig.width * 96 / 25.4);
    const viewportHeight = Math.round(formatConfig.height * pageCount * 96 / 25.4);
    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: CONFIG.deviceScaleFactor
    });
    // Attendre le re-layout
    await new Promise(r => setTimeout(r, 200));
  }

  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 200));

  // Screenshot en mode debug
  if (DEBUG) {
    // Screenshot global
    const screenshotPath = `print/debug-${card.id}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`      📸 ${screenshotPath}`);

    // Screenshots par page pour affiches multi-pages
    if (pageCount > 1) {
      const pages = await page.$$('.affiche-a4, .affiche-a4-portrait');
      for (let i = 0; i < pages.length; i++) {
        const pagePath = `print/debug-${card.id}-page${i + 1}.png`;
        await pages[i].screenshot({ path: pagePath });
        console.log(`      📸 ${pagePath}`);
      }
    }
  }

  // Note: pas de landscape:true car les dimensions sont déjà en paysage (297×210)
  const pdfBuffer = await page.pdf({
    width: `${formatConfig.width}mm`,
    height: `${formatConfig.height}mm`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  return { pdfBuffer, pageCount };
}

/**
 * Génère un PDF pour une carte ou affiche
 */
async function renderCard(browser, card, baseUrl) {
  stats.cardsProcessed++;

  const format = card.format || CONFIG.defaultFormat;
  const formatConfig = CONFIG.formats[format] || CONFIG.formats[CONFIG.defaultFormat];

  const page = await browser.newPage();

  // Capturer les erreurs
  page.on('pageerror', err => {
    stats.errors.push(`Page error (${card.id}): ${err.message}`);
  });

  // Viewport adapté au format
  // Pour le paysage, le viewport doit avoir width > height
  const viewportWidth = Math.round(formatConfig.width * 96 / 25.4);
  const viewportHeight = Math.round(formatConfig.height * 96 / 25.4);
  await page.setViewport({
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: CONFIG.deviceScaleFactor
  });

  try {
    let pdfBytes;

    // Affiche A4 (landscape ou portrait) avec HTML direct (1 page)
    if ((format === 'A4-landscape' || format === 'A4-portrait') && card.htmlPath) {
      const { pdfBuffer, pageCount } = await renderAfficheA4(page, card, baseUrl, formatConfig);

      // Pas de fusion, une seule page
      pdfBytes = pdfBuffer;

      // Sauvegarder dans le dossier affiches
      const baseName = path.basename(card.htmlPath, '.html');
      const outputPath = path.join(CONFIG.affichesDir, `${baseName}.pdf`);
      fs.writeFileSync(outputPath, pdfBytes);

      // Générer les PNG d'aperçu pour le site
      if (card.previewImages && card.previewImages.length > 0) {
        if (pageCount <= 1) {
          await page.screenshot({ path: card.previewImages[0], fullPage: true });
          console.log(`  🖼️  ${path.basename(card.previewImages[0])}`);
        } else {
          const pageDivs = await page.$$('.affiche-a4, .affiche-a4-portrait');
          for (let i = 0; i < pageDivs.length && i < card.previewImages.length; i++) {
            await pageDivs[i].screenshot({ path: card.previewImages[i] });
            console.log(`  🖼️  ${path.basename(card.previewImages[i])}`);
          }
        }
      }

      const orientation = format === 'A4-portrait' ? 'portrait' : 'paysage';
      console.log(`  ✅ ${baseName}.pdf (A4 ${orientation})`);

      // Si l'affiche a aussi un mémo A6 (path markdown), le générer aussi
      if (card.path) {
        const a6Format = CONFIG.formats['A6'];

        // Reconfigurer le viewport pour A6
        const a6ViewportWidth = Math.round(a6Format.width * 96 / 25.4);
        const a6ViewportHeight = Math.round(a6Format.height * 96 / 25.4);
        await page.setViewport({
          width: a6ViewportWidth,
          height: a6ViewportHeight,
          deviceScaleFactor: CONFIG.deviceScaleFactor
        });

        const rectoBuffer = await renderCardFace(page, card.id, 'recto', baseUrl, a6Format);
        const versoBuffer = await renderCardFace(page, card.id, 'verso', baseUrl, a6Format);

        const { PDFDocument } = require('pdf-lib');
        const mergedPdf = await PDFDocument.create();
        const rectoPdf = await PDFDocument.load(rectoBuffer);
        const versoPdf = await PDFDocument.load(versoBuffer);

        const [rectoPage] = await mergedPdf.copyPages(rectoPdf, [0]);
        const [versoPage] = await mergedPdf.copyPages(versoPdf, [0]);

        mergedPdf.addPage(rectoPage);
        mergedPdf.addPage(versoPage);

        const memoBytes = await mergedPdf.save();
        const memoBaseName = path.basename(card.path, '.md');
        const memoOutputPath = path.join(CONFIG.outputDir, `${memoBaseName}.pdf`);
        fs.writeFileSync(memoOutputPath, memoBytes);

        console.log(`  ✅ ${memoBaseName}.pdf (mémo A6)`);
      }

      stats.cardsSuccess++;

    } else {
      // Carte A6 markdown (recto + verso)
      const rectoBuffer = await renderCardFace(page, card.id, 'recto', baseUrl, formatConfig);
      const versoBuffer = await renderCardFace(page, card.id, 'verso', baseUrl, formatConfig);

      // Fusionner les 2 pages
      const { PDFDocument } = require('pdf-lib');

      const mergedPdf = await PDFDocument.create();
      const rectoPdf = await PDFDocument.load(rectoBuffer);
      const versoPdf = await PDFDocument.load(versoBuffer);

      const [rectoPage] = await mergedPdf.copyPages(rectoPdf, [0]);
      const [versoPage] = await mergedPdf.copyPages(versoPdf, [0]);

      mergedPdf.addPage(rectoPage);
      mergedPdf.addPage(versoPage);

      pdfBytes = await mergedPdf.save();

      // Sauvegarder
      const baseName = path.basename(card.path, '.md');
      const outputDir = card.type === 'affiche' ? CONFIG.affichesDir : CONFIG.outputDir;
      const outputPath = path.join(outputDir, `${baseName}.pdf`);
      fs.writeFileSync(outputPath, pdfBytes);

      stats.cardsSuccess++;
      console.log(`  ✅ ${baseName}.pdf`);
    }

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
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 60000  // 60s max pour lancer Chrome
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
