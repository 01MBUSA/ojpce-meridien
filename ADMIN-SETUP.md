# Administration OJPCE/MERIDIEN

L’administration Decap CMS est accessible depuis :

`https://ojpce-meridien.org/admin/`

Le bouton « Administration » a été retiré du site public. Cette adresse est volontairement non liée dans les pages publiques.

## Hébergement prévu

Le site public et la page `/admin/` sont destinés à être publiés par GitHub Pages.

L’authentification Decap avec le backend GitHub nécessite un petit serveur OAuth côté serveur. Pour ne plus dépendre de Netlify, nous utiliserons un Cloudflare Worker gratuit comme proxy OAuth. Decap documente cette architecture et fournit un exemple de configuration pour un proxy OAuth externe.

### Configuration finale du backend

Une fois le Worker Cloudflare créé, `admin/config.yml` devra contenir notamment :

```yaml
backend:
  name: github
  repo: 01MBUSA/ojpce-meridien
  branch: main
  base_url: "https://ADRESSE-DU-WORKER"
  auth_endpoint: "/auth"
  site_domain: "ojpce-meridien.org"
```

**Ne remplacez pas encore la configuration actuelle par cet exemple** tant que l’adresse du Worker n’a pas été créée et testée.

## Documents PDF

La collection « Documents PDF » est déjà configurée dans `admin/config.yml` et utilise `content/documents.json`.
