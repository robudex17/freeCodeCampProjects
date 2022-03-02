function ConvertHandler() {
  this.unitArray = ['gal', 'L', 'lbs', 'kg', 'mi', 'km']
  this.getNum = function(input) {
    let result;
    result = this.unitArray.find(element => element.toLowerCase() === input.toLowerCase())
    if(result || input === ''){
      result = 1
   
    }else{
      let newInput = this.spellOutUnit(input).number
      if(newInput !== 'invalid number'){
          if(Number(newInput)){
          result = +newInput
        }else{
          newInput = newInput.split('/')
          if(newInput.length === 2 && newInput[0] && newInput[1]) {
            let item1 = Number(newInput[0])
            let item2 = Number(newInput[1])
            let resultItem = item1 / item2
            if(resultItem){
              result = resultItem
            
            }
          }else{
            result = 'invalid number'
          }   
        }
        
     }else{
       result = 'invalid number'
     }
  
    }
    
    return result;
  };
  
  this.getUnit = function(input) {
    let result;

    
     result = this.unitArray.find(element => element.toLowerCase() === input.toLowerCase())
    if(result){
       return result;
    }
    let getUnit = this.spellOutUnit(input).unit
    
    if(getUnit !== 'invalid unit'){
      result = this.unitArray.find(element => element.toLowerCase() === getUnit.toLowerCase())
      if(result){
        return result
      }else{
        result = 'invalid unit'
      }
    }
    
    return result
   
  };
  
  this.getReturnUnit = function(initUnit) {
    let result;
    let unitTableObjet = {gal:'L',L:'gal',lbs:'kg',kg:'lbs',mi:'km',km:'mi'}
     if(unitTableObjet[initUnit]){
       return result = unitTableObjet[initUnit]
     }
     return result = undefined
  };

  this.spellOutUnit = function(input) {
   // let regex = /\D+$/gi //
   let result = {}
   let specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>?]/gi

   let regex =  /((?!\/|\d+)\D+)$/gi
  
   
   if(specialCharRegex.test(input)){
    
     result.number = 'invalid number'
     result.unit = 'invalid unit'
   }else{
   
    if(regex.test(input)){
      result.unit = input.match(regex)[0]
     
      let newInput = input.replace(result.unit, '')
     
      if(newInput === ''){
        result.number = 1
      }else{
        result.number = newInput
      }
    }else{
      result.unit = 'invalid unit'
      result.number = input
    }   
   }

   console.log(result)
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch(initUnit) {
      case 'gal':
        result =  galToL * initNum 
        break;
      case 'L':
        result = initNum / galToL
        break;
      case 'lbs':
        result =  lbsToKg * initNum
        break;
      case 'kg': 
        result =  initNum / lbsToKg
        break;
      case 'mi': 
        result =  miToKm * initNum
        break;
      case 'km':
        result =   initNum / miToKm  
        break;
      default:
        result = null
    }
    result = Number.parseFloat(result).toFixed(5)
    
    return +result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let unitFullnames = {gal:'gallons',L:'liters',lbs:'pounds',kg:'kilograms',mi:'miles',km:'kilometers'}
    let result  = `${initNum} ${unitFullnames[initUnit]} converts to ${returnNum} ${unitFullnames[returnUnit]}`;
   
    return result;
  };
  
}

module.exports = ConvertHandler;
