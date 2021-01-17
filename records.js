const express = require('express')
const bodyParser = require('body-parser')

const morgan = require('morgan')
var router = express.Router();
var network = require('./fabric/network.js');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');

const app = express()

var cfenv = require('cfenv');

var fs = require("fs");

router.post('/addRecord', async function (req, res) {
    // app.post('/createResource', (req, res) => { 
        console.log(" **** Inside addRecord **** ")
        console.log(" **** createResource ::: Print input", req.body);    
            const resp = network.addRecord(
              req.body
              )
              res.status(200).json({message: "successfully added resource!"})
            // .then((response) => {
            //   res.status(200).json({message: "successfully added resource!"})
            // });
          });

          router.get('/getRecord/:email', async function (req, res) {
            //app.get('/getResourceData',(req,res) => {
              console.log(req.body);
                 const resp = network.getRecord(   
                   req.params.email
                   )
      
                   console.log(" **** Print resp :: ", resp)
                  if (resp === undefined ) { 
                    console.log(" **** Print resp :: ", resp)
                    res.status(404).json({message: resp})
      
                  } else {
                    res.status(200).json(resp)
                  }
                  
                  // .then((response) => {
                  //   res.status(200).json(response)
                  // });
            })         
          

module.exports = router;