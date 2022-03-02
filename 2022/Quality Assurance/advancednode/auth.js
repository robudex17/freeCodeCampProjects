const passport = require('passport')
const LocalStrategy = require('passport-local')
const GitHubStrategy = require('passport-github'
)
require('dotenv').config({path: './sample.env'})
module.exports = (app,myDataBase) => {

  //this middleware is being called by passport.authenticate 
  //github strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // callbackURL: 'https://boilerplate-advancednode.robudexworld.repl.co/auth/github/callback'
    callbackURL: 'http://localhost:8080/auth/github/callback'
  }, function(accessToken, refreshToken, profile, cb) {
      myDataBase.findOneAndUpdate(
        { id: profile.id },
        {
          $setOnInsert: {
            id: profile.id,
            name: profile.displayName || 'John Doe',
            photo: profile.photos[0].value || '',
            email: Array.isArray(profile.emails)
              ? profile.emails[0].value
              : 'No public email',
            created_on: new Date(),
            provider: profile.provider || ''
          },
          $set: {
            last_login: new Date()
          },
          $inc: {
            login_count: 1
          }
        },
        { upsert: true, new: true },
        (err, doc) => {
          return cb(null, doc.value);
        }
    );
    
  }))

  //this middleware is being called by passport.authenticate
  //local strategy
  passport.use(new LocalStrategy(function(username, password, done) {
      myDataBase.findOne({username: username}, function(err, user) {
        console.log('User '+ username +' attempted to log in.');
      
        if(err){
          return done(err)
        }
        if(!user){
          return done(null, false)
        
        }
        if(password !== user.password){
          return done(null, false)
        }
      
        return done(null, user)
      })
    }))
    passport.serializeUser((user,done) => {
    return  done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
      myDataBase.findOne({id: new ObjectID(id)}, (err, doc) => {
      return  done(null, doc)
      })
    })

    app.get('/logout', (req,res, next) => {
      req.logout()
      res.redirect('/')
    })

}