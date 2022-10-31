const xlsx = require('node-xlsx');
const moment = require('moment');
const axios = require('axios');
const fs = require('fs');

const getExcel = (xlsPath) => {
    return xlsx.parse(xlsPath);
}

const sheets = {
    interests: 0
}

const columns = {
    date: 0,
    interest: 1
}

const amountOfDaysInYear = (year) => {
    const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    const daysInYear = isLeapYear ? 366 : 365;

    return daysInYear;
} 

const convertToDailyInterest = (value, amountOfDaysBetweenCalcs) => {
    // const dailyInterest = Math.pow((1 + value/100),(1/365.2425));
    const dailyInterest = (value/100/amountOfDaysBetweenCalcs);
    // const dailyInterest = 1 + ((value/100)*(1/daysInYear));
    // const dailyInterest = Math.pow((1 + value/100),(1/daysInYear));
 
    return dailyInterest;
}

const getInterestByDate = (date, amountOfDaysBetweenCalcs, interestType) => {
    let worksheet = interestsExcel[sheets.interests];
    if(interestType ===  'legal-interest'){
        worksheet = interestsExcel[sheets.interests];
    } else if(interestType ===  'illegal-interest'){
        worksheet = illeagalInterestsExcel[sheets.interests];
    }else if(interestType === 'shekel-interest'){
        worksheet = shekelInterestsExcel[sheets.interests];
    }
    
    let i = 2;
    while(i <= worksheet.data.length && i+1 < worksheet.data.length){
        const rowDate = moment(worksheet.data[i][columns.date], 'DD/MM/YYYY').toDate();
        const nextRowDate = moment(worksheet.data[i+1][columns.date], 'DD/MM/YYYY').toDate();
        if(rowDate < date ){
            if(i+1 < worksheet.data.length && nextRowDate > date){
                break;
            }
            else{
                if(i+1 < worksheet.data.length && nextRowDate <= date){
                    i++;
                } else{
                    break;
                }
            }
        }else{
            // notice the date is older than the oldest in the excel
            break;
        }
    }

    const dailyInterest = convertToDailyInterest(worksheet.data[i][columns.interest], amountOfDaysBetweenCalcs);
    
    return dailyInterest;
}

const recursiveDailyInterestFromDate = (endDate, date, interestType) => {
    const DAY_IN_MILISECONDS = 24 * 60 * 60 * 1000;
    const today = new Date(date);
    let totalRecursiveInterest = 1;
    const yearlySumInterest = [];
    let currentYearInterest = 0;

    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear()+1);
    let amountOfDaysBetweenCalcs = Math.round(Math.abs((nextYear - today) / (DAY_IN_MILISECONDS)));

    while(today < endDate){
        const daylyInterest = getInterestByDate(today, amountOfDaysBetweenCalcs, interestType);
        const tommorow = new Date(today);
        tommorow.setDate(tommorow.getDate() + 1);
        // totalRecursiveInterest = daylyInterest * totalRecursiveInterest ;

        if(tommorow >= endDate) {
            currentYearInterest += daylyInterest;
            yearlySumInterest.push(currentYearInterest)
        } else if((today.getDate() === nextYear.getDate() && 
                    today.getMonth() === nextYear.getMonth() &&
                    today.getFullYear() === nextYear.getFullYear())) {
            yearlySumInterest.push(currentYearInterest)
            currentYearInterest = 0;
            currentYearInterest += daylyInterest;
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            amountOfDaysBetweenCalcs = Math.round(Math.abs((nextYear - today) / (DAY_IN_MILISECONDS)));
        } else {
            currentYearInterest += daylyInterest;
        }

        today.setDate(today.getDate() + 1);
    }

    totalRecursiveInterest = yearlySumInterest.reduce((totalInterest, yearlySumInterest) => totalInterest * (1 + yearlySumInterest), 1);

    return totalRecursiveInterest;
}

const getInterestsTable = (interestType) => {
    if(interestType ===  'legal-interest'){
        worksheet = interestsExcel[sheets.interests];
    } else if(interestType ===  'illegal-interest'){
        worksheet = illeagalInterestsExcel[sheets.interests];
    }else if(interestType === 'shekel-interest'){
        worksheet = shekelInterestsExcel[sheets.interests];
    }
    
    return worksheet;
}

const refreshExcelFiles = async () => {
    try{
        await saveTempXLS('https://ga.mof.gov.il/api/rate/history/12');
        interestsExcel = getExcel("./assets/interest_tmp.xls"); 
            
        await saveTempXLS('https://ga.mof.gov.il/api/rate/history/9')
        illeagalInterestsExcel = getExcel("./assets/interest_tmp.xls"); 

        await saveTempXLS('https://ga.mof.gov.il/api/rate/history/10')
        shekelInterestsExcel = getExcel("./assets/interest_tmp.xls");
    }catch(err){
        console.log("failed to refresh rates")
    }    
}

const saveTempXLS = (url) => {
    return axios.request({
    responseType: 'arraybuffer',
    url: url,
    method: 'get',
    headers: {
    'Content-Type': 'blob',
    },
  }).then((result) => {
      const outputFilename = './assets/interest_tmp.xls';
      fs.writeFileSync(outputFilename, result.data);
      return outputFilename;
    });
  }


let interestsExcel = getExcel("./assets/interest.xlsx"); 
// let interestsExcel = getExcel("C://Users//ofire//Documents//personal projects//Actuar//actuar-services//interest-calculator//assets//interest.xlsx");
let illeagalInterestsExcel = getExcel("./assets/illegal-interest.xlsx");
// let illeagalInterestsExcel = getExcel("C://Users//ofire//Documents//personal projects//Actuar//actuar-services//interest-calculator//assets//illegal-interest.xlsx");
let shekelInterestsExcel = getExcel("./assets/shekel-interest.xlsx");
// let shekelInterestsExcel = getExcel("C://Users//ofire//Documents//personal projects//Actuar//actuar-services//interest-calculator//assets//shekel-interest.xlsx");


module.exports = { getInterestByDate, recursiveDailyInterestFromDate, getInterestsTable, refreshExcelFiles }