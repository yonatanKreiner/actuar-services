const xlsx = require('node-xlsx');
const moment = require('moment');

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

const convertToDailyInterest = (value, year) => {
    const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    const daysInYear = isLeapYear ? 366 : 365;
    // const dailyInterest = Math.pow((1 + value/100),(1/365.2425));
    const dailyInterest = 1 + ((value/100)*(1/daysInYear));
    // const dailyInterest = Math.pow((1 + value/100),(1/daysInYear));
 
    return dailyInterest;
}

const getInterestByDate = (date, isLegalInterest = true) => {
    const worksheet =isLegalInterest ? interestsExcel[sheets.interests] : illeagalInterestsExcel[sheets.interests];

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

    const dailyInterest = convertToDailyInterest(worksheet.data[i][columns.interest], date.getFullYear());
    
    return dailyInterest;
}


const recursiveDailyInterestFromDate = (endDate, date, isLegalInteres) => {
    const today = new Date(endDate);
    let totalRecursiveInterest = 1;

    while(today > date){
        const daylyInterest = getInterestByDate(today, isLegalInteres);
        totalRecursiveInterest = daylyInterest * totalRecursiveInterest ;
        console.log("d * x = " + totalRecursiveInterest);

        today.setDate(today.getDate() - 1);
    }

    return totalRecursiveInterest;
}

// const excel = getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/actuar-legal-interest.xlsx"); // getExcel(`./assets/actuar-legal-interest.xlsx`); 
// const excelIlegaInterest = getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/actuar-illegal-interest.xlsx"); //getExcel('./assets/actuar-illegal-interest.xlsx');
const interestsExcel = getExcel("./assets/interest.xlsx"); 
// const interestsExcel = getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/interest.xlsx");
const illeagalInterestsExcel = getExcel("./assets/illegal-interest.xlsx");
// const illeagalInterestsExcel = getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/illegal-interest.xlsx");

module.exports = { getInterestByDate, recursiveDailyInterestFromDate }