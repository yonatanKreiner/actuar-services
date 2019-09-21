const xlsx = require('node-xlsx');

const getExcel = (xlsPath) => {
    return xlsx.parse(xlsPath);
}

const sheets = {
    work: 0,
    yearlyInterests: 1,
    madadsAndInterests: 2,
    dailyInterests: 3,
}

const columns = {
    madad: 1,
    interest: 7
}

const firstMadad = {
    date: new Date(1942, 0, 1),
    row: 2
}

const getMadadRow = date => {
    let months = (date.getFullYear() - firstMadad.date.getFullYear()) * 12;
    months -= firstMadad.date.getMonth();
    months += date.getMonth();
    return months + firstMadad.row;
}

const getMadadByDate = date => {
    const worksheet = excel[sheets.madadsAndInterests]
    const row = getMadadRow(date);
    return worksheet.data[row][columns.madad];
}

const firstInterest = {
    date: new Date(1990, 0, 1),
    row: 8
}

const getInterestRow = date => {
    const daysDifference = Math.round((date - firstInterest.date) / (1000 * 60 * 60 * 24));
    return daysDifference + firstInterest.row;
}

const getInterestByDate = (date, isLegalInterest = true) => {
    const worksheet = isLegalInterest ? excel[sheets.work] : excelIlegaInterest[sheets.work];
    const row = getInterestRow(date);
    return worksheet.data[row][columns.interest];
}

const excel = getExcel('./assets/actuar-legal-interest.xlsx');
const excelIlegaInterest = getExcel('./assets/actuar-illegal-interest.xlsx');

module.exports = { getMadadByDate, getInterestByDate }