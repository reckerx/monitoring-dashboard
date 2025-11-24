# syntax=docker/dockerfile:1

########################
# 1) Build stage
########################
FROM node:20-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build production bundle
RUN npm run build

########################
# 2) Nginx runtime
########################
FROM nginx:1.27-alpine AS runner

# Copy build output to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# (Optional) custom nginx.conf can be copied here if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
