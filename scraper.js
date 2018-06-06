'use strict';

// require packages
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv");
const Json2csvParser = require("json2csv").Parser;


// target site variable and current date 
let mainURL = "http://shirts4mike.com/";
let date = new Date();

// header for json2csv
let fields = ['Title', 'Price', 'ImageURL', 'url', 'Time'];


// array to hold each shirt's info
let shirtsArr = new Array();

// create new data directory
		let directory = "data";
		
		if(!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
		}

// error handling 
let logError = function(error) {
	let errMessage = "Sorry you've encountered an error with the code (" + error.code + ")";
	console.log(error.message);
	fs.appendFile("scraper-error.log", errMessage + " - " + date + "\n", function(err) {
		if (err) throw err;
		console.log('Error has been logged to the appropriate file');
	});
};


request(mainURL, function(error, response, html){
	if (!error && response.statusCode === 200) {
		let $ = cheerio.load(html);

		
		// path to shirts info page
		let todaysDate = date.toISOString().slice(0,10);
		let newPath = $(".shirts > a").attr("href");
		let newURL = mainURL + newPath;
		request(newURL, function(error, response, html){
			if (!error && response.statusCode === 200) {
				let $ = cheerio.load(html);
				// number of shirts per page
				let shirtTotal = $(".products > li > a").length;
				$(".products > li > a").each(function(i) {
					let thisShirtURL = ("http://shirts4mike.com/" + $(this).attr("href"));

					// request
					request(thisShirtURL, function(error, response, html) {
						if (!error && response.statusCode === 200) {
							let $ = cheerio.load(html);

							// retrieve info
							let title = $("title").text();
							let price = $(".price").text();
							let img = $(".shirt-picture img").attr("src");

							// create JSON data object
							let meta = {};
							meta.Title = title;
							meta.Price = price;
							meta.ImageURL = mainURL + img;
							meta.url = thisShirtURL;
							meta.Time = date.toISOString().slice(11,19);
							shirtsArr.push(meta);
							console.log(shirtsArr);

							

							if (shirtsArr.length == shirtTotal) {
								

								const json2csvParser = new Json2csvParser({ fields});
								const csv = json2csvParser.parse(shirtsArr);//, function(err, csv) {
									//if (err) console.log(err);
									console.log(csv);
									fs.writeFile(directory + "/" + todaysDate + ".csv", csv, function(err) {
										if(err) throw err;
										console.log('shirt info saved to data directory');
									});
								//});
							} return shirtsArr;
						} else {
							logError(error);
						}
					});
				});
			} else {
				logError(error);
			}
		});
	} else {
		logError(error);
	}
});


// function to run scraper



// scrapeSite();

// // Main function
// function scrapeSite() {
// 	// create "data" directory
// 	makeDir();

// 	// send the scraped data to the directory

// 	let csvData = json2csv.format({ headers: true });
// 	let writeStream = fs.createWriteStream(newPath());
// 	csvData.pipe(writeStream);

// 	// runs the siteScraper function
// 	siteScraper(csvData);
// }

// // Check to see if a directory "data" exists. If not creates the directory
// function makeDir() {
// 	if(!fs.existsSync("data")) {
// 		fs.mkdirSync("data");
// 	}
// }

// // Make a path to the new directory to store the results 
// function newPath() {
// 	let todaysDate = date.toISOString().slice(0,10);
// 	return "data/" + todaysDate + ".csv";
// }

// // links to site and loops through desired content
// function siteScraper(csvData) {
// 	request(mainURL, function(error, response, html) {
// 		if (!error && response.statusCode === 200) {
// 			let $ = cheerio.load(html);
// 			$(".products li a").each(function() {
// 				let shirtData = $(this).attr("href");

// 				scrapeDataSite(shirtData, csvData);
// 			});
// 		} else {
// 			console.log(error);
// 			logError(error);
// 		}
// 	});
// }

// // scrapes each page and writes data
// function scrapeDataSite(shirtData, csvData) {
// 	let newURL = mainURL + shirtData;

// 	request(newURL, function(error, response, html) {
// 		if (!error && response.statusCode === 200) {
// 			let $ = cheerio.load(html);
// 			let title = $("title").text();
// 			let price = $(".price").text();
// 			let img = $(".shirt-picture img").attr("src");


// 			// object to store the data
// 			let meta = {
// 				Title: title,
// 				Price: price,
// 				ImageURL: mainURL + img,
// 				URL: newURL,
// 				Time: date.toISOString().slice(11,19)
// 			};
		
// 			csvData.write(meta);
// 		} else {
// 			logError(error);
// 		}
// 	});
// }

// error handling
// function logError(error) {
// 	let errMessage = "Sorry you've encountered an error with the code (" + error.code + ")";
// 	console.log(errMessage);
// 	fs.appendFile("scraper-error.log", errMessage + " - " + date + "\n");
// }















