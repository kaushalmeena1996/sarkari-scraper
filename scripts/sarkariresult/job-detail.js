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

    data.key = "Header";

    data.value = [];
    $(elem).find("h2").each(function () {
        data.value.push(helper.formatString($(this).text()));
    });

    data.type = "Array";

    return data;
}

function getKey($, elem) {
    var data = {};

    if ($(elem).find("span").eq(0).length > 0) {
        data.key = helper.formatString($(elem).find("span").eq(0).text());
    }

    return data;
}

function getValueAndType($, elem) {
    var data = {};

    if ($(elem).find("ul").length > 0) {
        data.value = [];
        $(elem).find("li").each(function () {
            data.value.push(helper.formatString($(this).text()));
        });
        data.type = "Array";
    } else if ($(elem).find("a").length > 0) {
        data.value = [];
        $(elem).find("a").each(function () {
            data.value.push({
                text: helper.formatString($(this).text()),
                link: helper.formatString($(this).attr("href"))
            });
        });
        data.type = "Link";
    }

    return data;
}

function getTableData($, trArr, i) {
    var data = {};

    var valueArr = [];

    var row;

    var temp1;
    var temp2;

    var index;

    for (index = i; index < trArr.length; index++) {
        if ($(trArr[index]).find("td").length < 2) {
            break;
        }
        row = [];
        $(trArr[index]).find("td").each(function () {
            temp1 = getValueAndType($, this);
            if (temp1.value === undefined) {
                temp1.value = helper.formatString($(this).text());
                temp1.type = "String";
            }
            temp2 = helper.formatString($(this).attr("rowspan"));
            if (temp2) {
                temp1.rowspan = temp2
            }
            temp2 = helper.formatString($(this).attr("colspan"));
            if (temp2) {
                temp1.colspan = temp2
            }
            row.push(temp1);
        });

        valueArr.push(row);
    }

    data.value = valueArr;
    data.type = "Table";

    return { data, index };
}

function getCellData($, elem) {
    var data = {};
    var temp;

    temp = getKey($, elem);
    Object.assign(data, temp);

    temp = getValueAndType($, elem);
    Object.assign(data, temp);

    if (data.key === undefined && data.value === undefined) {
        data.key = helper.formatString($(elem).text());
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


function getJobDetail(html, url) {
    var $ = cheerio.load(html);
    var temp;

    var temp;

    var json = [];

    var i;
    var j;

    var trArr = [];
    var tdArr = [];

    // Push Link information
    json.push({
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
    trArr = $("div[align='left'] table").eq(0).find("tr").toArray();

    for (i = 0; i < trArr.length; i++) {
        if ($(trArr[i]).find("td").length == 2) {
            temp = getShortData($, trArr[i]);
            json.push(temp);
        }
    }

    // Extract Table 2
    trArr = $("div[align='left'] table").eq(1).find("tr").toArray();

    for (i = 0; i < trArr.length; i++) {
        if ($(trArr[i]).find("p").length > 0) {
            temp = getTableData($, trArr, i);
            json.push(temp.data);
            i = temp.index
        } else {
            tdArr = $(trArr[i]).find("td").toArray();
            for (j = 0; j < tdArr.length; j++) {
                if (i == 0 && j == 0) {
                    temp = getHeaderData($, tdArr[j]);
                } else {
                    temp = getCellData($, tdArr[j]);
                }
                json.push(temp);
            }
        }
    }

    json = mergeKeyValue(json);

    return json;
}

module.exports.getJobDetail = getJobDetail;