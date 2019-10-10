var axios = require("axios");
var fs = require("fs");
var constant = require("./utils/constant");
var csv = require("./utils/csv");

var temp;

// set url
var url = "";
temp = process.argv.indexOf("-u");
if (temp !== -1) {
    url = process.argv[temp + 1];
} else {
    console.log("Usage: node scrap-job-detail -u <url>");
    process.exit(0);
}

// set domain name
var domain = constant.DEFAULT_DOMAIN;
temp = url.split("/")[2];
if (temp.includes("www.")) {
    temp = temp.split("www.")[1];
}
if (constant.DOMAIN_LIST.includes(temp)) {
    domain = temp;
} else {
    console.log("Error: Domain is not supported.");
    process.exit(0);
}

// set output format
var format = constant.DEFAULT_FORMAT;
temp = process.argv.indexOf("-f");
if (temp !== -1 && constant.FORMAT_LIST.includes(process.argv[temp + 1])) {
    format = process.argv[temp + 1];
}

// set output filename
var filename = "";
temp = process.argv.indexOf("-o");
if (temp !== -1) {
    filename = process.argv[temp + 1];
}

var jobDetail = require(`./scripts/${domain}/job-detail`);

var data;

axios.get(url)
    .then(function (response) {
        data = jobDetail.scrapJobDetail(response.data, url);

        switch (format) {
            case "json":
                data = JSON.stringify(data, undefined, 2);
                console.log(data);
                break;
            case "csv":
                data = csv.formatData(data);
                data = csv.parse(data);
                console.log(data);
                break;
        }
        if (filename) {
            fs.writeFile(filename, data, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(`----- ${url} written to file ${filename} in ${format} format.`);
            });
        }
    })
    .catch(function (error) {
        console.log(error);
    });