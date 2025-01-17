FROM mcr.microsoft.com/playwright:v1.48.2-jammy
WORKDIR /usr/src/app
RUN cd ..
COPY package*.json ./
RUN npm ci
COPY . .
RUN cd demo && \
    npm ci && \
    cd .. && \
    npx playwright install && \
    npm run build