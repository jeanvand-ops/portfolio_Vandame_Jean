/* =====================================================================
   TES PROJETS — un seul endroit pour tout modifier.
   Chaque bloc { ... } est un projet. L'ordre ici = l'ordre sur tout le site.
   - nom, role, format, desc : les textes
   - couleur : fond derrière le personnage
   - theme   : couleurs de la page du projet
   - visuel  : image du projet (dossier img/visuels)
   - perso   : personnage SANS extension. Le site cherche .jpg (fixe) puis .gif (animé)
   - video   : (facultatif) fichier dans le dossier video/ ; ou "embed" : lien YouTube/Vimeo
   - palette : 4 couleurs affichées sur la page (clic = copie du code)
   - stats   : jauges de 0 à 10
   - interaction : le petit jeu de la page (type + textes)
   ===================================================================== */
const PROJETS = [
  {
    "id": "meduse",
    "nom": "Méduse",
    "role": "Animation · Direction artistique",
    "format": "16:9 · vidéo de 1 min 20",
    "desc": "Persée tranche la tête de Méduse. Deux couleurs, du grain, 1 min 20 d'animation.",
    "couleur": "#ff0a14",
    "theme": {
      "fond": "#000000",
      "texte": "#f2efea",
      "titre": "#ff0a14",
      "accent": "#ff0a14",
      "accentTexte": "#000000"
    },
    "visuel": "img/visuels/img-meduse.jpg",
    "perso": "img/persos/perso-meduse",
    "video": "video/meduse.mp4",
    "palette": [
      "#ff0a14",
      "#b0000a",
      "#000000",
      "#f2efea"
    ],
    "stats": {
      "Grain": 9,
      "Tension": 9,
      "Couleur": 3
    },
    "interaction": {
      "type": "spotlight",
      "titre": "Éclaire Méduse",
      "aide": "Déplace la souris, ou glisse le doigt, pour éclairer l'image dans le noir."
    }
  },
  {
    "id": "monsieur",
    "nom": "Monsieur",
    "role": "Illustration",
    "format": "Vertical · 9:16",
    "desc": "Une silhouette, trois couleurs, des angles vifs. Il pleure, et on ne sait pas pourquoi.",
    "couleur": "#b3001b",
    "theme": {
      "fond": "#b3001b",
      "texte": "#f2efea",
      "titre": "#f2efea",
      "accent": "#000000",
      "accentTexte": "#f2efea"
    },
    "visuel": "img/visuels/img-monsieur.jpg",
    "perso": "img/persos/perso-monsieur",
    "palette": [
      "#ff0000",
      "#aa0718",
      "#000000",
      "#ffffff"
    ],
    "stats": {
      "Grain": 4,
      "Tension": 8,
      "Couleur": 4
    },
    "interaction": {
      "type": "hue",
      "titre": "De quelle couleur ?",
      "aide": "Choisis une teinte : tout le visuel change, sauf le noir et le blanc.",
      "phrase": "Monsieur pleure en"
    }
  },
  {
    "id": "play4life",
    "nom": "Play 4 Life",
    "role": "Motion design · TF1",
    "format": "Vidéo",
    "desc": "Direction artistique et motion design pour TF1.",
    "couleur": "#ffe79a",
    "theme": {
      "fond": "#ffe79a",
      "texte": "#000000",
      "titre": "#ff0a14",
      "accent": "#ff0a14",
      "accentTexte": "#000000"
    },
    "visuel": null,
    "perso": null,
    "palette": [
      "#ffe79a",
      "#ff0a14",
      "#000000",
      "#f2efea"
    ],
    "stats": {
      "Grain": 5,
      "Tension": 6,
      "Couleur": 8
    },
    "interaction": {
      "type": "synth",
      "titre": "Joue du Play 4 Life",
      "aide": "Clique sur les pads, ou utilise les touches Q S D F G H de ton clavier."
    }
  },
  {
    "id": "carton-tv",
    "nom": "Carton TV",
    "role": "Illustration",
    "format": "Portrait · 4:5",
    "desc": "Un vieux monsieur, sa télé, ses écrans. Tout en carton découpé.",
    "couleur": "#8a1c14",
    "theme": {
      "fond": "#7a1a12",
      "texte": "#f6e7d0",
      "titre": "#ffcf8a",
      "accent": "#ff9a3c",
      "accentTexte": "#000000"
    },
    "visuel": "img/visuels/img-carton-tv.jpg",
    "perso": "img/persos/perso-carton-tv",
    "palette": [
      "#7d2114",
      "#f08a2b",
      "#f2e1c6",
      "#2b2b2b"
    ],
    "stats": {
      "Grain": 6,
      "Tension": 3,
      "Couleur": 7
    },
    "interaction": {
      "type": "zap",
      "titre": "Zappe",
      "aide": "Change de chaîne avec les boutons, ou avec les flèches du clavier.",
      "canaux": [
        "carton-tv",
        "carton-foot",
        "qualbo",
        "toid",
        "uma"
      ]
    }
  },
  {
    "id": "carton-foot",
    "nom": "Carton Foot",
    "role": "Illustration",
    "format": "Portrait · 4:5",
    "desc": "France 1987, le penalty. Le même univers carton, côté terrain.",
    "couleur": "#1d6b2f",
    "theme": {
      "fond": "#14532d",
      "texte": "#f2efea",
      "titre": "#ffe79a",
      "accent": "#ffe79a",
      "accentTexte": "#000000"
    },
    "visuel": "img/visuels/img-carton-foot.jpg",
    "perso": "img/persos/perso-carton-foot",
    "palette": [
      "#105524",
      "#7d2114",
      "#f2efea",
      "#0b3f8f"
    ],
    "stats": {
      "Grain": 6,
      "Tension": 6,
      "Couleur": 8
    },
    "interaction": {
      "type": "loupe",
      "titre": "Regarde de près",
      "aide": "Passe la loupe sur l'image : on voit les rainures du carton."
    }
  },
  {
    "id": "toid",
    "nom": "TOID",
    "role": "Affiche · Illustration",
    "format": "Vertical · 9:16",
    "desc": "Une silhouette en manteau rouge, une typo géante qui écrase le décor.",
    "couleur": "#ff3b3b",
    "theme": {
      "fond": "#ff2d2d",
      "texte": "#000000",
      "titre": "#000000",
      "accent": "#000000",
      "accentTexte": "#f2efea"
    },
    "visuel": "img/visuels/img-toid.jpg",
    "perso": "img/persos/perso-toid",
    "palette": [
      "#ff2d2d",
      "#000000",
      "#ff9798",
      "#e6e6e6"
    ],
    "stats": {
      "Grain": 7,
      "Tension": 8,
      "Couleur": 4
    },
    "interaction": {
      "type": "affiche",
      "titre": "Fabrique ton affiche",
      "aide": "Écris un mot, choisis les couleurs : la typo s'étire et déborde, comme sur TOID.",
      "mot": "TOID"
    }
  },
  {
    "id": "qualbo",
    "nom": "Qualbo",
    "role": "Affiche · RATP",
    "format": "Vertical · 9:16",
    "desc": "Les 30 ans des Musiciens du Métro. Des instruments qui débordent de partout.",
    "couleur": "#2bbfa0",
    "theme": {
      "fond": "#141414",
      "texte": "#f2efea",
      "titre": "#2bbfa0",
      "accent": "#2bbfa0",
      "accentTexte": "#000000"
    },
    "visuel": "img/visuels/img-qualbo.jpg",
    "perso": "img/persos/perso-qualbo",
    "palette": [
      "#ff4a00",
      "#2bbfa0",
      "#ffb000",
      "#ff3dd6"
    ],
    "stats": {
      "Grain": 8,
      "Tension": 4,
      "Couleur": 10
    },
    "interaction": {
      "type": "stamp",
      "titre": "Décore l'affiche",
      "aide": "Clique ou glisse sur l'affiche pour semer des étoiles et des gribouillis."
    }
  },
  {
    "id": "uma",
    "nom": "UMÀ",
    "role": "Affiche DOOH",
    "format": "Vertical · 9:16",
    "desc": "Heureux mais jamais lourd. Une campagne rouge et rose pour une boisson sans alcool.",
    "couleur": "#c10010",
    "theme": {
      "fond": "#c10010",
      "texte": "#ffe9e9",
      "titre": "#ff9a9a",
      "accent": "#ff9a9a",
      "accentTexte": "#c10010"
    },
    "visuel": "img/visuels/img-uma.jpg",
    "perso": "img/persos/perso-uma",
    "palette": [
      "#c20000",
      "#ff9a9a",
      "#e34e42",
      "#620c06"
    ],
    "stats": {
      "Grain": 3,
      "Tension": 5,
      "Couleur": 5
    },
    "interaction": {
      "type": "billboard",
      "titre": "Sur le panneau",
      "aide": "Vois l'affiche en vrai : de jour, de nuit, et en rotation avec d'autres campagnes.",
      "programme": [
        "uma",
        "qualbo",
        "toid"
      ]
    }
  },
  {
    "id": "aquarium",
    "nom": "Aquarium",
    "role": "Print",
    "format": "Ticket · 1,9:1",
    "desc": "Un faux ticket d'entrée, détourné pour Sea Shepherd. Tout ici est temporaire.",
    "couleur": "#2340ff",
    "theme": {
      "fond": "#101a6b",
      "texte": "#f2efea",
      "titre": "#f2efea",
      "accent": "#f2efea",
      "accentTexte": "#101a6b"
    },
    "visuel": "img/visuels/img-aquarium.jpg",
    "perso": "img/persos/perso-aquarium",
    "palette": [
      "#f2efea",
      "#2d3bff",
      "#000000",
      "#b4b4bb"
    ],
    "stats": {
      "Grain": 8,
      "Tension": 7,
      "Couleur": 2
    },
    "interaction": {
      "type": "erase",
      "titre": "Efface le ticket",
      "aide": "Frotte le ticket avec la souris ou le doigt. Tout ici est temporaire."
    }
  },
  {
    "id": "qonto",
    "nom": "Qonto",
    "role": "Motion design · Titrage",
    "format": "Cinéma · 2,6:1",
    "desc": "L'heure de la relève : titrage d'une série vidéo pour Qonto.",
    "couleur": "#ffe79a",
    "theme": {
      "fond": "#0d0d0d",
      "texte": "#f2efea",
      "titre": "#ffe79a",
      "accent": "#ffe79a",
      "accentTexte": "#000000"
    },
    "visuel": "img/visuels/img-qonto.jpg",
    "perso": "img/persos/perso-qonto",
    "palette": [
      "#ffe79a",
      "#f2efea",
      "#5b5345",
      "#262312"
    ],
    "stats": {
      "Grain": 5,
      "Tension": 4,
      "Couleur": 5
    },
    "interaction": {
      "type": "guides",
      "titre": "Les zones de sécurité",
      "aide": "Affiche les repères de titrage : ce qui reste visible sur tous les écrans de télé."
    }
  },
  {
    "id": "bose",
    "nom": "Bose",
    "role": "3D · Blender",
    "format": "16:9",
    "desc": "Un casque, une lumière, un fond bleu nuit. Rendu produit en 3D.",
    "couleur": "#1b2a55",
    "theme": {
      "fond": "#0a1330",
      "texte": "#e8eeff",
      "titre": "#9fc0ff",
      "accent": "#9fc0ff",
      "accentTexte": "#000000"
    },
    "visuel": "img/visuels/img-bose.jpg",
    "perso": "img/persos/perso-bose",
    "palette": [
      "#0a1330",
      "#202b45",
      "#030918",
      "#9fc0ff"
    ],
    "stats": {
      "Grain": 2,
      "Tension": 3,
      "Couleur": 3
    },
    "interaction": {
      "type": "tilt",
      "titre": "Fais-le tourner",
      "aide": "Bouge la souris sur le casque pour l'incliner et jouer avec la lumière."
    }
  },
  {
    "id": "scrap",
    "nom": "SCRAP",
    "role": "Identité visuelle",
    "format": "Vertical · 9:16",
    "desc": "Un mot, un point rouge, une grille. L'identité la plus simple possible.",
    "couleur": "#f2efea",
    "theme": {
      "fond": "#f0f0ee",
      "texte": "#000000",
      "titre": "#000000",
      "accent": "#ff0a14",
      "accentTexte": "#000000"
    },
    "visuel": "img/visuels/img-scrap.jpg",
    "perso": "img/persos/perso-scrap",
    "palette": [
      "#f0f0ee",
      "#000000",
      "#ff0a14",
      "#9a9a9a"
    ],
    "stats": {
      "Grain": 1,
      "Tension": 3,
      "Couleur": 1
    },
    "interaction": {
      "type": "dots",
      "titre": "Joue avec la grille",
      "aide": "Passe la souris sur la grille, clique pour lancer une onde."
    }
  }
];
