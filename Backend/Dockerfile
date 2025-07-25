# Use Node.js LTS version
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the backend source code
COPY . .

# Expose port and start the server
EXPOSE 3088
CMD ["node", "server.js"]

