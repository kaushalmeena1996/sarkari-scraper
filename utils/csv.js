var json2csv = require('json2csv');
var table = require("table");

var parser = new json2csv.Parser();

function formatArray(data) {
  return data.reduce(function (acc, cur) {
    return acc + "• " + cur + "\n";
  }, "");
}

function formatParagraph(data) {
  return data.reduce(function (acc, cur) {
    return acc + cur + "\n";
  }, "");
}

function formatLink(data) {
  return data.reduce(function (acc, cur) {
    return acc + cur.text + " ( " + cur.link + " )\n";
  }, "");
}

function formatTable(json) {
  var data = [];

  var curr_x = 0;
  var curr_y = 0;

  var rowspan;
  var colspan;
  var content;

  var x;
  var y;

  var i;
  var j;

  for (i = 0; i < json.length; i++) {
    curr_y = 0;
    for (j = 0; j < json[i].length; j++) {
      rowspan = +json[i][j].rowspan || 1;
      colspan = +json[i][j].colspan || 1;

      switch (json[i][j].type) {
        case "List":
          content = formatArray(json[i][j].value);
          break;
        case "Paragraph":
          content = formatParagraph(json[i][j].value);
          break;
        case "Link":
          content = formatLink(json[i][j].value);
          break;
        default:
          content = json[i][j].value;
      }

      for (x = 0; x < rowspan; x++) {
        for (y = 0; y < colspan; y++) {
          if (data[curr_x + x] === undefined) {
            data[curr_x + x] = [];
          }

          while (data[curr_x + x][curr_y + y] !== undefined) {
            curr_y += 1;
            if (data[curr_y + y] === undefined) {
              data[curr_y + y] = [];
            }
          }

          if (x === 0 && y === 0) {
            data[curr_x + x][curr_y + y] = content;
          } else {
            data[curr_x + x][curr_y + y] = ""
          }
        }
      }
      curr_y += 1;
    }
    curr_x += 1;
  }

  var config = {
    columns: {
      0: {
        width: 20
      },
      1: {
        width: 20
      },
      2: {
        width: 20
      },
      3: {
        width: 20
      },
      4: {
        width: 20
      },
      5: {
        width: 20
      },
      6: {
        width: 20
      },
      7: {
        width: 20
      },
      8: {
        width: 20
      },
      9: {
        width: 20
      },
      10: {
        width: 20
      }
    }
  };

  data = table.table(data, config);

  return data;
}

function formatData(json) {
  var i;

  for (i = 0; i < json.length; i++) {
    switch (json[i].type) {
      case "List":
        json[i].value = formatArray(json[i].value);
        break;
      case "Link":
        json[i].value = formatLink(json[i].value);
        break;
      case "Table":
        json[i].value = formatTable(json[i].value);
        break;
    }
  }

  return json;
}

function parse(data) {
  return parser.parse(data);
}

module.exports.formatData = formatData;
module.exports.parse = parse;