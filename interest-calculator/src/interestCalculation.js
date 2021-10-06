const moment = require('moment');

const {getIndexate} = require('./madad');
const getInterestDifferences = require('./interest');

const interestCalculate = async (date, debts, isLegalInterest) => {
    const allDepts = Promise.all(debts.map(async (debt) => await addExtra(date, debt, isLegalInterest)));
    const allDebtsResults = await allDepts;
    const finalDebt = allDebtsResults.reduce((debtsSum, debt) => debtsSum + debt.totalDebt, 0);

    return {total: finalDebt, allDepts: Object.values(allDebtsResults)};
};

const addExtra = async (date, debt, isLegalInterest) => {
    const debtDate = moment(debt.date, 'DD/MM/YYYY').toDate();
    const paymentDate = moment(date, 'DD/MM/YYYY').toDate();
    
    const interestDifference = getInterestDifferences(new Date(paymentDate), new Date(debtDate), debt.sum, isLegalInterest);

    const hazmadaMadad = await getIndexate(debt.sum, debtDate, paymentDate);
    const hazmadaRibit = await getIndexate(interestDifference, debtDate, paymentDate);

    return {
        totalDebt: parseFloat((debt.sum + hazmadaMadad + interestDifference + hazmadaRibit).toFixed(2)),
        deptDate: debt.date,
        debtSum: debt.sum,
        indexateSum: hazmadaMadad.toFixed(2),
        totalInterest: (interestDifference + hazmadaRibit).toFixed(2)
    };
};

module.exports = interestCalculate;