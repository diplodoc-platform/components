# Based on node:22 with Playwright dependencies
FROM node:22-bookworm

# Update npm to meet requirements (>=11.5.1)
RUN npm install -g npm@latest

# Install Playwright system dependencies
RUN npx playwright install-deps chromium webkit firefox

# Install browsers
RUN npx playwright@1.48.2 install chromium webkit firefox

WORKDIR /work
