require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
bodyParser = require('body-parser');
const url = require('url');
const dns = require('dns');

const urlarrary = [];
let id = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.get('/api/shorturl/:short_url', function(req,res){
  const short_url = req.params.short_url;
    const urlElement = urlarrary.find(el => el.short_url.toString() === short_url)
    if(urlElement){
      res.redirect(urlElement.original_url);
    }else{
      res.end('Not found');
    }
})
app.post('/api/shorturl', function(req,res, next) {
  const postUrl = req.body.url 
  if(postUrl.includes('http://') || postUrl.includes('https://')){
    let urlHost = new URL(postUrl).host
    dns.lookup(urlHost, (err) => {
      if(!err){
          urlarrary.push({original_url: postUrl, short_url :id})
          res.json({original_url: postUrl, short_url:id})
          id++;
      }else{
        res.json({'error':'invalid url'});
      }
    })
  }else{
    res.json({'error':'invalid url'});
  }

})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
