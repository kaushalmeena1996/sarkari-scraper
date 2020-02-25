var cheerio = require("cheerio");
var helper = require("../../utils/helper")

function getShortData($, elem) {
  var data = {};

  data.key = helper.formatKey($(elem).find("td:nth-child(1)").text());
  data.value = helper.formatString($(elem).find("td:nth-child(2)").text());
  data.type = "String";

  return data;
}

function getHeaderData($, elem) {
  var data = {};

  var arr = [];

  var i;

  data.key = "Header";

  arr = $(elem).find("span").toArray();
  data.value = [];
  for (i = 0; i < arr.length; i++) {
    data.value.push(helper.formatString($(arr[i]).text()));
  }
  data.type = "List";

  return data;
}

function getKey($, elem) {
  var data = {};

  if ($(elem).find("span").eq(0).length > 0) {
    data.key = helper.formatKey($(elem).find("span").eq(0).text());
  }

  return data;
}

function getValueAndType($, elem) {
  var data = {};

  var arr = [];

  var i;

  if ($(elem).find("ul").length > 0) {
    arr = $(elem).find("li").toArray();
    data.value = [];
    for (i = 0; i < arr.length; i++) {
      data.value.push(helper.formatString($(arr[i]).text()));
    }
    data.type = "List";
  } else if ($(elem).find("a").length > 0) {
    arr = $(elem).find("a").toArray();
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

function getTableData($, trArr, i) {
  var data = {};

  var valueArr = [];

  var temp1;
  var temp2;
  var temp3;

  var arr = [];

  var index;

  var k;

  for (index = i; index < trArr.length; index++) {
    arr = $(trArr[index]).find("td").toArray();
    if (arr.length < 2) {
      break;
    }
    temp1 = [];
    for (k = 0; k < arr.length; k++) {
      temp2 = getValueAndType($, arr[k]);
      if (temp2.value === undefined) {
        temp2.value = helper.formatString($(arr[k]).text());
        temp2.type = "String";
      }
      temp3 = helper.formatString($(arr[k]).attr("rowspan"));
      if (temp3) {
        temp2.rowspan = temp3
      }
      temp3 = helper.formatString($(arr[k]).attr("colspan"));
      if (temp3) {
        temp2.colspan = temp3
      }
      temp1.push(temp2);
    }

    valueArr.push(temp1);
  }

  data.value = valueArr;
  data.type = "Table";

  return { data, index };
}

function isTable($, elem) {
  var result = false;

  if ($(elem).find("p").length > 0) {
    result = true;
  }

  return result;
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

function mergeKeyValue(json) {
  var data = [];
  var linkSection = false;
  var i;

  for (i = 0; i < json.length - 1; i++) {
    if ((linkSection || json[i + 1].type === "Table") && json[i + 1].value && json[i].value === undefined) {
      data.push({
        ...json[i],
        ...json[i + 1]
      });
      i++;
    } else {
      data.push(json[i]);
    }

    if (json[i].key === "Some Useful Important Links") {
      linkSection = true;
    }
  }

  return data;
}


function scrapJobDetail(html, url) {
  var $ = cheerio.load(html);

  var data = [];

  var temp;

  var i;
  var j;

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

  // Extract Table 1
  arr1 = $("div[align='left'] table").eq(0).find("tr").toArray();
  for (i = 0; i < arr1.length; i++) {
    if ($(arr1[i]).find("td").length == 2) {
      temp = getShortData($, arr1[i]);
      if (helper.isObjectEmpty(temp) == false) {
        data.push(temp);
      }
    }
  }

  // Extract Table 2
  arr1 = $("div[align='left'] table").eq(1).find("tr").toArray();
  for (i = 0; i < arr1.length; i++) {
    if (isTable($, arr1[i])) {
      temp = getTableData($, arr1, i);
      if (helper.isObjectEmpty(temp.data) == false) {
        data.push(temp.data);
      }
      i = temp.index;
    }
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

  data = mergeKeyValue(data);

  return data;
}

module.exports.scrapJobDetail = scrapJobDetail;