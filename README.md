# [ Project : Sarkari Scrapper ]

## [ Synopsis ]

A web scraper made to extract results from government job listing sites.

## [ Prerequisities ]

- NodeJS
  - https://nodejs.org/en/download/

## [ CLI Usage ]

### Supported Domains

- freshersnow.com
- sarkariresult.com
- sarkariresults.info
- sarkariexam.com

### Supported Formats

- json
- csv

### For job-list

```
node scrap-job-list.js [flags]
```
- example
```
node scrap-job-list.js -d sarkariresult.com
```

#### Flags

| Flag | Input    | Description                                                                   |
| ---- | -------- | ----------------------------------------------------------------------------- |
| -d   | domain   | Set domain of site from job list to be scrapped (default : sarkariresult.com) |
| -f   | format   | Set format of output (default : json)                                         |
| -o   | filename | Set filename of output file, if not used file will not be saved               |

### For job-detail

```
node scrap-job-detail.js [flags]
```
- example
```
node scrap-job-detail.js -u https://www.sarkariresult.com/upsssc/01exam2018.php
```

#### Flags

| Flag | Input    | Description                                                     |
| ---- | -------- | --------------------------------------------------------------- |
| -u   | url      | Set url of job detail page (required)                           |
| -f   | format   | Set format of output (default : json)                           |
| -o   | filename | Set filename of output file, if not used file will not be saved |

### For scraping

```
node run-scrapper.js [flags]
```
- example
```
node run-scrapper.js -d freshersnow.com -f csv -o output.csv
```

#### Flags

| Flag | Input    | Description                                                                   |
| ---- | -------- | ----------------------------------------------------------------------------- |
| -d   | domain   | Set domain of site from job list to be scrapped (default : sarkariresult.com) |
| -f   | format   | Set format of output (default : json)                                         |
| -o   | filename | Set filename of output file (required)                                        |
