const axios = require('axios');
const moment = require('moment');
const puppeteer = require('puppeteer');

const YearToInsuranceNetApiURL = {
    2022: "https://data.gov.il/api/3/action/datastore_search?resource_id=c6c62cc7-fe02-4b18-8f3e-813abfbb4647&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2021: "https://data.gov.il/api/3/action/datastore_search?resource_id=d706cbbb-b1d6-4e6b-9a7e-599a78616a5f&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
    2020: "https://data.gov.il/api/3/action/datastore_search?resource_id=8bd9b499-0985-4231-b4c2-9a0bb67a6e0c&fields=FUND_NAME&fields=FUND_ID&fields=REPORT_PERIOD&fields=MONTHLY_YIELD",
}

const calcInsuranceYield = async (fundId, startDate, endDate, sum) => {
   const records = await getSpecificRecords(startDate, endDate, fundId);
   console.log(records)

   const totalYield = records.reduce((record, total) => ((record.MONTHLY_YIELD/100/12)+1) * total);
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

    const filteredRecords = records.filter(record => 
        moment(record.REPORT_PERIOD, 'YYYYMM').toDate() >= startDate &&
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

const getRecordsFromAPI = async (reqURL) => {
    const result = await axios.get(reqURL);
    return result.data.result.records;
}

const insuranceDataCatalogURL = 'https://data.gov.il/dataset/insurance'; 
const findGovAPIUrlsByYear = async (yearForCalc) => {
    const results = await scrape(); 
    console.log(results);
}

const scrape = async () => { 
    const browser = await puppeteer.launch({headless: false, args: ["--no-sandbox"]});
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    await page.goto(insuranceDataCatalogURL);
    await page.waitForXPath('//*[@id="dataset-resources"]/ul');
    
    const res = await page.$("#dataset-resources > ul")

    browser.close();

    return result;
}; 


module.exports = calcInsuranceYield;