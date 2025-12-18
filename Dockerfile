FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

# Clear Vite/Angular cache to prevent 504 errors
RUN rm -rf node_modules/.vite node_modules/.cache .angular/cache

EXPOSE 4200

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
