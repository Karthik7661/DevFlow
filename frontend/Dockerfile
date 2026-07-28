FROM node:18-alpine

WORKDIR /app

# Install dependencies including devDependencies (needed for build)
COPY package*.json ./
RUN npm install --include=dev

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
