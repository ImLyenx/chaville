# Chaville

Ce projet est une application web développée avec [Next.js](https://nextjs.org) pour la ville de Chaville, créée avec [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Fonctionnalités

- **Page d'accueil** : Présentation des actualités et catégories de commerçants
- **Espace commerçants** : Découverte des commerces locaux
- **Blog** : Articles et actualités de la ville
- **Espace entreprise** : Informations pour les entreprises locales
- **Espace administratif** : Gestion du contenu du site
- **Système d'authentification** : Inscription et connexion des utilisateurs
- **Formulaire de contact** : Communication avec la mairie
- **Mode clair/sombre** : Interface adaptable aux préférences utilisateur
- **Carrousels d'images** : Présentation visuelle des contenus

## Technologies utilisées

- **Frontend** : Next.js 15, React 19, TailwindCSS
- **UI Components** : Shadcn UI
- **Formulaires** : React Hook Form, Zod
- **Éditeur de texte riche** : TipTap
- **Base de données** : MySQL avec Drizzle ORM
- **Upload de fichiers** : UploadThing
- **Emails** : Resend

## Installation

1. Clonez le dépôt
2. Installez les dépendances :

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

3. Configurez les variables d'environnement (créez un fichier `.env` basé sur les besoins de la base de données)

```env
BETTER_AUTH_SECRET="XXXXXXXX"
BETTER_AUTH_URL=http://localhost:3000 #Base URL of your app
MYSQL_DATABASE_URL=mysql://root:@localhost:3306/chaville
RESEND_API_KEY=re_XXXXXXXX
RESEND_FROM_EMAIL=mail@example.com
UPLOADTHING_TOKEN=eyJ.......

```

4. Initialisez la base de données :

```bash
npm run db:push
# ou
pnpm db:push
```

## Démarrage

Lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

Vous pouvez commencer à éditer le site en modifiant `app/page.tsx`. La page se met à jour automatiquement à mesure que vous éditez le fichier.
