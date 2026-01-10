## HYPERLEDGER FABRIC SETUP
This Project runs on a permissioned netwrok(Hyperledger fabric)

## Prerequisites

### System Requirements
- Linux distribution (Ubuntu 18.04+, CentOS 7+, RHEL 7+)
- Docker
- Python 3.6+
- Node.js 12+ (for smart contract development)
- Git
- curl, wget, tar

### Required Tools
```bash
# Install Podman
sudo dnf install docker docker-engine -y  # For RHEL/CentOS/Fedora
# OR
sudo apt-get install docker -y  # For Ubuntu/Debian

## Installation

### 1. Install Hyperledger Fabric Samples and Binaries

# Clone the repo 
git clone https://github.com/momentumlabs99/branchchain-mvp.git

#Delete current fabric-samples folder
rm -f fabric-samples

# Download Fabric binaries and config from hyperleedger
curl -sSL https://bit.ly/2ysbOFE | bash -s 2.5.9 1.5.7

# This will create a folder /fabric-samples
cd fabric-samples
```


### 2. Set up Environment Variables

```bash
# Add to ~/.bashrc or ~/.profile
echo 'export PATH=$PATH:$HOME/fabric/fabric-samples/bin' >> ~/.bashrc
echo 'export FABRIC_CFG_PATH=$HOME/fabric/fabric-samples/config' >> ~/.bashrc

#Reload source-file
source ~/.bashrc
```

### 3. Verify Installation

```bash
# Check if binaries are properly installed
peer version
cryptogen version
configtxgen version
```
## If succesful:

## Set-up Docker Containers peers, orderers, CAs and Couchdb

### REPLACE the docker-compose-test-net.yaml

```bash
cd test-network/compose/docker

# REPLACE docker-compose-test-net.yaml WITH the following code:

# Fabric Test Network Docker Compose with CouchDB
# Fabric Version: 2.5.9
# CA Version: 1.5.7
# CouchDB Version: 3.3

version: '2'

services:

  # -----------------------------
  # Peer0 Org1
  # -----------------------------
  peer0.org1.example.com:
    container_name: peer0.org1.example.com
    image: hyperledger/fabric-peer:2.5.9
    labels:
      service: hyperledger-fabric
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=fabric_test
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDBbashrc
source ~/.bashrc
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb0.org1.example.com:5984
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=admin
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=adminpw
    volumes:
      - ./docker/peercfg:/etc/hyperledger/peercfg
      - ${DOCKER_SOCK}:/host/var/run/docker.sock
    networks:
      - fabric_test

  # -----------------------------
  # Peer0 Org2
  # -----------------------------
  peer0.org2.example.com:
    container_name: peer0.org2.example.com
    image: hyperledger/fabric-peer:2.5.9
    labels:
      service: hyperledger-fabric
    environment:
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=fabric_test
      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB
      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb0.org2.example.com:5984
      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=admin
      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=adminpw
    volumes:
      - ./docker/peercfg:/etc/hyperledger/peercfg
      - ${DOCKER_SOCK}:/host/var/run/docker.sock
    networks:
      - fabric_test

  # -----------------------------
  # CouchDB Org1
  # -----------------------------
  couchdb0.org1.example.com:
    container_name: couchdb0.org1.example.com
    image: couchdb:3.3
    labels:
      service: hyperledger-fabric
    environment:
      - COUCHDB_USER=admin
      - COUCHDB_PASSWORD=adminpw
    ports:
      - "5984:5984"
    networks:
      - fabric_test

  # -----------------------------
  # CouchDB Org2
  # -----------------------------
  couchdb0.org2.example.com:
    container_name: couchdb0.org2.example.com
    image: couchdb:3.3
    labels:
      service: hyperledger-fabric
    environment:
      - COUCHDB_USER=admin
      - COUCHDB_PASSWORD=adminpw
    ports:
      - "6984:5984"
    networks:
      - fabric_test

  # -----------------------------
  # Orderer
  # -----------------------------
  orderer.example.com:
    container_name: orderer.example.com
    image: hyperledger/fabric-orderer:2.5.9
    environment:
      - ORDERER_GENERAL_LOGLEVEL=info
      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0
      - ORDERER_GENERAL_GENESISMETHOD=file
      - ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block
      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP
      - ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp
    volumes:
      - ./docker/orderer:/var/hyperledger/orderer
    networks:
      - fabric_test

  # -----------------------------
  # Certificate Authorities
  # -----------------------------
  ca_org1:
    container_name: ca_org1
    image: hyperledger/fabric-ca:1.5.7
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca-org1
      - FABRIC_CA_SERVER_TLS_ENABLED=true
    ports:
      - "7054:7054"
    volumes:
      - ./docker/ca/org1:/etc/hyperledger/fabric-ca-server
    networks:
      - fabric_test

  ca_org2:
    container_name: ca_org2
    image: hyperledger/fabric-ca:1.5.7
    environment:
      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server
      - FABRIC_CA_SERVER_CA_NAME=ca-org2
      - FABRIC_CA_SERVER_TLS_ENABLED=true
    ports:
      - "8054:7054"
    volumes:
      - ./docker/ca/org2:/etc/hyperledger/fabric-ca-server
    networks:
      - fabric_test

# -----------------------------
# Network definition
# -----------------------------
networks:
  fabric_test:
    external: false

```

## Save and Exit

## Setup Channels to emulate production
``` bash
 cd test-network/scripts
```
## Delete Everything in createChannel.sh and then Copy and paste this in the createChannel.sh
``` bash 

#!/usr/bin/env bash

set -euo pipefail

# ---------------------------------------------------------------------------
# Imports
# ---------------------------------------------------------------------------
. scripts/envVar.sh

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
CHANNEL_NAME="${1:-mychannel}"
DELAY="${2:-3}"
MAX_RETRY="${3:-5}"
VERBOSE="${4:-false}"
BFT="${5:-0}"

BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

: ${CONTAINER_CLI:="docker"}
if command -v ${CONTAINER_CLI}-compose > /dev/null 2>&1; then
  CONTAINER_CLI_COMPOSE="${CONTAINER_CLI}-compose"
else
  CONTAINER_CLI_COMPOSE="${CONTAINER_CLI} compose"
fi

infoln "Using ${CONTAINER_CLI} and ${CONTAINER_CLI_COMPOSE}"

mkdir -p channel-artifacts

# ---------------------------------------------------------------------------
# Functions
# ---------------------------------------------------------------------------

createChannelGenesisBlock() {
  local bft_true=$1
  setGlobals 1

  which configtxgen >/dev/null 2>&1 || fatalln "configtxgen tool not found"

  infoln "Generating genesis block for channel '${CHANNEL_NAME}'"

  if [ "$bft_true" -eq 1 ]; then
    configtxgen \
      -profile ChannelUsingBFT \
      -outputBlock "${BLOCKFILE}" \
      -channelID "${CHANNEL_NAME}"
  else
    configtxgen \
      -profile ChannelUsingRaft \
      -outputBlock "${BLOCKFILE}" \
      -channelID "${CHANNEL_NAME}"
  fi
}

createChannel() {
  local bft_true=$1
  local rc=1
  local counter=1

  infoln "Adding orderers to channel '${CHANNEL_NAME}'"

  while [ $rc -ne 0 ] && [ $counter -le $MAX_RETRY ]; do
    sleep "$DELAY"

    set +e
    . scripts/orderer.sh "${CHANNEL_NAME}" >/dev/null 2>&1
    rc=$?

    if [ "$bft_true" -eq 1 ]; then
      . scripts/orderer2.sh "${CHANNEL_NAME}" >/dev/null 2>&1
      . scripts/orderer3.sh "${CHANNEL_NAME}" >/dev/null 2>&1
      . scripts/orderer4.sh "${CHANNEL_NAME}" >/dev/null 2>&1
    fi
    set -e

    counter=$((counter + 1))
  done

  verifyResult $rc "Channel creation failed"
}

joinChannel() {
  local ORG=$1
  setGlobals "$ORG"

  infoln "Checking channel membership for peer0.org${ORG}"

  if peer channel list | grep -q "^${CHANNEL_NAME}$"; then
    infoln "peer0.org${ORG} already joined channel '${CHANNEL_NAME}'"
    return 0
  fi

  local rc=1
  local counter=1

  infoln "Joining peer0.org${ORG} to channel '${CHANNEL_NAME}'"

  while [ $rc -ne 0 ] && [ $counter -le $MAX_RETRY ]; do
    sleep "$DELAY"

    set +e
    peer channel join -b "${BLOCKFILE}" >&log.txt
    rc=$?
    set -e

    counter=$((counter + 1))
  done

  cat log.txt
  verifyResult $rc "peer0.org${ORG} failed to join channel '${CHANNEL_NAME}'"
}

setAnchorPeer() {
  local ORG=$1
  infoln "Setting anchor peer for org${ORG}"
  . scripts/setAnchorPeer.sh "$ORG" "$CHANNEL_NAME"
}

# ---------------------------------------------------------------------------
# Main flow
# ---------------------------------------------------------------------------

FABRIC_CFG_PATH="${PWD}/configtx"
[ "$BFT" -eq 1 ] && FABRIC_CFG_PATH="${PWD}/bft-config"

export FABRIC_CFG_PATH

createChannelGenesisBlock "$BFT"
createChannel "$BFT"

successln "Channel '${CHANNEL_NAME}' created"

joinChannel 1
joinChannel 2

setAnchorPeer 1
setAnchorPeer 2

successln "Channel '${CHANNEL_NAME}' setup completed successfully"
``` 

## Save createCahnnel.sh and exit

## Edit  file in the same folder
## ADD THIS at the beiginning of envVar.sh
``` bash
  : ${OVERRIDE_ORG:=""}

``` 

## Save and Exit


## Run Sample Test Network
## Locate the ./network.sh file in the test-network directory
``` bash
cd test-network/

Run
./network.sh up
``` 

## To stop the network
```  bash
./network.sh down

``` 