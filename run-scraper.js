var axios = require("axios");
var json2csv = require('json2csv');
var fs = require('fs');
var jobDetail = require("./scripts/sarkariresult/job-detail")
var jobList = require("./scripts/sarkariresult/job-list")
var helper = require("./utils/helper")


var parser = new json2csv.Parser();

var url = "https://www.sarkariresult.com/latestjob.php";

axios.get(url)
    .then(function (response) {
        var list = jobList.getJobList(response.data);
        console.log("List length : ", list.length);
        saveToFile(list)
    })
    .catch(function (error) {
        console.log(error);
    });

function saveToFile(list) {
    var lineBreaker = "\r\n\n\-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-X-O-\n\r";
    var data;

    for (const item of list) {
        axios.get(item['Link']).then(function (response) {
            if (response.data) {
                data = jobDetail.getJobDetail(response.data, item['Link']);
                data = helper.formatDataForCSV(data);
                data = parser.parse(data) + lineBreaker;
                fs.appendFile("output.csv", data, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`----- ${item['Link']} saved!`);
                });
            }
        }).catch(function (error) {
            console.log(`----- ${item['Link']} error occured!`);
            console.log(error);
        });
    }
}