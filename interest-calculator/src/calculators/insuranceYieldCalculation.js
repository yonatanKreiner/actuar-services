const axios = require('axios');
const https = require('https');
const moment = require('moment');

const YearToInsuranceNetApiURL = {
    2023: "https://data.gov.il/api/3/action/datastore_search?resource_id=c6c62cc7-fe02-4b18-8f3e-813abfbb4647&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2022: "https://data.gov.il/api/3/action/datastore_search?resource_id=584e6b69-174f-46c9-b8db-03925b4c68c6&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2021: "https://data.gov.il/api/3/action/datastore_search?resource_id=d706cbbb-b1d6-4e6b-9a7e-599a78616a5f&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2020: "https://data.gov.il/api/3/action/datastore_search?resource_id=8bd9b499-0985-4231-b4c2-9a0bb67a6e0c&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2019: "https://data.gov.il/api/3/action/datastore_search?resource_id=8cba3c0c-100d-4865-bc26-55651a9d054e&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
 }

const calcInsuranceYield = async (fundId, startDate, endDate, sum) => {
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
    let result = await getRecordsFromAPI(`${YearToInsuranceNetApiURL[year]}&q=${fundId}`);
    if(result.length == 100){
        result = [...result, ...await getRecordsFromAPI(`${YearToInsuranceNetApiURL[year]}&offset=${100}&q=${fundId}`)];
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

module.exports = calcInsuranceYield;