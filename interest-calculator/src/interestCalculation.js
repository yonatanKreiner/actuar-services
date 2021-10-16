const moment = require('moment');

const {getIndexate} = require('./madad');
const getInterestDifferences = require('./interest');

const interestCalculate = async (date, debts, isLegalInterest) => {
    const allDepts = Promise.all(debts.map(async (debt) => await addExtra(date, debt, isLegalInterest)));
    const allDebtsResults = await allDepts;

    return {allDepts: Object.values(allDebtsResults)};
};

const addExtra = async (date, debt, isLegalInterest) => {
    const debtDate = moment(debt.date, 'DD/MM/YYYY').toDate();
    const paymentDate = moment(date, 'DD/MM/YYYY').toDate();
    
    const interestDifference = getInterestDifferences(new Date(paymentDate), new Date(debtDate), debt.sum, isLegalInterest);

    const hazmadaMadad = await getIndexate(debt.sum, debtDate, paymentDate);
    const hazmadaRibit = await getIndexate(interestDifference, debtDate, paymentDate);

    return {
        totalDebt: ((debt.sum + hazmadaMadad + interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })),
        deptDate: debt.date,
        debtSum: debt.sum.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
        indexateSum: hazmadaMadad.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
        totalInterest: (interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })
    };
};

module.exports = interestCalculate;