# Plan de travail - Cartes Moments M4 à M7

> Dernière mise à jour : 23 janvier 2026

---

## Contexte

Les 3 premiers moments (M1, M2, M3) ont été finalisés en passe Fond. L'analyse de leur processus de raffinement permet d'identifier des patterns récurrents à appliquer aux 4 protos restants (M4-M7).

### Patterns identifiés dans M1-M3

| Pattern | Description | Exemples |
|---------|-------------|----------|
| **Quote engageante** | Bloc quote à la 1e personne du pluriel, orienté action | "Transformons...", "Exprimons...", "Célébrons..." |
| **Contexte concret** | Situation immédiate, adresse directe | "Vous êtes six inconnu·es...", "Une semaine en équipage, c'est..." |
| **Enjeu explicite** | Ce qui se passe SANS ce moment | "Sans cadre explicite, vous allez naviguer à vue..." |
| **Tip = permission** | Invitation, pas injonction + lien outil | "Osez le rôle qui vous intimide", "Ces accords sont les vôtres" |
| **Déroulé actionnable** | Verbes d'action, consignes directes | "Chacun·e prend une carte", "Commence qui veut" |
| **Questions-emojis** | Emojis de repérage rapide pour questions | 🧭 💬 😴 🌱 |
| **⚓ ANCRAGE** | Ce qu'on note, où, et le lien avec la suite | "Notons...", "On y reviendra en M6 et M7" |
| **→ Transition** | Lien explicite vers le moment suivant | "→ Prochaine étape : M4 Brief du matin" |

---

## Structure type d'une carte moment finalisée

### RECTO (HEAD)

| Section | Contenu |
|---------|---------|
| **H1 + H6** | Emoji + titre + timing + durée |
| **Bloc quote** | Le "pourquoi" en 2-3 phrases, ton engageant, 1e pers. pluriel |
| **Contexte** | Situation concrète ("vous êtes là") |
| **Enjeu** | Pourquoi ce moment est important (conséquence si absent) |
| **Tip** | Permission d'explorer + lien vers autre outil si pertinent |

### VERSO (FLIP)

| Section | Contenu |
|---------|---------|
| **SKIP-PRINT H2** | Titre masqué en print |
| **Étapes numérotées** | H4 + durées indicatives + consignes actionnables |
| **Questions-emojis** | Si pertinent, lecture rapide en conditions dégradées |
| **⚓ ANCRAGE** | Ce qu'on retient, où on le note, lien séquentiel |
| **→ Transition** | Annonce du moment suivant |
| **Footer** | `*Anacoluthe - CC-BY-NC-SA*` |

---

## Grille d'audit

Avant de retravailler, vérifier pour chaque carte :

| # | Critère | Question |
|---|---------|----------|
| 1 | **Emoji titre** | Correspond à DESIGN_INTENTIONS ? |
| 2 | **Quote** | 1e pers. pluriel, orientée action, ≤ 3 phrases ? |
| 3 | **Contexte** | Situation immédiate, adresse directe ? |
| 4 | **Enjeu** | Conséquence explicite si le moment est absent ? |
| 5 | **Tip** | Permission (pas injonction) + lien outil ? |
| 6 | **Déroulé** | Verbes d'action, pas de passif, consignes précises ? |
| 7 | **Cohérence intentions** | Respecte les intentions de CARTES_MOMENTS_INTENTIONS ? |
| 8 | **ANCRAGE** | Explicite ce qu'on retient et où ? |
| 9 | **Transition** | Lien vers moment suivant/précédent ? |
| 10 | **Densité** | ≤ 900 car/face ? |
| 11 | **Écriture inclusive** | "lae", "iel", "chacun·e", etc. ? |
| 12 | **Tirets** | Uniquement `-` (jamais — ni –) ? |
| 13 | **Marqueurs MD** | HEAD, FLIP, SKIP-PRINT correctement placés ? |
| 14 | **Ton** | Adresse directe "vous/on", pas de "il faut" ? |
| 15 | **Progression mono** | Le rôle du mono s'efface progressivement ? |

---

## Diagnostic par carte

### M4 - Brief matin ☀️

**Fichier** : `sources/cartes/moments/M4_brief_matin_proto.md`

| # | Critère | Statut | Observation |
|---|---------|--------|-------------|
| 1 | Emoji titre | ⚠️ | Fichier utilise ☀️, DESIGN_INTENTIONS dit 🌅 → à trancher |
| 2 | Quote | ✅ | Bonne, orientée action |
| 3 | Contexte | ✅ | Situation posée clairement |
| 4 | Enjeu | ⚠️ | Implicite ("comment va l'équipage ?"), pas de conséquence nommée |
| 5 | Tip | ✅ | Permission ("un mot suffit") + lien second soigneux |
| 6 | Déroulé | ⚠️ | Étape 4 "BRIEF TECHNIQUE" trop vague, pas actionnable |
| 7 | Cohérence intentions | ⚠️ | Intentions mentionnent "remplir le tableau d'équipage" (présent) mais aussi "intention collective" plus développée |
| 8 | ANCRAGE | ❌ | Absent. Les intentions mentionnent "noter dans le livre de bord" |
| 9 | Transition | ✅ | "→ Ce soir : M5 Débrief du soir" |
| 10 | Densité | ✅ | OK |
| 11 | Écriture inclusive | ✅ | "lae", "iel" présents |
| 12 | Tirets | ✅ | OK |
| 13 | Marqueurs MD | ✅ | HEAD, FLIP, SKIP-PRINT OK |
| 14 | Ton | ✅ | Adresse directe |
| 15 | Progression mono | ✅ | "VARIANTE J5-J6" présente |

**Travail à faire** :
- Trancher emoji (☀️ vs 🌅)
- Ajouter enjeu explicite ("Sans ce temps, l'équipage démarre à froid...")
- Préciser étape 4 ou la supprimer (le brief technique n'est pas d'Anacoluthe)
- Ajouter section ⚓ ANCRAGE (noter dans LDB)

---

### M5 - Débrief soir 🌙

**Fichier** : `sources/cartes/moments/M5_debrief_soir_proto.md`

| # | Critère | Statut | Observation |
|---|---------|--------|-------------|
| 1 | Emoji titre | ✅ | 🌙 cohérent avec DESIGN_INTENTIONS |
| 2 | Quote | ✅ | Bonne, orientée action |
| 3 | Contexte | ✅ | Situation claire |
| 4 | Enjeu | ✅ | "la dimension humaine compte aussi" |
| 5 | Tip | ✅ | CNV implicite ("notre communication" vs "tu n'écoutais pas") |
| 6 | Déroulé | ⚠️ | "Tour classique" vague, pas de questions précises pour le tech |
| 7 | Cohérence intentions | ⚠️ | Intentions mentionnent "faire circuler la parole équitablement" → pas de guidance concrète sur ça dans le proto |
| 8 | ANCRAGE | ⚠️ | Présent mais pas nommé "⚓ ANCRAGE" (c'est "NOTER DANS LE LIVRE DE BORD") |
| 9 | Transition | ✅ | "→ Demain matin : M4 Brief du matin" |
| 10 | Densité | ✅ | OK |
| 11 | Écriture inclusive | ✅ | "lae" présent |
| 12 | Tirets | ✅ | OK |
| 13 | Marqueurs MD | ✅ | OK |
| 14 | Ton | ✅ | Adresse directe |
| 15 | Progression mono | ✅ | "VARIANTE J5-J6" présente |

**Travail à faire** :
- Renommer "NOTER DANS LE LIVRE DE BORD" → "⚓ ANCRAGE" (cohérence pattern)
- Préciser étape 1 (questions concrètes plutôt que "tour classique")
- Ajouter une micro-guidance sur l'équilibre du temps de parole
- Vérifier si le lien Joker est assez explicite ("Si oui → proposer une carte Joker adaptée" = OK mais quel Joker ?)

---

### M6 - Mi-parcours ⚓

**Fichier** : `sources/cartes/moments/M6_mi_parcours_proto.md`

| # | Critère | Statut | Observation |
|---|---------|--------|-------------|
| 1 | Emoji titre | ✅ | ⚓ cohérent avec DESIGN_INTENTIONS |
| 2 | Quote | ✅ | Bonne, orientée action |
| 3 | Contexte | ✅ | Situation bien posée |
| 4 | Enjeu | ✅ | "les tensions peuvent émerger", "la fatigue s'accumule" |
| 5 | Tip | ⚠️ | Bon contenu mais formulation passive ("C'est le bon moment pour...") |
| 6 | Déroulé | ⚠️ | Ordre inversé vs intentions : intentions disent célébrer AVANT les tensions |
| 7 | Cohérence intentions | ⚠️ | Intentions mentionnent "revenir sur les attentes M1" et "engagement" → absents du déroulé |
| 8 | ANCRAGE | ❌ | Absent. Rien n'est noté nulle part |
| 9 | Transition | ✅ | "→ Fin de stage : M7 Débrief final" |
| 10 | Densité | ✅ | OK |
| 11 | Écriture inclusive | ⚠️ | "fier·ères" utilisé mais pas de "lae" (pas d'occurrence nécessaire ici) |
| 12 | Tirets | ✅ | OK |
| 13 | Marqueurs MD | ✅ | OK |
| 14 | Ton | ✅ | Adresse directe |
| 15 | Progression mono | ❌ | Pas de mention d'autonomisation (intentions : "le·la mono avec Second soigneux du jour") |

**Travail à faire** :
- Réordonner : célébrer AVANT tensions (cohérence intentions)
- Ajouter retour sur attentes M1 ("Ressortons notre feuille de J1")
- Ajouter section ⚓ ANCRAGE (noter ajustements, mettre à jour feuille M1/accords M2)
- Ajouter guidance sur qui anime (Second soigneux + mono → autonomisation)
- Reformuler tip en permission active

---

### M7 - Débrief final 🎯→🏁

**Fichier** : `sources/cartes/moments/M7_debrief_final_proto.md`

| # | Critère | Statut | Observation |
|---|---------|--------|-------------|
| 1 | Emoji titre | ❌ | Fichier utilise 🎯, DESIGN_INTENTIONS dit 🏁 |
| 2 | Quote | ⚠️ | Bonne intention mais formulation distante ("les compétences développées risquent...") |
| 3 | Contexte | ⚠️ | Bon mais redondant avec le quote (double formulation du même enjeu) |
| 4 | Enjeu | ⚠️ | Présent mais noyé dans la redondance quote/contexte |
| 5 | Tip | ⚠️ | Répète l'enjeu au lieu de donner une permission/un outil |
| 6 | Déroulé | ⚠️ | Temps de réflexion 10 min (intentions disent 15 min). Feedbacks croisés absents des intentions mais présents dans le proto |
| 7 | Cohérence intentions | ❌ | Manque : lien attentes M1, engagement action, transition debriefs individuels |
| 8 | ANCRAGE | ❌ | Absent (pas de retour sur feuille M1, pas de note LDB) |
| 9 | Transition | ❌ | "Bon vent" = poétique mais pas de guidance vers les debriefs individuels |
| 10 | Densité | ⚠️ | À revérifier après réécriture |
| 11 | Écriture inclusive | ⚠️ | "du·de la navigateur·ice" → devrait être "lae navigateurice" |
| 12 | Tirets | ✅ | OK |
| 13 | Marqueurs MD | ✅ | OK |
| 14 | Ton | ⚠️ | Distancié par moments ("les compétences développées") |
| 15 | Progression mono | ⚠️ | "Lae moniteurice reformule" = ok mais pas d'autonomie équipage |

**Travail à faire** :
- Corriger emoji → 🏁
- Réécrire quote (action, "nous", 2-3 phrases)
- Supprimer redondance contexte/quote (un seul passage sur l'enjeu transfert)
- Ajouter retour explicite sur feuille M1 ("Ressortons nos attentes de J1")
- Ajouter "engagement action" (1 chose concrète à ramener à terre)
- Supprimer ou reformuler feedbacks croisés (pas dans les intentions)
- Ajouter section ⚓ ANCRAGE (fermeture LDB, fiche bilan)
- Ajouter transition vers debriefs individuels
- Corriger écriture inclusive ("lae navigateurice")

---

## Ordre de traitement

| Priorité | Carte | Raison |
|----------|-------|--------|
| 1 | **M4** | Peu de modifications, rapide à finaliser. Servira de modèle pour la paire M4/M5 |
| 2 | **M5** | Miroir de M4, ajustements mineurs (renommage, précisions) |
| 3 | **M6** | Plus de réorganisation nécessaire (ordre, ajout retour M1) |
| 4 | **M7** | Le plus de travail (réécriture quote, suppression redondance, ajouts) |

---

## Contraintes de forme (rappel)

- **Format** : A6 recto-verso (~900 car/face max)
- **Marqueurs** : `<!-- HEAD -->`, `<!-- FLIP -->`, `<!-- SKIP-PRINT -->` / `<!-- /SKIP-PRINT -->`
- **Écriture inclusive** : systématique (iel, chacun·e, "lae" au lieu de "le·la")
- **Tirets** : uniquement `-` (jamais — ni –)
- **Ton** : permission d'explorer, pas injonction
- **Bloc quote** : 1e personne du pluriel, orienté action
- **Footer** : `*Anacoluthe - CC-BY-NC-SA*`

---

## Questions à trancher avant production

1. **Emoji M4** : ☀️ (dans le proto) ou 🌅 (dans DESIGN_INTENTIONS) ? L'emoji 🌅 évoque le lever de soleil mais aussi un coucher. ☀️ est plus clair pour "matin".

2. **Emoji M7** : 🏁 (DESIGN_INTENTIONS) ou 🎯 (dans le proto) ? 🏁 = arrivée/fin, 🎯 = objectif atteint. Les deux fonctionnent.

3. **Étape "Brief technique" dans M4** : la garder (signal que M4 se greffe sur l'existant) ou la supprimer (elle n'est pas d'Anacoluthe) ?

4. **Feedbacks croisés dans M7** : les garder (ajout par rapport aux intentions, mais utile terrain) ou s'en tenir aux intentions ?

---

## Références

- Cartes moments sources : `sources/cartes/moments/M*.md`
- Intentions pédagogiques : `sources/documentation/CARTES_MOMENTS_INTENTIONS.md`
- Standards design : `sources/documentation/DESIGN_INTENTIONS.md`
- Tableau de suivi : `sources/suivi/tableau_suivi_cartes.md`
- Suivi de production : `sources/documentation/work-in-progress/SUIVI_PRODUCTION_V5.md`
- Modèle de plan : `sources/documentation/work-in-progress/PLAN_MEMOS_AFFICHES.md`

---

*Plan créé le 23 janvier 2026*
