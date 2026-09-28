FROM node:20-alpine

WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./

RUN npm install --production=false

# Copy backend source code
COPY . .

EXPOSE 5001

CMD ["npm", "start"]
