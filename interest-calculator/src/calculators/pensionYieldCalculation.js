const axios = require('axios');
const https = require('https');
const moment = require('moment');

const YearToPensionNetApiURL = {
    2023: "https://data.gov.il/api/3/action/datastore_search?resource_id=6d47d6b5-cb08-488b-b333-f1e717b1e1bd&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2022: "https://data.gov.il/api/3/action/datastore_search?resource_id=a66926f3-e396-4984-a4db-75486751c2f7&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2021: "https://data.gov.il/api/3/action/datastore_search?resource_id=cad96a4d-d386-40b4-b621-e281c0ee2885&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2020: "https://data.gov.il/api/3/action/datastore_search?resource_id=31343260-5283-42b7-8a73-de8c4017a276&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2019: "https://data.gov.il/api/3/action/datastore_search?resource_id=1cd084e8-b835-4342-91cb-3cef6f724b13&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2018: "https://data.gov.il/api/3/action/datastore_search?resource_id=3c7b9615-3f0a-4f66-a999-6dc52ec7399e&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD", 
    2017: "https://data.gov.il/api/3/action/datastore_search?resource_id=3e52f719-d1b9-4c53-80c6-259c44fa15be&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2016: "https://data.gov.il/api/3/action/datastore_search?resource_id=3da3b955-b197-40d5-9d70-21e8d08b0aee&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2015: "https://data.gov.il/api/3/action/datastore_search?resource_id=8cfa1626-086f-415a-8c21-253783b49615&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2014: "https://data.gov.il/api/3/action/datastore_search?resource_id=1a6fb38a-d6ef-44c8-8cdb-82ee84309964&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2013: "https://data.gov.il/api/3/action/datastore_search?resource_id=a3129eda-e298-4ab9-ab55-37b0f021c873&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2012: "https://data.gov.il/api/3/action/datastore_search?resource_id=fe8d1866-abf9-4286-8fb5-cd9d12b84765&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2011: "https://data.gov.il/api/3/action/datastore_search?resource_id=90da8bc7-645d-4ef9-9f68-31fcf22f1c30&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
}

const calcPensionYield = async (fundId, startDate, endDate, sum) => {
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
    let result = await getRecordsFromAPI(`${YearToPensionNetApiURL[year]}&q=${fundId}`);
    if(result.length == 100){
        result = [...result, ...await getRecordsFromAPI(`${YearToPensionNetApiURL[year]}&offset=${100}&q=${fundId}`)];
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

module.exports = calcPensionYield;