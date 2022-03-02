const passport = require('passport')
const bcrypt = require('bcrypt')

module.exports = (app,myDataBase) =>{

  //middleware for checking if the user is authenticated
function ensureAuthenticated(req,res, next){
  if(req.isAuthenticated()){
   return  next()
  }
  console.log('Failure to authenticate')
  res.redirect('/')
}

  app.route('/').get((req, res) => {
    
    res.render('pug/index', {
      title: 'Connected to Database',
      message: 'Please Login',
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true
    })
  })

  app.post('/login',passport.authenticate('local', {failureRedirect: '/'}),(req, res) => {
    res.redirect('/profile')
  })
  
  app.get('/profile',ensureAuthenticated, (req,res)=> {
    console.log(req.user.username)
     res.render(process.cwd() + '/views/pug/profile', {
       username: req.user.username
     })
  } )
  app.post('/register', (req,res, next) => {
    myDataBase.findOne({ username:req.body.username}).then((err,user) =>{
      if(err){
        next(err)
      }else if(user){
        redirect('/')
      }else{
        const hash = bcrypt.hashSync(req.body.password,12)
        return myDataBase.insertOne({ username:req.body.username, passpword:hash})
      }
    }).then((err,doc) =>{
      if(err){
        res.redirect('/')
      }else{
        next(null, doc.ops[0]);
      }
    })
  },passport.authenticate('local',{failureRedirect: '/'}),(req,res, next) => {
    res.redirect('/profile')
  })
 
  app.get('/logout', (req,res, next) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/auth/github',
    passport.authenticate('github')
  )

  app.get('/auth/github/callback',passport.authenticate('github',{
    failureRedirect: '/'
  }),(req, res) => {
    req.session.user_id = req.user.id
    res.redirect('/chat')
  })

  app.get('/chat', (req, res,next) => {
      res.render('pug/chat',{user: req.user})
  })
  
}