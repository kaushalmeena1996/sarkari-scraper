function isObjectEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

function formatString(str) {
  if (str) {
    return str.trim();
  } else {
    return null;
  }
}

function formatKey(str) {
  if (str) {
    return str.replace(":", "").trim();
  } else {
    return null;
  }
}

module.exports.isObjectEmpty = isObjectEmpty;
module.exports.formatKey = formatKey;
module.exports.formatString = formatString;