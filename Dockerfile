# ============================================
# Stage 1: Build the client (Vite React app)
# ============================================
FROM node:20-alpine AS build-client
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ============================================
# Stage 2: Build CyberAnalyst (CRA React app)
# ============================================
FROM node:20-alpine AS build-cyberanalyst
WORKDIR /app/cyberanalyst
COPY cyberanalyst/package.json cyberanalyst/package-lock.json ./
RUN npm ci
COPY cyberanalyst/ ./
RUN npm run build

# ============================================
# Stage 3: Build PhishTank (Vite TS React app)
# ============================================
FROM node:20-alpine AS build-phishtank
WORKDIR /app/PhishTank
COPY PhishTank/package.json PhishTank/package-lock.json ./
RUN npm ci
COPY PhishTank/ ./
RUN npm run build

# ============================================
# Stage 4: Production server
# ============================================
FROM node:20-alpine AS production
WORKDIR /app

# Install server dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --only=production

# Copy server source
COPY server/ ./server/

# Copy built apps from build stages
COPY --from=build-client /app/client/dist ./client/dist
COPY --from=build-cyberanalyst /app/cyberanalyst/build ./cyberanalyst/build
COPY --from=build-phishtank /app/PhishTank/dist ./PhishTank/dist

# Copy static games (no build needed)
COPY CS450/ ./CS450/
COPY CS450-github/ ./CS450-github/
COPY labEscape/ ./labEscape/
COPY CyberGame/ ./CyberGame/
COPY games/ ./games/

EXPOSE 3001

CMD ["node", "server/index.js"]
