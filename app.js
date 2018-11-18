const express = require('express');
const nodemailer = require('nodemailer');
const PubSub = require('pubsub-js');
const twilio = require('twilio');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride =  require('method-override');
const redis = require('redis');

//Create Redis Client
let client = redis.createClient();
client.on('connect',function(){
console.log('Connected to Redis');
});

//set port
const port = 3000;

// Init app
const app = express();

//View Engine\
app.engine('handlebars',exphbs({defaulLayout:'main'}));
app.set('view engine','handlebars');

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({entended:false}));

//methodOverride

app.use(methodOverride('_method'));

//Search Page
app.get('/',function(req, res, next){
 res.render('adduser');
});

app.get('/user/search',function(req, res, next){
 let id = req.body.id;
 client.hgetall(id,function(err,obj){
 if(!obj){
  res.render('searchusers',{
   error:'User does not exist'
  });
 }else{
  obj.id = id;
  res.render('details',{
  user:obj
  });
 }
 });
});

//Add User Page Render
app.get('/user/add',function(req, res, next){
 res.render('adduser');
});

//Add User API
app.post('/user/add',function(req, res, next){
 let email = req.body.email;
 let phone = req.body.phone;
 let pollution = req.body.pollution;
 let area = req.body.area;
 client.incr('id', function(err, id) {
  client.hmset(id, [
  'email', email,
  'phone',phone,
  'pollution',pollution,
  'area',area
 ],function(err,reply){
if(err){
 console.log(err);
}
console.log(reply);
res.redirect('/')
 });
});
});


app.listen(port,function(){
console.log('Server started on port '+port);
});