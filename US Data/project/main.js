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

    var dataset = data.slice(0, 50)

    var svg = d3.select("body").append("svg").attr("width", w).attr("height", h)

    var xScale = d3.scaleBand().domain(dataset.map(d => d.year)).range([0, w - pad])
    var x_axis = d3.axisBottom(xScale)
    svg.append("g").attr("class", "x axis").call(x_axis).attr("transform", "translate(" + pad + "," + (h - pad) + ")")

    var yScale = d3.scaleLinear().domain([0, 250000]).range([h - pad, 0])
    var y_axis = d3.axisLeft(yScale)
    svg.append("g").attr("class", "y axis").call(y_axis).attr("transform", "translate(" + pad + ",0)")

    // create a bar
    var bars = svg.selectAll("svg").data(dataset).enter()

    bars.append("rect").attr("width", xScale.bandwidth() - 3)
        .attr("height", d => h - yScale(d.wildfires))
        .attr("x", (d, i) => pad + i * xScale.bandwidth())
        .attr("y", d => yScale(d.wildfires) - pad)
        .attr("fill", d => "rgb(0,0," + yScale(d.wildfires) + ")")
        .on("mouseover", function(d) {
            var x = d3.event.pageX
            var y = d3.event.pageY

            d3.select("#value").text("No of wildfires: " + d.wildfires)
            d3.select("#value2").text("Acres burned: " + d.acres + " ha")
            d3.select("#value3").text("Year: " + d.year)

            d3.select("#tool")
                .style("left", x + "px")
                .style("top", y + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function() {
            d3.select("#tool").classed("hidden", true)
        })


    d3.select("#add").on("click", function() {
        dataset.push(data[dataset.length])
        update()
    })

    d3.select("#remove").on("click", function() {
        dataset.pop()
        update()
    })

    d3.select("#sort").on("click", function() {
        sortBar()
    })

    function update() {
        xScale.domain(dataset.map(d => d.year))
        yScale.domain([0, 250000])

        svg.select(".x.axis").transition().duration(50).call(x_axis);
        svg.select(".y.axis").transition().duration(50).call(y_axis);


        var new_bar = svg.selectAll("rect").data(dataset)

        new_bar.enter().append("rect")
            .merge(new_bar).transition().duration(50)
            .attr("width", xScale.bandwidth() - 3)
            .attr("height", d => h - yScale(d.wildfires))
            .attr("x", (d, i) => pad + i * xScale.bandwidth())
            .attr("y", d => yScale(d.wildfires) - pad)
            .attr("fill", d => "rgb(0,0," + yScale(d.wildfires) + ")")

        new_bar.on("mouseover", function(d) {
                var x = d3.event.pageX
                var y = d3.event.pageY

                d3.select("#value").text("No of wildfires: " + d.wildfires)
                d3.select("#value2").text("Acres burned: " + d.acres + " ha")
                d3.select("#value3").text("Year: " + d.year)

                d3.select("#tool")
                    .style("left", x + "px")
                    .style("top", y + "px")
                    .classed("hidden", false)
            })
            .on("mouseout", function() {
                d3.select("#tool").classed("hidden", true)
            })

        new_bar.exit().transition().duration(50).attr("x", -xScale.bandwidth()).remove()

    }

    function sortBar() {
        dataset.sort((a, b) => a.wildfires - b.wildfires)

        xScale.domain(dataset.map(d => d.year))

        var sort_bar = svg.selectAll("rect").data(dataset, d => d.year)

        sort_bar.transition().duration(50).attr("x", (d, i) => pad + i * xScale.bandwidth())

        svg.select(".x.axis").transition().duration(50).call(x_axis);
    }
}