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

const convertToDailyInterest = (value) => {
    const dailyInterest = Math.pow((1 + value/100),(1/365.25));

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

    const dailyInterest = convertToDailyInterest(worksheet.data[i][columns.interest]);

    return dailyInterest;
}


const recursiveDailyInterestFromDate = (date, isLegalInteres) => {
    const today = new Date();
    let totalRecursiveInterest = 1;

    while(today > date){
        totalRecursiveInterest = totalRecursiveInterest * getInterestByDate(today, isLegalInteres)

        today.setDate(today.getDate() - 1);
        if(today < date){
            break;
        }
    }

    return totalRecursiveInterest;
}

const excel = getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/actuar-legal-interest.xlsx"); // getExcel(`./assets/actuar-legal-interest.xlsx`); 
const excelIlegaInterest = getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/actuar-illegal-interest.xlsx"); //getExcel('./assets/actuar-illegal-interest.xlsx');
const interestsExcel = getExcel("./assets/interets.xlsx"); //getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/interets.xlsx");
const illeagalInterestsExcel = getExcel("./assets/illegal-interests.xlsx"); //getExcel("C:/Users/Ofir Elarat/Documents/Actuar/actuar-services/interest-calculator/assets/illegal-interests.xlsx");

module.exports = { getInterestByDate, recursiveDailyInterestFromDate }