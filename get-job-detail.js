var axios = require("axios");
var jobDetail = require("./scripts/sarkariresult.com/raw-job-detail")

var url = process.argv[2];

if (url) {
    axios.get(url)
        .then(function (response) {
           console.log(JSON.stringify(jobDetail.getJobDetail(response.data), undefined, 2));
        })
        .catch(function (error) {
            console.log(`${error.response.status} : ${error.response.statusText}`);
        });
} else {
    console.log("Usage: node get-job-detail.js [link]");
    process.exit(0);
}