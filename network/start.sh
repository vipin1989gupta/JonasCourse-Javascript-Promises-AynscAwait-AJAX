#!/bin/bash

# Check to see if the user has created a .env file and that sourcing this file results in an environent
# variable called CHAINCODE_BUILD_PATH being set. This ENV is used by the docker-compose.yaml file and
# should contain the full path to the built chaincode. e.g
# export CHAINCODE_BUILD_PATH="/Users/vipin/go/src/github.com/ayn"
if [ ! -f .env ]
then
    read -p "Enter the full path to the directory containing your built chaincode (e.g. /Users/JohnDoe/blockchain/chaincode-repo/build): " build_path
    echo "export CHAINCODE_BUILD_PATH=$build_path" > .env
fi
source .env

if [ -z $CHAINCODE_BUILD_PATH ] 
then
    echo "Missing ENV! CHAINCODE_BUILD_PATH must be set in .env and contain the path to the directory containing your built chaincode."
    exit 1
else
    echo "Setting path to Chaincode repo to $CHAINCODE_BUILD_PATH"
fi

# Check that the provided build path exists, otherwise delete the .env file so the user is forced to enter
# a new build path when re-running the script.
ls $CHAINCODE_BUILD_PATH
if [ $? -ne 0 ]
then 
    echo "Specified chaincode build directory ($CHAINCODE_BUILD_PATH) does not exist. Exiting - Please try again."
    rm .env
    exit 1
fi


set -ev
docker-compose -f docker-compose.yaml down
docker-compose -f docker-compose.yaml up -d

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=9
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec cli peer channel create -o orderer.example.com:7050 -c defaultchannel -f /etc/hyperledger/configtx/channel.tx
sleep ${FABRIC_START_TIMEOUT}

# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=org1" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b defaultchannel.block

# Join peer0.org2.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=org2" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.example.com/msp" peer0.org2.example.com peer channel join -b defaultchannel.block
