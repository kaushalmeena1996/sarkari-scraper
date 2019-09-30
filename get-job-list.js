var axios = require("axios");
var jobList = require("./scripts/sarkariresult/job-list")

var url = "https://www.sarkariresult/latestjob.php";

axios.get(url)
    .then(function (response) {
        console.log(JSON.stringify(jobList.getJobList(response.data), undefined, 2));
    })
    .catch(function (error) {
        console.log(error);
    });