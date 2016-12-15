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

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
  //Visualize the JSON
    //const data = JSON.stringify(req.body, null,4);
    //console.log('-->', data);
  //Read the JSON
    var user_input = req.body.messages[0].text;
    USER_ID = req.body.appUser.userId;
    //console.log(user_input);
    //console.log(USER_ID);

    var request = apiai.textRequest(user_input, {
      sessionId: 'bla123'
  });

    request.on('response', function(response) {
      const bot_data =  JSON.stringify(response, null,4);
      //console.log(bot_data);

      var bot_output = response.result.fulfillment.messages[0].speech;
      console.log(bot_output);
    //  console.log(token);

      postrequest
        .post('https://api.smooch.io/v1/appusers/' + USER_ID + '/messages')
        .send({
          text: bot_output,
          type: 'text',
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
  console.log("listening on 8080\n\n");
});
