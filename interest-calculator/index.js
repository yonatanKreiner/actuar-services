const express = require('express');
const bodyParser = require('body-parser');

const interestCalculate = require('./src/interestCalculation');
const calculateAlimonyPayments = require('./src/alimonyPaymentsCalculation');

const app = express();

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 7001));
app.set('name', 'interest calculator')

app.post('/', async (req, res) => {
  const date = req.body.calculationDate;
  const debts = req.body.debts;
  const isLegalInterest = req.body.isLegalInterest;

  const finalDebt = await interestCalculate(date, debts, isLegalInterest);

  res.send({ finalDebt });
});

app.post('/alimonyPayment', async (req, res) => {
  const children = req.body.children;
  const madadIndexateInterval = req.body.madadIndexateInterval;
  const startPaymentDate = req.body.startPaymentDate;

  const payments = calculateAlimonyPayments(children, madadIndexateInterval, startPaymentDate);

  res.send({payments});
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('name')} is running at localhost: ${app.get('port')}`); 
});