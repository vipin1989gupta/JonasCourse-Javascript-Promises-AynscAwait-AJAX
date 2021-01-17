'use strict';

 const FabricCAServices = require('fabric-ca-client');
 const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
 const fs = require('fs');
 const path = require('path');

 const ccpPath = path.resolve(__dirname, 'connection.json');
 const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
 const ccp = JSON.parse(ccpJSON);

 async function main() {
   try {

   // Create a new CA client for interacting with the CA.
   const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
   const ca = new FabricCAServices(caURL);

   // Create a new file system based wallet for managing identities.
   const walletPath = path.join(process.cwd(), 'wallet');
   const wallet = new FileSystemWallet(walletPath);
   console.log(`Wallet path: ${walletPath}`);

   // Check to see if we've already enrolled the admin user.
   const userExists = await wallet.exists('admin');
   if (userExists) {
     console.log('An identity for "admin" already exists in the wallet');
     return;
   }

   // Enroll the admin user, and import the new identity into the wallet.
   const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
   const identity = X509WalletMixin.createIdentity('org1', enrollment.certificate, enrollment.key.toBytes());
   await wallet.import('admin', identity);
   console.log('Successfully enrolled client "admin" and imported it into the wallet');

   } catch (error) {
     console.error(`Failed to enroll "admin": ${error}`);
     process.exit(1);
   }
 }

 main();