var axios = require("axios");
var jobList = require("./scripts/sarkariresult.com/job-list")

var url = "https://www.sarkariresult.com/latestjob.php";

axios.get(url)
    .then(function (response) {
        console.log(JSON.stringify(jobList.getJobList(response.data), undefined, 2));
    })
    .catch(function (error) {
        console.log(`${error.response.status} : ${error.response.statusText}`);
    });