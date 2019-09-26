var cheerio = require("cheerio");
var helper = require("../../utils/helper")

function getInfoSection($, elem) {
    var data = {};

    var key = helper.formatKey($(elem).find("td:nth-child(1)").text());
    var value = helper.formatString($(elem).find("td:nth-child(2)").text());

    data[key] = value;

    return data;
}

function getListSection($, elem) {
    var data = {};

    var key = helper.formatKey($(elem).find("h2 > span > b").text());
    var valueArr = [];

    $(elem).find("li").each(function () {
        valueArr.push(helper.formatString($(this).text()));
    });

    data[key] = valueArr;

    return data;
}

function findSection($, elem, trArr, index) {
    var result = null;

    var sectionName = helper.formatString($(elem).text());

    if (sectionName === "Some Useful Important Links") {
        result = {
            name: sectionName,
            type: "Link"
        }
    } else if ($(trArr[index + 1]).find("p").length > 0) {
        result = {
            name: sectionName,
            type: "Table"
        }
    }

    return result;
}

function getHeaderSection($, trArr, key, i) {
    var data = {};

    var valueArr = [];

    for (index = i; index < trArr.length; index++) {
        if ($(trArr[index]).find("h2").length < 2) {
            index--;
            break;
        }
        $(trArr[index]).find("h2").each(function () {
            valueArr.push(helper.formatString($(this).text()));
        });
    }

    data[key] = valueArr;

    return { data, index };
}

function getTableSection($, trArr, key, i) {
    var data = {};

    var valueArr = [];

    var temp1;
    var temp2;

    var index;

    for (index = i; index < trArr.length; index++) {
        if ($(trArr[index]).find("h2").length > 0) {
            index--;
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

    data[key] = valueArr;

    return { data, index };
}

function getLinkSection($, trArr, key, i) {
    var data = {};

    var valueObj = {};

    var temp1;
    var temp2;

    var index;

    for (index = i; index < trArr.length; index++) {
        if ($(trArr[index]).find("td").length !== 2) {
            index--;
            break;
        }

        temp1 = helper.formatKey($(trArr[index]).find("td:nth-child(1)").text());
        temp2 = [];

        if ($(trArr[index]).find("td:nth-child(2) a").length > 0) {
            $(trArr[index]).find("td:nth-child(2) a").each(function () {
                temp2.push({
                    name: helper.formatString($(this).text()),
                    link: helper.formatString($(this).attr("href"))
                });
            });
        } else {
            temp2.push({
                name: $(trArr[index]).find("td:nth-child(2)").text(),
                link: null
            });
        }

        valueObj[temp1] = temp2;
    }

    data[key] = valueObj;

    return { data, index };
}

function getJobDetail(html) {
    var $ = cheerio.load(html);
    var temp;
    var section = { name: "Header", type: "Header" };

    var json = {};

    var i;
    var j;

    var trArr = [];
    var tdArr = [];

    // Extract Table 1

    trArr = $("div[align='left'] table").eq(0).find("tr").toArray();

    for (i = 0; i < trArr.length; i++) {
        if ($(trArr[i]).find("td").length == 2) {
            temp = getInfoSection($, trArr[i]);
            Object.assign(json, temp)
        }
    }

    // Extract Table 2

    trArr = $("div[align='left'] table").eq(1).find("tr").toArray();

    for (i = 0; i < trArr.length; i++) {
        if (section) {
            switch (section.type) {
                case "Header":
                    temp = getHeaderSection($, trArr, section.name, i);
                    Object.assign(json, temp.data);
                    i = temp.index;
                    break;
                case "Table":
                    temp = getTableSection($, trArr, section.name, i);
                    Object.assign(json, temp.data);
                    i = temp.index;
                    break;
                case "Link":
                    temp = getLinkSection($, trArr, section.name, i);
                    Object.assign(json, temp.data);
                    i = temp.index;
                    break;
            }
            section = null;
        } else {
            tdArr = $(trArr[i]).find("td").toArray();
            for (j = 0; j < tdArr.length; j++) {
                if ($(tdArr[j]).find("ul").length > 0) {
                    temp = getListSection($, tdArr[j]);
                    Object.assign(json, temp)
                } else {
                    section = findSection($, tdArr[j], trArr, i)
                }
            }
        }
    }

    return json;
}

module.exports.getJobDetail = getJobDetail;