// require packages
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("fast-csv");


// target site variable and current date 
let mainURL = "http://shirts4mike.com/";
let date = new Date();

// function to run scraper

scrapeSite();

// Main function
function scrapeSite() {
	// create "data" directory
	makeDir();

	// send the scraped data to the directory

	let csvData = json2csv.format({ headers: true });
	let writeStream = fs.createWriteStream(newPath());
	csvData.pipe(writeStream);

	// runs the siteScraper function
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
	request(mainURL, function(error, response, html) {
		if (!error && response.statusCode === 200) {
			let $ = cheerio.load(html);
			$(".products li a").each(function() {
				let shirtData = $(this).attr("href");

				scrapeDataSite(shirtData, csvData);
			});
		} else {
			console.log(error);
			logError(error);
		}
	});
}

// scrapes each page and writes data
function scrapeDataSite(shirtData, csvData) {
	let newURL = mainURL + shirtData;

	request(newURL, function(error, response, html) {
		if (!error && response.statusCode === 200) {
			let $ = cheerio.load(html);
			let title = $("title").text();
			let price = $(".price").text();
			let img = $(".shirt-picture img").attr("src");


			// object to store the data
			let meta = {
				Title: title,
				Price: price,
				ImageURL: mainURL + img,
				URL: newURL,
				Time: date.toISOString().slice(11,19)
			};
		
			csvData.write(meta);
		} else {
			logError(error);
		}
	});
}

// error handling
function logError(error) {
	let errMessage = "Sorry you've encountered an error with the code (" + error.code + ")";
	console.log(errMessage);
	fs.appendFile("scraper-error.log", errMessage + " - " + date + "\n");
}















