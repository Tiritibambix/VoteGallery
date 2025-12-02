# 📸 Vote Gallery

Une application web ultra-légère pour voter sur vos photos préférées selon un profil de personnage. Simple, rapide et facile à déployer.

## 🎯 Concept

Vote Gallery vous propose un petit jeu : **incarner un personnage pendant le vote**.

Au lieu de voter en tant que vous-même, vous devenez temporairement quelqu'un d'autre — citadin, cultivé, sensible, avec une fibre artistique. Cela change la perspective et rend le vote plus créatif et intéressant.

Puis vous choisissez vos **20 photos préférées** selon ce nouveau point de vue.

## ✨ Fonctionnalités

- ✅ Galerie responsive avec photos en ratio original
- ✅ Système de vote : 20 votes maximum par utilisateur
- ✅ Un vote par photo (pas de doublon)
- ✅ Identifiant utilisateur unique via cookie HttpOnly
- ✅ Ordre aléatoire des photos à chaque visite
- ✅ Modal zoom haute résolution au clic
- ✅ Admin dashboard protégé par mot de passe
- ✅ Base de données SQLite (zéro config)
- ✅ Backend Flask ultra-léger
- ✅ Déploiement Docker one-liner
- ✅ Protection des images (clic-droit désactivé)

## 🚀 Démarrage rapide

### Prérequis

- Docker & Docker Compose (ou Python 3.12+)

### Avec Docker Compose (recommandé) ⭐

```bash
# 1. Cloner le repo
git clone https://github.com/tiritibambix/VoteGallery.git
cd VoteGallery

# 2. Ajouter vos photos dans le dossier ./photos/
cp /chemin/vers/vos/photos/* ./photos/

# 3. Lancer l'app
docker-compose up -d
```

**Accéder à :** http://localhost:7845

### En local (sans Docker)

```bash
# 1. Installer les dépendances
pip install -r requirements.txt

# 2. Créer le dossier des photos
mkdir -p photos
cp /chemin/vers/vos/photos/* ./photos/

# 3. Définir le mot de passe admin
export ADMIN_PASSWORD=votreMotDePasse

# 4. Lancer l'app
python app.py
```

**Accéder à :** http://localhost:5000

---

## 📁 Structure du projet

```
VoteGallery/
├── app.py                      # Backend Flask principal
├── requirements.txt            # Dépendances Python
├── Dockerfile                  # Image Docker
├── docker-compose.yml          # Configuration Docker Compose
│
├── static/                     # Fichiers statiques
│   ├── gallery.js             # Logique frontend (votes, modal, etc)
│   └── style.css              # Styles responsive
│
├── templates/                  # Templates HTML
│   ├── index.html             # Page d'accueil + brief personnage
│   ├── gallery.html           # Galerie interactive
│   └── admin.html             # Dashboard admin
│
├── photos/                     # Vos images (JPG, PNG, GIF)
│   └── .gitkeep
│
└── data/                       # Répertoire de données (créé auto)
    └── votes.db               # Base SQLite (créée auto)
```

---

## ⚙️ Configuration

### Variables d'environnement

**`ADMIN_PASSWORD`** (obligatoire)
- Mot de passe pour accéder au dashboard admin
- À définir dans `docker-compose.yml`
- Format : `ADMIN_PASSWORD=votreMotDePasse`

### Limites par défaut

- **Max votes par utilisateur** : 20
- **Max votes par photo** : illimité
- **Authentification admin** : Basic Auth
  - Username: `admin`
  - Password: défini via `ADMIN_PASSWORD`

---

## 🐳 Docker Compose

### docker-compose.yml

```yaml
version: '3.9'

services:
  photo-vote:
    build: .                              # Build depuis le Dockerfile
    ports:
      - "7845:5000"                       # Port exposé
    environment:
      - ADMIN_PASSWORD=votreMotDePasse    # ⚠️ À personnaliser
    volumes:
      - ./photos:/app/photos              # Vos images
      - ./data:/app/data                  # Base de données
    restart: unless-stopped               # Redémarrage auto
```

### Commandes utiles

```bash
# Démarrer
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart

# Reconstruire l'image
docker-compose up -d --build
```

---

## 🖼️ Ajouter des photos

1. **En local** : placez vos images JPG/PNG/GIF dans `./photos/`
2. **Redémarrez** : `docker-compose restart`
3. **L'app détecte** les photos automatiquement au redémarrage
4. **L'ordre** est aléatoire à chaque visite

**Formats supportés** : `.jpg`, `.jpeg`, `.png`, `.gif`

---

## 📊 Admin Dashboard

### Accès

- **URL** : http://localhost:7845/admin
- **Username** : `admin`
- **Password** : celui défini dans `ADMIN_PASSWORD`

### Fonctionnalités

- Tableau des résultats de votes
- Photos triées par nombre de votes (décroissant)
- Mise à jour en temps réel

---

## 🔌 API Endpoints

| Endpoint | Méthode | Protection | Retour |
|----------|---------|-----------|--------|
| `/` | GET | — | Page d'accueil |
| `/gallery` | GET | — | Galerie interactive |
| `/admin` | GET | Basic Auth | Dashboard admin |
| `/api/photos` | GET | — | Liste des photos |
| `/api/user_votes` | GET | — | Votes de l'utilisateur |
| `/api/vote` | POST | — | Enregistrer un vote |
| `/api/admin/stats` | GET | Basic Auth | Stats votes par photo |

---

## 🔐 Sécurité

- ✅ **Cookies HttpOnly** : identifiant utilisateur sécurisé
- ✅ **Basic Auth** : protection admin
- ✅ **Validation côté serveur** : pas de doublon de vote
- ✅ **Clic-droit désactivé** : sur toutes les images
- ✅ **Drag-drop désactivé** : protection contre le vol d'images
- ✅ **SQLite local** : pas d'exposition réseau

---

## 📦 Stack technique

| Composant | Technologie |
|-----------|-------------|
| **Backend** | Python 3.12 + Flask 3.0 |
| **Base de données** | SQLite 3 |
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript |
| **Conteneurisation** | Docker + Docker Compose |
| **Authentification** | HTTP Basic Auth |

---

## 🚢 Déploiement

### Build Docker manuel

```bash
# Build l'image
docker build -t photo-vote .

# Run le container
docker run -p 7845:5000 \
  -e ADMIN_PASSWORD=motDePasse \
  -v $(pwd)/photos:/app/photos \
  -v $(pwd)/data:/app/data \
  photo-vote
```

### Déploiement cloud

L'application est compatible avec :
- **Heroku** : via Dockerfile
- **Railway.app** : via docker-compose
- **Fly.io** : via Dockerfile
- **VPS Linux** : Docker + nginx reverse proxy

---

## 🐛 Troubleshooting

### Les photos ne s'affichent pas

```bash
# Vérifier que le dossier photos existe
ls -la photos/

# Vérifier les logs
docker-compose logs -f
```

### Erreur "unable to open database file"

```bash
# Vérifier les permissions du dossier data
ls -la data/

# Redémarrer
docker-compose restart
```

### Admin : erreur 401 Unauthorized

- Vérifier le mot de passe dans `docker-compose.yml`
- Format : `ADMIN_PASSWORD=votreMotDePasse`
- Sans espaces ni caractères spéciaux (ou les échapper)

---

## 📈 Performance

- **Temps de démarrage** : ~2-3 secondes
- **Taille image Docker** : ~150MB
- **Consommation RAM** : ~50MB
- **Temps de vote** : <100ms
- **Support** : jusqu'à 1000+ photos

---

## 📄 Licence

MIT — Libre d'utilisation et de modification

---

## 🤝 Contribution

Les PRs sont bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer des améliorations
- Améliorer la documentation

---

**Vote simplement. Incarnez le personnage. Choisissez consciemment.** 🎭✨

