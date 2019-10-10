var cheerio = require("cheerio");
var helper = require("../../utils/helper")

function scrapJobList(html) {
    var $ = cheerio.load(html);

    var data = [];
    var next = null;

    var i;

    var arr = [];

    arr = $("#example > tbody > tr").toArray();
    for (i = 0; i < arr.length; i++) {
        data.push({
            company: helper.formatString($(arr[i]).find("td:nth-child(1)").text()),
            postName: helper.formatString($(arr[i]).find("td:nth-child(2)").text()),
            education: helper.formatString($(arr[i]).find("td:nth-child(3)").text()),
            totalPosts: helper.formatString($(arr[i]).find("td:nth-child(4)").text()),
            location: helper.formatString($(arr[i]).find("td:nth-child(5)").text()),
            lastDate: helper.formatString($(arr[i]).find("td:nth-child(6)").text()),
            link: helper.formatString($(arr[i]).find("td:nth-child(7) a").attr("href")),
        });
    }

    return { data, next };
}

module.exports.jobListUrl = "https://www.freshersnow.com/government-jobs-india";
module.exports.scrapJobList = scrapJobList;
