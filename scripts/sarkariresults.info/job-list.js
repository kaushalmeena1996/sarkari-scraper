var cheerio = require("cheerio");
var helper = require("../../utils/helper")

function scrapJobList(html) {
  var $ = cheerio.load(html);

  var data = [];
  var next = null;

  var i;
  var j;

  var date;

  var arr1 = [];
  var arr2 = [];

  arr1 = $("#headbox-1").children().toArray();
  for (i = 0; i < arr1.length; i++) {
    if ($(arr1[i]).attr("id") === "postname") {
      date = helper.formatString($(arr1[i]).text().split(/Latest Jobs on/)[1]);
    }
    arr2 = $(arr1[i]).find("li").toArray();
    for (j = 0; j < arr2.length; j++) {
      data.push({
        postName: helper.formatString($(arr2[j]).find("[href]:not([href=''])").text()),
        date: date,
        link: helper.formatString($(arr2[j]).find("[href]:not([href=''])").attr("href"))
      })
    }
  }

  return { data, next };
}

module.exports.jobListUrl = "https://sarkariresults.info/page/latestjobs.php";
module.exports.scrapJobList = scrapJobList;
