const readline = require('readline-sync'); //Required module for taking user inputs?
const request = require('request');
const cheerio = require('cheerio');

var emailInput = readline.question('Enter email address: '); //Take user input for email
var atPos = emailInput.indexOf('@'); //Position of '@' character in email string
var emailLen = emailInput.length; //Length of email string

var urlRoot = emailInput.slice(atPos + 1, emailLen); //Slice the string to extract web address

console.log('The relevant web address is: ' + urlRoot); //Print web address to console

var url = 'https://www.' + urlRoot; //Affix root

console.log(url); //Print full URL to console

request({
    method: 'GET',
    url: url
    
}, function getContactUrl(error, response, body)
{
    if (error != null) {
        console.log(error);
    } //Print error to console if an error occurs
    
    let $ = cheerio.load(body); //In
    
    let contacts= $('a:contains("Contact")'); //Using cheerio we grab any a elementsconntaining the text "Contact"
    
    console.log(contacts.attr('href')); //Here we return any attribute information stored, i.e. the link address, to the console
    
    let contactUrl = contacts.attr('href'); //Here we take the href target url and store it in a new variable
    
    var newUrl = url + contactUrl; //And here we combine the two to get the contact page URL
    console.log(newUrl);
}); 

//console.log(_newUrl);












