const axios = require('axios');
const https = require('https');
const moment = require('moment');

const URL_1999_2022 = "https://data.gov.il/api/3/action/datastore_search?resource_id=584e6b69-174f-46c9-b8db-03925b4c68c6&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD";
const URL_2023 = "https://data.gov.il/api/3/action/datastore_search?resource_id=672090ba-7893-4496-a07c-dc7e822cbf18&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD";
const URL_2024_TODAY = "https://data.gov.il/api/3/action/datastore_search?resource_id=c6c62cc7-fe02-4b18-8f3e-813abfbb4647&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD" 

const YearToInsuranceNetApiURL = {
    2027: URL_2024_TODAY,
    2026: URL_2024_TODAY,
    2025: URL_2024_TODAY,
    2024: URL_2024_TODAY,
    2023: URL_2023,
    2022: URL_1999_2022,
    2021: URL_1999_2022,
    2020: URL_1999_2022,
    2019: URL_1999_2022,
    2018: URL_1999_2022,
    2017: URL_1999_2022,
    2016: URL_1999_2022,
    2015: URL_1999_2022,
    2014: URL_1999_2022,
    2013: URL_1999_2022,
    2012: URL_1999_2022,
    2011: URL_1999_2022,
    2010: URL_1999_2022,
    2009: URL_1999_2022,
    2008: URL_1999_2022,
    2007: URL_1999_2022,
    2006: URL_1999_2022,
    2005: URL_1999_2022,
    2004: URL_1999_2022,
    2003: URL_1999_2022,
    2002: URL_1999_2022,
    2001: URL_1999_2022,
    2000: URL_1999_2022,
    1999: URL_1999_2022,
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

    return result.filter(record => record.FUND_ID == fundId && moment(record.REPORT_PERIOD, "YYYYMM").toDate().getFullYear() === year);
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