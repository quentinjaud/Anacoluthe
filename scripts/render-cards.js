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
 * 
 * Variables d'environnement:
 *   DEBUG=true  Active le mode debug (screenshots, logs verbeux)
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
  readyTimeout: 10000,
  
  // Qualité rendu (3 = 288 DPI effectif, bon pour images futures)
  deviceScaleFactor: 3
};

// Mode debug (activé par [debug] dans le commit ou DEBUG=true)
const DEBUG = process.env.DEBUG === 'true';

// Stats pour le résumé final
const stats = {
  startTime: Date.now(),
  cardsProcessed: 0,
  cardsSuccess: 0,
  cardsFailed: 0,
  cardsWithOverflow: 0,
  totalRenderTime: 0,
  autoFitReductions: [],
  overflowCards: [],
  errors: []
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
 * DEBUG: Affiche les infos d'environnement
 */
function logEnvironment() {
  if (!DEBUG) return;
  
  console.log('\n🔍 ===== DEBUG: ENVIRONNEMENT =====');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Platform: ${process.platform} ${process.arch}`);
  console.log(`   CWD: ${process.cwd()}`);
  console.log(`   Puppeteer: ${require('puppeteer/package.json').version}`);
  console.log(`   pdf-lib: ${require('pdf-lib/package.json').version}`);
  console.log('');
  console.log('   CONFIG:');
  Object.entries(CONFIG).forEach(([key, value]) => {
    console.log(`     ${key}: ${value}`);
  });
  console.log('=================================\n');
}

/**
 * DEBUG: Affiche les infos d'une carte avant rendu
 */
function logCardInfo(card) {
  if (!DEBUG) return;
  
  console.log(`\n   📋 Card info:`);
  console.log(`      ID: ${card.id}`);
  console.log(`      Type: ${card.type}`);
  console.log(`      Path: ${card.path}`);
  
  // Taille du fichier source
  if (card.path && fs.existsSync(card.path)) {
    const stat = fs.statSync(card.path);
    console.log(`      Source size: ${stat.size} bytes`);
    
    // Compter les caractères et lignes
    const content = fs.readFileSync(card.path, 'utf-8');
    console.log(`      Source chars: ${content.length}`);
    console.log(`      Source lines: ${content.split('\n').length}`);
    
    // Vérifier les marqueurs
    console.log(`      Has FLIP: ${content.includes('<!-- FLIP -->')}`);
    console.log(`      Has HEAD: ${content.includes('<!-- HEAD -->')}`);
    console.log(`      Has SKIP-PRINT: ${content.includes('SKIP-PRINT')}`);
    console.log(`      Has SKIP-WEB: ${content.includes('SKIP-WEB')}`);
  }
}

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
 * @returns {{ buffer: Buffer, hasOverflow: boolean }} PDF buffer et flag overflow persistant
 */
async function renderCardFace(page, cardId, face, baseUrl) {
  const faceStartTime = Date.now();
  const url = `${baseUrl}/print-render.html?card=${cardId}&face=${face}`;
  let hasOverflow = false; // Overflow persistant (même à taille min)
  
  if (DEBUG) {
    console.log(`\n   📄 Rendering ${face}...`);
    console.log(`      URL: ${url}`);
  }
  
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
    if (DEBUG) console.log(`      ✅ card-ready détecté`);
  } catch (err) {
    // Vérifier s'il y a une erreur
    const hasError = await page.$('body.card-error');
    if (hasError) {
      const errorMsg = `Erreur de chargement pour ${cardId} (${face})`;
      stats.errors.push(errorMsg);
      throw new Error(errorMsg);
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
  
  // DEBUG: Capturer infos détaillées
  if (DEBUG) {
    const debugInfo = await page.evaluate(() => {
      const card = document.getElementById('card');
      const content = document.getElementById('content');
      const body = document.body;
      
      // Récupérer les styles computed
      const contentStyles = content ? getComputedStyle(content) : null;
      const cardStyles = card ? getComputedStyle(card) : null;
      
      // Lister les fonts chargées
      const fonts = [];
      document.fonts.forEach(f => fonts.push(`${f.family} ${f.weight} ${f.status}`));
      
      return {
        // Body
        bodyClasses: body.className,
        bodyWidth: body.offsetWidth,
        bodyHeight: body.offsetHeight,
        
        // Card container
        cardWidth: card?.offsetWidth,
        cardHeight: card?.offsetHeight,
        cardClientHeight: card?.clientHeight,
        cardScrollHeight: card?.scrollHeight,
        cardPadding: cardStyles?.padding,
        
        // Content
        hasContent: !!content,
        contentWidth: content?.offsetWidth,
        contentHeight: content?.offsetHeight,
        contentClientHeight: content?.clientHeight,
        contentScrollHeight: content?.scrollHeight,
        contentFontSize: contentStyles?.fontSize,
        contentLineHeight: contentStyles?.lineHeight,
        contentOverflow: contentStyles?.overflow,
        
        // Overflow detection
        isOverflowing: content ? content.scrollHeight > content.clientHeight : null,
        overflowAmount: content ? content.scrollHeight - content.clientHeight : null,
        
        // Fonts
        fontsLoaded: fonts.length,
        fontsList: fonts.slice(0, 5).join(', '),
        
        // Content preview
        contentHTML: content ? content.innerHTML.substring(0, 500) : 'NO CONTENT',
        
        // Nombre d'éléments
        h1Count: content?.querySelectorAll('h1').length || 0,
        h2Count: content?.querySelectorAll('h2').length || 0,
        h3Count: content?.querySelectorAll('h3').length || 0,
        pCount: content?.querySelectorAll('p').length || 0,
        liCount: content?.querySelectorAll('li').length || 0,
        imgCount: content?.querySelectorAll('img').length || 0
      };
    });
    
    console.log(`      📏 Dimensions:`);
    console.log(`         Body: ${debugInfo.bodyWidth}x${debugInfo.bodyHeight}px`);
    console.log(`         Card: ${debugInfo.cardWidth}x${debugInfo.cardHeight}px (client: ${debugInfo.cardClientHeight}, scroll: ${debugInfo.cardScrollHeight})`);
    console.log(`         Content: ${debugInfo.contentWidth}x${debugInfo.contentHeight}px (client: ${debugInfo.contentClientHeight}, scroll: ${debugInfo.contentScrollHeight})`);
    console.log(`         Padding: ${debugInfo.cardPadding}`);
    
    console.log(`      📝 Typography:`);
    console.log(`         Font-size: ${debugInfo.contentFontSize}`);
    console.log(`         Line-height: ${debugInfo.contentLineHeight}`);
    console.log(`         Fonts loaded: ${debugInfo.fontsLoaded} (${debugInfo.fontsList})`);
    
    console.log(`      📦 Content:`);
    console.log(`         Overflow: ${debugInfo.isOverflowing ? `YES (+${debugInfo.overflowAmount}px)` : 'NO'}`);
    console.log(`         Elements: ${debugInfo.h1Count} H1, ${debugInfo.h2Count} H2, ${debugInfo.h3Count} H3, ${debugInfo.pCount} P, ${debugInfo.liCount} LI, ${debugInfo.imgCount} IMG`);
    
    // Tracker les réductions auto-fit
    if (debugInfo.contentFontSize && parseFloat(debugInfo.contentFontSize) < 10) {
      stats.autoFitReductions.push({
        card: cardId,
        face: face,
        fontSize: debugInfo.contentFontSize,
        overflow: debugInfo.overflowAmount
      });
    }
    
    // Screenshot
    const screenshotPath = `print/debug-${cardId}-${face}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`      📸 Screenshot: ${screenshotPath}`);
    
    // Logs console de la page
    const consoleLogs = await page.evaluate(() => {
      // On ne peut pas récupérer les logs passés, mais on peut afficher l'état
      return window.__debugLogs || [];
    });
    if (consoleLogs.length > 0) {
      console.log(`      💬 Console logs: ${consoleLogs.join(', ')}`);
    }
    
    const faceTime = Date.now() - faceStartTime;
    console.log(`      ⏱️  Render time: ${faceTime}ms`);
    stats.totalRenderTime += faceTime;
  }
  
  // Détecter overflow persistant (même en mode non-DEBUG)
  // Overflow = taille min (6pt) ET contenu dépasse encore
  const overflowInfo = await page.evaluate(() => {
    const content = document.getElementById('content');
    if (!content) return { isOverflowing: false, fontSize: null };
    const styles = getComputedStyle(content);
    const fontSize = parseFloat(styles.fontSize);
    const isOverflowing = content.scrollHeight > content.clientHeight;
    return { isOverflowing, fontSize };
  });
  
  // Overflow persistant = à la taille min (6pt) et déborde encore
  const MIN_FONT_SIZE = 6;
  if (overflowInfo.fontSize <= MIN_FONT_SIZE && overflowInfo.isOverflowing) {
    hasOverflow = true;
    console.log(`  ⚠️ ${cardId} (${face}): overflow persistant à ${overflowInfo.fontSize}pt`);
  }
  
  // Générer le PDF
  const pdfBuffer = await page.pdf({
    width: `${CONFIG.pageWidth}mm`,
    height: `${CONFIG.pageHeight}mm`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  return { buffer: pdfBuffer, hasOverflow };
}

/**
 * Génère un PDF A6 complet (recto + verso) pour une carte
 */
async function renderCard(browser, card, baseUrl) {
  const cardStartTime = Date.now();
  stats.cardsProcessed++;
  
  // Log infos carte en mode debug
  logCardInfo(card);
  
  const page = await browser.newPage();
  
  // Capturer les erreurs et logs de la page
  if (DEBUG) {
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log(`      🚨 Console ERROR: ${text}`);
      } else if (type === 'warning') {
        console.log(`      ⚠️  Console WARN: ${text}`);
      } else {
        console.log(`      💬 Console ${type}: ${text}`);
      }
    });
  } else {
    // En mode normal, juste les erreurs
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`  🚨 Console error: ${msg.text()}`);
      }
    });
  }
  
  page.on('pageerror', err => {
    console.log(`  🚨 Page error: ${err.message}`);
    stats.errors.push(`Page error (${card.id}): ${err.message}`);
  });
  
  page.on('requestfailed', req => {
    const failure = `Request failed: ${req.url()} - ${req.failure()?.errorText}`;
    console.log(`  🚨 ${failure}`);
    if (DEBUG) stats.errors.push(`${card.id}: ${failure}`);
  });
  
  // Viewport A6 en pixels (96 DPI de base, multiplié par deviceScaleFactor)
  await page.setViewport({
    width: Math.round(CONFIG.pageWidth * 96 / 25.4),
    height: Math.round(CONFIG.pageHeight * 96 / 25.4),
    deviceScaleFactor: CONFIG.deviceScaleFactor
  });
  
  try {
    // Générer recto et verso
    const rectoResult = await renderCardFace(page, card.id, 'recto', baseUrl);
    const versoResult = await renderCardFace(page, card.id, 'verso', baseUrl);
    
    // Détecter si au moins une face a un overflow persistant
    const hasOverflow = rectoResult.hasOverflow || versoResult.hasOverflow;
    
    // Fusionner les 2 pages avec pdf-lib
    const { PDFDocument } = require('pdf-lib');
    
    const mergedPdf = await PDFDocument.create();
    
    const rectoPdf = await PDFDocument.load(rectoResult.buffer);
    const versoPdf = await PDFDocument.load(versoResult.buffer);
    
    const [rectoPage] = await mergedPdf.copyPages(rectoPdf, [0]);
    const [versoPage] = await mergedPdf.copyPages(versoPdf, [0]);
    
    mergedPdf.addPage(rectoPage);
    mergedPdf.addPage(versoPage);
    
    const pdfBytes = await mergedPdf.save();
    
    // Sauvegarder - utiliser le nom du fichier source (sans extension)
    // Ajouter _overflow si contenu déborde même à la taille min
    const baseName = path.basename(card.path, '.md');
    const suffix = hasOverflow ? '_overflow' : '';
    const outputPath = path.join(CONFIG.outputDir, `${baseName}${suffix}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    
    const cardTime = Date.now() - cardStartTime;
    stats.cardsSuccess++;
    
    // Tracker les cartes avec overflow
    if (hasOverflow) {
      stats.cardsWithOverflow++;
      stats.overflowCards.push(baseName);
    }
    
    if (DEBUG) {
      const pdfSize = pdfBytes.length;
      console.log(`\n   ✅ ${baseName}${suffix}.pdf (${(pdfSize / 1024).toFixed(1)} KB, ${cardTime}ms)`);
    } else {
      const icon = hasOverflow ? '⚠️' : '✅';
      console.log(`  ${icon} ${baseName}${suffix}.pdf`);
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
 * DEBUG: Affiche le résumé final
 */
function logSummary() {
  if (!DEBUG) return;
  
  const totalTime = Date.now() - stats.startTime;
  
  console.log('\n🔍 ===== DEBUG: RÉSUMÉ =====');
  console.log(`   Durée totale: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`   Temps de rendu cumulé: ${(stats.totalRenderTime / 1000).toFixed(2)}s`);
  console.log('');
  console.log(`   Cartes traitées: ${stats.cardsProcessed}`);
  console.log(`   ✅ Succès: ${stats.cardsSuccess}`);
  console.log(`   ⚠️  Overflow: ${stats.cardsWithOverflow}`);
  console.log(`   ❌ Échecs: ${stats.cardsFailed}`);
  
  if (stats.overflowCards.length > 0) {
    console.log('');
    console.log(`   🚨 Cartes avec overflow persistant (${stats.overflowCards.length}):`);
    stats.overflowCards.forEach(name => {
      console.log(`      - ${name}_overflow.pdf`);
    });
  }
  
  if (stats.autoFitReductions.length > 0) {
    console.log('');
    console.log(`   📏 Auto-fit reductions (${stats.autoFitReductions.length}):`);
    stats.autoFitReductions.forEach(r => {
      console.log(`      - ${r.card} (${r.face}): ${r.fontSize}`);
    });
  }
  
  if (stats.errors.length > 0) {
    console.log('');
    console.log(`   ⚠️ Erreurs (${stats.errors.length}):`);
    stats.errors.forEach(e => {
      console.log(`      - ${e}`);
    });
  }
  
  console.log('==============================\n');
}

/**
 * Main
 */
async function main() {
  const target = process.argv[2] || 'all';
  console.log(`\n🖨️  RENDER - Génération des PDFs A6 via afficheur`);
  console.log(`   Target: ${target}`);
  console.log(`   DPI: ${CONFIG.deviceScaleFactor * 96} (scale ${CONFIG.deviceScaleFactor})`);
  if (DEBUG) console.log(`   🔍 Mode DEBUG activé`);
  console.log('');
  
  // Logs environnement en mode debug
  logEnvironment();
  
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
  
  // Résumé en mode debug
  logSummary();
  
  const overflowNote = stats.cardsWithOverflow > 0 
    ? ` (⚠️ ${stats.cardsWithOverflow} avec overflow)` 
    : '';
  console.log(`\n✅ Render terminé : ${stats.cardsSuccess}/${stats.cardsProcessed} PDFs générés dans ${CONFIG.outputDir}/${overflowNote}\n`);
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
