# Use official Node.js LTS image
FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY .node-version ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

# Expose port (optional, mainly for health checks)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
