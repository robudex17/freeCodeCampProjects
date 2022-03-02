const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
     test('read whole number', function(done){
       assert.equal(12,convertHandler.getNum('12kg'))
       done()
     })
    test('read a decimal number input', function(done){
        assert.equal(1.5, convertHandler.getNum('1.5'))
        done()
    })
    test('read a fractional input', function(done){
     assert.equal(0.5, convertHandler.getNum('1/2'))
      assert.equal(0.5, convertHandler.getNum('1/2kg'))
      assert.equal(0.5, convertHandler.getNum('1/2random'))
      done()
    })
    test('read a fractional input with decimal', function(done){
     assert.equal(2.5/2, convertHandler.getNum('2.5/2'))
      assert.equal(2.5/2, convertHandler.getNum('2.5/2kg'))
      done()
      
    })
    test('error on a double-fraction', function(done){
        assert.equal('invalid number', convertHandler.getNum('3/2/3') )
       assert.equal('invalid number', convertHandler.getNum('3/2/3kg') )
       assert.equal('invalid number', convertHandler.getNum('3/2/3random') )
       done()
    }) 
    test('numerical input of 1', function(done){
        assert.equal(1, convertHandler.getNum('kg'))
      assert.equal(1, convertHandler.getNum(''))
      assert.equal(1, convertHandler.getNum('random'))
      done()
    })
    test('read each valid input unit', function(done){
        assert.equal('L',convertHandler.getUnit('l'))
        assert.equal('L',convertHandler.getUnit('L'))
        assert.equal('gal',convertHandler.getUnit('gal'))
        assert.equal('gal',convertHandler.getUnit('GAL'))
       assert.equal('km', convertHandler.getUnit('KM'))
       assert.equal('km', convertHandler.getUnit('km'))
       assert.equal('mi', convertHandler.getUnit('MI'))
       assert.equal('mi', convertHandler.getUnit('mi'))
       assert.equal('lbs', convertHandler.getUnit('lbs'))
       assert.equal('lbs', convertHandler.getUnit('LBS'))
       assert.equal('kg', convertHandler.getUnit('kg'))
       assert.equal('kg', convertHandler.getUnit('KG'))
       done()
      
    })
    test('invalid input unit', function(done){
        assert.equal('invalid unit', convertHandler.getUnit('abc'))
        done()
    })

    test('return unit for each valid input unit,', function(done){
        let returnUnit = convertHandler.getUnit('L')
        assert.isString(convertHandler.getReturnUnit(returnUnit))
        done()
    })
    test('spelled-out string unit for each valid input unit', function(done){
        assert.isString(convertHandler.spellOutUnit('1.2/2kg').unit)
        done()
    })

    test('gal to L',function(done){
        let number = 1
        let result = 3.78541*number
        result = Number.parseFloat(result).toFixed(5)
        assert.equal(result, convertHandler.convert(number,'gal'))
        done()
    })
    test('L to gal',function(done){
        let number = 5
        let result =  number/3.78541
         result = Number.parseFloat(result).toFixed(5)
       assert.equal(result, convertHandler.convert(number ,'L'))
       done()
    })
    test('mi to km',function(done){
        let number = 5
        let result =  number * 1.60934
         result = Number.parseFloat(result).toFixed(5)
        assert.equal(result, convertHandler.convert(number ,'mi'))
        done()
    })
    test('km to mi',function(done){
        let number = 5
        let result =  number/1.60934
         result = Number.parseFloat(result).toFixed(5)
       assert.equal(result, convertHandler.convert(number ,'km'))
       done()
    })
    test('lbs to kg',function(done){
        let number = 5
        let result =  number*0.453592
         result = Number.parseFloat(result).toFixed(5)
       assert.equal(result, convertHandler.convert(number ,'lbs'))
       done()
    })
    test('kg to lbs',function(done){
        let number = 5
        let result =  number/0.453592
         result = Number.parseFloat(result).toFixed(5)
       assert.equal(result, convertHandler.convert(number ,'kg'))
       done()
    })


 });