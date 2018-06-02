// require packages
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const JSON2csv = require("json2csv").parse;
const http = require("http");
const https = require("https");

// target site variable and current date 
let mainURL = "https://shirts4mike.com";
let shirtsURL = "http://shirts4mike.com/shirts.php";
let date = new Date();

// function to run scraper

someFunction();

// Main function
function scrapeSite() {
	// create "data" directory
	makeDir();

	// send the scraped data to the directory

	let csvData = json2csv(scrapedData);
	let writeStream = fs.createWriteStream(newPath());
	csvFormat.pipe(writeStream);

	siteScraper(csvData);
}

// Check to see if a directory "data" exists. If not creates the directory
function makeDir() {
	if(!fs.existsSync("data")) {
		fs.mkdirSync("data");
	}
}

// Make a path to the new directory to store the results 
function newPath() {
	let todaysDate = date.toISOString().slice(0,10);
	return "data/" + todaysDate + ".csv";
}

// links to site and loops through desired content
function siteScraper(csvData) {
	request(mainURL, function(err, res, html) {
		if (!err && res.statusCode === 200) {
			let $ = cheerio.load(html);
			$(".products li a").each(function() {
				let shirtData = $(this).attr("href");

				scrapeDataSite();
			});
		} else {
			logError(err);
		}
	});
}















