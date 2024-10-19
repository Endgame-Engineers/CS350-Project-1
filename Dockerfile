FROM node:20

# Create app directory
WORKDIR /app

# cp backend and frontend
COPY backend /app/backend
COPY frontend /app/frontend

# Install app dependencies
RUN cd /app/backend && npm install
RUN cd /app/frontend && npm install

# Build frontend
RUN cd /app/frontend && npm run build

# Build backend
RUN cd /app/backend && npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "/app/backend/dist/index.js"]
