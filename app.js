const readline = require('readline-sync'); //Required module for taking user inputs?
const request = require('request');
const cheerio = require('cheerio');
const knwl = require('knwl.js');

var knwlInstance = new knwl('english');


var emailInput = readline.question('Enter email address: '); //Take user input for email
var atPos = emailInput.indexOf('@'); //Position of '@' character in email string
var emailLen = emailInput.length; //Length of email string

var urlRoot = emailInput.slice(atPos + 1, emailLen); //Slice the string to extract web address

console.log('The relevant web address is: ' + urlRoot); //Print web address to console

var url = 'https://www.' + urlRoot; //Affix root

console.log(url); //Print full URL to console

//Some URLs I've found this to work with so far:
//https://www.ey.com/uk/en/home
//https://www2.deloitte.com/uk/en.html

request({
    method: 'GET',
    url: 'https://www.canddi.com/contact'
    
}, function getContactUrl(error, response, body)
{
    if (error != null) {
        console.log(error);
    } //Print error to console if an error occurs
    
    let $ = cheerio.load(body); //In
    
    //let contacts= $('a:contains("Contact")'); //Using cheerio we grab any a elements conntaining the text "Contact"
    
    //console.log(contacts.attr('href')); //Here we return any attribute information stored, i.e. the link address, to the console
    
    //let contactUrl = contacts.attr('href'); //Here we take the href target url and store it in a new variable
    
    //var newUrl = url + contactUrl; //And here we combine the two to get the contact page URL
    //console.log(newUrl);
    
    let bodyText = $('body').text();
    let bodyTextClean = bodyText.replace('.com', '.com '); //clean up --> is there a better way that'd also account for different endings, i.e. .co.uk? .net?
    
    //console.log(bodyTextClean);
    
    knwlInstance.init(bodyTextClean);
    
    var emails = knwlInstance.get('emails')
    var phoneNums = knwlInstance.get('phones');
    var addresses = knwlInstance.get('places')
    
    console.log(emails);
    console.log(phoneNums);
    console.log(addresses);
}); 

//console.log(_newUrl);












