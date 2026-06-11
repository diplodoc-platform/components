# Based on node:24 with Playwright dependencies
FROM node:24-bookworm

# Update npm to meet requirements (>=11.5.1)
RUN npm install -g npm@latest

# Install Playwright system dependencies
RUN npx playwright install-deps chromium webkit firefox

# Install browsers (keep in sync with playwright/test package version in package.json)
RUN npx playwright@1.60.0 install chromium webkit firefox

WORKDIR /work
