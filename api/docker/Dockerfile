FROM node:18-alpine AS api-builder
WORKDIR api
COPY . .
RUN npm install
RUN npm install -g typescript
RUN npm run clean
RUN npm run prisma generate
RUN npm run build
RUN npm run prisma migrate deploy
RUN npm run prisma migrate status

FROM node:18-alpine AS api
WORKDIR api
COPY --from=api-builder /api/build ./build
COPY package* ./
RUN npm install --omit=dev
CMD npm run start-api