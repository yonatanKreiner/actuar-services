const express = require('express');
const bodyParser = require('body-parser');

const calculate = require('./src/calculation');

const app = express();

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 7001));
app.set('name', 'interest calculator')

app.post('/', (req, res) => {
  const date = req.body.calculationDate;
  const debts = req.body.debts;

  res.send({ finalDebt: calculate(date, debts) });
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('name')} is running at localhost: ${app.get('port')}`); 
});