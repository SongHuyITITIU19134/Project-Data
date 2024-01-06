d3.queue().defer(d3.json, "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json")
    .defer(d3.csv, "covid19-provinces_vn_en_v2.csv", function(d) {
        // console.log(d)
        return {
            province: d['Province'],
            infected: parseInt(d['Total infected cases'])
        }
    })
    .await(draw)
    // 106.62545776400003,21.011486053000056
    // 107.34315490700004,17.149677277000023
    //10.7756,106.7019

const w = 2000
const h = 2000
const p = 50

var svg = d3.select("#map").append("svg")
    .attr("width", w).attr("height", h)

var projection = d3.geoMercator().translate([w / 3000000000, h / 6])
    .scale(800)

var path = d3.geoPath().projection(projection)


var color = d3.scaleQuantize()
    .range([
        "rgb(199,233,192)",
        "rgb(161,217,155)",
        "rgb(116,196,118)",
        "rgb(65,171,93)",
        "rgb(35,139,69)",
        "rgb(0,109,44)",
        "rgb(0,90,50)"
    ]);

function draw(err, datamap, dataset) {
    // if (err) throw err
    console.log(datamap)

    // console.log(dataset)

    var infectionDataByProvince = {};
    dataset.forEach(function(d) {
        infectionDataByProvince[d.province] = d.infected
    });

    // Assign infection data to GeoJSON
    datamap.features.forEach(function(feature) {
        var name = feature.properties.Name;
        feature.properties.infected = infectionDataByProvince[name] || 0;
    });



    color.domain([
        d3.min(dataset, function(d) { return d.infected; }),
        d3.max(dataset, function(d) { return d.infected; })
    ]);

    // console.log(datamap.features)

    svg.selectAll(".province").data(datamap.features)
        .enter().append("path")
        .attr("class", "province")
        .attr("d", path)
        .attr("fill", function(d) {
            //Get data value
            var name = d.properties.Name
            var value = d.properties.infected
            if (value >= 0) return color(value * 5)
            else return "steelblue"
        })
        .on("mouseover", function(d) {

            d3.select("#value").text(d.properties.Name)
            d3.select("#value2").text("Case infected: " + d.properties.infected)


            d3.select("#tooltip").transition()
                .style("visibility", "visible")
                .style("left", 1300 + "px")
        })
        .on("mouseout", function(d) {
            d3.select("#tooltip").transition()
                .style("visibility", "hidden")
        })

}