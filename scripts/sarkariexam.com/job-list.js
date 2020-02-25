var cheerio = require("cheerio");
var helper = require("../../utils/helper")

function scrapJobList(html) {
  var $ = cheerio.load(html);

  var data = [];
  var next = null;

  var i;

  var date;

  var arr = [];

  arr = $(".category-typepost > div > ul").children().toArray();
  for (i = 0; i < arr.length; i++) {
    if ($(arr[i]).prop("tagName") === "H3") {
      date = helper.formatString($(arr[i]).text().split(/Latest Form Issued on/)[1]);
    }
    if ($(arr[i]).prop("tagName") === "LI") {
      data.push({
        postName: helper.formatString($(arr[i]).find("a").text()),
        date: date,
        link: helper.formatString($(arr[i]).find("a").attr("href"))
      })
    }
  }

  if ($(".nextpostslink").length > 0) {
    next = helper.formatString($(".nextpostslink").attr("href"));
  }

  return { data, next };
}

module.exports.jobListUrl = "https://www.sarkariexam.com/category/hot-job";
module.exports.scrapJobList = scrapJobList;
