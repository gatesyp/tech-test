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
    url: 'https://www.canddi.com/contact' //Just point at this URL for the time being for testing
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
    
    /*
    var textArray = [];
    
    //NOTE: here I'm trying to stop duplicates from populating the array but alas it doesn't seem to be working...
    $('*').each(function(i, elem) {
        
        if (textArray.includes($(this).text()) == true) {
                return;
        }
        else {
            textArray.push($(this).text());
        }
    });
    
    textArray.join(', ');
    */
    
    let bodyTextClean = textCleanUp(bodyText);
    knwlInstance.init(bodyTextClean);
    
    let foundEmails = knwlInstance.get('emails')
    foundEmails.forEach( (objEmail) => {
        emails.push(objEmail.address);
    });
    
    let foundPhoneNums = knwlInstance.get('phones');
    foundPhoneNums.forEach( (phoneObj) => {
        phoneNums.push(phoneObj.phone);
    })
    
    let addresses = [];
    //var addresses = knwlInstance.get('places')
    
    //Addresses - here I want to use a RegExp expressions
    //To try and locate addresses but I'm unsure how to so this is unfinished.
    var regExConstructor = new RegExp(bodyTextClean);
    
    function findAddresses() {
        for (var i = 0; i < bodyTextClean.length; i++) {
            addresses[i] = bodyTextClean.search(/^\d+\s[A-z]+\s[A-z]+\,\s[A-z]+\,\s[A-z]+/g);
        }
    }
    
    //findAddresses();
    
    console.log(emails);
    console.log(phoneNums);
    //console.log(addresses);
}    
 
request(initialOptions, getContactUrl);













