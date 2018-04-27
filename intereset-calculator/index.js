import express from 'express';
import bodyParser from 'body-parser';

import calculate from './src/calculation';

const app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 7001));

app.post('/', async (req, res) => {
  const date = req.body.calculationDate;
  const debts = req.body.debts;

  res.send({ finalDebt: await calculate(date, debts) });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); 
});