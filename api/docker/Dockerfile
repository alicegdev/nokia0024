FROM node:18-alpine AS api-builder
WORKDIR api
COPY package*.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install prisma --save-dev
COPY . .
RUN npm run clean
RUN npm run prisma:generate
RUN npm run build
RUN npm run prisma:migrate
EXPOSE 5050

FROM node:18-alpine AS api
WORKDIR api
COPY --from=api-builder /api/build ./build
COPY package* ./
RUN npm install --omit=dev
CMD npm run start-api