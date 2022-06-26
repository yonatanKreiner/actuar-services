const {getIndexate} = require('../tools/madad');

const madadCalculate = async (indexatePayload) => {
    const allRows = Promise.all(indexatePayload.map(async (madadIndexateRow) => await addExtra(madadIndexateRow)));
    const allRowsResults = await allRows;

    return Object.values(allRowsResults);
};


const addExtra = async (row) => {
    const rowDate = new Date(row.startDate);
    const paymentDate = new Date(row.endDate);
    const sum = parseFloat(row.sum);
    
    const hazmadaMadad = await getIndexate(sum, rowDate, paymentDate);
    
    return {
        startDate: row.startDate,
        endDate: row.endDate,
        sum: row.sum,
        madadIndexate: hazmadaMadad.toLocaleString(undefined,{ minimumFractionDigits: 2 })
    };
};

module.exports = madadCalculate;