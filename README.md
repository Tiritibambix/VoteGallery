# 📸 Vote Gallery

Une application web ultra-légère pour voter sur vos photos préférées. Simple, rapide et facile à déployer.

## 🎯 Fonctionnalités

- ✅ Galerie de photos avec interface responsive
- ✅ Système de vote avec limite de 20 votes par utilisateur
- ✅ Identifiant utilisateur unique via cookie HttpOnly
- ✅ Admin dashboard protégé par mot de passe
- ✅ Base de données SQLite (zéro config)
- ✅ Backend Flask léger
- ✅ Déploiement Docker ultra-simple

## 🚀 Démarrage rapide

### Avec Docker Compose (recommandé)

```bash
# Cloner le repo
git clone https://github.com/tiritibambix/VoteGallery.git
cd VoteGallery

# Ajouter vos photos dans le dossier /photos

# Lancer l'app
docker-compose up -d
```

Accéder à : http://localhost:7845

### En local

```bash
# Installer les dépendances
pip install -r requirements.txt

# Définir le mot de passe admin
export ADMIN_PASSWORD=votreMotDePasse

# Lancer l'app
python app.py
```

## 📋 Architecture

```
project/
├── app.py                 # Backend Flask
├── requirements.txt       # Dépendances Python
├── Dockerfile            # Image Docker
├── docker-compose.yml    # Configuration Docker Compose
├── static/
│   ├── gallery.js       # Logique frontend
│   └── style.css        # Styles
├── templates/
│   ├── index.html       # Page d'accueil
│   ├── gallery.html     # Galerie
│   └── admin.html       # Admin dashboard
└── photos/              # Vos images (jpg, png, gif)
```

## 🔧 Configuration

### Variables d'environnement

- `ADMIN_PASSWORD` : Mot de passe admin (obligatoire dans docker-compose)

### Limites par défaut

- **Max votes par utilisateur** : 20
- **Authentification admin** : Basic Auth (username: `admin`)

## 📊 Admin Dashboard

Accéder via : http://localhost:7845/admin

- Username: `admin`
- Password: défini dans `docker-compose.yml`

Affiche un tableau avec le nombre de votes par photo.

## 🐳 Déploiement Docker

```bash
# Build l'image
docker build -t photo-vote .

# Run le container
docker run -p 7845:5000 \
  -e ADMIN_PASSWORD=votreMotDePasse \
  -v $(pwd)/photos:/app/photos \
  photo-vote
```

## 📸 Ajouter des photos

1. Placez vos images (JPG, PNG, GIF) dans le dossier `/photos/`
2. L'app les détecte automatiquement au redémarrage
3. L'ordre d'affichage est aléatoire à chaque visite

## 🔐 Sécurité

- Cookies HttpOnly pour l'identifiant utilisateur
- Basic Auth pour l'admin
- Validation des votes côté serveur
- SQLite local (pas de réseau exposé)

## 📦 Stack technique

- **Backend** : Python 3.12 + Flask
- **Base de données** : SQLite
- **Frontend** : HTML5 + CSS3 + Vanilla JavaScript
- **Container** : Docker

## 📄 Licence

MIT

## 🤝 Contribution

Les PRs sont bienvenues !

---

**Déployer simplement, voter facilement.** 🚀

