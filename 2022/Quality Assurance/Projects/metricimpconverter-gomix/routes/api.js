'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();
  

   app.get('/api/convert', (req, res,next) => {
   let input = req.query.input

    //remove all possible whitespace
     input = input.replace(/ /g, '')

    let initUnit = convertHandler.getUnit(input)
    let initNum = convertHandler.getNum(input)
    let returnUnit = '';
    let returnNum  = 0;
    let string ;
    
    
  
    if(initNum === 'invalid number' && initUnit === 'invalid unit'){
      return res.status(200).json('invalid number and unit')
    }

    if(initNum === 'invalid number'){
      return res.status(200).json('invalid number')
    }
    if(initUnit === 'invalid unit'){
      return res.status(200).json('invalid unit')
    }
 

    returnUnit = convertHandler.getReturnUnit(initUnit)
    returnNum = convertHandler.convert(initNum, initUnit) //+ sign convert from string to number type
    string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit)

    
    
    // {"initNum":1,"initUnit":"L","returnNum":0.26417,"returnUnit":"gal","string":"1 liters converts to 0.26417 gallons"}
    return res.status(200).json({initNum:initNum, initUnit:initUnit, returnNum:returnNum, returnUnit:returnUnit,string:string})
    
      
  })

};


// {"initNum":1,"initUnit":"gal","returnNum":3.78541,"returnUnit":"L","string":"1 gallons converts to 3.78541 liters"}
// {"initNum":1,"initUnit":"gal","returnNum":3.78541,"returnUnit":"L","string":"1 gallons converts to 3.78541 liters"}

// {"initNum":1,"initUnit":"L","returnNum":0.26417,"returnUnit":"gal","string":"1 liters converts to 0.26417 gallons"}
// {"initNum":1,"initUnit":"L","returnNum":0.26417,"returnUnit":"gal","string":"1 liters converts to 0.26417 gallons"}