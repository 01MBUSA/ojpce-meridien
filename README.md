# OJPCE/MERIDIEN — site web

Version préparée pour GitHub Pages et le domaine `ojpce-meridien.org`.

## Publication
- Déposer le contenu de ce dossier à la racine du dépôt GitHub.
- Dans Settings → Pages, choisir la branche de publication.
- Configurer le domaine personnalisé `ojpce-meridien.org`.
- Conserver le fichier `CNAME` à la racine si la publication se fait depuis une branche.
- Activer **Enforce HTTPS** après émission du certificat.

## Formulaires
Le formulaire de contact et la newsletter utilisent FormSubmit pour transmettre les demandes à `ojpcemeridien@gmail.com`. La première utilisation peut nécessiter une confirmation du service.

## Sécurité
L’administration du site utilise Decap CMS dans `/admin/`. Le bouton d’administration est volontairement masqué du site public. L’authentification sera assurée par GitHub via un proxy OAuth Cloudflare, sans dépendre de Netlify pour l’hébergement du site.
