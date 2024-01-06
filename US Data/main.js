var year = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002,
    2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021
]
var number_of_fires = [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]
var acres_area = [0, 1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000, 11000000]
var fires = [66481, 75754, 87394, 58810, 79107, 82234, 96363, 66196, 81043, 92487, 92250, 84079, 73457, 63629,
    65461, 66753, 96385, 85705, 78979, 78792, 71971, 74126, 67774, 47579, 63312, 68151, 67743, 71499, 58083, 50477, 58950, 58985
]
var acres = [4621621, 2953578, 2069929, 1797574, 4073579, 1840546, 6065998, 2856959,
    1329704, 5626093, 7393493, 3570911, 7184712, 3960842, 8097880, 8689389, 9873745, 9328045, 5292468, 5921786, 3422724, 8711367,
    9326238, 4319546, 3595613, 10125149, 5509995, 10026086, 8767492, 4664364, 10122336, 7125643
]

const width = 1500
const height = 700
const bar_width = 45

var graph = d3.select("body").append("svg").attr("width", width).attr("height", height)

var xScale = d3.scaleLinear().domain([1990, 2021]).range([0, width - 150])

var x_axis = graph.selectAll("svg").data(year).enter()
    .append("g")
    .attr("transform", "translate(50, 575)")
    .call(d3.axisBottom(xScale))

var text1 = graph.append("text").attr("x", 730).attr("y", 620).text("YEARS")

var yScale = d3.scaleLinear().domain([0, d3.max(number_of_fires, (d) => d)]).range([550, 0])

var y_axis = graph.selectAll("svg").data(number_of_fires).enter()
    .append("g")
    .attr("transform", "translate(50, 25)")
    .call(d3.axisLeft(yScale))

var text2 = graph.append("text").attr("x", 0).attr("y", 10).text("No. of Fires").attr("fill", "purple")

var zScale = d3.scaleLinear().domain([0, d3.max(acres_area, (d) => d)]).range([550, 0])

var z_axis = graph.selectAll("svg").data(acres_area).enter()
    .append("g")
    .attr("transform", "translate(1400, 25)")
    .call(d3.axisRight(zScale))

var text3 = graph.append("text").attr("x", 1400).attr("y", 10).text("Acres burned").attr("fill", "blue")

var bar = graph.selectAll("svg").data(fires).enter().append("g")
    // .attr("transform", function(d, i) {
    //     return "translate(" + (i + 250) + "," + 1360 + ")"
    // })

var rect = bar.append("rect").attr("width", width / fires.length - 10)
    .attr("height", (d) => 574 - yScale(d))
    .attr("x", (d, i) => 55 + 40 * i + 2 * i)
    .attr("y", (d) => yScale(d))
    .attr("fill", "purple")
    .attr("stroke", "black")
    .attr("stroke-width", "2px")

var bar2 = graph.selectAll("svg").data(acres).enter().append("g")

var circle = bar2.append("circle")
    .attr("cx", (d, i) => 74 + 40 * i + 2 * i)
    .attr("cy", (d) => zScale(d))
    .attr("r", 5)
    .attr("fill", "steelblue")


var lineGenerator = d3.line()
    .x((d, i) => 74 + 40 * i + 2 * i)
    .y((d) => zScale(d));

graph.append("path")
    .datum(acres) // Use datum() instead of data() for the path
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 4)
    .attr("d", lineGenerator); // Use the line generator here



// graph.append("circle").attr("cx", 75).attr("cy", 200).attr("r", 3)
// graph.append("circle").attr("cx", 75 + 40 + 2).attr("cy", 200).attr("r", 3)
// graph.append("circle").attr("cx", 75 + 80 + 4).attr("cy", 200).attr("r", 3)
// graph.append("circle").attr("cx", 75 + 120 + 6).attr("cy", 200).attr("r", 3)