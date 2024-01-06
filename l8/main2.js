d3.queue().defer(d3.json, "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json")
    .defer(d3.csv, "vn-provinces-data.csv", function(d) {
        return {
            ma: +d['ma'],
            name: d['province'],
            population: parseFloat(d['population']),
            gdp: parseFloat(d['GRDP-USD'])
        }
    })
    .await(draw)

const w = 2000
const h = 2000
const p = 50

var svg = d3.select("#map").append("svg").attr("width", w).attr("height", h)

var projection = d3.geoMercator().translate([w / 30000000, h / 6]).scale(800)

var path = d3.geoPath().projection(projection)

var color = d3.scaleQuantize()
    .range([
        "rgb(254,229,217)",
        "rgb(252,187,161)",
        "rgb(252,146,114)",
        "rgb(251,106,74)",
        "rgb(239,59,44)",
        "rgb(203,24,29)",
        "rgb(165,15,21)"
    ]);



function draw(err, datamap, dataset) {

    console.log(datamap.features)
        // console.log(dataset)

    // synchronous to map
    for (let i = 0; i < dataset.length; i++) {
        var ma = dataset[i].ma
        var name = dataset[i].name
        var pop = dataset[i].population
        for (let j = 0; j < datamap.features.length; j++) {
            var ma2 = datamap.features[j].properties.Ma
            if (ma == ma2) {
                // console.log("matched")
                datamap.features[j].properties.value = pop
                break
            }
        }
    }

    color.domain([d3.min(dataset, d => d.population), d3.max(dataset, d => d.population)])

    svg.selectAll(".population").data(datamap.features)
        .enter().append("path")
        .attr("class", "population")
        .attr("d", path)
        .attr("fill", (d) => {
            var pop = d.properties.value
            if (pop >= 0) return color(pop * 1.5)
            return "steelblue"
        })
        .on("mouseover", function(d) {
            d3.select("#value").text(d.properties.Name)
            d3.select("#value2").text(`${d.properties.value * 1000} people`)

            d3.select("#tooltip")
                .style("left", 1300 + "px")
                .style("visibility", "visible")
        })
        .on("mouseout", function(d) {
            d3.select("#tooltip").style("visibility", "hidden")
        })



}