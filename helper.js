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

module.exports.formatKey = formatKey;
module.exports.formatString = formatString;