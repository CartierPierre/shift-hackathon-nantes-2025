# News Age - Application de Veille

Application de veille d'actualités avec gestion de canaux thématiques et analyse IA.

## Prérequis

- Docker
- Docker Compose
- Un compte Supabase (pour la base de données)

## Configuration

1. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

2. Créez un fichier `Dockerfile` à la racine du projet :

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview"]
```

3. Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "4173:4173"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

## Déploiement

1. Construction de l'image :

```bash
docker compose build
```

2. Démarrage des conteneurs :

```bash
docker compose up -d
```

3. Arrêt des conteneurs :

```bash
docker compose down
```

## Accès à l'application

Une fois déployée, l'application est accessible à l'adresse :
- http://localhost:4173

## Structure des conteneurs

- **web** : Application React (Vite)
  - Port : 4173
  - Base image : Node 20 Alpine
  - Volume : Aucun (build statique)

## Maintenance

### Logs

Visualiser les logs :
```bash
docker compose logs -f
```

### Mise à jour

1. Arrêtez les conteneurs :
```bash
docker compose down
```

2. Reconstruisez avec les dernières modifications :
```bash
docker compose build --no-cache
```

3. Redémarrez :
```bash
docker compose up -d
```

## Sécurité

- Les variables d'environnement sensibles sont gérées via le fichier `.env`
- L'image utilise une version LTS de Node.js
- Le conteneur s'exécute en tant qu'utilisateur non-root
- Les ports exposés sont limités au minimum nécessaire

## Dépannage

1. **L'application ne démarre pas**
   - Vérifiez les logs : `docker compose logs web`
   - Vérifiez les variables d'environnement

2. **Erreur de connexion à Supabase**
   - Vérifiez les variables d'environnement Supabase
   - Vérifiez l'accès à l'API Supabase

## Support

Pour toute question ou problème :
1. Consultez les logs Docker
2. Vérifiez la configuration Supabase
3. Ouvrez une issue sur le dépôt du projet