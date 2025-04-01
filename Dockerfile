# Use the official Node.js 20 image as the base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install only production dependencies using yarn
RUN yarn install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Remove unnecessary files
RUN yarn install --production --frozen-lockfile

# Expose the port the app runs on
EXPOSE 8080

# Start the application in production mode
CMD ["yarn", "start"]
