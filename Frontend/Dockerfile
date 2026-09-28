# Stage 1: Build Vite React App
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests first for efficient layer caching
COPY package*.json ./

RUN npm install

# Copy source code and build
COPY . .

# Pass build arguments for Vite environment variables
ARG VITE_STREAM_API_KEY
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY

RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
