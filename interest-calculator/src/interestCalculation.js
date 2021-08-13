const moment = require('moment');

const {getIndexate} = require('./madad');
const getInterestDifferences = require('./interest');

const interestCalculate = async (date, debts, isLegalInterest) => {
    const allDepts = Promise.all(debts.map(async (debt) => await addExtra(date, debt, isLegalInterest)));
    const finalDebt = (await allDepts).reduce((a, b) => a + b, 0);

    return finalDebt;
};

const addExtra = async (date, debt, isLegalInterest) => {
    const interestDifference = getInterestDifferences(moment(debt.date, 'DD/MM/YYYY').toDate(), debt.sum, isLegalInterest);

    const hazmadaMadad = await getIndexate(debt.sum, moment(debt.date, 'DD/MM/YYYY').toDate(), moment(date, 'DD/MM/YYYY').toDate());
    const hazmadaRibit = await getIndexate(interestDifference,  moment(debt.date, 'DD/MM/YYYY').toDate(), moment(date, 'DD/MM/YYYY').toDate());

    return debt.sum + hazmadaMadad + interestDifference + hazmadaRibit;
};

module.exports = interestCalculate;