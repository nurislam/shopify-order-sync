# Step 1: Build React app
FROM node:18 AS build

WORKDIR /app 
RUN npm install
RUN npm run build
  
EXPOSE 80
CMD ["-g", "daemon off;"]
