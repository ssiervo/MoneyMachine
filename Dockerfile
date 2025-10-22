FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --legacy-peer-deps || true
COPY . .
RUN npm run build
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
