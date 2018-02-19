const express = require('express');
const http = require('http');
const proxy = require('http-proxy-middleware');
const helmet = require('helmet');

const app = express();
app.use(helmet());

app.set('port', (process.env.PORT || 7000));

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.use('/interest', proxy({ target: 'http://localhost:7001' }));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); 
});