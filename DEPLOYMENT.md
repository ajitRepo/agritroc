# 🚀 Guide de Déploiement en Production — AgriTroc

Ce guide détaille pas-à-pas la mise en production du backend et du frontend web **AgriTroc (`web-agri-troc`)**.

---

## 📋 Checklist Pré-Déploiement

- [x] Compilation TypeScript validée sans erreur (`npm run build`).
- [x] Gestion des proxys et en-têtes CORS pour requêtes mobiles et web.
- [x] Signature sécurisée des JWT avec Jose (HS256) et expiration à 7 jours.
- [x] Rate limiting en mémoire actif sur les demandes OTP (5 / 15 min) et vérifications (10 / 15 min).
- [x] Validation stricte des entrées utilisateurs via des schémas **Zod**.
- [x] Protection des données privées (numéros masqués sur les profils publics).
- [x] Respect des règles d'intégrité métier (R1 à R7 : vérification propriétaire, unicité des conversations, etc.).
- [x] Mode fallback console WhatsApp pour tests locaux sans dépendance externe.

---

## 🗄️ 1. Configuration de la Base de Données

### Option A : PostgreSQL (Recommandé pour la Production)
Pour un déploiement sur **Supabase**, **Neon**, **Railway**, **Render** ou **AWS RDS** :

1. Dans `prisma/schema.prisma`, remplacez :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Mettez à jour votre variable `DATABASE_URL` dans vos variables d'environnement :
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/agritroc?sslmode=require"
   ```
3. Synchronisez le schéma et générez le client :
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts  # Optionnel : charger les données de démo
   ```

### Option B : SQLite
Convient pour un petit serveur VPS avec stockage persistant (ex: Docker avec volume monté sur `/app/prisma/dev.db`).

---

## 🔑 2. Variables d'Environnement en Production

Définissez les variables suivantes dans le tableau de bord de votre hébergeur (Vercel, Railway, Render, etc.) :

| Variable | Exemple / Valeur | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://...` ou `file:./dev.db` | Chaîne de connexion à la base de données |
| `JWT_SECRET` | `4f8a9e2b1c7d6e5f8a9e2b1c7d6e5f8a...` | Clé secrète de signature (min 32 caractères aléatoires) |
| `WHATSAPP_TOKEN` | `EAAX...` | Jeton d'accès Système Meta Developers |
| `PHONE_NUMBER_ID` | `1059483928172` | Identifiant du numéro WhatsApp Business |
| `SUPER_ADMIN_PHONE` | `+221770000000` | Numéro qui reçoit le rôle `is_admin = true` |
| `NEXT_PUBLIC_APP_URL` | `https://agritroc.sn` | URL publique du site web |
| `NODE_ENV` | `production` | Active les cookies sécurisés `Secure; SameSite=Lax` |

---

## ☁️ 3. Options d'Hébergement

### Méthode 1 : Déploiement sur Vercel (Recommandé & Le plus rapide)

1. Poussez votre code sur GitHub/GitLab.
2. Rendez-vous sur [Vercel](https://vercel.com) > **Add New Project**.
3. Sélectionnez le dépôt `web-agri-troc`.
4. Configurez les variables d'environnement listées ci-dessus.
5. Commande de build : `npm run build` (génère automatiquement Prisma Client + Next.js).
6. Cliquez sur **Deploy**.

---

### Méthode 2 : Déploiement Docker (Render, Railway, VPS, CapRover)

Le projet inclut un fichier [`Dockerfile`](./Dockerfile) multi-étapes optimisé avec `output: 'standalone'`.

1. **Construire l'image Docker** :
   ```bash
   docker build -t agritroc-web:latest .
   ```

2. **Lancer le conteneur** :
   ```bash
   docker run -d \
     -p 3000:3000 \
     --name agritroc \
     -e DATABASE_URL="postgresql://..." \
     -e JWT_SECRET="votre-secret-32-caracteres" \
     -e WHATSAPP_TOKEN="votre-token" \
     -e PHONE_NUMBER_ID="votre-id" \
     -e NEXT_PUBLIC_APP_URL="https://agritroc.sn" \
     agritroc-web:latest
   ```

---

## 📲 4. Configuration WhatsApp Cloud API (Meta Developers)

1. Rendez-vous sur [developers.facebook.com](https://developers.facebook.com).
2. Créez une application de type **Business** et ajoutez le produit **WhatsApp**.
3. Dans **WhatsApp > Getting Started** :
   * Récupérez votre **Phone Number ID**.
   * Récupérez votre **Temporary Access Token** (ou générez un System User Token permanent dans Meta Business Manager).
4. **Modèle de message OTP** :
   * Nom du modèle : `otp_code`
   * Catégorie : `AUTHENTICATION`
   * Langue : `fr` (Français)
   * Corps du message : `{{1}} est votre code de vérification pour AgriTroc.`

---

## 📱 5. Connexion de l'application Mobile (`mob-agri-troc`)

Une fois votre backend déployé (par exemple sur `https://api.agritroc.sn`) :

1. Dans `mob-agri-troc/.env` :
   ```env
   EXPO_PUBLIC_API_URL=https://api.agritroc.sn/api
   ```
2. Compilez l'application mobile avec EAS Build pour les stores ou testez avec Expo :
   ```bash
   eas build --platform all
   ```
