/*
 * SPDX-License-Identifier: Apache-2.0  
 */


'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { isContext } = require('vm');
//var ccpPath = require('./connection.json');
const ccpPath = path.resolve('./fabric/connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

/***************************************** CHAINCODES ***********************************************/

/****************************INVOKE CHAINCODE TO STORE Resource DETAILS********************************/
/**ctx,resourceId,userRoleId,aliasName,skillId,businessTypeId,industryId,companyAddress1,companyDescription,companyName,officialMailId,phoneNumber */
//exports.addResource = async function(stub,resourceId,userRoleId,officialMailId) {
exports.addRecord = async function(recordObj) {
    console.log("***** Inside addRecord ****")
    console.log("***** Inside addRecord :: ", recordObj)
    try {

        //Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('admin');
        if (!userExists) {
            console.log('An identity for the user "admin" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return ({Error : 'An identity for the user "admin" does not exist in the wallet and Run the registerUser.js application before retrying'});
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('aydd');

        // Submit the specified transaction.
        const result = await contract.submitTransaction('addPatientData', JSON.stringify(recordObj));
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // Disconnect from the gateway.
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}






/*******************************QUERY method to get parties data*******************************************************/
exports.getRecord = async function(email) {
    try {
        console.log("***** Inside getRecord ****")
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('admin');
        if (!userExists) {
            console.log('An identity for the user "client" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return ({Error : 'An identity for the user "Tenderer" does not exist in the wallet and Run the registerUser.js application before retrying'});
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('aydd');

        // Evaluate the specified transaction.
       
        const result = await contract.evaluateTransaction('getPatientData',email);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}



