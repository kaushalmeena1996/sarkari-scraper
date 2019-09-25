var axios = require("axios");
var cheerio = require("cheerio");
var helper = require("./helper")
var constant = require("./constant")

var url = process.argv[2];

if (url) {
    axios.get(url)
        .then(function (response) {
            console.log(JSON.stringify(getJobDetail(response.data), undefined, 2));
        })
        .catch(function (error) {
            console.log(error);
        });
} else {
    console.log("Usage: node job-detail.js [link]");
    process.exit(0);
}

function getHeaderSection($, elem) {
    var data = {};

    var count = 1;

    $(elem).find("h2").each(function () {
        data[`Header${count}`] = helper.formatString($(this).text());
        count++;
    });

    return data;
}


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

function findSection($, elem) {
    const SECTIONS = constant.SECTIONS;

    const sectionName = helper.formatString($(elem).text());

    var result = SECTIONS.find(function (section) {
        return sectionName.indexOf(section.name) > -1
    });

    return result;
}

function getTableSection($, trArr, key, index) {
    var tableData = {};

    var valueArr = [];

    var temp1;
    var temp2;

    var tableIndex;

    for (tableIndex = index; tableIndex < trArr.length; tableIndex++) {
        if ($(trArr[tableIndex]).find("h2").length > 0) {
            break;
        }
        temp1 = [];
        $(trArr[tableIndex]).find("td").each(function () {
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

    tableData[key] = valueArr;

    return { tableData, tableIndex };
}

function getLinkSection($, trArr, key, index) {
    var linkData = {};

    var valueObj = {};

    var temp1;
    var temp2;

    var linkIndex;

    for (linkIndex = index; linkIndex < trArr.length; linkIndex++) {
        if ($(trArr[linkIndex]).find("h2").length > 0) {
            break;
        }

        temp1 = helper.formatKey($(trArr[linkIndex]).find("td:nth-child(1)").text());
        temp2 = [];

        if ($(trArr[linkIndex]).find("td:nth-child(2) a").length > 0) {
            $(trArr[linkIndex]).find("td:nth-child(2) a").each(function () {
                temp2.push({
                    name: helper.formatString($(this).text()),
                    link: helper.formatString($(this).attr("href"))
                });
            });
        } else {
            temp2.push({
                name: $(trArr[linkIndex]).find("td:nth-child(2)").text(),
                link: null
            });
        }

        valueObj[temp1] = temp2;
    }

    linkData[key] = valueObj;

    return { linkData, linkIndex };
}

function getJobDetail(html) {
    var $ = cheerio.load(html);
    var data;
    var section = {};

    var json = {};

    var i;
    var j;

    var trArr = [];
    var tdArr = [];

    // // Extract Table 1

    // trArr = $("div[align='left'] table").eq(0).find("tr").toArray();

    // for (i = 0; i < trArr.length; i++) {
    //     if ($(trArr[i]).find("td").length == 2) {
    //         data = getInfoSection($, trArr[i]);
    //         Object.assign(json, data)
    //     }
    // }

    // Extract Table 2

    trArr = $("div[align='left'] table").eq(1).find("tr").toArray();

    for (i = 0; i < trArr.length; i++) {
        if (section) {
            switch (section.type) {
                case "Table":
                    data = getTableSection($, trArr, section.name, i);
                    Object.assign(json, data.tableData);
                    i = data.tableIndex;
                    break;
                case "Link":
                    data = getLinkSection($, trArr, section.name, i);
                    Object.assign(json, data.linkData);
                    i = data.linkIndex;
                    break;
            }
            section = null;
        } else {
            tdArr = $(trArr[i]).find("td").toArray();
            for (j = 0; j < tdArr.length; j++) {
                if (i === 0) {
                    data = getHeaderSection($, tdArr[j]);
                    Object.assign(json, data);
                }
                else if ($(tdArr[j]).find("ul").length > 0) {
                    data = getListSection($, tdArr[j]);
                    Object.assign(json, data)
                } else {
                    section = findSection($, tdArr[j])
                }
            }
        }
    }

    return json;
}