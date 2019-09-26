var cheerio = require("cheerio");
var helper = require("../utils/helper")

function getJobList(html) {
    var $ = cheerio.load(html);
    var json = [];

    $('#post ul').each(function (i, e) {
        json.push({});
        json[i]['Name of Post'] = helper.formatString($(this).find("a:nth-child(2)").text());
        json[i]['Last Date'] = helper.formatString($(this).text().split(/Last Date\s?:/)[1]);
        json[i]['Link'] = helper.formatString($(this).find("a:nth-child(2)").attr("href"));
    });

    return json;
}

module.exports.getJobList = getJobList;