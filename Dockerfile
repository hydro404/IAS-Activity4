# Use an official Node.js runtime as the base image
FROM node:14

# Install qpdf
RUN apt-get update && apt-get install -y qpdf

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container at /app
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# Copy the rest of the application into the container at /app
COPY . .

# Make port 3000 available to the outside world
EXPOSE 3000

# Run the application when the container launches
CMD ["node", "main.js"]
