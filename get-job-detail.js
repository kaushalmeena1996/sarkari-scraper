var axios = require("axios");
var jobDetail = require("./scripts/sarkariresult/job-detail")

var url = process.argv[2];

if (url) {
    axios.get(url)
        .then(function (response) {
            console.log(JSON.stringify(jobDetail.getJobDetail(response.data, url), undefined, 2));
        })
        .catch(function (error) {
            console.log(error);
        });
} else {
    console.log("Usage: node get-job-detail.js [link]");
    process.exit(0);
}