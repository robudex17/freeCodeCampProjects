const express = require('express')
const app = express()
const cors = require('cors')
const crypto = require('crypto');
const { application } = require('express');
const bodyParser = require('body-parser');
const { runInNewContext } = require('vm');

require('dotenv').config()

exerciseArray = {
  '61f3e83951d36440e9035115' : [
    { description: 'Burpess', duration: 30, date: 'Sat Jan 01 2022' },
    { description: 'Cardio', duration: 30, date: 'Sun Jan 02 2022' },
    {
      description: 'weight training',
      duration: 30,
      date: 'Sat Jan 29 2022'
    },

    { description: 'Tabata', duration: 50, date: 'Tue Feb 01 2022' },
    { description: 'Tabata', duration: 50, date: 'Tue Feb 02 2022' }
  ]
}
 

userArray = [
  {"username":"rogmer","_id":"61f3e83951d36440e9035115"}
]
  

app.use(cors())
app.use(express.static('public'))


app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users/:_id/exercises', function(req, res){
 const _id = req.params._id;
 const user = userArray.find(user => user._id === _id);
  
  if(!user ){
    res.json('user not found');
    return;
  }
 
  const description = req.body.description;
  const duration = Number(req.body.duration);
  let date = req.body.date;

  // function formValidation(description,duration, date){
  //     let formIsValid = true;
  //     if(description === '' || duration === ''){
  //       formIsValid = false;
  //       return
  //     }
  //     if(!duration){
  //       formIsValid = false;
  //       return
  //     }
  //     if(date !== '' && !new Date(date).getTime()){
  //       formIsValid = false;
  //       return
  //     }
  //     return formIsValid
  // }
  // if(!formValidation(description,duration,date)){
  //   res.json('Invalid inputs');
  //   return;
  // }
  // if(date !== '' && ! new Date(date).getTime()){
  //   res.json('Invalid Date')
  //   return
  // }
  if(date == '' || !new Date(date).getTime()){
    date = new Date().toDateString()
  }else{
    date = new Date(date).toDateString()
  }
    exerciseArray[_id].push({description,duration,date});
    console.log(exerciseArray);
    res.json({username:user.username, description,duration,date,_id});
})

app.get('/api/users/:id/logs', function (req, res){
  const id = req.params.id;
  const user = userArray.find(user => user._id === id);

  console.log(req.query.from);
  console.log(req.query.to);
  console.log(req.query.limit);

  let from = new Date(req.query.from).toDateString();
  let to = new Date(req.query.to).toDateString();
  let limit = Math.floor(Math.abs(Number(req.query.limit))) //make sure the get only real and absolute  Number
  let valid = true;
     //if limit is not number  or limit is equal to zero set limit to 1 and valid is equal false
     if(!limit || limit == 0){
       limit = 1
       valid = false
     }

  console.log(from);
  console.log(to);
  console.log(limit);
  let log = [];
  let userLogs = {}
  if(!user ){
    res.end('logs not found')
    return
  }
  if(from != 'Invalid Date' && to != 'Invalid Date'  ){
    //  let fromdateStringf = new Date(from).toDateString();
     let fromTimeStamp= new Date(from).getTime();
    //  todateString = new Date(to).toDateString();
    let toTimeStamp = new Date(to).getTime();
     

     if(fromTimeStamp > toTimeStamp){
       userLogs.from = from;
       userLogs.to = to;
       log = []

     }else {
      for(let i=0;exerciseArray[id].length>i;i++ ){
        
        let date = new Date(exerciseArray[id][i].date).getTime();
       if( date>= fromTimeStamp && date<=toTimeStamp && limit>0){
         log.push(exerciseArray[id][i])
       }
       if(valid){
         limit--
       }
       
      }
      userLogs.to = to;
      userLogs.from = from
    }

     
  }else if ( from != 'Invalid Date'){
    let fromTimeStamp= new Date(from).getTime();
    for(let i=0;exerciseArray[id].length>i;i++ ){
        
      let date = new Date(exerciseArray[id][i].date).getTime();
     if( date>= fromTimeStamp && limit>0){
       log.push(exerciseArray[id][i])
     }
     if(valid){
       limit--
     }
     
    }
   
    userLogs.from = from
  

  }else if(to != 'Invalid Date' ){
    let toTimeStamp = new Date(to).getTime();
    for(let i=0;exerciseArray[id].length>i;i++ ){
        
      let date = new Date(exerciseArray[id][i].date).getTime();
     if( date<=toTimeStamp && limit>0){
       log.push(exerciseArray[id][i])
     }
     if(valid){
       limit--
     }
     
    }
    userLogs.to = to;
  

  }

  else{
   
    for(let i=0;exerciseArray[id].length>i;i++ ){
     if( limit>0){
       log.push(exerciseArray[id][i])
     }
     if(valid){
       limit--
     }
     
    }
  }
  

    //   userLogs = {
    //   _id: id,
    //   username: user.username,
    //   count: log.length,
    //   log: log
    // }
    userLogs._id = id;
    userLogs.username = user.username;
    userLogs.count = log.length;
    userLogs.log = log;

    res.json(userLogs);

})


app.post('/api/users', function(req, res){
  // {"username":"rogmer","_id":"61f3e83951d36440e9035115"}

  const username = req.body.username;
  if(username === ''){
    res.json('Path `username` is required.');
    return;
  }
  const _id = crypto.randomBytes(10).toString('hex');
  userArray.push({
    username,
    _id,
   
  })
  exerciseArray[_id] = []
  console.log(userArray)
  console.log(exerciseArray)
  res.json({username, _id});

});
app.get('/api/users', function(req, res){
  res.json(userArray);
})

app.use('/api', function(req, res){
  res.end('Not found')
})


const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})





//61f7f2cf51d36440e90356c4