var cheerio = require("cheerio");
var helper = require("../../utils/helper");

function getValueAndType($, elem) {
  var data = {};

  var temp1;
  var temp2;
  var temp3;

  var i;
  var j;
  var k;

  var arr1 = [];
  var arr2 = [];
  var arr3 = [];

  switch ($(elem).prop("tagName")) {
    case "UL":
      data.value = [];
      arr1 = $(elem).find("li").toArray();
      for (i = 0; i < arr1.length; i++) {
        data.value.push(helper.formatString($(arr1[i]).text()));
      }
      data.type = "List";
      break;
    case "TABLE":
      data.value = [];
      arr1 = $(elem).find("tr").toArray();
      for (i = 0; i < arr1.length; i++) {
        temp1 = []
        arr2 = $(arr1[i]).find("td").toArray();
        for (j = 0; j < arr2.length; j++) {
          temp2 = {};
          if ($(arr2[j]).find("a").length > 0) {
            temp3 = [];
            arr3 = $(arr2[j]).find("a").toArray();
            for (k = 0; k < arr3.length; k++) {
              temp3.push({
                text: helper.formatString($(arr3[k]).text()),
                link: helper.formatString($(arr3[k]).attr("href")),
              })
            }
            temp2.value = temp3;
            temp2.type = "Link";
          } else {
            temp2.value = helper.formatString($(arr2[j]).text());
            temp2.type = "String";
          }

          temp3 = helper.formatString($(arr2[j]).attr("rowspan"));
          if (temp3) {
            temp2.rowspan = temp3
          }
          temp3 = helper.formatString($(arr2[j]).attr("colspan"));
          if (temp3) {
            temp2.colspan = temp3
          }

          temp1.push(temp2);
        }
        data.value.push(temp1);
      }
      data.type = "Table";
      break;
    default:
      data.value = $(elem).text();
      data.type = "String";
  }

  return data;
}

function getKey($, elem) {
  var data = {};

  data.key = helper.formatKey($(elem).text());

  return data;
}

function getSectionData($, childArr, i) {
  var data = {};
  var temp;
  var index;

  temp = getKey($, childArr[i]);
  Object.assign(data, temp);

  temp = getValueAndType($, childArr[i + 1]);
  Object.assign(data, temp);

  index = i + 1; // skip row as it is already traversed by getValueAndType

  return { data, index };
}

function scrapJobDetail(html, url) {
  var $ = cheerio.load(html);

  var data = [];

  var temp;

  var i;

  var arr = [];

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

  arr = $(".td-post-content").children().toArray();
  for (i = 0; i < arr.length; i++) {
    if ($(arr[i]).prop("tagName") == "H2" || $(arr[i]).prop("tagName") == "H3") {
      temp = getSectionData($, arr, i);
      if (helper.isObjectEmpty(temp.data) == false) {
        data.push(temp.data);
      }
      i = temp.index;
    }
  }

  return data;
}

module.exports.scrapJobDetail = scrapJobDetail;