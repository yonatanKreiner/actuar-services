const axios = require('axios');

// The madad API doc
// https://www.cbs.gov.il/he/Pages/%D7%9E%D7%93%D7%93%D7%99-%D7%9E%D7%97%D7%99%D7%A8%D7%99%D7%9D-%D7%91%D7%90%D7%9E%D7%A6%D7%A2%D7%95%D7%AA-API.aspx

const getIndexate = async (value, startDate, endDate) => {
    const startdateString =  `${startDate.getMonth() + 1}-${startDate.getDate()}-${startDate.getFullYear()}`
    const enddateString =  `${endDate.getMonth() + 1}-${endDate.getDate()}-${endDate.getFullYear()}`
    const res = await axios.get(`https://api.cbs.gov.il/index/data/calculator/120010?value=${Math.trunc(value)}&date=${startdateString}&toDate=${enddateString}&format=json&download=false`)
    const result = res.data.answer.to_value;

    return result - value;
}

module.exports =  {getIndexate};