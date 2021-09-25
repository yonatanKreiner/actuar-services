const moment = require('moment');

const {getIndexate} = require('./madad');
const getInterestDifferences = require('./interest');

const interestCalculate = async (date, debts, isLegalInterest) => {
    const allDepts = Promise.all(debts.map(async (debt) => await addExtra(date, debt, isLegalInterest)));
    const finalDebt = (await allDepts).reduce((a, b) => a + b, 0);

    return finalDebt;
};

const addExtra = async (date, debt, isLegalInterest) => {
    const debtDate = moment(debt.date, 'DD/MM/YYYY').toDate();
    const paymentDate = moment(date, 'DD/MM/YYYY').toDate();
    
    const interestDifference = getInterestDifferences(new Date(paymentDate), new Date(debtDate), debt.sum, isLegalInterest);

    const hazmadaMadad = await getIndexate(debt.sum, debtDate, paymentDate);
    const hazmadaRibit = await getIndexate(interestDifference, debtDate, paymentDate);

    return debt.sum + hazmadaMadad + interestDifference + hazmadaRibit;
};

module.exports = interestCalculate;