FROM nginx:alpine

# Copy frontend files to NGINX's default web directory
COPY html /usr/share/nginx/html
# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf
# Expose port 80 for NGINX
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
