# Use the official Bun image
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["bun", "start"]
