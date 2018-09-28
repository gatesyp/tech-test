const cheerio = require('cheerio');
const request = require('request');

var url = 'http://google.com';

request({
    method: 'GET',
    url: url
    
}, function(error, response, body)
{
    if (error != null) {
        console.log(error);
    } //Print error to console if an error occurs
    
    let $ = cheerio.load(body); //????
    let title = $('title'); //Select title tag
    
    console.log(title.text()); //Print title to console
});