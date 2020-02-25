var cheerio = require("cheerio");
var helper = require("../../utils/helper")

function scrapJobList(html) {
  var $ = cheerio.load(html);

  var data = [];
  var next = null;

  var i;

  var arr = [];

  arr = $("#post ul").toArray();
  for (i = 0; i < arr.length; i++) {
    data.push({
      postName: helper.formatString($(arr[i]).find("a:nth-child(2)").text()),
      lastDate: helper.formatString($(arr[i]).text().split(/Last Date\s?:/)[1]),
      link: helper.formatString($(arr[i]).find("a:nth-child(2)").attr("href"))
    });
  }

  return { data, next };
}

module.exports.jobListUrl = "https://www.sarkariresult.com/latestjob.php";
module.exports.scrapJobList = scrapJobList;
