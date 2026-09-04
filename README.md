# AgriTroc Web & Backend API (Fullstack Next.js)

Plateforme complète de **troc et d'entraide agricole au Sénégal**, construite avec **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, et **Tailwind CSS**.

Elle remplace intégralement l'ancien backend Python (Flask) et intègre à la fois le **frontend web moderne** et les **routes API REST** consommables par l'application mobile Expo (`mob-agri-troc`).

L'authentification s'effectue exclusivement par **numéro de téléphone et code OTP WhatsApp**, sans mot de passe ni email requis.

---

## 🚀 Démarrage rapide

### 1. Variables d'environnement

Copiez `.env.example` en `.env` :

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Base de données (`file:./dev.db` en SQLite local ou PostgreSQL) |
| `JWT_SECRET` | Clé secrète de signature des tokens JWT (min 32 caractères) |
| `WHATSAPP_TOKEN` | Jeton Meta Developers pour WhatsApp Cloud API |
| `PHONE_NUMBER_ID` | Identifiant du numéro expéditeur WhatsApp Cloud API |
| `SUPER_ADMIN_PHONE` | Numéro promu administrateur à la connexion (ex: `+221770000000`) |
| `NEXT_PUBLIC_APP_URL` | URL de l'application (défaut : `http://localhost:3000`) |

> **Mode Développement sans WhatsApp configuré** :  
> Si `WHATSAPP_TOKEN` n'est pas renseigné, les codes OTP à 6 chiffres sont générés, stockés en base et **affichés directement dans la console du serveur** pour tester la connexion sans friction.

### 2. Initialiser la base de données & Démonstration

```bash
# Générer le client Prisma et synchroniser le schéma
npm run db:push

# Charger les données initiales (agriculteurs et annonces au Sénégal)
npm run db:seed
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application est disponible sur **[http://localhost:3000](http://localhost:3000)**.

---

## 🌾 Fonctionnalités Principales

### 1. Authentification WhatsApp OTP (Zero Email, Zero Password)
- L'utilisateur entre son numéro de téléphone sénégalais (ex: `+221771234567`).
- Envoi automatique d'un code OTP à 6 chiffres via WhatsApp Cloud API (modèle `otp_code`).
- Vérification du code avec rate limiting (5 demandes / 15 min, 10 vérifications max).
- Création automatique du compte au premier login et génération d'une session JWT valide 7 jours.

### 2. Gestion des Offres de Troc Agricole
- **Types de ressources** :
  - `land` (Terres & Parcelles irriguées)
  - `livestock` (Bétail & Élevage : bovins, ovins, caprins)
  - `seeds` (Semences certifiées & Plants)
  - `machinery` (Matériel agricole & Tracteurs)
  - `production` (Récoltes, foin, céréales locales)
  - `other` (Autre ressource)
- **Compléments d'échange (Soulte)** :
  - `none` (Troc simple 100% nature)
  - `money` (Troc avec complément financier)
  - `other` (Troc avec autre complément)
- **Filtres et recherche** : par mot-clé, type de ressource, région (Kaolack, Saint-Louis, Thiès, Fatick, Dakar, etc.) et pagination.
- **Suivi des statuts** : `active`, `completed` (conclu), `cancelled` (annulé).

### 3. Messagerie & Mise en relation WhatsApp
- Discussions directes intégrées sur la plateforme pour chaque offre de troc.
- Bouton de contact direct **WhatsApp** (`https://wa.me/...`) pré-rempli avec l'annonce.
- Validation de conclusion de troc et incrémentation des compteurs d'échanges réussis.

### 4. Profils & Réputation
- Page de profil public avec note moyenne, avis et annonces actives.
- Gestion des informations personnelles et localisation de l'exploitation.

---

## 📱 Connexion avec l'application Mobile (`mob-agri-troc`)

L'application mobile Expo (`mob-agri-troc`) consomme directement les API de ce projet.

Pour connecter le mobile avec tunnel Expo :
1. Démarrez le backend Next.js : `npm run dev`
2. Dans `mob-agri-troc`, démarrez Expo avec tunnel :
   ```bash
   npx expo start --tunnel
   ```
3. Si vous utilisez une URL de tunnel publique (ngrok / localtunnel), définissez simplement :
   ```env
   EXPO_PUBLIC_API_URL=https://votre-tunnel.ngrok.app/api
   ```

---

## ⚡ Référence des API REST

### Authentification — `/api/auth`
| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/send-otp` | Génère et envoie le code OTP WhatsApp |
| `POST` | `/api/auth/verify-otp` | Vérifie l'OTP, connecte/crée le compte et retourne le JWT |
| `GET` | `/api/auth/me` | Profil de l'utilisateur authentifié |
| `POST` | `/api/auth/logout` | Déconnexion et suppression du cookie de session |
| `GET` | `/api/auth/token/verify` | Vérifie la validité du token JWT |

### Offres de Troc — `/api/offers`
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/offers` | Liste des offres filtrées (`resource_type`, `location`, `q`, `page`) |
| `POST` | `/api/offers` | Publier une nouvelle offre de troc (Auth requise) |
| `GET` | `/api/offers/:id` | Détail d'une offre et incrémentation des vues |
| `PUT` | `/api/offers/:id` | Modifier une offre (propriétaire) |
| `DELETE` | `/api/offers/:id` | Annuler une offre (propriétaire) |
| `POST` | `/api/offers/:id/complete` | Marquer l'offre comme conclue |
| `GET` | `/api/offers/my` | Mes offres publiées |

### Messagerie — `/api/messages`
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/messages/conversations` | Liste des conversations avec compteurs non lus |
| `POST` | `/api/messages/conversations` | Démarrer une conversation sur une offre |
| `GET` | `/api/messages/conversations/:id` | Messages d'une conversation (marqués comme lus) |
| `POST` | `/api/messages/conversations/:id` | Envoyer un message dans une conversation |

### Profils — `/api/profile`
| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/profile` | Mon profil complet |
| `PUT` | `/api/profile` | Mettre à jour mon profil |
| `GET` | `/api/profile/:id` | Profil public d'un agriculteur et ses annonces actives |

---

## 🗄️ Structure du Projet

```
web-agri-troc/
├── prisma/
│   ├── schema.prisma          # Schéma de base de données (User, OtpCode, Offer, Conversation...)
│   └── seed.ts                # Données initiales de démonstration
├── src/
│   ├── app/
│   │   ├── api/               # Route Handlers Next.js (Auth, Offres, Messages, Profil)
│   │   ├── connexion/         # Page de connexion WhatsApp OTP
│   │   ├── offres/            # Explorateur d'offres de troc & Détail (/offres/[id])
│   │   ├── publier/           # Formulaire de publication d'offre
│   │   ├── mes-offres/        # Tableau de bord des annonces personnelles
│   │   ├── messages/          # Interface de discussion en direct
│   │   ├── profil/            # Profil privé et profil public (/profil/[id])
│   │   ├── layout.tsx         # Layout racine avec AuthProvider, Navbar et Footer
│   │   └── page.tsx           # Page d'accueil & recherche
│   ├── components/            # Navbar, Footer, etc.
│   ├── context/               # AuthContext (gestion session & WhatsApp OTP)
│   └── lib/                   # Prisma Client, auth JWT jose, WhatsApp API, constants
├── .env.example
└── package.json
```
