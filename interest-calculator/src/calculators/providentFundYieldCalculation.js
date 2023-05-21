const axios = require('axios');
const https = require('https');
const moment = require('moment');

const YearToProvidentNetApiURL = {
    2023: "https://data.gov.il/api/3/action/datastore_search?resource_id=a30dcbea-a1d2-482c-ae29-8f781f5025fb&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2022: "https://data.gov.il/api/3/action/datastore_search?resource_id=91c849ed-ddc4-472b-bd09-0f5486cea35c&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2021: "https://data.gov.il/api/3/action/datastore_search?resource_id=a113d56c-5f55-4861-8e04-ab2cf06f41d9&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2020: "https://data.gov.il/api/3/action/datastore_search?resource_id=05f1e5d5-5c29-4c93-a5b2-e745720bdb22&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2019: "https://data.gov.il/api/3/action/datastore_search?resource_id=469633a2-5538-4f2c-a0ed-6ed5bc2f74c6&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
 }

const calcProvidentFundYield = async (fundId, startDate, endDate, sum) => {
   const records = await getSpecificRecords(startDate, endDate, fundId);
   console.log(records)

   const totalYield = records.reduce((total,record) => ((parseFloat(record.MONTHLY_YIELD)/100)+1) * total, 1);
   console.log(totalYield);

   return {records, totalYield}; 
}

const getSpecificRecords = async (startDate, endDate, fundId) => {
    const records = [];
    let calcDate = new Date(startDate);
    while(calcDate.getFullYear() <= endDate.getFullYear()){
        records.push(...await getFundDataForMonth(fundId, calcDate.getFullYear()));

        calcDate.setFullYear(calcDate.getFullYear() + 1);
    }

    const startDateTMP = new Date(startDate)
    startDateTMP.setDate(1);
    startDateTMP.setHours(0,0,0,0);
    const filteredRecords = records.filter(record => 
        moment(record.REPORT_PERIOD, 'YYYYMM').toDate() >= startDateTMP &&
        moment(record.REPORT_PERIOD, 'YYYYMM').toDate() <= endDate)

    console.log(filteredRecords);
    return filteredRecords;
}

const getFundDataForMonth = async (fundId, year, ...periodDates) => {
    let result = await getRecordsFromAPI(`${YearToProvidentNetApiURL[year]}&q=${fundId}`);
    if(result.length == 100){
        result = [...result, ...await getRecordsFromAPI(`${YearToProvidentNetApiURL[year]}&offset=${100}&q=${fundId}`)];
    }

    return result.filter(record => record.FUND_ID == fundId);
}

const agent = new https.Agent({  
    rejectUnauthorized: false
});

const getRecordsFromAPI = async (reqURL) => {
    try{
        const result = await axios.get(reqURL, {httpsAgent: agent});
        return result.data.result.records;
    }catch(err){
        console.error(`error on fetch from govapi:${err}`)
        return [];
    }
}

module.exports = calcProvidentFundYield;