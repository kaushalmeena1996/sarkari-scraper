var axios = require("axios");
var cheerio = require("cheerio");
var helper = require("./helper")

var url = "https://www.sarkariresult.com/latestjob.php";

axios.get(url)
    .then(function (response) {
        console.log(JSON.stringify(getJobList(response.data)));
    })
    .catch(function (error) {
        console.log(error);
    });

function getJobList(html) {
    var $ = cheerio.load(html);
    var json = [];

    $('#post ul').each(function (i, e) {
        json.push({});
        json[i]['Name of Post'] = helper.formatString($(this).find("a:nth-child(2)").text());
        json[i]['Last Date'] = helper.formatString($(this).text().split(/Last Date\s?:/)[1]);
        json[i]['Link'] = helper.formatString($(this).find("a:nth-child(2)").attr("href"));
    });

    return json;
}