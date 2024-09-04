FROM node:18-alpine AS api-builder
WORKDIR api
RUN npm install
RUN npm install -g typescript
RUN npm install prisma --save-dev
COPY . .
RUN npm run clean
RUN npx prisma generate --schema=./src/prisma/schema.prisma
RUN npm run build
RUN npx prisma migrate deploy --schema=./src/prisma/schema.prisma
EXPOSE 5050

FROM node:18-alpine AS api
WORKDIR api
COPY --from=api-builder /api/build ./build
COPY package* ./
RUN npm install --omit=dev
CMD npm run start-api