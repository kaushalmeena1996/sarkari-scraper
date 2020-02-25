var axios = require("axios");
var fs = require("fs");
var constant = require("./utils/constant");
var csv = require("./utils/csv");

var temp;

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
}

var jobList = require(`./scripts/${domain}/job-list`);

var url = jobList.jobListUrl;

var data = [];

var temp;

function appendData(response) {
  if (response) {
    temp = jobList.scrapJobList(response.data);
    data = [...data, ...temp.data];
    console.log(`----- ${response.config.url} parsed.`);
  }
  if (temp.next) {
    scrapData(temp.next, appendData);
  } else {
    saveData();
  }
}

function saveData() {
  switch (format) {
    case "json":
      data = JSON.stringify(data, undefined, 2);
      console.log(data);
      break;
    case "csv":
      data = csv.parse(data);
      console.log(data);
      break;
  }
  if (filename) {
    fs.writeFile(filename, data, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log(`----- joblist written to file ${filename} in ${format} format.`);
    });
  }
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

scrapData(url, appendData);
