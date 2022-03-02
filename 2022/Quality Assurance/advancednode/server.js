'use strict';
require('dotenv').config({path: './sample.env'});
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const ObjectID = require('mongodb').ObjectID;
const auth = require('./auth')
const routes = require('./routes')

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'pug');



myDB(async client => {
 const myDataBase = await client.db('freecodecamp').collection('users');
  auth(app, myDataBase)
  routes(app, myDataBase)

}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('pug/index', {
      title: e.message,
      message: 'Unable to Login'
    })
  })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
