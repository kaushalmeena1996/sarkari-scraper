var axios = require("axios");
var fs = require("fs");
var constant = require("./utils/constant");
var csv = require("./utils/csv");

var domain = constant.DEFAULT_DOMAIN;
temp = process.argv.indexOf("-d");
if (temp !== -1 && constant.DOMAIN_LIST.includes(process.argv[temp + 1])) {
  domain = process.argv[temp + 1];
}

var format = constant.DEFAULT_FORMAT;
temp = process.argv.indexOf("-f");
if (temp !== -1 && constant.FORMAT_LIST.includes(process.argv[temp + 1])) {
  format = process.argv[temp + 1];
}

var filename = "";
temp = process.argv.indexOf("-o");
if (temp !== -1) {
  filename = process.argv[temp + 1];
} else {
  console.log("Usage: node run-scraper -o <filename>");
  process.exit(0);
}

var jobDetail = require(`./scripts/${domain}/job-detail`);
var jobList = require(`./scripts/${domain}/job-list`);

var url = jobList.jobListUrl;

var data = [];

var counter = 0;

var temp;

function loadJobList(response) {
  if (response) {
    temp = jobList.scrapJobList(response.data);
    data = [...data, ...temp.data];
  }
  if (temp.next) {
  } else {
    console.log(`----- list length : ${data.length}`);
    scrapData(data[counter++]["link"], loadJobDetail);
  }
}

function loadJobDetail(response) {
  if (response) {
    temp = jobDetail.scrapJobDetail(response.data);
    saveData(temp, response.config.url);
  }
  if (counter < data.length) {
    scrapData(data[counter++]["link"], loadJobDetail);
  }
}

function saveData(jobData, url) {
  temp = jobData;
  switch (format) {
    case "json":
      temp = JSON.stringify(temp, undefined, 2);
      break;
    case "csv":
      temp = csv.formatData(temp);
      temp = csv.parse(temp) + constant.LINE_BREAKER;
      break;
  }
  fs.appendFile(filename, temp, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`----- ${url} appended to file ${filename} in ${format} format.`);
  });
}

function scrapData(url, callback) {
  axios.get(url)
    .then(function (response) {
      callback(response);
    })
    .catch(function (error) {
      console.log(`----- ${url} error occured!`);
      console.log(error);
      callback(null);
    });
}

scrapData(url, loadJobList);
