FROM node:18-alpine
LABEL org.hyperledger.fabric.chaincode.id=basic
LABEL org.hyperledger.fabric.chaincode.version=1.0
LABEL org.hyperledger.fabric.chaincode.language=node

# Copy chaincode source
COPY package*.json /usr/local/src/package.json
COPY package-lock.json /usr/local/src/package-lock.json
COPY index.js /usr/local/src/index.js

# Set working directory
WORKDIR /usr/local/src

# Install dependencies
RUN npm install --omit=dev

# Expose chaincode server port
EXPOSE 9999

# Start chaincode server using fabric-shim
CMD ["sh", "-c", "CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999 CHAINCODE_ID=basic_1.0 CORE_CHAINCODE_ID_NAME=basic_1.0 node /usr/local/src/index.js"]
