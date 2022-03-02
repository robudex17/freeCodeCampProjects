const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// chai
//         .request(server)
//         .get('/hello')
//         .end(function (err, res) {
//           assert.equal(res.status, 200);
//           assert.equal(res.text, 'hello Guest');
//           done();
//         });

suite('Functional Tests', function() {
    test('Valid input', function(done){
      chai.request(server).get('/api/convert?input=10L')
      .end(function(err, res){
        //   console.log(res)
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json')
          assert.equal(res.text, '{"initNum":10,"initUnit":"L","returnNum":2.64172,"returnUnit":"gal","string":"10 liters converts to 2.64172 gallons"}')
          done()
      }) 
    })
    test('Invalid Unit', function(done) {
        chai.request(server)
        .get('/api/convert?input=32g')
        .end(function(err,res) {
            assert.equal(res.status , 200)
            assert.equal(res.type, 'application/json')
            assert.equal(res.text, '"invalid unit"')
        })
        done()
    })
    test('Invalid Number', function(done){
        chai.request(server)
        .get('/api/convert?input=3/7.2/4kg')
        .end(function(err, res){
            assert.equal(res.status, 200)
            assert.equal(res.type, 'application/json')
            assert.equal(res.text,'"invalid number"')
            done()
        })
    })
    test('Invalid Number and Unit', function(done){
        chai.request(server)
        .get('/api/convert?input=3/7.2/4kilomegagram')
        .end(function (err, res){
            assert.equal(res.status, 200)
            assert.equal(res.type, 'application/json')
            assert.equal(res.text, '"invalid number and unit"')
            done()
        })
    })
    test('No Number', function(done){
        chai.request(server)
        .get('/api/convert?input=gal')
        .end(function (err, res){
            assert.equal(res.status, 200)
            assert.equal(res.type, 'application/json')
            assert.equal(res.text, '{"initNum":1,"initUnit":"gal","returnNum":3.78541,"returnUnit":"L","string":"1 gallons converts to 3.78541 liters"}')
            done()
        })
    })
     
});
