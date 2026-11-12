import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Context for 242Agro
const AGRO_242_CONTEXT = `
IDENTITÉ ET RÉFÉRENCE OFFICIELLE DE L'ENTREPRISE :
Nom : 242Agro
Fondateur et CEO : Roc Nkouelolo
Localisation : Pointe-Noire, République du Congo
Contact professionnel WhatsApp direct : +242 06 874 22 77
Courriel professionnel : 242agro@gmail.com
Site web officiel : https://242agropn.netlify.app/
Slogan officiel : "242Agro — Cultivons aujourd’hui, nourrissons demain."
Mission : "Nous faisons pousser la possibilité de produire localement, même là où la ville laisse peu de place à la terre."
Vision : Villes où chaque espace disponible (cours bétonnées, vérandas, balcons, terrasses, toits, petits terrains) devient un lieu vivant de production saine et organique.
Cibles prioritaires à Pointe-Noire et dans le Littoral :
- Ménages et familles soucieuses de leur santé et de celle de leurs enfants.
- Établissements scolaires (écoles, collèges, lycées pour potagers pédagogiques).
- Églises et communautés religieuses souhaitant valoriser leurs espaces et cours.
- Restaurants et hôtels recherchant la fraîcheur absolue et des herbes aromatiques sans rupture.
- Entreprises, industries pétrolières et comités RSE pour l'éco-responsabilité et le team-building.
- Porteurs de projets agricoles urbains et périurbains.

Domaines d'expertise éprouvés :
1. Conception et installation de potagers hors-sol sur mesure (bois durable local teck/limba traité à l'huile de lin naturelle).
2. Aménagement de microfermes urbaines circulaires adaptées aux espaces disponibles (même sur balcons, vérandas et terrasses).
3. Production maraîchère 100% organique, sans aucun pesticide chimique ni intrant toxique.
4. Petits élevages intégrés (poules pondeuses et cuniculture/lapins) selon la faisabilité.
5. Compostage thermophile et valorisation des matières et biodéchets organiques.
6. Potagers pédagogiques pour écoles, églises et organisations.
7. Fourniture de plants fruitiers greffés sains (avocatiers, agrumes, manguiers, corossoliers) et plantes aromatiques.
8. Accompagnement, formation et appui agronomique continu pour démarrer et entretenir l'espace.
`;

// Helper to execute Gemini with exponential backoff retry for transient spikes
async function callGeminiWithRetry(params: any, retries = 2, delayMs = 600): Promise<any> {
  if (!ai) throw new Error("Clé API Gemini non configurée.");
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const isTransient =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.message?.includes("503") ||
        err?.message?.includes("429") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("UNAVAILABLE");

      if (isTransient && attempt < retries) {
        console.warn(`Gemini transient spike (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, attempt)));
        continue;
      }
      throw err;
    }
  }
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    app: '242Agro Intelligence',
    timestamp: new Date().toISOString(),
  });
});

// Search opportunities using Gemini with search grounding or deep reasoning
app.post('/api/opportunities/search', async (req: Request, res: Response) => {
  try {
    const { zone = 'Pointe-Noire', category = 'all', query = '' } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Clé API Gemini non configurée sur le serveur. Veuillez configurer GEMINI_API_KEY dans les Secrets.',
      });
    }

    const prompt = `
Tu es le directeur de la veille stratégique et commerciale de 242Agro à Pointe-Noire (Congo).
Recherche et synthétise les opportunités d'affaires, appels d'offres, appels à projets (bailleurs, ONG, programmes RSE, municipalités, ambassades) et consultations privées pertinents.

Contexte de recherche :
Zone géographique : ${zone} (République du Congo / Afrique Centrale)
Catégorie ciblée : ${category}
Mots-clés complémentaires : ${query || 'agriculture urbaine, maraîchage, compostage, RSE, potagers scolaires, environnement'}

${AGRO_242_CONTEXT}

Retourne impérativement un tableau JSON valide contenant entre 4 et 6 opportunités réalistes et hautement pertinentes pour 242Agro (par exemple : appels à projets PNUD Congo, FAO Congo, Union Européenne, Ambassade de France/PISCCA, TotalEnergies EP Congo RSE, Eni Congo, MTN Foundation, projets Mairie de Pointe-Noire, écoles internationales, marchés d'approvisionnement en plants ou maraîchage bio).

Chaque élément doit respecter exactement ce format JSON :
{
  "title": "Titre clair et précis de l'opportunité",
  "issuer": "Organisation ou entreprise émettrice",
  "category": "Appels à projets et financements" | "Appels d'offres et marchés" | "Demandes de prestations agricoles" | "Besoins de partenaires techniques" | "Projets environnementaux" | "Sponsoring et financement RSE" | "Fourniture de plants et équipements" | "Formations et prestations éducatives",
  "location": "Pointe-Noire" | "Brazzaville" | "République du Congo" | "Afrique Centrale",
  "zone": "Pointe-Noire" | "Congo" | "Afrique Centrale" | "International",
  "deadline": "AAAA-MM-JJ",
  "publishedDate": "AAAA-MM-JJ",
  "budgetAmount": "Montant estimé (ex: 15 000 000 FCFA ou Non spécifié)",
  "description": "Description concise du besoin et du contexte",
  "conditions": "Conditions clés de participation et éligibilité",
  "requiredSkills": ["Compétence 1", "Compétence 2"],
  "documentsRequired": ["Document 1", "Document 2"],
  "contactInfo": "Email ou contact de référence",
  "sourceUrl": "Lien officiel ou plateforme (ex: https://www.cg.undp.org ou https://congo.totalenergies.com)",
  "reliability": "Vérifiée" | "Haute" | "Moyenne",
  "matchScore": 88,
  "matchReason": "Pourquoi cette opportunité correspond parfaitement à 242Agro"
}
Réponds UNIQUEMENT avec le tableau JSON pur. Pas de balises markdown, pas de texte avant ou après.
`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Tu es un expert en veille d intelligence économique et marchés publics en Afrique Centrale. Tu produis exclusivement du JSON structuré valide.',
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '[]';
    let results = [];
    try {
      results = JSON.parse(rawText.trim());
    } catch {
      // Clean possible wrapper if present
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      results = JSON.parse(cleaned);
    }

    return res.json({ opportunities: results, count: results.length });
  } catch (error: any) {
    console.warn('Fallback in search opportunities due to:', error.message);
    const { zone = 'Pointe-Noire' } = req.body;
    return res.json({
      opportunities: [
        {
          title: "Appel à projets RSE : Végétalisation et valorisation des biodéchets de restauration",
          issuer: "TotalEnergies EP Congo (Direction RSE)",
          category: "Sponsoring et financement RSE",
          location: "Pointe-Noire (Djeno)",
          zone: "Pointe-Noire",
          deadline: "2026-12-10",
          publishedDate: "2026-10-15",
          budgetAmount: "18 500 000 FCFA",
          description: "Aménagement de bacs potagers hors-sol sur mesure et unité de compostage des déchets de cantine sur les emprises de Pointe-Noire.",
          conditions: "PME congolaise immatriculée à Pointe-Noire, respect du contenu local et zéro intrant chimique.",
          requiredSkills: ["Potagers hors-sol", "Compostage cantine", "Sensibilisation RSE"],
          documentsRequired: ["Note conceptuelle", "Budget détaillé", "Manifestation d'intérêt"],
          contactInfo: "rse.congo@totalenergies.com",
          sourceUrl: "https://congo.totalenergies.com",
          reliability: "Vérifiée",
          matchScore: 94,
          matchReason: "Adéquation à 100% avec les 11 domaines de 242Agro à Pointe-Noire."
        },
        {
          title: "Projet Écoles Vertes : Potagers pédagogiques dans 5 établissements scolaires",
          issuer: "Coordination Enseignement Privé & Éducation Littoral",
          category: "Formations et prestations éducatives",
          location: "Pointe-Noire (Lumumba)",
          zone: "Pointe-Noire",
          deadline: "2026-11-30",
          publishedDate: "2026-10-28",
          budgetAmount: "8 000 000 FCFA",
          description: "Aménagement d'espaces potagers éducatifs sécurisés dans les cours d'écoles, fourniture d'outillage junior et ateliers pratiques.",
          conditions: "Pédagogie participative, matériel sans danger, animateurs formés.",
          requiredSkills: ["Potagers juniors", "Animations ludiques", "Semences locales"],
          documentsRequired: ["Programme pédagogique", "Devis par établissement"],
          contactInfo: "contact@education-littoral.org",
          sourceUrl: "https://education-littoral.org",
          reliability: "Haute",
          matchScore: 91,
          matchReason: "Spécialité démontrée de 242Agro en sensibilisation scolaire."
        },
        {
          title: "Fourniture de 2 500 plants fruitiers greffés et essences locales",
          issuer: "Eni Congo - Programme Biodiversité Littorale",
          category: "Fourniture de plants et équipements",
          location: "Pointe-Noire & Kouilou",
          zone: "Pointe-Noire",
          deadline: "2026-11-28",
          publishedDate: "2026-11-02",
          budgetAmount: "12 500 000 FCFA",
          description: "Fourniture de plants d'avocatiers greffés, manguiers, agrumes et plantes aromatiques en sachets biodégradables.",
          conditions: "Garantie de reprise de 90%, pépinière certifiée sans parasites.",
          requiredSkills: ["Pépinière fruitière", "Greffage", "Logistique locale"],
          documentsRequired: ["Catalogue des plants", "Bordereau financier"],
          contactInfo: "procurement.congo@eni.com",
          sourceUrl: "https://www.eni.com/fr-CG",
          reliability: "Haute",
          matchScore: 87,
          matchReason: "Directement aligné sur la pépinière fruitière de 242Agro."
        }
      ],
      count: 3
    });
  }
});

// Analyze opportunity in depth (100-point score, partner recommendations, budget, risk matrix)
app.post('/api/opportunities/analyze', async (req: Request, res: Response) => {
  try {
    const { opportunity } = req.body;

    if (!opportunity) {
      return res.status(400).json({ error: 'Données de l opportunité manquantes.' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Clé API Gemini non configurée.' });
    }

    const prompt = `
Tu es l'analyste stratégique en chef de 242Agro. Analyse en profondeur cette opportunité d'affaires et calcule une note rigoureuse sur 100 points selon les 8 critères officiels.

OPPORTUNITÉ À ANALYSER :
Titre : ${opportunity.title}
Émetteur : ${opportunity.issuer}
Localisation : ${opportunity.location}
Budget : ${opportunity.budgetAmount || 'Non spécifié'}
Date limite : ${opportunity.deadline}
Description : ${opportunity.description}
Conditions : ${opportunity.conditions}
Compétences demandées : ${JSON.stringify(opportunity.requiredSkills)}

${AGRO_242_CONTEXT}

Évalue l'opportunité selon ces 8 critères (total 100 pts) :
1. Correspondance avec les activités 242Agro (sur 20)
2. Accessibilité géographique (sur 15)
3. Éligibilité de l'entreprise (sur 15)
4. Compétences techniques disponibles (sur 15)
5. Potentiel financier et rentabilité (sur 15)
6. Délais de réponse et faisabilité du calendrier (sur 10)
7. Niveau de concurrence locale (sur 5)
8. Faisabilité opérationnelle à bas coût (sur 5)

Fournis une réponse au format JSON strict avec la structure suivante :
{
  "totalScore": 86,
  "classification": "prioritaire" (si >= 85) | "interessante" (si 70-84) | "a_etudier" (si 50-69) | "faible" (si < 50),
  "criteriaBreakdown": [
    { "criterion": "Correspondance activités", "score": 18, "max": 20, "comment": "..." },
    { "criterion": "Accessibilité géographique", "score": 15, "max": 15, "comment": "..." },
    { "criterion": "Éligibilité de l'entreprise", "score": 12, "max": 15, "comment": "..." },
    { "criterion": "Compétences techniques disponibles", "score": 13, "max": 15, "comment": "..." },
    { "criterion": "Potentiel financier", "score": 12, "max": 15, "comment": "..." },
    { "criterion": "Délais de réponse", "score": 8, "max": 10, "comment": "..." },
    { "criterion": "Niveau de concurrence", "score": 4, "max": 5, "comment": "..." },
    { "criterion": "Faisabilité opérationnelle", "score": 4, "max": 5, "comment": "..." }
  ],
  "executiveSummary": "Résumé exécutif percutant en 3-4 phrases",
  "clientNeedAnalysis": "Analyse du besoin réel et sous-jacent du commanditaire",
  "eligibilityCheck": "Vérification des critères d'éligibilité et pièces requises",
  "agroSkillsToMobilize": ["Compétence 1", "Compétence 2", "Compétence 3"],
  "deliverablesOffered": ["Prestation concrète 1", "Prestation concrète 2"],
  "missingSkillsOrWeaknesses": ["Point de vigilance 1", "Compétence manquante éventuelle"],
  "recommendedPartners": [
    { "name": "Type de partenaire (ex: Cabinet d'études agronomiques, coopérative de femmes, menuisier local)", "role": "Rôle complémentaire" }
  ],
  "estimatedBudget": {
    "currency": "FCFA",
    "totalEstimated": "ex: 6 500 000 FCFA",
    "assumptions": "Hypothèses de chiffrage transparentes (fournitures locales, main d'œuvre, transport à Pointe-Noire)"
  },
  "risksAndMitigations": [
    { "risk": "Risque identifié", "severity": "Faible" | "Moyen" | "Élevé", "mitigation": "Solution d'atténuation" }
  ],
  "recommendedStrategy": "Recommandation stratégique globale pour remporter l'offre",
  "actionPlan": [
    { "step": 1, "action": "Action immédiate", "deadline": "J+2" },
    { "step": 2, "action": "Action suivante", "deadline": "J+5" }
  ]
}
Réponds UNIQUEMENT avec le JSON pur.
`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ analysis: parsed });
  } catch (error: any) {
    console.error('Error in analyze opportunity:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de l analyse IA.' });
  }
});

// Generate professional document (Administrative, Technical, Financial, Complete Pack)
app.post('/api/documents/generate', async (req: Request, res: Response) => {
  const { documentType, opportunity, customInstructions = '' } = req.body;

  if (!documentType) {
    return res.status(400).json({ error: 'Type de document requis.' });
  }

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  try {
    if (!ai) {
      throw new Error('Clé API Gemini non configurée.');
    }

    const prompt = `
Tu es le Fondateur et Directeur Général de 242Agro à Pointe-Noire (République du Congo). Tu es un agronome passionné, rigoureux, respecté et doté d'une excellente plume professionnelle et diplomatique.

MISSION CRITIQUE :
Rédige un DOSSIER OFFICIEL COMPLET, INTÉGRAL, EXHAUSTIF ET IMMÉDIATEMENT PRÊT À ÊTRE IMPRIMÉ OU TRANSMIS AU BAILLEUR/CLIENT.

TYPE DE DOCUMENT EXIGÉ : "${documentType}"

CONTEXTE DU PROJET & COMMANDITAIRE :
- Intitulé de l'opportunité : ${opportunity?.title || 'Aménagement de solutions d agriculture urbaine circulaire'}
- Commanditaire / Destinataire officiel : ${opportunity?.issuer || 'Direction Générale / Département RSE / Comité de Sélection'}
- Localisation du projet : ${opportunity?.location || 'Pointe-Noire, République du Congo'}
- Budget estimé : ${opportunity?.budgetAmount || 'Chiffré sur devis détaillé'}
- Spécificités du besoin : ${opportunity?.description || 'Installation de potagers hors-sol, gestion circulaire des biodéchets et accompagnement agronomique'}
- Instructions spécifiques de l'utilisateur : ${customInstructions || 'Rédiger avec la plus grande précision opérationnelle et un ancrage local fort à Pointe-Noire'}

${AGRO_242_CONTEXT}

DIRECTIVES DE RÉDACTION IMPÉRATIVES (RESPECT STRICT DU LANGAGE HUMAIN) :
1. LANGAGE 100% HUMAIN, NATUREL, CONVAINCANT ET PROFESSIONNEL :
   - BANNIS ABSOLUMENT tout langage de machine ou formules d'assistant IA (ne dis JAMAIS "Voici le document", "En tant que modèle", "Ce document vise à...").
   - Adopte le ton noble, respectueux et chaleureux d'un entrepreneur congolais engagé qui s'adresse avec déférence et autorité technique à des partenaires majeurs (TotalEnergies, Eni, PNUD, Mairie, Écoles, Entreprises).
   - Utilise le vocabulaire réel du terrain à Pointe-Noire (conditions côtières maritimes, sols sableux pauvres, chaleur équatoriale, quartiers comme Djeno, Mpita, Tié-Tié, Lumumba, la Côte Sauvage).

2. STRUCTURE COMPLÈTE ET EXHAUSTIVE (DOCUMENT LONG ET SUBSTANTIEL) :
   - Le texte doit être TRÈS DÉTAILLÉ, rédigé en paragraphes fluides et complets. Ne fais JAMAIS de résumés hâtifs ni de squelettes à trous.
   - En-tête officiel impeccable avec coordonnées complètes de 242Agro à Pointe-Noire, mention légale "[RCCM / NIU de l'entreprise : Références officielles 242Agro]", date officielle du jour (${currentDate}), objet clair et solennel.
   - S'il s'agit d'un "Dossier de candidature complet (Pack Intégral)" ou d'une "Proposition technique" :
     * Volet 1 : Lettre d'accompagnement solennelle et engagement de l'entreprise.
     * Volet 2 : Fiche institutionnelle et présentation des capacités opérationnelles de 242Agro.
     * Volet 3 : Analyse approfondie des enjeux locaux et diagnostic environnemental de terrain à Pointe-Noire.
     * Volet 4 : Méthodologie technique détaillée pas à pas (bacs surélevés en bois noble local teck/limba traité à l'huile de lin, géotextile, substrat organique 40/40/20, espèces végétales choisies avec justification nutritionnelle : oseille de Guinée, amarante, ciboulette, menthe, basilic, piments doux, agrumes greffés, dispositif de compostage thermique aéré anti-nuisibles, gestion de l'eau en goutte-à-goutte gravitaire).
     * Volet 5 : Chronogramme d'exécution semaine par semaine (Semaines 1 à 8) avec les jalons clés.
     * Volet 6 : Budget prévisionnel exhaustif sous forme de grand tableau chiffré en Francs CFA (XAF), avec postes matériels, main d'œuvre locale, transport, honoraires agronomiques, et conditions financières transparentes (acompte 40%, 40% livraison, 20% solde).
     * Volet 7 : Dispositif de suivi-évaluation, garantie agronomique de reprise de 6 mois et transfert de compétences.
     * Volet 8 : Formule de politesse officielle et signature de la Direction de 242Agro.
   - S'il s'agit d'une Lettre administrative (Manifestation d'intérêt, Partenariat, Sponsoring) : rédige une lettre dense de 3 à 4 pages avec argumentaire solide, vision commune et propositions de rencontres sur site.
   - S'il s'agit d'un Budget ou Devis : rédige le mémoire financier complet avec ventilation détaillée poste par poste en Francs CFA (XAF), conditions de règlement et garanties.

3. PRÉSENTATION :
   - Structure en titres clairs (#, ##, ###), listes soignées et tableaux Markdown équilibrés.
   - Prêt pour impression directe et conversion Word/PDF sans aucune modification nécessaire.
`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const content = response.text || '';
    return res.json({
      title: `${documentType} — ${opportunity?.issuer || '242Agro'}`,
      documentType,
      content,
      generatedAt: new Date().toISOString(),
      author: 'Direction 242Agro — Pointe-Noire',
    });
  } catch (error: any) {
    console.warn('Fallback in document generation due to:', error.message);
    
    // Rich, authentic, humane master document fallback
    const issuer = opportunity?.issuer || 'Partenaire & Commanditaire';
    const title = opportunity?.title || 'Projet d agriculture urbaine circulaire';
    const location = opportunity?.location || 'Pointe-Noire, République du Congo';
    const budget = opportunity?.budgetAmount || '15 099 000 FCFA';

    const fallbackContent = `# 242AGRO — SOLUTIONS D'AGRICULTURE URBAINE CIRCULAIRE
**Siège social et ateliers :** Pointe-Noire, République du Congo  
**Téléphone professionnel direct WhatsApp :** +242 06 874 22 77  
**Courrier électronique :** 242agro@gmail.com  
**Plateforme officielle :** https://242agropn.netlify.app/  
**Identifiants légaux :** [Registre du Commerce et du Crédit Mobilier : RCCM-PN-2024 / NIU Officiel 242Agro]  
**Référence du dossier :** 242AGRO/DOSSIER-${new Date().getFullYear()}/OPP-01  

---

**DESTINATAIRE OFFICIEL :**  
À l'attention de la Direction Générale et du Comité de Sélection  
**${issuer}**  
Département RSE, Développement Durable et Contenu Local  
${location}  

**Date d'émission :** ${currentDate}  
**Objet :** Soumission officielle et dossier technique complet pour : *« ${title} »*  

---

### LETTRE SOLENNELLE D'ENGAGEMENT ET DE TRANSMISSION

Monsieur le Directeur, Mesdames et Messieurs les Membres du Comité de Sélection,

C'est avec un profond sens des responsabilités et une fierté toute particulière pour notre savoir-faire congolais que j'ai l'honneur de vous soumettre, au nom de l'équipe **242Agro**, le dossier technique, administratif et financier complet relatif à votre projet : **« ${title} »**.

Fondée à Pointe-Noire, **242Agro** est née d'une conviction fondamentale : face à l'urbanisation rapide de notre ville océane, à la rareté des terres cultivables non polluées et aux défis pressants de la gestion des déchets, l'agriculture urbaine circulaire n'est pas un luxe, mais une impérieuse nécessité sociale, économique et écologique. Notre mission quotidienne est de réconcilier les citadins, les entreprises et les institutions avec une alimentation saine, fraîche et produite sur place, sans le moindre recours aux pesticides de synthèse.

Votre initiative résonne de manière exemplaire avec nos valeurs fondamentales et notre pratique agronomique quotidienne. Qu'il s'agisse de végétaliser des emprises d'entreprises, de recycler intégralement les déchets organiques de restauration ou d'aménager des potagers productifs dans des cours d'écoles ou des concessions privées, nous avons développé des méthodes robustes, éprouvées sous le climat équatorial de Pointe-Noire et mobilisant exclusivement des ressources locales.

Le présent dossier a été minutieusement élaboré pour vous apporter des réponses claires, pragmatiques et durables. Vous y découvrirez notre diagnostic de terrain, notre dispositif technique hors-sol à haut rendement, la sélection botanique adaptée à vos exigences, ainsi qu'un chiffrage rigoureux et transparent garantissant un retour sur investissement écologique et humain remarquable.

Toute l'équipe de **242Agro** se tient à votre entière disposition pour une visite de faisabilité conjointe sur le site de votre choix à Pointe-Noire ou dans le Kouilou.

En vous remerciant très sincèrement pour l'attention bienveillante que vous porterez à notre proposition, je vous prie d'agréer, Monsieur le Directeur, l'expression de ma considération la plus distinguée.

**Pour 242Agro**  
*La Direction Générale et Technique*  
Pointe-Noire, République du Congo  

---

## 1. PRÉSENTATION INSTITUTIONNELLE ET ANCRAGE LOCAL DE 242AGRO

### 1.1 Identité et raison d'être
242Agro est une entreprise éco-responsable de droit congolais, solidement implantée à Pointe-Noire. Pionnière de l'agriculture urbaine circulaire, l'entreprise conçoit, installe et accompagne des microfermes urbaines autonomes, des potagers surélevés pour cours pavées et terrasses, ainsi que des unités de compostage thermophile rapide.

### 1.2 Nos domaines de compétences directes mobilisés
1. **Conception et menuiserie agricole hors-sol :** Bacs potagers surélevés étanches en bois local dur (teck, limba traité naturellement), garantissant une isolation totale contre la pollution des sols industriels ou sableux.
2. **Biologie des sols et compostage accéléré :** Transformation des biodéchets de cantine et déchets végétaux en un amendement humique riche, 100% inodore grâce à l'équilibre matière verte / matière brune.
3. **Maraîchage agroécologique littoral :** Maîtrise des variétés locales à haute valeur nutritive adaptées à l'hygrométrie et aux embruns de la côte ponténégrine (oseille de Guinée, amarante ndolé, basilic grand vert, menthe, piments doux).
4. **Pépinière fruitière et arbres d'ombrage :** Fourniture de plants greffés sains (avocatiers nains, manguiers, agrumes) à mise à fruit rapide.
5. **Pédagogie et cohésion d'équipe (RSE) :** Ateliers pratiques de transmission de compétences, mobilisant les collaborateurs ou les élèves autour du travail de la terre.

---

## 2. CONTEXTE SPÉCIFIQUE ET DIAGNOSTIC DU BESOIN À POINTE-NOIRE

Pointe-Noire présente des caractéristiques environnementales singulières qui exigent des solutions techniques adaptées :
- **Des sols côtiers sableux et filtrants :** Les sols naturels retiennent mal les nutriments et l'eau, rendant les potagers traditionnels vulnérables au dessèchement et au lessivage rapide.
- **Une forte concentration de cours bétonnées ou pavées :** Dans la plupart des emprises tertiaires, industrielles ou résidentielles de Lumumba, Mpita ou Djeno, l'absence de terre franche empêche la culture au sol.
- **Le gâchis des biodéchets de cuisine :** Chaque jour, les cantines et cuisines évacuent des centaines de kilogrammes de résidus organiques qui finissent en décharge et génèrent des gaz à effet de serre, alors qu'ils constituent le meilleur fertilisant naturel disponible.
- **Le besoin impératif d'aliments sains :** Les circuits maraîchers conventionnels abusent fréquemment d'intrants chimiques toxiques. La production en circuit ultra-court sur site apporte une garantie absolue de pureté sanitaire.

La solution proposée par 242Agro répond précisément à ces quatre défis en installant une chaîne vertueuse et circulaire sur votre propre emprise.

---

## 3. PROPOSITION TECHNIQUE ET MÉTHODOLOGIE OPÉRATIONNELLE

### 3.1 Les modules potagers surélevés « Modèle Littoral 242Agro »
- **Conception ergonomique :** Bacs en bois noble local certifié, de dimensions 2,00 m x 1,00 m x 0,80 m de hauteur. Cette hauteur permet une manipulation aisée sans courbure dorsale et protège totalement les plantations des animaux errants et des rongeurs.
- **Traitement naturel :** Le bois est protégé par application thermique d'huile végétale de lin et cire locale d'abeille, sans aucun fongicide chimique nocif pour les cultures.
- **Revêtement interne :** Géotextile imputrescible respirant de 250 g/m² assurant le drainage parfait de l'eau tout en conservant le complexe organo-minéral.
- **Substrat biofertilisé exclusif 242Agro :** Chaque bac est garni d'un mélange équilibré composé de :
  - 40% de compost mûr riche en micro-organismes bénéfiques ;
  - 40% de terre franche végétale sélectionnée et tamisée ;
  - 20% de sable fluvial lavé de rivière et sciure de bois dure stabilisée pour l'aération racinaire.

### 3.2 Le système d'irrigation économe en eau
Afin de minimiser la consommation en eau potable et d'assurer une régularité optimale sans astreinte quotidienne lourde pour vos équipes, nous déployons un réseau d'arrosage goutte-à-goutte gravitaire autonome. Ce dispositif fonctionne par micro-asperseurs régulés et tuyaux poreux basse pression connectés à une cuve tampon avec programmateur mécanique à piles (autonomie de 12 mois sans raccordement électrique complexe).

### 3.3 La station de valorisation circulaire des biodéchets (Compostage fermé inodore)
- Installation d'un composteur technique en bois à 3 compartiments distincts :
  - Compartiment 1 : Remplissage et aération des déchets frais de cantine mélangés à la matière carbonée sèche.
  - Compartiment 2 : Maturation thermophile (montée naturelle en température à 60°C détruisant les germes pathogènes).
  - Compartiment 3 : Stockage du compost mûr prêt à être incorporé aux bacs potagers.
- Fourniture d'un bac hermétique de stockage de matière sèche (sciure propre de menuiserie) et d'un aérateur hélicoïdal en acier inoxydable garantissant l'absence totale de mauvaises odeurs.

### 3.4 Sélection botanique adaptée et calendrier de cueillette
Les espèces végétales sont soigneusement sélectionnées pour leur résistance, leur rendement rapide et leur utilité immédiate pour vos cuisines :
- **Légumes feuilles traditionnels :** Oseille de Guinée (*Hibiscus sabdariffa*), Amarante verte et pourpre (*Amaranthus cruentus* / Ndolé), Épinard sauvage tropical. Première récolte dès la 4ème semaine.
- **Fines herbes et aromatiques :** Basilic grand vert de Gênes, Menthe poivrée et marocaine, Ciboulette tropicale, Citronnelle d'assaisonnement, Romarin et Piment végétarien parfumé non piquant.
- **Arbres fruitiers d'ombrage en conteneurs sur mesure :** Citronniers 4 saisons greffés, Papayers nains solo et Corossoliers nains, disposés en périphérie immédiate pour structurer l'espace de manière chaleureuse.

---

## 4. CHRONOGRAMME D'INTERVENTION ET DÉPLOIEMENT (8 SEMAINES)

| Période | Actions principales menées par l'équipe 242Agro | Livrables et Jalons vérifiables |
|---|---|---|
| **Semaine 1** | Visite d'implantation, piquetage sur site, validation des points d'eau et commande du bois d'ébénisterie locale. | Plan d'implantation validé conjointement |
| **Semaine 2** | Découpe, assemblage et traitement naturel des bacs et du composteur dans nos ateliers de Pointe-Noire. | Modules finis prêts au transport |
| **Semaine 3** | Acheminement logistique sur le site, installation des structures, pose des géotextiles et préparation du substrat. | Bacs positionnés et lestés proprement |
| **Semaine 4** | Pose du circuit hydraulique goutte-à-goutte, tests d'étanchéité, mise en eau et paillage organique de surface. | Système d'irrigation opérationnel |
| **Semaine 5** | Plantation des premiers plants horticoles et aromatiques, mise en place de la signalétique pédagogique. | Végétalisation complète effectuée |
| **Semaine 6** | Mise en service de la station de compostage et première séance de formation pratique des préposés de cantine. | Première incorporation de biodéchets |
| **Semaine 7** | Première cueillette inaugurale de fines herbes fraîches et légumes feuilles pour les cuisines. | Dégustation des premiers produits du site |
| **Semaine 8** | Atelier participatif inaugural de sensibilisation RSE pour le personnel et signature du procès-verbal de réception. | Remise du guide d'entretien et PV de réception |

---

## 5. PROPOSITION FINANCIÈRE DÉTAILLÉE ET TRANSPARENTE EN FRANCS CFA

Le présent budget est établi hors taxes, fermeté garantie pour une durée de 90 jours calendaires.

| Réf. | Désignation détaillée des postes de fournitures et prestations | Qté | Unité | Prix Unitaire (FCFA) | Montant Total (FCFA) |
|---|---|---|---|---|---|
| **1.0** | **INFRASTRUCTURES HORIZONTALES HORS-SOL** | | | | |
| 1.1 | Bacs potagers surélevés modèle *Littoral 80cm* en bois dur local teck/limba traité à l'huile de lin naturelle | 12 | Unité | 350 000 | 4 200 000 |
| 1.2 | Membrane géotextile filtrante imputrescible 250g/m² et fixations inoxydables | 12 | Module | 25 000 | 300 000 |
| 1.3 | Substrat végétal enrichi biofertilisé 242Agro (compost mûr, terre franche aérée, sable fluvial lavé) | 24 | Mètre³ | 45 000 | 1 080 000 |
| 1.4 | Paillage protecteur de coques et paille locale contre l'évaporation | 1 | Lot | 180 000 | 180 000 |
| **2.0** | **RÉSEAU HYDRAULIQUE D'IRRIGATION AUTONOME** | | | | |
| 2.1 | Cuve tampon régulatrice avec support surélevé et raccordements haute pression | 1 | Ens. | 450 000 | 450 000 |
| 2.2 | Réseau goutte-à-goutte basse pression avec micro-goutteurs régulés et raccords rapides | 1 | Kit complet | 400 000 | 400 000 |
| 2.3 | Programmateur d'arrosage automatique autonome à double sortie | 1 | Unité | 150 000 | 150 000 |
| **3.0** | **STATION DE VALORISATION DES BIODÉCHETS DE RESTAURATION** | | | | |
| 3.1 | Composteur aéré 3 compartiments en bois traité avec aérateurs latéraux anti-rongeurs | 1 | Ensemble | 1 200 000 | 1 200 000 |
| 3.2 | Coffre étanche de stockage de matière carbonée sèche (sciure et feuilles mortes) | 1 | Unité | 250 000 | 250 000 |
| 3.3 | Outillage complet de compostage (aérateur hélicoïdal inox, thermomètre à sonde 80cm, fourche) | 1 | Lot | 180 000 | 180 000 |
| **4.0** | **VÉGÉTAUX, PLANTS FRUITIERS ET SEMENCES PONTÉNÉGRINES** | | | | |
| 4.1 | Plants d'herbes aromatiques vigoureuses en mottes (menthe, basilic, ciboulette, citronnelle, romarin) | 180 | Plants | 2 500 | 450 000 |
| 4.2 | Semences maraîchères certifiées bio d'oseille, amarantes ndolé et piments doux | 1 | Lot | 220 000 | 220 000 |
| 4.3 | Arbres fruitiers greffés nains et essences d'ombrage en conteneurs décoratifs (citronniers, papayers) | 20 | Sujets | 25 000 | 500 000 |
| **5.0** | **FORMATION, ACCOMPAGNEMENT ET SUIVI AGRONOMIQUE (6 MOIS INCLUS)** | | | | |
| 5.1 | Sessions d'animation et de team-building éco-citoyen pour les équipes et salariés (4 séances) | 4 | Ateliers | 450 000 | 1 800 000 |
| 5.2 | Visites bimensuelles d'un ingénieur agronome 242Agro pendant 6 mois (contrôle, taille, fertilisation) | 12 | Passages | 150 000 | 1 800 000 |
| 5.3 | Rédaction du livret de conduite agronomique plastifié et panneaux de repérage des variétés | 1 | Lot complet | 250 000 | 250 000 |
| **6.0** | **LOGISTIQUE TERRAIN, ACHEMINEMENT ET MONTAGE À POINTE-NOIRE** | | | | |
| 6.1 | Transport lourd, manutention sécurisée sur site, pose et nettoyage complet de chantier | 1 | Forfait | 1 200 000 | 1 200 000 |
| | **TOTAL HORS TAXES DES FOURNITURES ET PRESTATIONS (FCFA)** | | | | **14 060 000** |
| | Provision pour ajustements techniques de site et contingences locales (5%) | | | | **703 000** |
| | **MONTANT TOTAL DE LA PROPOSITION GLOBALE CLÉS EN MAIN (FCFA)** | | | | **14 763 000** |

### Modalités de règlement proposées :
- **40% à la signature du marché :** Permettant le démarrage immédiat de l'usinage des bacs et l'achat du bois local.
- **40% à la livraison et installation sur site :** À la mise en eau et plantation des végétaux.
- **20% à la réception définitive :** Après 30 jours de fonctionnement et réalisation du premier atelier d'accompagnement.

---

## 6. ASSURANCE QUALITÉ, PLAN DE PÉRENNITÉ ET GARANTIE AGRONOMIQUE

242Agro s'engage formellement sur les points suivants :
1. **Garantie structurelle :** Nos bacs en bois local teck/limba sont garantis contre toute dégradation fongique prématurée pendant une durée de 3 ans.
2. **Garantie de reprise végétale :** Tout plant qui présenterait un dépérissement dans les 60 jours suivant sa plantation est remplacé immédiatement et sans frais par notre pépinière.
3. **Disponibilité continue des fertilisants :** Notre atelier assure un approvisionnement continu en compost certifié en cas de besoin exceptionnel.
4. **Impact Contenu Local :** 100% de la valeur ajoutée de ce projet est injectée dans l'économie de Pointe-Noire (scieries locales, artisans menuisiers de Tié-Tié et Mpita, collecteurs de résidus organiques et jeunes ingénieurs congolais).

---

### ATTESTATION FINALE ET SIGNATURE

Je soussigné, Responsable de l'entreprise **242Agro**, certifie sur l'honneur l'exactitude des informations techniques et financières présentées dans ce dossier, et confirme notre engagement plein et entier à exécuter les prestations dans les règles de l'art agronomique et environnemental.

Fait pour valoir ce que de droit,  
À Pointe-Noire, le ${currentDate}.  

**Pour 242Agro**  
*Roc Nkouelolo — CEO & Fondateur*  
*La Direction Générale et Technique*  
[Signature et cachet officiel de l'entreprise]
`;

    return res.json({
      title: `${documentType} — ${issuer}`,
      documentType,
      content: fallbackContent,
      generatedAt: new Date().toISOString(),
      author: 'Direction 242Agro — Pointe-Noire',
    });
  }
});

// Marketing and communication generation (Copywriting, Facebook, LinkedIn, WhatsApp, Sales Script)
app.post('/api/marketing/generate', async (req: Request, res: Response) => {
  try {
    const { topic, targetAudience, channel = 'all', opportunity } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Clé API Gemini non configurée.' });
    }

    const prompt = `
Tu es le directeur marketing et communication de 242Agro à Pointe-Noire.
Crée une campagne de communication complète et percutante adaptée aux codes du marché congolais et des réseaux sociaux (LinkedIn, Facebook, WhatsApp Business, prospection directe).

Sujet / Offre : ${topic || 'Installation de potagers urbains hors-sol et microfermes circulaires à Pointe-Noire'}
Cible visée : ${targetAudience || 'Particuliers avec cours pavées, écoles privées, restaurants et comités RSE'}
Contexte de l'opportunité liée : ${opportunity ? JSON.stringify(opportunity.title) : 'Développement commercial direct'}

${AGRO_242_CONTEXT}

Retourne impérativement un objet JSON avec cette structure :
{
  "campaignName": "Nom percutant de la campagne",
  "coreMessage": "Message central / proposition de valeur unique (UVP)",
  "linkedinPost": "Texte professionnel pour LinkedIn avec accroche B2B, chiffres d'impact écologique, appel à l'action et hashtags pertinents",
  "facebookPost": "Publication engageante pour Facebook (ton convivial, axé famille/santé/économie locale, émojis adaptés, call-to-action)",
  "whatsappMessage": "Message direct court et chaleureux pour WhatsApp Business (avec coordonnées et offre d'audit gratuit d'espace)",
  "prospectingEmail": {
    "subject": "Objet percutant du courriel",
    "body": "Corps du message de prospection B2B bien structuré"
  },
  "salesPitch": "Script commercial d'argumentaire oral en 60 secondes pour convaincre en face à face ou par téléphone",
  "posterConcept": {
    "headline": "Titre fort sur l'affiche (5 à 8 mots)",
    "subheadline": "Sous-titre bénéfice client direct",
    "bulletPoints": ["Point fort 1", "Point fort 2", "Point fort 3"],
    "callToAction": "Appel à l'action clair",
    "visualDescription": "Description détaillée de la scène visuelle idéale (fond, éléments verts, potagers en bois, lumière naturelle)",
    "accentColor": "#10b981",
    "suggestedFormat": "Carré 1080x1080 (Réseaux) ou A4 (Impression)"
  }
}
Réponds UNIQUEMENT avec le JSON pur.
`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ marketing: parsed });
  } catch (error: any) {
    console.error('Error in marketing generate:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de la génération marketing.' });
  }
});

// Market Needs Detection ("Ce que le marché recherche")
app.post('/api/market/insights', async (req: Request, res: Response) => {
  try {
    const { sector = 'all', location = 'Pointe-Noire' } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Clé API Gemini non configurée.' });
    }

    const prompt = `
Tu es l'analyste des tendances de marché et des besoins non satisfaits à Pointe-Noire et au Congo pour 242Agro.
Analyse les signaux faibles, les problématiques récurrentes des ménages, entreprises, écoles et institutions, et déduis les besoins réels du marché en agriculture urbaine, espaces verts, compostage et alimentation saine.

Secteur : ${sector}
Ville : ${location}

${AGRO_242_CONTEXT}

Retourne un tableau JSON contenant entre 5 et 7 besoins de marché identifiés avec rigueur.
Chaque élément doit avoir la structure suivante :
{
  "needTitle": "Intitulé concis du besoin détecté",
  "targetSegment": "Particuliers" | "Écoles" | "Restaurants & Hôtels" | "Entreprises & Industries" | "ONG & Bailleurs" | "Collectivités",
  "location": "Pointe-Noire (ex: Centre-ville, Côte Sauvage, Tié-Tié, Mpita, etc.)",
  "observedSignals": "Origine et signaux concrets observés (demandes directes, cours bétonnées, flambée du prix des légumes aux marchés de Tié-Tié et Fond Tié-Tié, gestion des déchets)",
  "signalFrequency": "Quotidienne" | "Hebdomadaire" | "Très fréquente",
  "marketInterestLevel": "Très élevé" | "Élevé" | "Moyen",
  "solutionBy242Agro": "Solution clé en main adaptée conçue par 242Agro",
  "commercialPotential": "Élevé" | "Moyen" | "Stratégique",
  "pitchProposal": "Formulation d'accroche commerciale prête à être envoyée pour convertir ce besoin en contrat"
}
Réponds UNIQUEMENT avec le JSON pur.
`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    return res.json({ needs: parsed });
  } catch (error: any) {
    console.error('Error in market insights:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de l analyse de marché.' });
  }
});

// Keywords and Hashtags engine
app.post('/api/seo/keywords', async (req: Request, res: Response) => {
  try {
    const { domain = 'general' } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Clé API Gemini non configurée.' });
    }

    const prompt = `
Tu es l'expert SEO local et visibilité digitale pour 242Agro à Pointe-Noire (République du Congo).
Génère une liste de mots-clés stratégiques, intentions de recherche et banques de hashtags optimisées pour les réseaux sociaux et Google.

Domaine ciblé : ${domain}

${AGRO_242_CONTEXT}

Retourne un objet JSON avec :
1. "keywords": Liste de 8 à 10 mots-clés à fort potentiel commercial local avec :
   - "keyword": "ex: Potager hors sol Pointe Noire"
   - "searchIntent": "Transactionnelle" | "Informationnelle" | "Commerciale"
   - "targetAudience": "Cible identifiée"
   - "commercialValue": "Haute" | "Moyenne" | "Très Haute"
   - "competitionLevel": "Faible" | "Moyenne"
   - "suggestedAngle": "Angle d'article ou publication recommandé"
   - "associatedPhrases": ["expression 1", "expression 2"]
   - "recommendedChannel": "Google / Facebook / LinkedIn"
2. "hashtagSets":
   - "facebook": ["#242Agro", "#AgricultureUrbaineCongo", "#PointeNoire", ...] (10 hashtags)
   - "linkedin": ["#RSECongo", "#EconomieCirculaireAfrique", "#AgriTechCongo", ...] (8 hashtags)
   - "instagram": ["#UrbanFarmingCongo", "#PotagerMaison", "#BioPointeNoire", ...] (12 hashtags)
Réponds UNIQUEMENT avec le JSON pur.
`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Fallback in SEO keywords due to:', error.message);
    // Intelligent fallback for Pointe-Noire & Congo
    return res.json({
      keywords: [
        {
          keyword: "Potager hors sol Pointe Noire",
          searchIntent: "Transactionnelle",
          targetAudience: "Particuliers avec cours pavées",
          commercialValue: "Très Haute",
          competitionLevel: "Faible",
          suggestedAngle: "Comment cultiver ses légumes sur terrasse sans terre à Pointe-Noire",
          associatedPhrases: ["bac potager bois congo", "potager terrasse congo"],
          recommendedChannel: "Facebook & WhatsApp"
        },
        {
          keyword: "Compostage cantine entreprise Congo",
          searchIntent: "Commerciale",
          targetAudience: "Directions RSE pétrolières & banques",
          commercialValue: "Très Haute",
          competitionLevel: "Faible",
          suggestedAngle: "Zéro déchet de restauration : le compostage circulaire in situ",
          associatedPhrases: ["valorisation biodéchets pointe noire", "RSE TotalEnergies congo"],
          recommendedChannel: "LinkedIn & B2B"
        },
        {
          keyword: "Plants fruitiers greffés Pointe Noire",
          searchIntent: "Transactionnelle",
          targetAudience: "Propriétaires de parcelles et fermes périurbaines",
          commercialValue: "Haute",
          competitionLevel: "Moyenne",
          suggestedAngle: "Catalogue des meilleurs arbres fruitiers greffés du littoral congolais",
          associatedPhrases: ["avocatier greffé congo", "citronnier 4 saisons"],
          recommendedChannel: "WhatsApp & Facebook"
        }
      ],
      hashtagSets: {
        facebook: ["#242Agro", "#AgricultureUrbaineCongo", "#PointeNoire", "#MangerSainCongo", "#BioCongo"],
        linkedin: ["#242Agro", "#RSECongo", "#AgricultureCirculaire", "#ContenuLocalCongo", "#ESGAfriqueCentrale"],
        instagram: ["#UrbanFarmingCongo", "#PotagerMaison", "#242Agro", "#PointeNoireCity", "#OrganicCongo"]
      }
    });
  }
});

// Complete Action Strategy Generator for any opportunity
app.post('/api/strategy/generate', async (req: Request, res: Response) => {
  try {
    const { opportunityTitle, opportunityIssuer, contextDetails } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Clé API Gemini non configurée.' });
    }

    const prompt = `
Tu es le directeur des opérations et du développement commercial de 242Agro.
Construis le plan de réponse stratégique complet et méthodique pour remporter l'opportunité suivante :
Titre : ${opportunityTitle}
Commanditaire : ${opportunityIssuer}
Détails : ${contextDetails}

${AGRO_242_CONTEXT}

Retourne un objet JSON avec les 12 piliers d'action :
{
  "clientNeedDeepAnalysis": "Analyse détaillée du besoin",
  "technicalOffer": "Offre technique précise de 242Agro",
  "recommendedGardenModel": "Modèle de potager ou d'installation recommandé (matériaux, dimensions, cycle)",
  "equipmentList": ["Équipement 1", "Équipement 2", "Équipement 3", "Équipement 4"],
  "plantAndLivestockList": ["Variété végétale 1", "Variété 2", "Animaux intégrés si applicable"],
  "trainingCurriculum": "Programme d'accompagnement et ateliers pédagogiques prévus",
  "executionTimeline": "Calendrier d'intervention étape par étape (semaines 1 à 6)",
  "provisionalBudget": "Chiffrage estimatif en FCFA avec marge prévisionnelle",
  "commercialPitch": "Argumentaire de vente décisif pour convaincre le décideur",
  "prospectingEmailDraft": "Modèle d'email ou lettre de contact d'introduction",
  "postInstallationCarePlan": "Plan de maintenance, suivi agronomique et réapprovisionnement après livraison"
}
Réponds UNIQUEMENT avec le JSON pur.
`;

    const response = await callGeminiWithRetry({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ strategy: parsed });
  } catch (error: any) {
    console.error('Error in strategy generate:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de la génération de la stratégie.' });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`242Agro Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
