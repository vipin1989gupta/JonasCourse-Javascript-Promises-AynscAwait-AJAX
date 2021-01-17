#!/bin/bash
# set -x

##############################################################################
# Default Settings
##############################################################################

CHANNEL_NAME="defaultchannel"
CHAINCODE_ID="ayn"
CHAINCODE_VERSION="1"

LANGUAGE="golang"
SOURCE_PATH="/github.com/ayn/"


INVOKE_ARGS='{"Args":["function_name","arg1","arg2"]}'
QUERY_ARGS='{"Args":["function_name","arg1"]}'
INIT_ARGS='{"Args":[""]}'

ORDERER_ADDRESS="orderer.example.com:7050"

##############################################################################
# Functions
##############################################################################

function install () {
    echo $SOURCE_PATH

    # Org 1 Install
    docker exec -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
                -e "CORE_PEER_LOCALMSPID=org1" \
                -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
                cli peer chaincode install -n "$CHAINCODE_ID" -v "$CHAINCODE_VERSION" -p "$SOURCE_PATH" -l "$LANGUAGE"

    # Org 2 Install
    docker exec -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
                -e "CORE_PEER_LOCALMSPID=org2" \
                -e "CORE_PEER_ADDRESS=peer0.org2.example.com:7051" \
                cli peer chaincode install -n "$CHAINCODE_ID" -v "$CHAINCODE_VERSION" -p "$SOURCE_PATH" -l "$LANGUAGE"

}

function instantiate () {
    docker exec cli peer chaincode instantiate -o $ORDERER_ADDRESS \
                               -C "$CHANNEL_NAME" \
                               -n "$CHAINCODE_ID" \
                               -v "$CHAINCODE_VERSION" \
                               -c "$INIT_ARGS"
}

function invoke () {
    docker exec cli peer chaincode invoke -o $ORDERER_ADDRESS \
                          -C $CHANNEL_NAME \
                          -n $CHAINCODE_ID \
                          -c $INVOKE_ARGS
}

function query () {
    docker exec cli peer chaincode query -o $ORDERER_ADDRESS \
                         -C $CHANNEL_NAME \
                         -n $CHAINCODE_ID \
                         -c $QUERY_ARGS
}

function upgrade () {
    docker exec cli peer chaincode upgrade -o $ORDERER_ADDRESS \
                           -C "$CHANNEL_NAME" \
                           -n "$CHAINCODE_ID" \
                           -v "$CHAINCODE_VERSION" \
                           -c "$INIT_ARGS"
}

##############################################################################
# Options denote which command to run and what to overwrite
##############################################################################

# Parse args
while [ $# -gt 0 ]; do
    CURRENT="$1"

    case $CURRENT in

        # Action
        install)
            FUNCTION="$1"
            shift
        ;;

        instantiate)
            FUNCTION="$1"
            shift
        ;;

        upgrade)
            FUNCTION="$1"
            shift
        ;;

        invoke)
            FUNCTION="$1"
            shift
        ;;

        query)
            FUNCTION="$1"
            shift
        ;;

        # Flags
        -ch|--channel)
            CHANNEL_NAME="$2"
            shift
            shift
        ;;

        -i|--id)
            CHAINCODE_ID="$2"
            shift
            shift
        ;;

        -l|--language)
            LANGUAGE="$2"
            shift
            shift
        ;;

        -p|--path)
            # n.b.
            # if language=node this is appended to '/'
            # if language=golang this is appended to '/opt/gopath/src/'
            # (both of these paths must exist inside the CLI container)

            SOURCE_PATH="$2"
            shift
            shift
        ;;

        -v|--version)
            # This should default to the latest version of this chaincode, bit hard to do in bash
            # so do in a future version
            CHAINCODE_VERSION="$2"
            shift
            shift
        ;;

        -a|--args)
            # This should be submitted as the final argument and as a
            # list of strings, place them in the apropriate format then submit
            # Also, if you put a JSON with spaces it will error

            # Jump over the '-a'
            args='{"Args":["'$2
            shift
            shift

            # Iterate over remaining arguments, building up the JSON
            for i in "$@"
            do
                args=$args'","'$i
                shift
            done

            # Close off the JSON
            ARGS=$args'"]}'
        ;;

        *)
            echo "Unrecognised flag: '$1'"
            shift
            shift    
        ;;
    esac
done

# Run the command
case $FUNCTION in
    install)
        install
    ;;
    
    instantiate)
        if ! [ -z "$ARGS" ]; then
            INIT_ARGS=$ARGS
        fi

        instantiate
    ;;
    
    upgrade)
        if ! [ -z "$ARGS" ]; then
            INIT_ARGS=$ARGS
        fi

        upgrade
    ;;

    invoke)
        if ! [ -z "$ARGS" ]; then
            INVOKE_ARGS=$ARGS
        fi

        invoke
    ;;
    
    query)
        if ! [ -z "$ARGS" ]; then
            QUERY_ARGS=$ARGS
        fi

        query
    ;;

    ls|list)
        list
    ;;
esac