const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')

const interestCalculate = require('./src/calculators/interestCalculation');
const madadCalculate = require('./src/calculators/madadIndexateCalculator');
const calculateAlimonyPayments = require('./src/calculators/alimonyPaymentsCalculation');
const calcInsuranceYield = require('./src/calculators/insuranceYieldCalculation');
const calcProvidentFundYield = require('./src/calculators/providentFundYieldCalculation');
const calcPensionYield = require('./src/calculators/pensionYieldCalculation');
const { calculatorUsesContactEmail } = require('./src/tools/emailMgr');
const {getInterestsTable} = require('./src/tools/interest');
const CalculateSalaryDetermine = require('./src/calculators/salaryDetermineCalculator');

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
  const paymentDayInMonth = req.body.paymentDayInMonth;

  const payments = await calculateAlimonyPayments(children, madadIndexateInterval, startPaymentDate, endPaymentDate, baseIndexateDate, paymentDayInMonth);

  res.send({payments});
});

app.post('/insuranceYield', async (req, res) => {
  const fundId = req.body.fundId;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const sum = req.body.sum;

  const result = await calcInsuranceYield(fundId, startDate, endDate);
  res.send({result});
});

app.post('/providentFundYield', async (req, res) => {
  const fundId = req.body.fundId;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const sum = req.body.sum;

  const result = await calcProvidentFundYield(fundId, startDate, endDate);
  res.send({result});
});

app.post('/pensionYield', async (req, res) => {
  console.log(req.body)
  const fundId = req.body.fundId;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const sum = req.body.sum;

  const result = await calcPensionYield(fundId, startDate, endDate);
  res.send({result});
});

app.post('/madadIndexate', async (req,res) => {
  const rowsPayload = req.body.indexatePayload;
  const result = await madadCalculate(rowsPayload);
  res.send({result});
});

app.post('/calcUseRegestration', async (req, res) => {
  const email = req.body.email;
  const calcType = req.body.calcType;

  calculatorUsesContactEmail(email, calcType);
  res.sendStatus(200);
});

app.get('/interestsTable', async (req, res) => {
  const result = await getInterestsTable();
  res.send({result});
});

app.post('/salaryDetermine', async (req, res) => {
  const generalPayload = req.body.generalPayload;
  const salaries = req.body.salaries;

  const result = await CalculateSalaryDetermine(salaries, generalPayload.calculationDate);

  res.send(result);
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('name')} is running at localhost: ${app.get('port')}`); 
});