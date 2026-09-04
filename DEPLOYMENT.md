# 🚀 Guide de Déploiement : Render + Supabase (Production)

Ce guide détaille pas-à-pas la mise en production du backend et du frontend web **AgriTroc (`web-agri-troc`)** hébergé sur **Render** et connecté à une base de données **Supabase**.

---

## ⚡ Bascule Automatique Dev ↔ Production

Le projet intègre une détection automatique de l'environnement :
* **En local (Dev)** : Si `DATABASE_URL="file:./dev.db"`, Prisma utilise **SQLite** localement sans configuration requise.
* **Sur Render (Production)** : Si `DATABASE_URL` commence par `postgres://` ou `postgresql://`, Prisma s'adapte automatiquement à **Supabase (PostgreSQL)** lors du build.

---

## 🐘 Étape 1 : Créer la Base de Données sur Supabase

1. Connectez-vous sur [supabase.com](https://supabase.com) et cliquez sur **New project**.
2. Nommez le projet (ex: `agritroc`), définissez un mot de passe fort pour la base de données, et choisissez une région proche (ex: `eu-west-1` Francfort ou `eu-west-3` Paris).
3. Une fois le projet prêt, rendez-vous dans :
   **Project Settings** (icône d'engrenage en bas à gauche) ➔ **Database** ➔ Section **Connection string**.
4. Sélectionnez l'onglet **URI** :
   * **Mode Transaction / Session (Pooler)** :
     ```text
     postgresql://postgres.[VOTRE_REF]:[VOTRE_MDP]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   * **Mode Direct (Direct Connection - Port 5432)** :
     ```text
     postgresql://postgres.[VOTRE_REF]:[VOTRE_MDP]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
   > ⚠️ **Important** : Pensez à remplacer `[VOTRE_MDP]` par le mot de passe réel défini lors de la création du projet.

---

## ☁️ Étape 2 : Déployer sur Render

1. Rendez-vous sur votre tableau de bord [dashboard.render.com](https://dashboard.render.com).
2. Cliquez sur **New +** ➔ **Web Service**.
3. Connectez votre compte GitHub et sélectionnez le dépôt :
   👉 **`ajitRepo/agritroc`**
4. Configurez les champs suivants :
   * **Name** : `agritroc-web`
   * **Region** : Choisissez la même région ou la plus proche de Supabase (ex: Frankfurt).
   * **Branch** : `main`
   * **Root Directory** : *(laisser vide)*
   * **Runtime** : `Node`
   * **Build Command** :
     ```bash
     npm install && npx prisma db push && npm run build
     ```
     *(Cette commande installe les dépendances, synchronise les tables sur Supabase et compile Next.js)*
   * **Start Command** :
     ```bash
     npm start
     ```
   * **Instance Type** : `Free` ou `Starter`

---

## 🔑 Étape 3 : Configurer les Variables d'Environnement sur Render

Dans la section **Environment Variables** sur Render, ajoutez :

| Clé | Valeur | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[MDP]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` | Chaîne de connexion poolée Supabase |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[MDP]@aws-0-[REGION].pooler.supabase.com:5432/postgres` | Connexion directe Supabase (recommandée avec Prisma) |
| `JWT_SECRET` | *(chaîne aléatoire d'au moins 32 caractères)* | Clé secrète de signature des tokens |
| `NODE_ENV` | `production` | Active les optimisations de production |
| `NEXT_PUBLIC_APP_URL` | `https://agritroc-web.onrender.com` *(votre URL Render)* | URL publique de l'application |
| `CLOUDINARY_CLOUD_NAME`| *(votre cloud name Cloudinary)* | Hébergement des photos d'annonces |
| `CLOUDINARY_UPLOAD_PRESET`| `agritroc_unsigned` | Preset d'upload Cloudinary |
| `WHATSAPP_TOKEN` | *(token Meta Developers WhatsApp)* | Jeton API Cloud WhatsApp |
| `PHONE_NUMBER_ID` | *(id de numéro WhatsApp)* | Identifiant WhatsApp Business |
| `SUPER_ADMIN_PHONE` | `+221770000000` | Numéro administrateur |

5. Cliquez sur **Deploy Web Service** !
   Render va automatiquement cloner le dépôt, exécuter la commande de build, créer les tables sur Supabase, et démarrer le serveur.

---

## 📱 Étape 4 : Lier l'Application Mobile à Render

Une fois votre service Render déployé (ex: `https://agritroc-web.onrender.com`) :

Dans le projet mobile `mob-agri-troc/.env` :
```env
EXPO_PUBLIC_API_URL=https://agritroc-web.onrender.com/api
```
Et lancez l'application :
```bash
npx expo start --tunnel
```
L'application mobile appellera directement votre backend en production sur Render et interagira avec la base Supabase !
