package main

import (
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"testing"	
)

type SimpleChaincode1 struct {
}

func (t *SimpleChaincode1) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func Test_SupplyChain_test(t *testing.T) {

	stub := shim.NewMockStub("mockStub", new(SimpleChaincode))

	if stub == nil {

		t.Fatalf("MockStub creation failed")

  }
    addRecord := stub.MockInvoke("addRecord", [][]byte{[]byte("addPatientData"), []byte(patientData)})
	fmt.Println("Printing Test result for addRecord ::::", string(addRecord.Payload))

	getRecord := stub.MockInvoke("getRecord",[][]byte{[]byte("getPatientData"), []byte("harish@gmail.com")})
	fmt.Println("Printing Test result for getRecord ::", string(getRecord.Payload))

}



const patientData = `{

	"firstName" : "Harish",
	"lastName"  : "Reddy",
	"dob"       : "17Dec1990",
	"email" :    "harish@gmail.com",
	"phoneNumber": 1111122222,
	"address": {
		"street1" : "BTM Layout",
		"city" : "Bangalore",
		"state": "Karnataka",
		"country": "India",
		"postalCode": 560076           
	}
}`
