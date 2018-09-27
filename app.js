const readline = require('readline-sync'); //Required module for taking user inputs

var emailInput = readline.question('Enter email address: '); //Take user input for email
var atPos = emailInput.indexOf('@'); //Position of '@' character in email string
var emailLen = emailInput.length; //Length of email string

var webAddress = emailInput.slice(atPos + 1, emailLen); //Slice the string to extract web address

console.log('The relevant web address is: ' + webAddress); //Print web address to console








