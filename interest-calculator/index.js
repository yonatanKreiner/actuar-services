const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')

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

const authPass = process.env.BASIC_AUTH_PASS || "admin";
console.log("the authpass is " + authPass);
app.use(basicAuth({
  users: {  "actuar": authPass },
  challenge: true,
  realm: 'prod-actuar',
}));

app.post('/', async (req, res) => {
const debts = req.body.debts;

  const finalDebt = await interestCalculate(debts);

  res.send({ finalDebt });
});

app.post('/alimonyPayment', async (req, res) => {
  const children = req.body.children;
  const madadIndexateInterval = parseInt(req.body.madadIndexateInterval);
  const startPaymentDate = req.body.startPaymentDate;
  const endPaymentDate = req.body.calcDate;
  const baseIndexateDate = req.body.baseIndexateDate;

  const payments = await calculateAlimonyPayments(children, madadIndexateInterval, startPaymentDate, endPaymentDate, baseIndexateDate);

  res.send({payments});
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('name')} is running at localhost: ${app.get('port')}`); 
});