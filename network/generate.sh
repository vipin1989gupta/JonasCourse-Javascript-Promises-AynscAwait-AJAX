# TOOD: ask the user to say the defaults (and perhaps supply flags to change what is being generated?)

export PATH=$PATH:${PWD}/bin
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=defaultchannel

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# make config dir
if [ ! -d "config" ]; then
  mkdir config
fi

# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# generate genesis block for orderer
configtxgen -profile OneOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
configtxgen -profile OneOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./config/Org1anchors.tx -channelID $CHANNEL_NAME -asOrg Org1
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi
