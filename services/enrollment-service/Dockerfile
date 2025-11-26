# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy shared package
COPY ../../shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# Copy service
WORKDIR /app/service
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/service/dist ./dist
COPY --from=builder /app/service/node_modules ./node_modules
COPY --from=builder /app/service/package*.json ./

EXPOSE 3004

CMD ["npm", "start"]
