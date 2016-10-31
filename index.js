const express = require('express');
const bodyParser = require('body-parser');
var apiai = require('apiai');
var apiai = apiai("b2bbc6154ca144ce9f2cf4c3b9d2baf2");
var postrequest = require('superagent');
var jwt = require('jsonwebtoken');
var USER_ID = 'appUser _id';
var KEY_ID = 'app_5813745f2c3b2627004b4442';
var SECRET = '47i5ZPYzAD4i_95OxzU070yG';
var token = jwt.sign({
    scope: 'app'
},
    SECRET,
    {
        header: {
            alg: 'HS256',
            kid: 'app_5813745f2c3b2627004b4442'
        }
    });

var port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());

app.use(function(req, res) {
  const data = JSON.stringify(req.body, null,4);
  //console.log('-->', data);
  //var arr = data.split(",")
  //var text = arr[2].split("text")
  //var finaltext = text[1].split('"')
  var user_input = data.split("messages")[1].split("text")[1].split('"')[2]
  USER_ID = data.split("appUser")[3].split("_id")[1].split('"')[2]

  console.log(user_input);
//  console.log(data.split("appUser")[3]);
//  console.log(data.split("appUser")[3].split("_id")[1]);
  console.log(USER_ID);

  //console.log('-->', data);
  var request = apiai.textRequest(user_input);

  request.on('response', function(response) {
    const bot_data =  JSON.stringify(response, null);
    var bot_output = bot_data.split("fulfillment")[1].split("speech")[1].split('"')[2]
    //console.log(speech[12]);
    //var speech2 = speech[12].split("speech")[1].split('"')[2]
    console.log(bot_output);
    console.log(token);


    postrequest
      .post('https://api.smooch.io/v1/appusers/' + USER_ID + '/conversation/messages')
      .send({
        text: bot_output,
        role: 'appMaker'
      })
      .set('authorization', 'Bearer ' + token)
      .set('Accept', 'application/json')
      .end(function(err2, postres) {
        console.log(err2, postres.body, postres.statusCode);
    });


  });

  request.on('error', function(error) {
      console.log(error);
  });

  request.end();
  res.end();
});

app.listen(port, function() {
  console.log("listening on 8000\n\n");
});
