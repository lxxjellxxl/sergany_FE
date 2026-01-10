# Build stage
FROM node:18 AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Quasar CLI globally
RUN npm install -g @quasar/cli

# --- FIX: Use --ignore-scripts to prevent 'quasar prepare' errors ---
RUN npm install --ignore-scripts

# Copy the rest of the project files
COPY . .

# Set API URL for the build
ENV API_BASE_URL=http://164.90.163.108/api

# Now we can build (Quasar handles preparation internally during build)
RUN quasar build

# Runtime stage
FROM nginx:alpine
# Copy built files to Nginx
COPY --from=builder /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]