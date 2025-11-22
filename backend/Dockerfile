# 1) Dependencies stage
FROM node:20-alpine AS deps

# Create app directory
WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install ONLY production dependencies & clean npm cache
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi \
 && npm cache clean --force


# 2) Runtime image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules safely from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy ONLY necessary source files (NOT the whole folder)
COPY server.js ./
# If you have other required small files, list them here:
# COPY config.json ./

# Do NOT copy package.json, dockerfile, lock file unless needed
# Do NOT copy tests, docs, .git, etc.

# Security: run as non-root user
USER node

EXPOSE 8000

CMD ["node", "server.js"]
