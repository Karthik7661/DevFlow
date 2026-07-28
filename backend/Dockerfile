FROM node:18-alpine

WORKDIR /app

# Install dependencies including devDependencies (needed for build)
COPY package*.json ./
RUN npm install --include=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
