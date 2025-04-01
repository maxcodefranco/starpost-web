# Use the official Node.js 20 image as the base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Remove development dependencies and unnecessary files
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 8080

# Start the application in production mode
CMD ["npm", "start"]
