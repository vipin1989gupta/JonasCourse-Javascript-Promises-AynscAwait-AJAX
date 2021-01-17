# Exit on first error, print all commands.

# Check to see if the user has created a .env file and that sourcing this file results in an environent
# variable called CHAINCODE_BUILD_PATH being set. This ENV is used by the docker-compose.yaml file and
# should contain the full path to the built chaincode. e.g
# export CHAINCODE_BUILD_PATH="/Users/JohnDoe/blockchain/chaincode-repo/build"
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

# Shut down the Docker containers that might be currently running.
docker-compose -f docker-compose.yaml stop
docker rm -f $(docker ps -aq)
docker rmi $(docker images dev-* -q)