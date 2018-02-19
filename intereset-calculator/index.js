const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 7001));

app.get('*', function(request, response) {
  response.send('Hello Interest!')
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); 
});