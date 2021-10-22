const moment = require('moment');

const {getIndexate} = require('./madad');
const getInterestDifferences = require('./interest');

const interestCalculate = async (debts) => {
    const allDepts = Promise.all(debts.map(async (debt) => await addExtra(debt)));
    const allDebtsResults = await allDepts;

    return {allDepts: Object.values(allDebtsResults)};
};

const addExtra = async (debt) => {
    const debtDate = moment(debt.startDate, 'DD/MM/YYYY').toDate();
    const paymentDate = moment(debt.endDate, 'DD/MM/YYYY').toDate();
    
    const interestDifference = getInterestDifferences(new Date(paymentDate), new Date(debtDate), debt.sum, debt.isLegalInterest);

    const hazmadaMadad = await getIndexate(debt.sum, debtDate, paymentDate);
    const hazmadaRibit = await getIndexate(interestDifference, debtDate, paymentDate);

    return {
        totalDebt: ((debt.sum + hazmadaMadad + interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })),
        deptDate: debt.startDate,
        isLegalInterest: debt.isLegalInterest,
        endDate: debt.endDate,
        debtSum: debt.sum.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
        indexateSum: hazmadaMadad.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
        totalInterest: (interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })
    };
};

module.exports = interestCalculate;