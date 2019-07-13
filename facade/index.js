const express = require('express');
const proxy = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.set('port', (process.env.PORT || 7000));
app.set('name', 'facade');

const proxyOptions = {
  target: 'http://localhost:7001',
  pathRewrite: {
    '^/interest': ''
  },
  router: {
    '/interest': 'http://localhost:7001'
  }
}

app.use(proxy(proxyOptions));

app.listen(app.get('port'), () => {
  console.log(`${app.get('name')} is running at localhost: ${app.get('port')}`); 
});