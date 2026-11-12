#!/usr/bin/env python3
"""Genere soutenance-uc12.pptx depuis le contenu du wireframe.

Une passe : ce script produit le deck, il ne le relit pas. Une fois le pptx
edite a la main, ne pas relancer le script sans avoir sauvegarde l'edition.

Les notes de presentateur sont extraites du HTML (source unique), les
positions et tailles sont definies ici.

    PY=/chemin/venv/bin/python $PY build_soutenance_pptx.py
"""

import html as htmlmod
import re
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

ICI = Path(__file__).parent
SOURCE = ICI / "soutenance-uc12.html"
SORTIE = ICI / "soutenance-uc12.pptx"

# ── Identite visuelle ──
# Georgia et Calibri sont presentes par defaut sur Windows et Mac.
# Pour retrouver exactement le rendu du theme web, remplacer par
# "Merriweather Sans" et "Merriweather" (a installer sur la machine).
TITRE_FONT = "Georgia"
CORPS_FONT = "Calibri"

BLEU = RGBColor(0x00, 0x66, 0xAD)
TEAL = RGBColor(0x3D, 0x8B, 0x87)
NAVY = RGBColor(0x1E, 0x3A, 0x5F)
BRICK = RGBColor(0xC6, 0x28, 0x28)
AMBER = RGBColor(0xC9, 0x6A, 0x30)
TEXTE = RGBColor(0x2D, 0x37, 0x48)
MUET = RGBColor(0x71, 0x80, 0x96)
FOND_CLair = RGBColor(0xE8, 0xED, 0xF4)
BLANC = RGBColor(0xFF, 0xFF, 0xFF)

# ── Gabarit ──
L = Inches(0.95)          # marge gauche
R = Inches(0.95)          # marge droite
W = Inches(13.333)
CONTENU_W = W - L - R
HAUT = Inches(0.62)

# ── Echelle typographique (points) ──
T_NOM = 54
T_QUESTION = 26
T_SECTION = 30
T_CORPS = 20
T_LISTE = 20
T_PETIT = 13
T_MUET = 11
T_KICKER = 10
T_PIED = 9


def extraire_notes():
    brut = SOURCE.read_text(encoding="utf-8")
    blocs = re.findall(r'<aside class="notes">(.*?)</aside>', brut, re.S)
    notes = []
    for b in blocs:
        b = re.sub(r"<[^>]+>", "", b)
        b = htmlmod.unescape(b)
        lignes = [re.sub(r"[ \t]+", " ", l).strip() for l in b.strip().splitlines()]
        # les lignes vides deviennent des separateurs de paragraphe
        propre, vide = [], False
        for l in lignes:
            if not l:
                vide = True
                continue
            if vide and propre:
                propre.append("")
            propre.append(l)
            vide = False
        notes.append("\n".join(propre))
    return notes


def zone(slide, gauche, haut, largeur, hauteur):
    tb = slide.shapes.add_textbox(gauche, haut, largeur, hauteur)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.TOP
    return tf


def para(tf, morceaux, taille, couleur=TEXTE, font=CORPS_FONT, gras=False,
         align=PP_ALIGN.CENTER, avant=0, apres=0, interligne=None, premier=False):
    p = tf.paragraphs[0] if premier else tf.add_paragraph()
    p.alignment = align
    p.space_before = Pt(avant)
    p.space_after = Pt(apres)
    if interligne:
        p.line_spacing = interligne
    if isinstance(morceaux, str):
        morceaux = [(morceaux, {})]
    for texte, style in morceaux:
        r = p.add_run()
        r.text = texte
        f = r.font
        f.name = style.get("font", font)
        f.size = Pt(style.get("taille", taille))
        f.bold = style.get("gras", gras)
        f.italic = style.get("italique", False)
        f.color.rgb = style.get("couleur", couleur)
    return p


def interligne_pt(tf, p, valeur):
    p.line_spacing = valeur


def filet(slide, haut, largeur=Inches(0.9), couleur=TEAL, epaisseur=Pt(3)):
    forme = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                   Emu(int((W - largeur) / 2)), haut,
                                   Emu(int(largeur)), Emu(int(epaisseur)))
    forme.fill.solid()
    forme.fill.fore_color.rgb = couleur
    forme.line.fill.background()
    forme.shadow.inherit = False
    return forme


def regle_haut(slide, gauche, haut, largeur, couleur=TEAL, epaisseur=Pt(2.5)):
    forme = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, gauche, haut,
                                   largeur, Emu(int(epaisseur)))
    forme.fill.solid()
    forme.fill.fore_color.rgb = couleur
    forme.line.fill.background()
    forme.shadow.inherit = False
    return forme


def badge(slide, gauche, haut, largeur, hauteur, texte, couleur):
    forme = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, gauche, haut,
                                   largeur, hauteur)
    forme.fill.solid()
    forme.fill.fore_color.rgb = couleur
    forme.line.fill.background()
    forme.shadow.inherit = False
    tf = forme.text_frame
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.word_wrap = False
    para(tf, texte, T_PETIT, BLANC, TITRE_FONT, gras=True, premier=True)
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    return forme


def etiquette(slide, gauche, haut, largeur, hauteur, morceaux, couleur_fond,
              couleur_texte, taille=T_MUET, bordure=None, align=PP_ALIGN.CENTER):
    forme = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, gauche, haut,
                                   largeur, hauteur)
    forme.fill.solid()
    forme.fill.fore_color.rgb = couleur_fond
    forme.adjustments[0] = 0.18
    if bordure:
        forme.line.color.rgb = bordure
        forme.line.width = Pt(1)
    else:
        forme.line.fill.background()
    forme.shadow.inherit = False
    tf = forme.text_frame
    tf.margin_left = Inches(0.06)
    tf.margin_right = Inches(0.06)
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = para(tf, morceaux, taille, couleur_texte, CORPS_FONT, premier=True, align=align)
    p.alignment = align
    return forme


# ── Blocs de slide ──

def s_question(slide, d):
    tf = zone(slide, L, HAUT, CONTENU_W, Inches(0.3))
    para(tf, d["kicker"], T_KICKER, MUET, CORPS_FONT, premier=True)
    tf.paragraphs[0].runs[0].font._rPr.set("spc", "180")

    tf = zone(slide, L, Inches(1.55), CONTENU_W, Inches(1.0))
    para(tf, d["nom"], T_NOM, BLEU, TITRE_FONT, gras=True, premier=True)

    filet(slide, Inches(2.78))

    tf = zone(slide, Inches(1.85), Inches(3.25), Inches(9.6), Inches(2.6))
    para(tf, d["question"], T_QUESTION, TEXTE, TITRE_FONT, interligne=1.25, premier=True)


def s_section(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)
    if d.get("corps"):
        tf = zone(slide, L, Inches(2.0), CONTENU_W, Inches(1.6))
        para(tf, d["corps"], T_CORPS, TEXTE, CORPS_FONT, interligne=1.2, premier=True)
    if d.get("petit"):
        tf = zone(slide, L, Inches(4.1), CONTENU_W, Inches(1.0))
        para(tf, d["petit"], T_PETIT, MUET, CORPS_FONT, interligne=1.2, premier=True)


def s_liste(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)
    if d.get("corps"):
        tf = zone(slide, L, Inches(1.85), CONTENU_W, Inches(0.9))
        para(tf, d["corps"], T_CORPS, TEXTE, CORPS_FONT, interligne=1.15, premier=True)
    tf = zone(slide, Inches(1.6), Inches(2.85), Inches(10.1), Inches(3.4))
    for i, item in enumerate(d["items"]):
        para(tf, item, T_LISTE, TEXTE, CORPS_FONT, align=PP_ALIGN.LEFT,
             apres=14, interligne=1.1, premier=(i == 0))
    if d.get("petit"):
        tf = zone(slide, L, Inches(6.35), CONTENU_W, Inches(0.6))
        para(tf, d["petit"], T_PETIT, MUET, CORPS_FONT, interligne=1.1, premier=True)


def s_colonnes(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)
    tf = zone(slide, Inches(1.2), Inches(1.9), Inches(10.9), Inches(0.9))
    para(tf, d["corps"], T_CORPS, TEXTE, CORPS_FONT, interligne=1.15, premier=True)

    colonnes = d["colonnes"]
    n = len(colonnes)
    gouttiere = Inches(0.28)
    largeur = Emu(int((Inches(11.4) - gouttiere * (n - 1)) / n))
    gauche = Emu(int((W - (largeur * n + gouttiere * (n - 1))) / 2))
    y = Inches(3.15)
    for i, col in enumerate(colonnes):
        x = Emu(int(gauche + i * (largeur + gouttiere)))
        regle_haut(slide, x, y, largeur, TEAL)
        tf = zone(slide, x, Emu(int(y + Inches(0.16))), largeur, Inches(1.9))
        para(tf, col[0], T_CORPS, BLEU, TITRE_FONT, gras=True, align=PP_ALIGN.LEFT,
             apres=4, premier=True)
        para(tf, col[1], T_PETIT, TEXTE, CORPS_FONT, align=PP_ALIGN.LEFT, interligne=1.1)


def s_frise(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)

    versions = [
        ("V1", "Fiches mémo", NAVY),
        ("V2", "Archétypes", NAVY),
        ("V3", "Frankenstein", TEAL),
        ("V4", "Greffe", AMBER),
        ("V5", "Site + kits", TEAL),
    ]
    n = len(versions)
    largeur_col = Emu(int(Inches(11.0) / n))
    gauche0 = Emu(int((W - largeur_col * n) / 2))
    y_ligne = Inches(2.55)

    trait = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                   Emu(int(gauche0 + largeur_col / 2)), y_ligne,
                                   Emu(int(largeur_col * (n - 1))), Pt(3))
    trait.fill.solid()
    trait.fill.fore_color.rgb = NAVY
    trait.line.fill.background()
    trait.shadow.inherit = False

    for i, (code, label, couleur) in enumerate(versions):
        cx = Emu(int(gauche0 + i * largeur_col + largeur_col / 2))
        badge(slide, Emu(int(cx - Inches(0.42))), Emu(int(y_ligne - Inches(0.17))),
              Inches(0.84), Inches(0.34), code, couleur)
        tf = zone(slide, Emu(int(gauche0 + i * largeur_col)), Emu(int(y_ligne + Inches(0.3))),
                  largeur_col, Inches(0.4))
        para(tf, label, T_MUET, MUET, CORPS_FONT, premier=True)

    tf = zone(slide, Emu(int(gauche0)), Inches(3.25), Emu(int(largeur_col * 5)), Inches(0.35))
    para(tf, "le dispositif prend du volume  ·  puis convergence", T_MUET, MUET,
         CORPS_FONT, premier=True)

    pivots = [
        ("Module séparé", "Greffe"),
        ("Rôles fictifs", "Fonctions du bord"),
        ("Tout seul", "Intervenants"),
    ]
    y = Inches(3.95)
    for avant, apres in pivots:
        etiquette(slide, Inches(3.9), y, Inches(5.5), Inches(0.5),
                  [(avant + "  ", {"couleur": BRICK, "gras": True}),
                   ("→  ", {"couleur": MUET}),
                   (apres, {"couleur": TEAL, "gras": True})],
                  FOND_CLair, TEXTE, taille=T_PETIT)
        y = Emu(int(y + Inches(0.68)))


def s_arc(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)
    tf = zone(slide, Inches(1.2), Inches(1.9), Inches(10.9), Inches(0.8))
    para(tf, d["corps"], T_CORPS, TEXTE, CORPS_FONT, interligne=1.15, premier=True)

    n = 5
    gouttiere = Inches(0.22)
    largeur = Emu(int((Inches(11.6) - gouttiere * (n - 1)) / n))
    gauche = Emu(int((W - (largeur * n + gouttiere * (n - 1))) / 2))
    y = Inches(3.0)
    for i, (etape, geste, detail) in enumerate(d["arc"]):
        x = Emu(int(gauche + i * (largeur + gouttiere)))
        regle_haut(slide, x, y, largeur, NAVY, epaisseur=Pt(2))
        tf = zone(slide, x, Emu(int(y + Inches(0.16))), largeur, Inches(2.2))
        para(tf, etape, T_CORPS, BLEU, TITRE_FONT, gras=True, align=PP_ALIGN.LEFT,
             apres=6, premier=True)
        para(tf, geste, T_PETIT + 1, TEAL, CORPS_FONT, gras=True, align=PP_ALIGN.LEFT,
             apres=6)
        para(tf, detail, T_MUET, MUET, CORPS_FONT, align=PP_ALIGN.LEFT, interligne=1.1)


def s_ecart(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)
    tf = zone(slide, L, Inches(1.9), CONTENU_W, Inches(0.8))
    para(tf, d["corps"], T_CORPS, TEXTE, CORPS_FONT, interligne=1.15, premier=True)

    n = 3
    largeur = Emu(int(Inches(10.2) / n))
    gauche0 = Emu(int((W - largeur * n) / 2))
    for i, (chiffre, prevu, quoi) in enumerate(d["ecart"]):
        x = Emu(int(gauche0 + i * largeur))
        tf = zone(slide, x, Inches(3.05), largeur, Inches(2.4))
        para(tf, chiffre, 60, TEAL, TITRE_FONT, gras=True, premier=True)
        para(tf, prevu, T_PETIT, MUET, CORPS_FONT, apres=8)
        para(tf, quoi, T_CORPS, TEXTE, CORPS_FONT, interligne=1.1)


def s_encart(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)

    gauche_w = Inches(5.1)
    tf = zone(slide, Inches(1.0), Inches(2.0), gauche_w, Inches(3.6))
    for i, item in enumerate(d["items"]):
        morceaux = []
        for m in (item if isinstance(item, (list, tuple)) else [item]):
            morceaux.append((m, {}) if isinstance(m, str) else m)
        para(tf, morceaux, T_LISTE, TEXTE, CORPS_FONT, align=PP_ALIGN.LEFT,
             apres=16, interligne=1.1, premier=(i == 0))

    carte = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.55), Inches(2.0),
                                   Inches(5.8), Inches(3.1))
    carte.fill.solid()
    carte.fill.fore_color.rgb = FOND_CLair
    carte.line.fill.background()
    carte.shadow.inherit = False
    barre = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.55), Inches(2.0),
                                   Pt(4), Inches(3.1))
    barre.fill.solid()
    barre.fill.fore_color.rgb = TEAL
    barre.line.fill.background()
    barre.shadow.inherit = False
    tf = carte.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.22)
    tf.margin_right = Inches(0.2)
    tf.margin_top = Inches(0.2)
    tf.margin_bottom = Inches(0.2)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    para(tf, d["encart"], T_PETIT, TEXTE, CORPS_FONT, align=PP_ALIGN.LEFT,
         interligne=1.15, premier=True)


def s_apports(slide, d):
    tf = zone(slide, L, Inches(0.75), CONTENU_W, Inches(0.7))
    para(tf, d["titre"], T_SECTION, BLEU, TITRE_FONT, gras=True, premier=True)
    tf = zone(slide, Inches(1.6), Inches(1.85), Inches(10.1), Inches(2.0))
    for i, item in enumerate(d["items"]):
        morceaux = [(item[0], {"gras": True, "couleur": BLEU}), (item[1], {})]
        para(tf, morceaux, T_LISTE, TEXTE, CORPS_FONT, align=PP_ALIGN.LEFT,
             apres=12, interligne=1.1, premier=(i == 0))
    tf = zone(slide, Inches(1.9), Inches(4.15), Inches(9.5), Inches(1.0))
    para(tf, d["reponse"], T_CORPS, TEXTE, CORPS_FONT, interligne=1.2, premier=True)
    tf = zone(slide, L, Inches(5.85), CONTENU_W, Inches(0.6))
    para(tf, d["limite"], T_PETIT, MUET, CORPS_FONT, interligne=1.1, premier=True)


# ── Contenu ──

SLIDES = [
    ("question", {
        "kicker": "SOUTENANCE UC1-UC2 - BPJEPS VOILE HABITABLE",
        "nom": "Anacoluthe",
        "question": "Comment donner aux moniteurices les moyens d'animer le vivre-ensemble "
                    "dans un contexte qui génère autant de tensions que d'opportunités "
                    "d'apprentissage ?",
    }),
    ("section", {
        "titre": "Ce que j'ai cherché",
        "corps": "Quatorze entretiens, des semaines d'observation en stage, les rapports de mer.",
    }),
    ("colonnes", {
        "titre": "Quatre familles, indépendantes",
        "corps": "Chacune se comprend seule et vit sans les trois autres. On peut n'en prendre "
                 "qu'un bout.",
        "colonnes": [
            ("Les rôles", "quatre fonctions tournantes du bord"),
            ("Les affiches", "trois repères en cabine"),
            ("Les moments", "sept jalons de la semaine"),
            ("Les jokers", "quatre façons de sortir d'une tension"),
        ],
    }),
    ("section", {
        "titre": "Les rôles coopératifs",
        "corps": "Tout reposait sur la moniteurice. Quatre rôles tournants distribuent "
                 "l'organisation.",
        "petit": "Bosco, navigateurice, second soigneux, cambusier. Et ça marche sans les "
                 "trois autres familles.",
    }),
    ("section", {
        "titre": "Les affiches embarquées",
        "corps": "Les mêmes consignes, répétées chaque matin. Trois affiches fixes remplacent "
                 "la répétition.",
        "petit": "En cabine, lisibles sans qu'on les commente. Une affiche seule tient debout.",
    }),
    ("section", {
        "titre": "Les sept moments",
        "corps": "On avance, mais sans jalons visibles. Sept cartes donnent des rendez-vous "
                 "à la semaine.",
        "petit": "Du premier brief au débrief final. Une carte suffit pour en installer un.",
    }),
    ("section", {
        "titre": "Les quatre jokers",
        "corps": "Quand ça coince, chacun bricole. Quatre cartes donnent un protocole au lieu "
                 "d'une improvisation.",
        "petit": "Le seul bout qu'on peut sortir de la boîte et utiliser sans rien connaître "
                 "du reste.",
    }),
    ("frise", {"titre": "Cinq versions, neuf mois de terrain"}),
    ("section", {
        "titre": "La co-conception",
        "corps": "Neuf mois de séances avec les moniteurices de Marseillan. Chaque séance "
                 "était elle-même une séance d'animation.",
        "petit": "Nommer les situations, arbitrer entre deux cartes, défendre un choix devant "
                 "le groupe : c'est déjà la compétence qu'on veut transmettre aux stagiaires.",
    }),
    ("arc", {
        "titre": "Dans la formation",
        "corps": "Cinq étapes dans la vie d'un équipage, et à chacune un geste à animer.",
        "arc": [
            ("Formation", "poser les accords", "carte M2, puis J3"),
            ("Turbulence", "accueillir la tension", "joker J1, problème ou polarité"),
            ("Structuration", "distribuer et faire tourner", "rôles R1 à R4"),
            ("Coopération", "passer à l'apprentissage", "rituels et traces"),
            ("Dissolution", "faire emporter", "débrief final"),
        ],
    }),
    ("liste", {
        "titre": "Ce que la base pouvait porter",
        "items": [
            "Le vendredi formation existait déjà : un membre du bureau se libère pour qui le "
            "demande. Je m'y suis inséré.",
            "Le brief du samedi est un rituel dense : chaque minute ajoutée déplace une "
            "information existante.",
            "La bande passante du bureau a borné le nombre de formations, pas leur profondeur.",
        ],
    }),
    ("section", {
        "titre": "Faire appel à d'autres",
        "corps": "Cinq personnes, quatre domaines que je ne maîtrisais pas. Le projet dépasse "
                 "à un moment ce que je sais faire seul.",
        "petit": "Jeu et expérience utilisateur, psychologie clinique, identité graphique, "
                 "développement web. Mécénat de compétences, déclarations signées, licence libre.",
    }),
    ("liste", {
        "titre": "L'outil de la base",
        "items": [
            "Briefs de démarrage, débriefs d'atterrissage",
            "Kits distribués avec le livre de bord",
            "Des moniteurices formés le portent et le proposent à leurs collègues",
        ],
    }),
    ("ecart", {
        "titre": "L'écart au prévu",
        "corps": "Plus petit que prévu, et plus loin que prévu.",
        "ecart": [
            ("20", "sur 50 prévus", "moniteurices formés"),
            ("8", "sur 14 prévus", "bateaux équipés durablement"),
            ("3", "sans démarchage", "écoles extérieures"),
        ],
    }),
    ("encart", {
        "titre": "Ce que ça mesure",
        "items": [
            ["Neuf entretiens de moniteurices"],
            ["Quarante-trois questionnaires stagiaires"],
            [("68 % contre 27 %", {"gras": True, "couleur": BLEU})],
            ["les tensions se disent avant de dégrader le climat"],
        ],
        "encart": "L'usage du dispositif ne prouve pas, à lui seul, son effet sur les équipages. "
                  "Ce qui est mesuré porte sur des intentions déclarées et des retours, pas sur "
                  "un réinvestissement constaté.",
    }),
    ("liste", {
        "titre": "Ce qui reste",
        "items": [
            "Une licence libre : d'autres structures peuvent reprendre et adapter",
            "Une infrastructure : les fichiers sont accessibles sans moi",
            "Des personnes formées, et pas une décision de la structure",
        ],
        "petit": "Le portage reste fragile : rien ne tient à une décision institutionnelle, et "
                 "le déploiement repose encore sur une personne qui compense la bande passante "
                 "de la base.",
    }),
    ("apports", {
        "titre": "Apports et limites",
        "items": [
            ("Une démarche", " - co-concevoir avec celles et ceux qui vont utiliser"),
            ("Une formation", " - cinq gestes d'animation, pas cinq concepts"),
            ("Un outil", " - modulaire, greffé sur les routines, pas à côté"),
        ],
        "reponse": "Ce que le projet donne aux moniteurices, c'est une façon de nommer ce qui "
                   "se joue dans un équipage, et de le faire avec l'équipage plutôt que seul.",
        "limite": "Et la limite : un outil ne remplace pas une politique de formation.",
    }),
]

BLOCS = {
    "question": s_question,
    "section": s_section,
    "liste": s_liste,
    "colonnes": s_colonnes,
    "frise": s_frise,
    "arc": s_arc,
    "ecart": s_ecart,
    "encart": s_encart,
    "apports": s_apports,
}


def main():
    notes = extraire_notes()
    if len(notes) != len(SLIDES):
        raise SystemExit(f"{len(notes)} notes dans le HTML pour {len(SLIDES)} slides")

    prs = Presentation()
    prs.slide_width = W
    prs.slide_height = Inches(7.5)
    vide = prs.slide_layouts[6]

    for i, (genre, données) in enumerate(SLIDES):
        slide = prs.slides.add_slide(vide)
        BLOCS[genre](slide, données)

        tf = zone(slide, Emu(int(W - R - Inches(1.0))), Inches(7.0),
                  Inches(1.0), Inches(0.3))
        para(tf, str(i + 1), T_PIED, MUET, CORPS_FONT, align=PP_ALIGN.RIGHT, premier=True)

        slide.notes_slide.notes_text_frame.text = notes[i]

    prs.save(SORTIE)
    print(f"{SORTIE} : {len(prs.slides._sldIdLst)} slides")


if __name__ == "__main__":
    main()
