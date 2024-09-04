# Étape 1 : Construction de l'application
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /api

# Copier les fichiers de dépendances
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install -g typescript
RUN npm install @prisma/client

# Copier le reste des fichiers de l'application
COPY . .

# Nettoyer les fichiers de build précédents et générer le client Prisma
RUN npm run clean
RUN npx prisma generate --schema src/prisma/schema.prisma

# Construire le projet
RUN npm run build

# Exécuter les migrations Prisma
RUN npx prisma migrate dev --name init --schema src/prisma/schema.prisma

# Étape 2 : Préparation de l'image finale
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /api

# Copier les fichiers construits et les dépendances de l'étape précédente
COPY --from=builder /api/build ./build
COPY package*.json ./

# Installer les dépendances nécessaires pour l'exécution
RUN npm install --omit=dev

# Exposer le port utilisé par l'application
EXPOSE 5050

# Définir la commande par défaut
CMD ["npm", "run", "start-api"]

