# Stage 1: Build React app
FROM docker.io/node:23-alpine AS builder

# Set working directory
WORKDIR /app

# Copy source code
COPY fetch-gravatars/package.json fetch-gravatars/package-lock.json ./
# If you use yarn, use yarn.lock instead
# COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# RUN npm ci
# or RUN yarn install --frozen-lockfile

# Copy rest of the source
COPY ./fetch-gravatars .

# Build the React app
RUN npm run build
# or RUN yarn build

# Stage 2: Serve with nginx
FROM docker.io/nginx:alpine

# Copy build output to nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
