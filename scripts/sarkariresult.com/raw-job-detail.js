var cheerio = require("cheerio");
var helper = require("../../utils/helper")

function getTableData($, trArr, i) {
    var data = {};

    var valueArr = [];

    var temp1;
    var temp2;

    var index;

    for (index = i; index < trArr.length; index++) {
        if ($(trArr[index]).find("span").length > 0) {
            break;
        }
        temp1 = [];
        $(trArr[index]).find("td").each(function () {
            if ($(this).find("ul").length > 0) {
                temp2 = [];
                $(this).find("li").each(function () {
                    temp2.push(helper.formatString($(this).text()));
                });
                temp1.push(temp2.join("\n"));
            } else {
                temp1.push(helper.formatString($(this).text()));
            }
        });

        valueArr.push(temp1);
    }

    data.table = valueArr;

    return { data, index };
}

function getCellData($, elem) {
    var data = {};
    var temp;

    if ($(elem).find("h1").length > 0) {
        data.heading1 = [];
        $(elem).find("h1").each(function () {
            data.heading1.push(helper.formatString($(this).text()));
        });
    }

    if ($(elem).find("h2").length > 0) {
        data.heading2 = [];
        $(elem).find("h2").each(function () {
            data.heading2.push(helper.formatString($(this).text()));
        });
    }

    if ($(elem).find("h3").length > 0) {
        data.heading3 = [];
        $(elem).find("h3").each(function () {
            data.heading3.push(helper.formatString($(this).text()));
        });
    }

    if ($(elem).find("ul").length > 0) {
        data.list = [];
        $(elem).find("ul").each(function () {
            temp = [];
            $(this).find("li").each(function () {
                temp.push(helper.formatString($(this).text()));
            });
            data.list.push(temp);
        });
    } else if ($(elem).find("a").length > 0) {
        data.link = [];
        $(elem).find("a").each(function () {
            data.link.push(helper.formatString($(this).attr("href")));
        });
    } else if ($(elem).children().length == 0) {
        data.text = helper.formatString($(elem).text());
    }

    return data;
}


function getJobDetail(html) {
    var $ = cheerio.load(html);
    var temp;

    var json = [];

    var i;
    var j;

    var trArr = [];
    var tdArr = [];

    // Extract Table 1
    trArr = $("div[align='left'] table").find("tr").toArray();

    for (i = 0; i < trArr.length; i++) {
        if ($(trArr[i]).find("p").length > 0) {
            temp = getTableData($, trArr, i);
            json.push(temp.data);
            i = temp.index
        } else {
            tdArr = $(trArr[i]).find("td").toArray();
            for (j = 0; j < tdArr.length; j++) {
                temp = getCellData($, tdArr[j]);
                json.push(temp);
            }
        }
    }

    return json;
}

module.exports.getJobDetail = getJobDetail;