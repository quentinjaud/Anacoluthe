/**
 * ASSEMBLEUR - Assemble les PDFs A6 en livrets A4 (4-UP)
 * 
 * Usage: node scripts/assemble-booklets.js [target]
 *   target: 'all' | 'roles' | 'moments' | 'joker' | 'memos' | 'affiches'
 *
 * Input: /print/cartes/{id}.pdf (2 pages : recto + verso)
 *        /print/affiches/{id}.pdf (pour le livret affiches, format A4)
 * Output: /print/livrets/livret-{type}.pdf (A4, 4-UP recto-verso ou concat A4)
 * 
 * Layout 4-UP avec ordre pour impression recto-verso bord long :
 * 
 * RECTO A4:              VERSO A4 (après retournement bord long):
 * ┌─────────┬─────────┐  ┌─────────┬─────────┐
 * │ Carte1  │ Carte2  │  │ Carte2  │ Carte1  │
 * │ RECTO   │ RECTO   │  │ VERSO   │ VERSO   │
 * ├─────────┼─────────┤  ├─────────┼─────────┤
 * │ Carte3  │ Carte4  │  │ Carte4  │ Carte3  │
 * │ RECTO   │ RECTO   │  │ VERSO   │ VERSO   │
 * └─────────┴─────────┘  └─────────┴─────────┘
 */

const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

// Configuration
const CONFIG = {
  inputDir: 'print/cartes',
  outputDir: 'print/livrets',
  
  // Dimensions en points (1 pt = 1/72 inch)
  a4: { width: 595.28, height: 841.89 },  // A4 portrait
  a6: { width: 297.64, height: 420.94 },  // A6
  
  // Repères de coupe
  mireLength: 14,  // ~5mm
  mireOffset: 28.35,  // 10mm vers l'intérieur (hors marges non-imprimées)
  mireColor: rgb(0.7, 0.7, 0.7),
  mireThickness: 0.5,
  
  // Définition des livrets
  booklets: {
    roles: {
      cards: ['R1_bosco', 'R2_navigateurice', 'R3_second-soigneux', 'R4_cambusiere'],
      title: 'Cartes Rôles'
    },
    moments: {
      cards: ['M1_accueil-presentations', 'M2_accords-equipage', 'M3_introduction-roles', 
              'M4_brief-matin', 'M5_debrief-soir', 'M6_mi-parcours', 'M7_debrief-final'],
      title: 'Cartes Moments-clés'
    },
    joker: {
      cards: ['J1_conflit-desaccord', 'J2_temps-sans-navigation',
              'J3_rediscuter-accords', 'J4_demande_retour_mono'],
      title: 'Cartes Joker'
    },
    memos: {
      cards: ['A1_routines', 'A2_tableau', 'A3_marque-page'],
      title: 'Mémos Affiches'
    },
    m1x4: {
      cards: ['M1_accueil-presentations', 'M1_accueil-presentations', 'M1_accueil-presentations', 'M1_accueil-presentations'],
      title: 'M1 Accueil x4'
    },
    affiches: {
      cards: ['A1_routines', 'A2_tableau_equipage', 'A3_marque_page', 'A4_decouverte-dispositif'],
      title: 'Affiches A4',
      format: 'a4',
      inputDir: 'print/affiches'
    }
  }
};

// Positions des 4 cartes A6 sur une page A4 (origine en bas à gauche)
const POSITIONS = {
  topLeft:     { x: 0, y: CONFIG.a6.height },
  topRight:    { x: CONFIG.a6.width, y: CONFIG.a6.height },
  bottomLeft:  { x: 0, y: 0 },
  bottomRight: { x: CONFIG.a6.width, y: 0 }
};

/**
 * Ajoute les repères de coupe discrets sur une page A4
 */
function addCutMarks(page) {
  const { width, height } = CONFIG.a4;
  const { mireLength, mireOffset, mireColor, mireThickness } = CONFIG;

  // Centre horizontal (coupe verticale) - en haut
  page.drawLine({
    start: { x: width / 2, y: height - mireOffset - mireLength },
    end: { x: width / 2, y: height - mireOffset },
    thickness: mireThickness,
    color: mireColor
  });

  // Centre horizontal (coupe verticale) - en bas
  page.drawLine({
    start: { x: width / 2, y: mireOffset },
    end: { x: width / 2, y: mireOffset + mireLength },
    thickness: mireThickness,
    color: mireColor
  });

  // Centre vertical (coupe horizontale) - à gauche
  page.drawLine({
    start: { x: mireOffset, y: height / 2 },
    end: { x: mireOffset + mireLength, y: height / 2 },
    thickness: mireThickness,
    color: mireColor
  });

  // Centre vertical (coupe horizontale) - à droite
  page.drawLine({
    start: { x: width - mireOffset - mireLength, y: height / 2 },
    end: { x: width - mireOffset, y: height / 2 },
    thickness: mireThickness,
    color: mireColor
  });
}

/**
 * Trouve le fichier PDF d'une carte (gestion des variantes de nommage)
 */
function findCardPdf(cardId, inputDir) {
  const dir = inputDir || CONFIG.inputDir;
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir)
    : [];
  
  // Chercher par correspondance exacte ou par préfixe
  const prefix = cardId.split('_')[0];
  
  for (const file of files) {
    if (!file.endsWith('.pdf')) continue;
    
    const baseName = path.basename(file, '.pdf');
    
    // Match exact
    if (baseName === cardId || baseName.toLowerCase() === cardId.toLowerCase()) {
      return path.join(dir, file);
    }

    // Match par préfixe (R1, M1, S1, etc.)
    if (baseName.toUpperCase().startsWith(prefix.toUpperCase())) {
      return path.join(dir, file);
    }
  }

  return null;
}

/**
 * Charge les PDFs des cartes d'un livret
 */
async function loadCardPdfs(cardIds, inputDir) {
  const cards = [];

  for (const cardId of cardIds) {
    const pdfPath = findCardPdf(cardId, inputDir);
    
    if (pdfPath) {
      try {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdf = await PDFDocument.load(pdfBytes);
        cards.push({ id: cardId, pdf, path: pdfPath });
        console.log(`  📄 ${path.basename(pdfPath)}`);
      } catch (err) {
        console.error(`  ❌ Erreur lecture ${pdfPath}: ${err.message}`);
        cards.push({ id: cardId, pdf: null });
      }
    } else {
      console.log(`  ⚠️  ${cardId} non trouvé - page blanche`);
      cards.push({ id: cardId, pdf: null });
    }
  }
  
  return cards;
}

/**
 * Embed une page A6 dans une page A4 à une position donnée
 */
async function embedA6Page(outputPdf, a4Page, sourcePdf, pageIndex, position) {
  if (!sourcePdf) return; // Page blanche
  
  if (pageIndex >= sourcePdf.getPageCount()) return;
  
  const [embeddedPage] = await outputPdf.embedPdf(sourcePdf, [pageIndex]);
  
  a4Page.drawPage(embeddedPage, {
    x: position.x,
    y: position.y,
    width: CONFIG.a6.width,
    height: CONFIG.a6.height
  });
}

/**
 * Assemble un livret A4 4-UP à partir des cartes A6
 */
async function assembleBooklet(bookletName, bookletConfig) {
  console.log(`\n📚 Assemblage: ${bookletConfig.title}`);

  // Charger les PDFs sources
  const cards = await loadCardPdfs(bookletConfig.cards, bookletConfig.inputDir);

  // Créer le PDF de sortie
  const outputPdf = await PDFDocument.create();

  // Mode A4 : concaténation simple des pages
  if (bookletConfig.format === 'a4') {
    let totalPages = 0;
    for (const card of cards) {
      if (!card.pdf) continue;
      const pages = await outputPdf.copyPages(card.pdf, card.pdf.getPageIndices());
      for (const page of pages) {
        outputPdf.addPage(page);
        totalPages++;
      }
    }

    const outputPath = path.join(CONFIG.outputDir, `livret-${bookletName}.pdf`);
    const pdfBytes = await outputPdf.save();
    fs.writeFileSync(outputPath, pdfBytes);

    const sheetsCount = Math.ceil(totalPages / 2);
    console.log(`  ✅ ${outputPath} (${sheetsCount} feuille${sheetsCount > 1 ? 's' : ''} A4)`);

    return { name: bookletName, path: outputPath, cards: cards.length, sheets: sheetsCount };
  }

  // Mode 4-UP A6 : assemblage classique
  // Compléter à un multiple de 4 cartes
  while (cards.length % 4 !== 0) {
    cards.push({ id: 'blank', pdf: null });
  }

  // Traiter par groupes de 4 cartes (= 1 feuille A4 recto-verso)
  for (let i = 0; i < cards.length; i += 4) {
    const batch = cards.slice(i, i + 4);

    // Page RECTO A4 : les 4 rectos des cartes
    const rectoPage = outputPdf.addPage([CONFIG.a4.width, CONFIG.a4.height]);

    // Positions : topLeft, topRight, bottomLeft, bottomRight
    await embedA6Page(outputPdf, rectoPage, batch[0]?.pdf, 0, POSITIONS.topLeft);
    await embedA6Page(outputPdf, rectoPage, batch[1]?.pdf, 0, POSITIONS.topRight);
    await embedA6Page(outputPdf, rectoPage, batch[2]?.pdf, 0, POSITIONS.bottomLeft);
    await embedA6Page(outputPdf, rectoPage, batch[3]?.pdf, 0, POSITIONS.bottomRight);

    addCutMarks(rectoPage);

    // Page VERSO A4 : les 4 versos des cartes (miroir horizontal pour bord long)
    const versoPage = outputPdf.addPage([CONFIG.a4.width, CONFIG.a4.height]);

    // Après retournement bord long : gauche↔droite s'inversent
    await embedA6Page(outputPdf, versoPage, batch[1]?.pdf, 1, POSITIONS.topLeft);
    await embedA6Page(outputPdf, versoPage, batch[0]?.pdf, 1, POSITIONS.topRight);
    await embedA6Page(outputPdf, versoPage, batch[3]?.pdf, 1, POSITIONS.bottomLeft);
    await embedA6Page(outputPdf, versoPage, batch[2]?.pdf, 1, POSITIONS.bottomRight);

    addCutMarks(versoPage);
  }

  // Sauvegarder
  const outputPath = path.join(CONFIG.outputDir, `livret-${bookletName}.pdf`);
  const pdfBytes = await outputPdf.save();
  fs.writeFileSync(outputPath, pdfBytes);

  const sheetsCount = cards.length / 4;
  console.log(`  ✅ ${outputPath} (${sheetsCount} feuille${sheetsCount > 1 ? 's' : ''} A4)`);

  return { name: bookletName, path: outputPath, cards: cards.length, sheets: sheetsCount };
}

/**
 * Assemble le kit complet (tous les livrets en un seul PDF)
 */
async function assembleCompleteKit(bookletResults) {
  console.log(`\n📦 Assemblage: Kit complet`);
  
  const outputPdf = await PDFDocument.create();
  
  for (const result of bookletResults) {
    if (!fs.existsSync(result.path)) continue;
    
    const bookletBytes = fs.readFileSync(result.path);
    const bookletPdf = await PDFDocument.load(bookletBytes);
    const pages = await outputPdf.copyPages(bookletPdf, bookletPdf.getPageIndices());
    
    for (const page of pages) {
      outputPdf.addPage(page);
    }
  }
  
  const outputPath = path.join(CONFIG.outputDir, 'kit-complet.pdf');
  const pdfBytes = await outputPdf.save();
  fs.writeFileSync(outputPath, pdfBytes);
  
  const totalSheets = bookletResults.reduce((sum, r) => sum + r.sheets, 0);
  console.log(`  ✅ ${outputPath} (${totalSheets} feuilles A4 total)`);
}

/**
 * Main
 */
async function main() {
  const target = process.argv[2] || 'all';
  console.log(`\n📚 ASSEMBLEUR - Génération des livrets A4 (4-UP)`);
  console.log(`   Target: ${target}\n`);
  
  // S'assurer que le dossier output existe
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Déterminer quels livrets assembler
  const bookletNames = target === 'all' 
    ? Object.keys(CONFIG.booklets)
    : [target];
  
  const results = [];
  
  for (const name of bookletNames) {
    const config = CONFIG.booklets[name];
    if (!config) {
      console.log(`  ⚠️  Livret inconnu: ${name}`);
      continue;
    }
    
    const result = await assembleBooklet(name, config);
    results.push(result);
  }
  
  // Kit complet si "all"
  if (target === 'all' && results.length > 0) {
    await assembleCompleteKit(results);
  }
  
  console.log(`\n✅ Assemblage terminé\n`);
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});
