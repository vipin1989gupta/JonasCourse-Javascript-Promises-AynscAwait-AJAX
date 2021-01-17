# Local Fabric Network

### Pre-reqs

Install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

On Windows machines you may need to install a Linux VM forward the port of the `orderer.example.com` container and update `$ORDERER_ADDRESS` in `chaincode.sh`.

You may need to modify some of the config files, specifically `docker-compose.yaml` line 113 to map the location of your chaincode's build folder.

### Running

To stand up the network, issue `./start.sh`, this will stand up a local single peer network and set up the channel.

### Deploy Chaincode

To install chaincode, issue `./chaincode.sh install`. This will install the code under `build/example` (local dir) by default and you can specify another project using `-i`. For upgrades, use `-v <version>` to set a different version.

To instantiate (first deploy) and upgrade (second+ deploy) issue `./chaincode instantiate` and `./chaincode upgrade` respectively. Use the `-i` and `-v` flags to change the chaincode or version number.
