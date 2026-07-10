# ── FolioFYX frontend ─────────────────────────────────────────────────────────
# Stage 1: build the Vite app to static assets.
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines env vars at BUILD time, so the API URL must be a build arg.
# (The Groq key is intentionally NOT here — it now lives only on the server.)
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: serve the static build with nginx.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
