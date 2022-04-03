const {getIndexate} = require('./madad');
const getInterestDifferences = require('./interest');

const interestCalculate = async (debts) => {
    const allDepts = Promise.all(debts.map(async (debt) => await addExtra(debt)));
    const allDebtsResults = await allDepts;

    return {allDepts: Object.values(allDebtsResults)};
};

const addExtra = async (debt) => {
    const debtDate = new Date(debt.startDate);
    const paymentDate = new Date(debt.endDate);
    const debtSum = parseFloat(debt.sum);
    
    const interestDifference = getInterestDifferences(paymentDate, debtDate, debtSum, debt.isLegalInterest);

    const hazmadaMadad = await getIndexate(debtSum, debtDate, paymentDate);
    const hazmadaRibit = await getIndexate(interestDifference, debtDate, paymentDate);

    return {
        totalDebt: ((debtSum + hazmadaMadad + interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })),
        startDate: debt.startDate,
        isLegalInterest: debt.isLegalInterest,
        endDate: debt.endDate,
        sum: debt.sum,
        indexateSum: hazmadaMadad.toLocaleString(undefined,{ minimumFractionDigits: 2 }),
        totalInterest: (interestDifference + hazmadaRibit).toLocaleString(undefined,{ minimumFractionDigits: 2 })
    };
};

module.exports = interestCalculate;