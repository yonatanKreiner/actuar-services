const axios = require('axios');

const getIndexate = async (value, startDate, endDate) => {
    const startdateString =  `${startDate.getMonth() + 1}-${startDate.getDate()}-${startDate.getFullYear()}`
    const enddateString =  `${endDate.getMonth() + 1}-${endDate.getDate()}-${endDate.getFullYear()}`
    const res = await axios.get(`https://api.cbs.gov.il/index/data/calculator/120010?value=${Math.trunc(value)}&date=${startdateString}&toDate=${enddateString}&format=json&download=false`)
    const result = res.data.answer.to_value;

    return result;
}

module.exports =  {getIndexate};