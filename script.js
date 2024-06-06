const dayError = document.querySelector('.date.day .error i');
const monthError = document.querySelector('.date.month .error i');
const yearError = document.querySelector('.date.year .error i');

const labelDay = document.querySelector('.labelDay');
const labelMonth = document.querySelector('.labelMonth');
const labelYear = document.querySelector('.labelYear');

const answerDay = document.querySelector('.answerDay span');
const answerMonth = document.querySelector('.answerMonth span');
const answerYear = document.querySelector('.answerYear span');

let isItCalculated = false;

function updateMensajeError(campoMensaje, message){
    campoMensaje.textContent = message;
}

function clearError(){
    updateMensajeError(dayError, '');
    updateMensajeError(monthError, '');
    updateMensajeError(yearError, '');
}

const esBisiesto = (year) => {
    return (year % 400 === 0) ? true : 
            (year % 100 === 0) ? false : 
            year % 4 === 0;
};

function validateFebruary(year, month, day){
    if(month === 2){
        const bisiesto = esBisiesto(year);

        if(bisiesto && day > 29){
            updateMensajeError(dayError, `El año ${year} es bisiesto. El Mes ${month} tiene 29 dias`);
            labelDay.style = "color: hsl(0, 100%, 67%);";
            return false;
        }else if (!bisiesto && day > 28){
            updateMensajeError(dayError, `El Mes ${month} tiene 28 dias`);
            labelDay.style = "color: hsl(0, 100%, 67%);";
            return false;
        }
    }
    return true;
}

function validarDiaSegunMes(day, month){
    const shortMonths = [2,4,6,9,11];

    if(day === 31 && shortMonths.includes(month)){
        updateMensajeError(dayError,`El mes ${month} no tiene 31 días`);
        labelDay.style = "color: hsl(0, 100%, 67%);";
        return false;
    }

    return true;
}

function validarRangos(day,month,year){
    const date = new Date();
    const currentYear = parseInt(date.getFullYear());

    let valid = true;
    
    if(day < 1 || day > 31) {
        updateMensajeError(dayError,'Must be a valid day');
        labelDay.style = "color: hsl(0, 100%, 67%);";
        valid = false;
    }

    if(month < 1 || month > 12){
        updateMensajeError(monthError,'Must be a valid month');
        labelMonth.style = "color: hsl(0, 100%, 67%);";
        valid = false;
    }

    if(year < 1){
        updateMensajeError(yearError,'Must be a valid year');
        labelYear.style = "color: hsl(0, 100%, 67%);";
        valid = false;
    }

    if(year > currentYear){
        updateMensajeError(yearError,'Must be a valid year');
        labelYear.style = "color: hsl(0, 100%, 67%);";
        valid = false;
    }

    return valid;
}

function validateInput(){
    const dayInput = document.querySelector('#day').value;
    const monthInput = document.querySelector('#month').value;
    const yearInput = document.querySelector('#year').value;

    if (dayInput === '' || monthInput === '' || yearInput === '') {

        if(dayInput === ""){
            dayError.textContent = "This field is required";
            labelDay.style = "color: hsl(0, 100%, 67%);";
        } else {
            labelDay.style = "color: hsl(0, 1%, 44%);";
        }

        if(monthInput === ""){
            monthError.textContent = "This field is required";
            labelMonth.style = "color: hsl(0, 100%, 67%);";
        } else {
            labelMonth.style = "color: hsl(0, 1%, 44%);";
        }

        if(yearInput === ""){
            yearError.textContent = "This field is required";
            labelYear.style = "color: hsl(0, 100%, 67%);";
        } else {
            labelYear.style = "color: hsl(0, 1%, 44%);";
        }

        return false;
    }
    return true;
}

function hadBirthday(currentMonth, birthMonth, currentDay, birthDay){
    if(currentMonth < birthMonth) {
        return false;
    } else if(currentMonth === birthMonth && currentDay > birthDay){
        return false;
    }
    return true;
}

function answer(daysOld, monthsOld, yearsOld){
    answerDay.textContent = daysOld; 
    answerMonth.textContent = monthsOld;
    answerYear.textContent = yearsOld;

    labelDay.style = "color: hsl(0, 1%, 44%);";
    labelMonth.style = "color: hsl(0, 1%, 44%);";
    labelYear.style = "color: hsl(0, 1%, 44%);";

    isItCalculated = true;
}

document.querySelector('#btn').addEventListener('click', function(){
    clearError();

    if (!validateInput()) {
        return;
    }

    const birthDayInput = document.querySelector('#day').value;
    const birthMonthInput = document.querySelector('#month').value;
    const birthYearInput = document.querySelector('#year').value;

    const birthDay = parseInt(birthDayInput);
    const birthMonth = parseInt(birthMonthInput);
    const birthYear = parseInt(birthYearInput);

    const currentDate = new Date()
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let daysOld = currentDay - birthDay;
    let monthsOld = currentMonth - birthMonth;
    let yearsOld = currentYear - birthYear;

    // Se creo una variable "lessYears" para restar el año xq no se puede cambiar el valor de una copia
    const lessYears = hadBirthday(currentMonth, birthMonth, currentDay, birthDay);
   
    if(!validarRangos(birthDay, birthMonth, birthYear) ||
        !validarDiaSegunMes(birthDay, birthMonth) ||
        !validateFebruary(birthYear, birthMonth, birthDay)) {
        isItCalculated = false;
        return;
    }

    if(lessYears === false) yearsOld--;

    if(daysOld < 0) {
        const ultimoDiaDelMes = new Date(currentYear, currentMonth - 1, 0).getDate();
        monthsOld--;
        daysOld += ultimoDiaDelMes;
    }

    if(monthsOld < 0) {
        yearsOld--;
        monthsOld += 12;
    }

    answer(daysOld, monthsOld, yearsOld);
});
