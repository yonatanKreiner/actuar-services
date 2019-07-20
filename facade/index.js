const express = require('express');
const proxy = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(cors());

app.set('port', (process.env.PORT || 7000));
app.set('name', 'facade');

const interestCalculatorUrl = process.env.INTEREST_CALCULATOR || 'http://localhost:7001';

const proxyOptions = {
  target: interestCalculatorUrl,
  pathRewrite: {
    '^/interest': ''
  },
  router: {
    '/interest': interestCalculatorUrl
  }
}

app.use(proxy(proxyOptions));

app.listen(app.get('port'), () => {
  console.log(`${app.get('name')} is running at localhost: ${app.get('port')}`); 
});