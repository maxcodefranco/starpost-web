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

# Expose the port dynamically using the PORT environment variable
ENV PORT=8080
EXPOSE ${PORT}

# Ensure the application uses the environment variables provided by Railway
ENV NEXT_PUBLIC_API_HOST=${NEXT_PUBLIC_API_HOST}
ENV NEXT_PUBLIC_ENABLE_CORS=${NEXT_PUBLIC_ENABLE_CORS}

# Start the application in production mode
CMD ["yarn", "start"]
