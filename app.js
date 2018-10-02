const readline = require('readline-sync'); //Required module for taking user inputs?
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const knwl = require('knwl.js');

var knwlInstance = new knwl('english');

var emailInput = readline.question('Please enter an email address to check: '); //Take user input for email
var atPos = emailInput.indexOf('@'); //Position of '@' character in email string
var emailLen = emailInput.length; //Length of email string

var urlRoot = emailInput.slice(atPos + 1, emailLen); //Slice the string to extract web address

console.log('The associated web address is: ' + urlRoot); //Print web address to console

var url = 'https://www.' + urlRoot; //Affix root

console.log(url); //Print full URL to console

var emails = [];
var phoneNums = [];
var addresses = [];

var initialOptions = {
    method: 'GET',
    url: 'https://www.ey.com/uk/en/home/contact-us' //Just point at this URL for the time being for testing
    //url: url
}

function textCleanUp(bodyText) { //Attempt at cleaning up the body text to make it more readable...
    bodyText = bodyText.replace('.com', '.com ')
    bodyText = bodyText.replace('.co.uk', 'co.uk ')
    bodyText = bodyText.replace('.net', 'net ')
    bodyText = bodyText.replace(/([A-Z])/g, ' $1') //Add whitespace before capital letters
    bodyText = bodyText.replace(/[()]/g, '');
    bodyText = bodyText.replace(/\s(?=\d)/g, '');
    return bodyText;
}
   
function getContactUrl(error, response, body)
{
    if (error != null) {
        console.log(error);
    } //Print error to console if an error occurs
    

    let $ = cheerio.load(body); //In
    
    let contacts= $('a:contains("Contact")'); //Using cheerio we grab any a elements conntaining the text "Contact"
    
    console.log(contacts.attr('href')); //Here we return any attribute information stored, i.e. the link address, to the console
    
    let contactUrl = contacts.attr('href'); //Here we take the href target url and store it in a new variable
    var newUrl = url + contactUrl; //And here we combine the two to get the contact page URL
    
    console.log(newUrl);
    
    /*Here we can either select all elements with '*' or the body element with 'body'
    When using * it seems to grab more separated elements but also creates lots
    of duplicates ... with the body tag it treats it just as one element but 
    this needs a lot of cleaning up...
    */

    let bodyText = $('body').text(); 
    
    let bodyTextClean = textCleanUp(bodyText);
    knwlInstance.init(bodyTextClean);
    
    //scrape for emails and push to array
    let foundEmails = knwlInstance.get('emails')
    foundEmails.forEach((objEmail) => {
        emails.push(objEmail.address);
    });
    
    //scrape for phoneNums and push to array
    let foundPhoneNums = knwlInstance.get('phones');
    foundPhoneNums.forEach((phoneObj) => {
        phoneNums.push(phoneObj.phone);
    });
    
    //simple but scrapes for postcodes
    let addressRegEx = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/g;
    let addresses = [];
    
    addresses = body.match(addressRegEx);
    
    //delete any duplicate items in email array
    function deleteEmailDuplicates() {
         emails = emails.filter(function(item, index, inputArray) {
           return inputArray.indexOf(item) == index;
        }
    )};
    
    //delete any duplicate items in phone array
    function deletePhoneNumDuplicates() {
        phoneNums = phoneNums.filter(function(item, index, inputArray) {
           return inputArray.indexOf(item) == index;
        }
    )};
    
    //delete any duplicate items in addresses array
    function deleteAddressDuplicates() {
        addresses = addresses.filter(function(item, index, inputArray) {
           return inputArray.indexOf(item) == index;
        }
    )};
    
    deleteEmailDuplicates();
    deletePhoneNumDuplicates();
    deleteAddressDuplicates();
    
    console.log('Emails: ' + emails.join(', '));
    console.log('Phone Numbers: ' + phoneNums.join(', '));
    console.log('Addresses: ' + addresses.join(', '));
}    
 
request(initialOptions, getContactUrl);













