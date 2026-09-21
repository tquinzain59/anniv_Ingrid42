#  Ingrid 42.0 — Keynote Landing Page

> *"Voici Ingrid 42.0. Notre meilleure Ingrid à ce jour. Encore plus Ingrid."*

Landing page événementielle parodiant fidèlement les présentations de sortie d'iPhone d'Apple pour fêter les **42 ans d'Ingrid** le 24 septembre, et annoncer le lancement officiel au **Giallo à Sainghin-en-Mélantois** le **vendredi 25 septembre à 19h30**.

---

## ✨ Fonctionnalités

- **Design System Apple Pro (Dark Mode / Titanium) :**
  - Typographie SF Pro, header en verre dépoli translucide (`backdrop-filter`).
  - Effets dégradés titane, bento grid de présentation des innovations.
- **Vidéo en boucle avec filtre sombre :**
  - Lecture vidéo d'ambiance plein écran en continu.
  - Filtre sombre cinématique et vignetage pour garantir la parfaite lisibilité des textes.
  - Outil intégré en bas de page pour glisser-déposer / importer instantanément vos propres vidéos ou les placer dans `assets/videos/background.mp4`.
  - Fallback visuel animé élégant en canvas si aucune vidéo n'est fournie.
- **Les 4 points phares du SMS Keynote :**
  - ⚡ **Autonomie en soirée :** jusqu'à 6h sans faiblir, jauge interactive avec gestion thermique au Spritz.
  - 🔊 **Nouveau module sonore :** rots en rafale, cadence x2, qualité audio inchangée + bouton de test sonore interactif avec oscillateurs Web Audio.
  - 🧠 **Nouvelle Puce S (comme Spontanée) :** processeur gravé, sorties imprévisibles, insultes activées par défaut.
  - ⚠️ **Bug connu non corrigé :** rapport officiel Apple sur le « Je ne bois qu'un seul verre » (statut Won't Fix).
- **Tableau comparatif Apple :**
  - Ingrid 40.0 vs Ingrid 41.0 vs Ingrid 42.0.
- **Lieu & Compte à rebours :**
  - Compteur dynamique jusqu'au vendredi 25/09 à 19h30.
  - Liens d'itinéraires directs vers Le Giallo (Sainghin).
- **Système de Réservation interactif (Apple Store Checkout) :**
  - Modal de réservation avec choix du nombre de personnes, boisson de charge et petit mot.
  - Génération automatique de confirmation par **WhatsApp** ou **SMS** en 1 clic.
  - Téléchargement du pass au format calendrier `.ics` (Apple Calendar, Google Agenda).
  - Pluie de confettis festifs Apple.
- **Mentions légales Apple humoristiques :**
  - Notes de bas de page parodiant le style juridique de Cupertino.

---

## 🚀 Utilisation locale

Pour visualiser la page en local :

1. **Option 1 (Direct) :** Double-cliquez simplement sur `index.html` pour l'ouvrir dans Safari ou Chrome.
2. **Option 2 (Serveur local) :**
   ```bash
   python3 -m http.server 8080
   ```
   Puis ouvrez `http://localhost:8080` dans votre navigateur.

---

## 📹 Ajouter vos vidéos d'Ingrid

Deux possibilités très simples :
1. **Directement sur le site :** Cliquez sur le bouton en bas à gauche **« 📁 Importer vos vidéos »** ou glissez-déposez n'importe quelle vidéo (.mp4 ou .mov) sur la page.
2. **Dans le projet :** Placez votre fichier vidéo dans le dossier `assets/videos/` sous le nom `background.mp4`.

---

## 🌐 Déploiement GitHub Pages

Pour rendre le site accessible en ligne à vos invités via le dépôt GitHub :
1. Activez **GitHub Pages** dans les réglages de votre repo (`Settings` > `Pages` > Source: `main` branch `/ (root)`).
2. Partagez le lien avec vos amis !
