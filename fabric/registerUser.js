

"use strict";
const FabricCAServices = require('fabric-ca-client');
const {FileSystemWallet, Gateway, X509WalletMixin} = require("fabric-network")
//const utils = require('./utils.js');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
  try {
  
    // Create a new file system based wallet for managing identities.
    const wallet = new FileSystemWallet(utils.getWalletPath());
    // Check to see if we've already enrolled the admin user.
    const adminUser = 'admin'
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
    console.log(
        `An identity for the admin user ${adminUser} does not exist in the wallet`
    );
    console.log("Enroll the admin before retrying");
    return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

    // Get the CA client object from the gateway for interacting with the CA.
    //const ca = gateway.getClient().getCertificateAuthority();
    const caURL = ccp.certificateAuthorities['Org1CA'].url;
    const ca = new FabricCAServices(caURL);
    console.log("ca is ", ca)
    const adminIdentity = gateway.getCurrentIdentity(); 
    //const newUser = utils.getChaincodeUser();
    const userExists = await wallet.exists('admin');
    if (userExists) {
        console.error(`Failed to register user admin. User already exists.`);
        return
    }
    // For RBAC - not currently needed
    //attrList =  [{name:"Role", value: newUserData.role, ecert:true}]
    //attrReq = [{name:"Role", optional:false}]

    const secret = await ca.register(
        {
          //affiliation: "org1.department1",
          enrollmentID: 'admin',
          role: "admin"
        },
        adminIdentity
      );
    console.log("secret ", secret)

    const enrollment = await ca.enroll({
    enrollmentID: newUser,
    enrollmentSecret: secret
    });
    console.log(enrollment);

    const userIdentity = X509WalletMixin.createIdentity(
    utils.getMSP(),
    enrollment.certificate,
    enrollment.key.toBytes()
    );

    wallet.import(newUser, userIdentity);
    console.log( `Successfully registered and enrolled user ${newUser} and imported it into the wallet`);
    
    }catch (error) {
        console.error(`Failed to register new user: ${error}`);
        process.exit(1);
    }
  }

main();