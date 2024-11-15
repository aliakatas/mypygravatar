# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies (including TailwindCSS)
RUN npm install

# Copy the rest of the app source code into the container
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the app with a static server
FROM nginx:alpine

# Copy the built app from the previous stage to Nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]