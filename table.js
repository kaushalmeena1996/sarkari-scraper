var csv = require("./utils/csv");

var json = [
    {
        value: [
            [
                {
                    value: "Month",
                    type: "String"
                },
                {
                    value: "Savings",
                    type: "String",
                    colspan: 2
                },
                {
                    value: "c",
                    type: "String"
                },
                {
                    value: "Sa",
                    type: "String",
                    colspan: 2
                },
            ],
            [
                {
                    value: "January",
                    type: "String"
                },
                {
                    value: "$100",
                    type: "String",
                    colspan: 2,
                },
                {
                    value: "c",
                    type: "String"
                },
                {
                    value: "Sa",
                    type: "String",
                    colspan: 2
                },
            ],
            [
                {
                    value: "February",
                    type: "String"
                },
                {
                    value: "$80",
                    type: "String",
                    colspan: 2,
                },
                {
                    value: "c",
                    type: "String"
                },
                {
                    value: "Sa",
                    type: "String",
                    colspan: 2
                },
            ]
        ],
        type: "Table"
    }
];

// var json = [
//     {
//         "key": "Vacancy Details Total  694 Post",
//         "value": [
//             [
//                 {
//                     "value": "Post Name",
//                     "type": "String"
//                 },
//                 {
//                     "value": "Gen",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": "SC",
//                     "type": "String"
//                 },
//                 {
//                     "value": "ST",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": "OBC",
//                     "type": "String",
//                     "colspan": "3"
//                 },
//                 {
//                     "value": "Total",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": "Eligibility",
//                     "type": "String",
//                     "colspan": "6"
//                 }
//             ],
//             [
//                 {
//                     "value": "Exercise Trainer (Vyayam Parikshak)",
//                     "type": "String"
//                 },
//                 {
//                     "value": "22",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": "09",
//                     "type": "String"
//                 },
//                 {
//                     "value": "01",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": "10",
//                     "type": "String",
//                     "colspan": "3"
//                 },
//                 {
//                     "value": "42",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": [
//                         "Bachelor Degree in D.PEd/ B.PEd (Physical Education) Degree in Any Recognized University in India."
//                     ],
//                     "type": "List",
//                     "colspan": "6"
//                 }
//             ],
//             [
//                 {
//                     "value": "Development Team Officer (Vikas Dal Adhikari)",
//                     "type": "String"
//                 },
//                 {
//                     "value": "327",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": "132",
//                     "type": "String"
//                 },
//                 {
//                     "value": "14",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": "179",
//                     "type": "String",
//                     "colspan": "3"
//                 },
//                 {
//                     "value": "652",
//                     "type": "String",
//                     "colspan": "2"
//                 },
//                 {
//                     "value": [
//                         "Bachelor Degree in Any Stream in Any Recognized University in India."
//                     ],
//                     "type": "List",
//                     "colspan": "6"
//                 }
//             ]
//         ],
//         "type": "Table"
//     }
// ];

console.log(csv.parse(csv.formatData(json)));
