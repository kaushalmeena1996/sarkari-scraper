var axios = require("axios");
var json2csv = require('json2csv');
var fs = require('fs');
var jobDetail = require("./scripts/sarkariresult.com/raw-job-detail")
var jobList = require("./scripts/sarkariresult.com/job-list")
var cheerio = require("cheerio");


var parser = new json2csv.Parser();

var url = "https://www.sarkariresult.com/latestjob.php";

axios.get(url)
    .then(function (response) {
        var list = jobList.getJobList(response.data);
        console.log("List length : ", list.length);
        saveToFile(list)
    })
    .catch(function (error) {
        console.log(`${error.response.status} : ${error.response.statusText}`);
    });

function saveToFile(list) {
    var lineBreaker = "\r\n\-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-\n\r";
    var csvData;

    for (const item of list) {
        axios.get(item['Link']).then(function (response) {
            if (response.data) {
                csvData = parser.parse(jobDetail.getJobDetail(response.data)) + lineBreaker;
                fs.appendFile("output.csv", csvData, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`----- ${item['Link']} saved!`);
                });
            }
        }).catch(function (error) {
            console.log(`--- ${item['Link']} ${error.response.status} : ${error.response.statusText}`);
        });
    }
}