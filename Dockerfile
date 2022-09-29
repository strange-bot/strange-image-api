FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy app files
COPY assets ./assets
COPY dist ./dist

# Environment variables
ENV PORT=3000
ENV AUTHENTICATION=0

# Expose port
EXPOSE 3000

# Run the app
CMD [ "node", "." ]