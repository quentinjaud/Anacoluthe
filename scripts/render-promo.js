/**
 * RENDER PROMO - Génère le PDF de l'affiche promotionnelle
 *
 * Usage: node scripts/render-promo.js
 * Output: print/promo/affiche-promo.pdf (A4 portrait)
 *
 * Variables d'environnement:
 *   DEBUG=true  Active le mode debug (screenshot PNG)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer');

const CONFIG = {
  inputPath: 'promo/affiche-promo.html',
  outputDir: 'print/promo',
  outputFile: 'affiche-promo.pdf',
  serverPort: 8766,
  navigationTimeout: 30000,
  readyTimeout: 10000,
  deviceScaleFactor: 3,
  // A4 portrait
  width: 210,
  height: 297
};

const DEBUG = process.env.DEBUG === 'true';

/**
 * Serveur HTTP statique minimal (même pattern que render-cards.js)
 */
function createStaticServer(rootDir) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
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

async function main() {
  console.log('\n🖨️  Anacoluthe Promo Renderer');

  // Vérifier que le fichier source existe
  if (!fs.existsSync(CONFIG.inputPath)) {
    console.error(`❌ Fichier introuvable : ${CONFIG.inputPath}`);
    process.exit(1);
  }

  // Créer le dossier de sortie
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  // Démarrer le serveur HTTP
  const server = createStaticServer(process.cwd());
  await new Promise(resolve => server.listen(CONFIG.serverPort, resolve));
  const baseUrl = `http://localhost:${CONFIG.serverPort}`;

  // Lancer Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 60000
  });

  try {
    const page = await browser.newPage();

    // Viewport A4 portrait
    const viewportWidth = Math.round(CONFIG.width * 96 / 25.4);
    const viewportHeight = Math.round(CONFIG.height * 96 / 25.4);
    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: CONFIG.deviceScaleFactor
    });

    // Naviguer vers l'affiche
    const url = `${baseUrl}/${CONFIG.inputPath}`;
    console.log(`   Source: ${CONFIG.inputPath}`);

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: CONFIG.navigationTimeout
    });

    // Attendre que l'affiche soit prête
    try {
      await page.waitForSelector('body.affiche-ready', { timeout: CONFIG.readyTimeout });
    } catch (err) {
      console.error('❌ body.affiche-ready non détecté');
      process.exit(1);
    }

    // Attendre les fonts
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 300));

    // Screenshot debug
    if (DEBUG) {
      const screenshotPath = path.join(CONFIG.outputDir, 'debug-affiche-promo.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`   📸 ${screenshotPath}`);
    }

    // Générer le PDF
    const pdfBuffer = await page.pdf({
      width: `${CONFIG.width}mm`,
      height: `${CONFIG.height}mm`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    const outputPath = path.join(CONFIG.outputDir, CONFIG.outputFile);
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`   ✅ ${outputPath}`);

  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});
