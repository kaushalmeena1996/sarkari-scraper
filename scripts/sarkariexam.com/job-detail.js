var cheerio = require("cheerio");
var helper = require("../../utils/helper");

function getHeaderData($, elem) {
  var data = {};

  var arr = [];

  var i;

  data.key = "Header";

  data.value = [];

  arr = $(elem).find("h1,h4").toArray();
  for (i = 0; i < arr.length; i++) {
    data.value.push(helper.formatString($(arr[i]).text()));
  }

  data.type = "List";

  return data;
}


function getKey($, elem) {
  var data = {};

  if ($(elem).find("h3,h2").eq(0).length > 0) {
    data.key = helper.formatKey($(elem).find("h3,h2").eq(0).text());
  } else if ($(elem).find("p").eq(0).text().includes("Vacancy Details")) {
    data.key = "Vacancy Details";
  }

  return data;
}

function getValueAndType($, elem) {
  var data = {};

  var temp;

  var arr = [];

  var i;

  if ($(elem).find("p").length > 0) {
    arr = $(elem).find("p").toArray();
    data.value = [];
    for (i = 0; i < arr.length; i++) {
      temp = helper.formatString($(arr[i]).text());
      if (temp) {
        data.value.push(temp);
      }
    }
    data.type = "Paragraph";
  } else if ($(elem).find("ul").length > 0) {
    arr = $(elem).find("li").toArray();
    data.value = [];
    for (i = 0; i < arr.length; i++) {
      data.value.push(helper.formatString($(arr[i]).text()));
    }
    data.type = "List";
  } else if ($(elem).find("a[href]:not([href=''])").length > 0) {
    arr = $(elem).find("a[href]:not([href=''])").toArray();
    data.value = [];
    for (i = 0; i < arr.length; i++) {
      data.value.push({
        text: helper.formatString($(arr[i]).text()),
        link: helper.formatString($(arr[i]).attr("href"))
      });
    }
    data.type = "Link";
  }

  return data;
}

function getCellData($, elem) {
  var data = {};
  var temp;

  temp = getKey($, elem);
  Object.assign(data, temp);

  temp = getValueAndType($, elem);
  Object.assign(data, temp);

  temp = helper.formatString($(elem).text());
  if (temp && data.key === undefined && data.value === undefined) {
    data.key = temp;
  }

  return data;
}


function scrapJobDetail(html, url) {
  var $ = cheerio.load(html);

  var data = [];

  var temp;

  var i;

  var arr1 = [];
  var arr2 = [];

  // Push Link information
  data.push({
    key: "Post Link",
    value: [
      {
        text: "Link",
        link: url
      }
    ],
    type: "Link"
  });

  // Push Post Update information
  data.push({
    key: "Post Last Updates",
    value: helper.formatString($(".newpage-row2 > div:nth-child(1)").text().split(":")[1]),
    type: "String"
  });

  arr1 = $(".newpage-row2 table tr").toArray();
  for (i = 0; i < arr1.length; i++) {
    arr2 = $(arr1[i]).find("td").toArray();
    for (j = 0; j < arr2.length; j++) {
      if (i == 0 && j == 0) {
        temp = getHeaderData($, arr2[j]);
      } else {
        temp = getCellData($, arr2[j]);
      }
      if (helper.isObjectEmpty(temp) == false) {
        data.push(temp);
      }
    }
  }

  return data;
}

module.exports.scrapJobDetail = scrapJobDetail;