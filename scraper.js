// require packages
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const JSON2csv = require("json2csv");
const http = require("http");
const https = require("https");

// target site variable and current date 
let scrapeSite = "http://shirts4mike.com/shirts.php";
let date = new Date();

// function to run scraper

someFunction();

// Main function
function scrapeSite() {
	// create "data" directory
	makeDir();
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















