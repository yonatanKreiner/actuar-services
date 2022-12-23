const axios = require('axios');
const https = require('https');

const agent = new https.Agent({  
    rejectUnauthorized: false,
    keepAlive: true 
});


// The madad API doc
// https://www.cbs.gov.il/he/Pages/%D7%9E%D7%93%D7%93%D7%99-%D7%9E%D7%97%D7%99%D7%A8%D7%99%D7%9D-%D7%91%D7%90%D7%9E%D7%A6%D7%A2%D7%95%D7%AA-API.aspx

const getIndexate = async (value, startDate, endDate) => {
    axios.defaults.timeout = 5000; // how long axios should wait for a response

    const startdateString =  `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
    const enddateString =  `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`
    
    let result;
    try {
        const res = await axios.get(
            `https://api.cbs.gov.il/index/data/calculator/120010?value=${value.toFixed(2)}&date=${startdateString}&toDate=${enddateString}&format=json&download=false`
            , { httpsAgent: agent})
        result = res.data.answer.to_value;
    }catch(e) {
        console.log(`failed calculate indexate ${startdateString} - ${enddateString}, with err: ${e}`);
        result = value;
    }
    return result - value;
}

module.exports =  {getIndexate};