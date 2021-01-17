package main


import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)



type SimpleChaincode struct {
}

// Init initializes chaincode
// ===========================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}


// type Record struct {
// 	FirstName         string `json:"firstName"`
// 	LastName          string  `json:"lastName"`
// 	DOB               string  `json:"dob"`
// 	Email             string  `json:"email"`
// 	PhoneNumber       int64   `json:"phoneNumber"`
// 	Address           Address `json:"address"`   
// }


type Record struct {
	FirstName         string `json:"firstName"`
	LastName          string  `json:"lastName"`
	DOB               string  `json:"dob"`
	Email             string  `json:"email"`
	PhoneNumber       int64   `json:"phoneNumber"`
	Street1            string   `json:"street1"`
	City               string   `json:"city"`
	State              string   `json:"state"`
	Country            string   `json:"country"`
	PostalCode         int64    `json:"postalCode"`   
}



// type Address struct {
// 	Street1            string   `json:"street1"`
// 	City               string   `json:"city"`
// 	State              string   `json:"state"`
// 	Country            string   `json:"country"`
// 	PostalCode         int64    `json:"postalCode"`
// }


func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, _ := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	if function == "addPatientData" {
		return t.AddPatientData(stub)
	} else if function == "getPatientData" {
		PR :=  t.GetPatientData(stub)
		bytes, _ := json.Marshal(PR)
		return shim.Success([]byte(bytes))
	} 

	fmt.Println("invoke did not find func: " + function) 
	return shim.Error("Received unknown function invocation")
}

func (t *SimpleChaincode) AddPatientData(stub shim.ChaincodeStubInterface) pb.Response {
fmt.Println("**** AddPatientData :::: Enter")

	defer fmt.Println("**** AddProductData :::: Exit")


	var recordObj Record
	//var recordArr []Record

	_, args := stub.GetFunctionAndParameters()
	if len(args) < 1 {
		return shim.Error("AddPatientData" + ": Incorrect number of arguments.")
	}

	fmt.Println("**** Incoming Patient Data to be added ::::", args[0])

	patientDataParseErr := json.Unmarshal([]byte(args[0]), &recordObj)
	if patientDataParseErr != nil {
		fmt.Println("**** Error - AddPatientData: Error during json.Unmarshal ****")
		//utils.LOGGER.Error("CreateContract: Error during json.Unmarshal: ", err)
		return shim.Error(patientDataParseErr.Error())
	}

	fmt.Println("**** Printing Record Data :::::::", recordObj)

	InputAsBytes, erx := json.MarshalIndent(recordObj, "", "\r")
	_ = erx
	errPutState := stub.PutState(recordObj.Email, InputAsBytes)
	if errPutState != nil {
		fmt.Println("**** AddPatientData" + ": Error while putting data on Ledger. ****")
		return shim.Error("Error while putting data on Ledger")
	}

	return shim.Success([]byte("Successfully added data on ledger!!"))
}


func (sc *SimpleChaincode) GetPatientData(stub shim.ChaincodeStubInterface) Record {
	fmt.Println("**** Inside GetPatientData Method ****")
	defer fmt.Println("**** Exit GetPatientData Method ****")


	_, args := stub.GetFunctionAndParameters()

	var recordObj Record
	if len(args) < 1 {
		shim.Error("GetPatientData" + ": Incorrect number of arguments.")
	}

	fmt.Println("Print args[0]", args[0])
	recordBytes, _ := stub.GetState(args[0])
	err := json.Unmarshal(recordBytes, &recordObj)

			if err != nil {
				fmt.Printf("Error in parsing Record %v", err)
			}

			return recordObj
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

