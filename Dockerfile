# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# Aqui você pode usar .env.local, se quiser testar localmente
# No Railway, você usará ENV ou Build Args

RUN yarn build

# Etapa de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas os arquivos necessários do build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

ARG NEXT_PUBLIC_API_HOST
ARG NEXT_PUBLIC_ENABLE_CORS

# Disponibiliza elas no ambiente durante o build
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_ENABLE_CORS=$NEXT_PUBLIC_ENABLE_CORS

# Railway usará essa porta, pode ser configurável
ENV PORT=8080
EXPOSE ${PORT}

# NEXT config
ENV NODE_ENV=production

# Inicia o Next.js como servidor completo (SSR + API routes)
CMD ["yarn", "start"]