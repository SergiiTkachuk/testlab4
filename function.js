const moment = require('moment');

const checkDate = (deadline) => {

   const dateFormats = [
         
      'YYYY-MM-DD',
      'D.M.YYYY',
      'DD.MM.YYYY',
   
   ];

   const checkDateFormat = moment(deadline, dateFormats, true).isValid();

   const parseDate = moment(deadline, dateFormats, true);
   const inputDate = parseDate.toDate();
   const currentDate = new Date();

   const checkStatusDate = inputDate > currentDate;
   const result = checkStatusDate && checkDateFormat

   return result;
}

module.exports = {
   checkDate
}