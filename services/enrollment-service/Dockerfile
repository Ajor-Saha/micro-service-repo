FROM node:18-alpine AS base

# Build shared package
FROM base AS shared-builder
WORKDIR /app/shared
COPY shared/package*.json ./
RUN npm install
COPY shared/tsconfig.json ./
COPY shared/src ./src
RUN npm run build

# Build service
FROM base AS service-builder
WORKDIR /app/service

# Install service dependencies
COPY services/enrollment-service/package*.json ./
RUN npm install

# Remove symlink and copy built shared package to node_modules
RUN rm -rf ./node_modules/@university/shared
COPY --from=shared-builder /app/shared/dist ./node_modules/@university/shared/dist
COPY --from=shared-builder /app/shared/package.json ./node_modules/@university/shared/package.json
COPY --from=shared-builder /app/shared/node_modules ./node_modules/@university/shared/node_modules

# Copy service source and build
COPY services/enrollment-service/tsconfig.json ./
COPY services/enrollment-service/src ./src
RUN npm run build

# Production stage
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# Copy built artifacts with correct ownership
COPY --from=service-builder --chown=nodejs:nodejs /app/service/dist ./dist
COPY --from=service-builder --chown=nodejs:nodejs /app/service/node_modules ./node_modules
COPY --from=service-builder --chown=nodejs:nodejs /app/service/package*.json ./

# Copy drizzle config and entrypoint
COPY services/enrollment-service/drizzle.config.ts ./
COPY services/enrollment-service/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nodejs

ENV NODE_ENV=production
EXPOSE 3004

CMD ["./docker-entrypoint.sh"]
