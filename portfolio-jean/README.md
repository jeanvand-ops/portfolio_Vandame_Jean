# Portfolio Jean Vandame

## Comment mettre en ligne (GitHub, sans rien installer)
1. Dézippe le dossier.
2. Sur GitHub, ouvre ton dépôt > **Add file > Upload files**.
3. Glisse **le contenu** du dossier (index.html, projets.html, et les dossiers css, js, img, logo, projets, video), pas le dossier parent. Chrome garde les sous-dossiers.
4. **Commit changes**. Le site se met à jour en 1 à 2 minutes.
(Les anciens fichiers à la racine, comme meduse.jpg, ne servent plus : tu peux les supprimer avec l'icône corbeille.)

## Où est quoi
- `index.html` : accueil. `projets.html` : écran « Choisis ton projet ».
- `projets/` : une page par projet (ne pas modifier, tout vient de `js/projets-data.js`).
- `js/projets-data.js` : **tous les textes, couleurs et jauges des projets**. C'est le seul fichier à modifier pour changer un titre, une description, etc.
- `js/interactions.js` : les petits jeux de chaque page.
- `css/` : le style. `logo/` : les logos. `img/visuels/` : les images. `img/persos/` : les personnages.

## Ajouter tes GIF de personnages
Nomme-les `perso-ID.gif` (1:1) et mets-les dans `img/persos/`. Exemple : `perso-meduse.gif`. Ils s'animent au survol sur l'écran de sélection, et tournent sur la page du projet.

## Ajouter la vidéo de Méduse
Dépose `meduse.mp4` dans `video/` (25 Mo max par l'envoi web de GitHub). Sinon, mets-la sur YouTube/Vimeo et dis-le-moi.

## Ajouter un projet
Copie un bloc dans `js/projets-data.js`, change l'`id`, ajoute `img/visuels/img-ID.jpg` et `img/persos/perso-ID.jpg`, puis duplique un fichier de `projets/` en changeant `data-projet="ID"` et le titre.
