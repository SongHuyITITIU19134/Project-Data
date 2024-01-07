d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json"
  )
  .defer(d3.csv, "vnData.csv", function (d) {
   
    return {
      province: d["Province"],
      treeLost: parseInt(d["Tree Lost"]),
      co2: parseInt(d["Co2"]),
    };
  })
  .await(draw);
const w = 2000;
const h = 2000;
const p = 50;

var svg = d3.select("#map").append("svg").attr("width", w).attr("height", h);

var projection = d3
  .geoMercator()
  .translate([w / 3000000000, h / 6])
  .scale(800);

var path = d3.geoPath().projection(projection);

var color = d3
  .scaleQuantize()
  .range([
    "rgb(199,233,192)",
    "rgb(161,217,155)",
    "rgb(116,196,118)",
    "rgb(65,171,93)",
    "rgb(35,139,69)",
    "rgb(0,109,44)",
    "rgb(0,90,50)",
  ]);

function draw(err, datamap, dataset) {

  console.log(datamap);


  var treeLostDataByProvince = {};
  dataset.forEach(function (d) {
    treeLostDataByProvince[d.province] = d.treeLost;
  });

  datamap.features.forEach(function (feature) {
    var name = feature.properties.Name;
    feature.properties.treeLost = treeLostDataByProvince[name] || 0;
  });

  color.domain([
    d3.min(dataset, function (d) {
      return d.treeLost;
    }),
    d3.max(dataset, function (d) {
      return d.treeLost;
    }),
  ]);

  console.log(datamap.features);

  svg
    .selectAll(".province")
    .data(datamap.features)
    .enter()
    .append("path")
    .attr("class", "province")
    .attr("d", path)
    .attr("fill", function (d) {
      //Get data value
      var name = d.properties.Name;
      var value = d.properties.treeLost;
      console.log(value);
      if (value >= 0) return color(value * 5);
      else return "steelblue";
    })
    .on("mouseover", function (d) {
      d3.select("#value").text(d.properties.Name);
      d3.select("#value2").text("Case  treeLost: " + d.properties.treeLost);

      d3.select("#tooltip")
        .transition()
        .style("visibility", "visible")
        .style("left", 1300 + "px");
    })
    .on("mouseout", function (d) {
      d3.select("#tooltip").transition().style("visibility", "hidden");
    });
}
