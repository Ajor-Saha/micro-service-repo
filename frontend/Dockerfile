FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

# Accept build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_STUDENT_API_URL
ARG NEXT_PUBLIC_COURSE_API_URL
ARG NEXT_PUBLIC_FACULTY_API_URL
ARG NEXT_PUBLIC_ENROLLMENT_API_URL

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_STUDENT_API_URL=${NEXT_PUBLIC_STUDENT_API_URL}
ENV NEXT_PUBLIC_COURSE_API_URL=${NEXT_PUBLIC_COURSE_API_URL}
ENV NEXT_PUBLIC_FACULTY_API_URL=${NEXT_PUBLIC_FACULTY_API_URL}
ENV NEXT_PUBLIC_ENROLLMENT_API_URL=${NEXT_PUBLIC_ENROLLMENT_API_URL}

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
