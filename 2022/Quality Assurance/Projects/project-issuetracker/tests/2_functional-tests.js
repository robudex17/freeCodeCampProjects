const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let _id;
suite('Functional Tests', function() {
  test('Valid POST', function (done){
      chai.request(server)
      .post('/api/issues/:project')
      .send({
        issue_title: 'test title',
        issue_text : 'sample issue text',
        created_by: 'Rogmer',
        assigned_to : 'Robudex',
        status_text : 'Pending issue',
        open: true
      })
      .end(function(err, res) {
         _id = res.body._id
        
          assert.equal(res.type, 'application/json')
          assert.equal(res.status, 201)
          assert.equal(res.body.created_by, 'Rogmer' )
          assert.equal(res.body.issue_title, 'test title')
          assert.equal(res.body.issue_text, 'sample issue text')
          assert.equal(res.body.assigned_to, 'Robudex')
          assert.equal(res.body.status_text, 'Pending issue')
          assert.equal(res.body.open, true)
          assert.notEqual(res.body_id, '')
          assert.notEqual(res.body.created_on, '')
          assert.notEqual(res.body.updated_on, '')
          done()

      })
  })
  test('Valid Post in Only Required Fields', function(done){
    console.log(_id)
      chai.request(server)
      .post('/api/issues/:project')
      .send({
        issue_title: 'test title',
        issue_text : 'sample issue text',
        created_by: 'Rogmer',
        assigned_to : '',
        status_text : '',
        open: true
      })
      .end(function(err,res){
      
        assert.equal(res.type, 'application/json')
        assert.equal(res.status, 201)
        assert.equal(res.body.issue_title, 'test title')
        assert.equal(res.body.issue_text, 'sample issue text')
        assert.equal(res.body.created_by, 'Rogmer' )
        assert.equal(res.body.assigned_to, '')
        assert.equal(res.body.status_text, '')
        assert.equal(res.body.open, true)
        assert.notEqual(res.body._id, '')
        assert.notEqual(res.body.created_on, '')
        assert.notEqual(res.body.updated_on, '')
        done()

      })
  })
  test('Required Fields Empty', function(done){
      chai.request(server)
      .post('/api/issues/:project')
      .send({  
        issue_title: '',
        issue_text : '',
        created_by: '',
        assigned_to : 'Robudex',
        status_text : 'Pending issue',
        open: true
      })
      .end(function(err, res){
        assert.equal(res.type, 'application/json')
        assert.equal(res.body.error , 'required field(s) missing')
        done()
      }) 
  })
  test('View issues on a project', function(done){
    chai.request(server)
    .get('/api/issues/:project')
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.isArray(JSON.parse(res.text))
      done()
    })
  })
  test('View issues with one filter', function(done){
    chai.request(server)
    .get('/api/issues/:project?open=true')
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.isArray(JSON.parse(res.text))
      done()
    })
  })
  test('View issues with many filter', function(done){
    chai.request(server)
    .get('/api/issues/:project?open=true&created_by=rogmer')
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.isArray(JSON.parse(res.text))
      done()
    })
  })
  test('Update one field on an issue:', function(done){
    chai.request(server)
    .put('/api/issues/:project')
    .send({_id:_id,issue_title:'New Issue Title'})
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.equal(res.text, `{"result":"successfully updated","_id":"${_id}"}`)
      assert.typeOf(JSON.parse(res.text), 'object')
      assert.property(JSON.parse(res.text),'result')
      assert.property(JSON.parse(res.text),'_id')
      done()
    })
  })
  test('Update multiple fields on an issue:', function(done){
    chai.request(server)
    .put('/api/issues/:project')
    .send({_id:_id,issue_title:'New Issue Title', issue_text:'New issue text'})
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.equal(res.text, `{"result":"successfully updated","_id":"${_id}"}`)
      assert.typeOf(JSON.parse(res.text), 'object')
      assert.property(JSON.parse(res.text),'result')
      assert.property(JSON.parse(res.text),'_id')
      done()
    })
  })
  test('an issue with missing _id', function(done){
    console.log(_id)
    chai.request(server)
    .put('/api/issues/:project')
    .send({_id:false,issue_title:'New Issue Title', issue_text:'New issue text'})
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.equal(res.text, '{"error":"missing _id"}')
      assert.typeOf(JSON.parse(res.text), 'object')
      assert.property(JSON.parse(res.text),'error')
      
      done()
    })
  })
  test('no fields to update', function(done){
    chai.request(server)
    .put('/api/issues/:project')
    .send({_id:_id})
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.equal(res.text, `{"error":"no update field(s) sent","_id":"${_id}"}`)
      assert.typeOf(JSON.parse(res.text), 'object')
      assert.property(JSON.parse(res.text),'error')
      assert.property(JSON.parse(res.text),'_id')
      
      
      done()
    })
   
  })
  test('invalid _id on Update', function(done){
    chai.request(server)
    .put('/api/issues/:project')
    .send({_id:"6228f6fa1652de53dcb4brogmer",issue_title:'New Issue Title', issue_text:'New issue text'})
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.equal(res.text, '{"error":"Argument passed in must be a string of 12 bytes or a string of 24 hex characters"}')
      assert.typeOf(JSON.parse(res.text), 'object')
      assert.property(JSON.parse(res.text),'error')
      
      done()
    })

  })
  test('Invalid Id on Delete', function(done){
    chai.request(server)
    .delete('/api/issues/:project')
    .send({_id:"6228f6fa1652de53dcb4brogmer"})
    .end(function (err, res){
      assert.equal(res.status, 200)
      assert.equal(res.type, 'application/json')
      assert.equal(res.text, '{"error":"Invalid Id"}')
      assert.typeOf(JSON.parse(res.text), 'object')
      assert.property(JSON.parse(res.text),'error')
      
      done()
  })
})
test('Delete Successfully', function(done){
  chai.request(server)
  .delete('/api/issues/:project')
  .send({_id:_id})
  .end(function (err, res){
    assert.equal(res.status, 200)
    assert.equal(res.type, 'application/json')
    assert.equal(res.text, `{"result":"successfully deleted","_id":"${_id}"}`)
    assert.typeOf(JSON.parse(res.text), 'object')
    assert.property(JSON.parse(res.text),'result')
    assert.property(JSON.parse(res.text),'_id')
    done()
  })
})
test('an issue with missing _id', function(done){
  console.log(_id)
  chai.request(server)
  .delete('/api/issues/:project')
  .send({_id:false})
  .end(function (err, res){
    assert.equal(res.status, 200)
    assert.equal(res.type, 'application/json')
    assert.equal(res.text, '{"error":"missing _id"}')
    assert.typeOf(JSON.parse(res.text), 'object')
    assert.property(JSON.parse(res.text),'error')
    
    done()
  })
})
})
