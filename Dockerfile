# Use official Node.js 20 base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app source code
COPY . .

# Expose the port your Express app uses (default: 3000)
EXPOSE 3000

# Build and Start the server
CMD ["npm", "run", "build-start-server"]
