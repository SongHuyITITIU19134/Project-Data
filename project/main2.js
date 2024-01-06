var rowConverter = function(d) {
        return {
            year: d["Year"],
            wildfires: d["Number of wildfires - full series (NIFC)"],
            acres: d["Acres burned - full series (NIFC)"]
        }
    }
    //https://raw.githubusercontent.com/manjunath5496/CSV-Datasets_3/master/Wildfire%20data%20in%20the%20US%20(NIFC).csv
    //https://raw.githubusercontent.com/tejasvirandive/US-Wildfire-Analysis-/master/data/Fires_pruned.csv
    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv
d3.csv("https://raw.githubusercontent.com/manjunath5496/CSV-Datasets_3/master/Wildfire%20data%20in%20the%20US%20(NIFC).csv", rowConverter, function(err, data) {
    if (err) {
        console.log(err)
    } else {
        draw(data)
    }
})

function draw(data) {
    const w = 3500
    const h = 1000
    const pad = 50

    var svg = d3.select("body").append("svg").attr("width", w).attr("height", h)

    var xScale = d3.scaleBand().domain(data.map(d => d.year)).range([0, w - pad])
    var x_axis = d3.axisBottom(xScale)
    svg.append("g").call(x_axis).attr("transform", "translate(" + (pad + 10) + "," + (h - pad) + ")")

    var yScale = d3.scaleLinear().domain([0, 55000000]).range([h - pad, 0])
    var y_axis = d3.axisLeft(yScale)
    svg.append("g").call(y_axis).attr("transform", "translate(" + (pad + 10) + ",0)")

    var line = d3.line()
        .defined(d => d.acres >= 0 && d.acres < 25000000)
        .x((d, i) => pad + 10 + xScale.bandwidth() * i).y(d => yScale(d.acres))

    var area = d3.area()
        .defined(d => d.acres >= 0)
        .x((d, i) => pad + 10 + xScale.bandwidth() * i)
        .y0(() => yScale.range()[0])
        .y1(d => yScale(d.acres))

    svg.append("path").datum(data)
        .attr("class", "line").attr("d", area)
        .attr("stroke", "steelblue")
        .attr("fill", "blue")
        .attr("stroke-width", 4)


    var danger_line = d3.line()
        .defined(d => d.acres >= 25000000)
        .x((d, i) => pad + 10 + xScale.bandwidth() * i)
        .y(d => yScale(d.acres))

    var dange_area = d3.area()
        .defined(d => d.acres >= 15000000)
        .x((d, i) => pad + 10 + xScale.bandwidth() * i)
        .y0(() => yScale(15000000))
        .y1(d => yScale(d.acres))

    svg.append("path").datum(data)
        .attr("class", "danger_line").attr("d", dange_area)
        .attr("stroke", "lightcoral")
        .attr("fill", "red")
        .attr("stroke-width", 4)

    // Create a line for danger
    svg.append("line").attr("x1", pad)
        .attr("y1", yScale(15000000))
        .attr("x2", w - pad)
        .attr("y2", yScale(15000000))
        .attr("stroke", "red")
        .attr("stroke-width", 4)
        .style("stroke-dasharray", ("15, 15"));

    svg.append("text").attr("x", w - 5 * pad)
        .attr("y", yScale(15000000) - 10)
        .attr("font-size", 30)
        .text("Danger line").attr("fill", "lightcoral")
}