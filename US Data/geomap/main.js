d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "Fires_pruned.csv", function(d) {
        return {
            name: d.NWCG_REPORTING_UNIT_NAME,
            fireSizeClass: d.FIRE_SIZE_CLASS,
            state: d.STATE,
            latitude: +d.LATITUDE, // Convert string to number with the unary plus operator
            longitude: +d.LONGITUDE,
            year: +d.FIRE_YEAR,
            cause: d.STAT_CAUSE_DESCR
        }
    })
    .await(ready)

const w = 2000
const h = 1000
const p = 50

var svg = d3.select("#map").append("svg").attr("width", w).attr("height", h)

var projection = d3.geoMercator()
    .translate([w / 2, h / 2])
    .scale(200)

var path = d3.geoPath()
    .projection(projection);

var us_states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
    "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
    "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "PR", "VI"
]

var us_states_name = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "Puerto Rico",
    "Virgin Islands"
];

let map_states = new Map()

function ready(err, data, fires) {
    console.log(data)

    var states = topojson.feature(data, data.objects.states)
    console.log(states.features)

    for (let i = 0; i < 53; i++) {
        map_states[us_states[i]] = us_states_name[i]
    }

    svg.selectAll(".state")
        .data(states.features)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", path)

    var counties = topojson.feature(data, data.objects.counties).features
    console.log(counties)

    svg.selectAll(".county")
        .data(counties)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)

    console.log(fires)

    var fires_filter = fires.filter(d => d.fireSizeClass == 'G')

    svg.selectAll(".fire")
        .data(fires_filter)
        .enter()
        .append("circle")
        .attr("class", "fire")
        .attr("r", 1)
        .attr("cx", d => {
            var coord = projection([d.longitude, d.latitude])
            return coord[0]
        })
        .attr("cy", d => {
            var coord = projection([d.longitude, d.latitude])
            return coord[1]
        })
        .on("mouseover", function(d) {
            d3.select("#value").text("Location: " + d.name)
            d3.select("#value2").text("State: " + map_states[d.state])
            d3.select("#value3").text("Cause: " + d.cause)
            d3.select("#value4").text("Year: " + d.year)

            d3.select("#tooltip")
                .style("top", 200 + "px")
                .style("left", 700 + "px")
                .style("visibility", "visible")
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("visibility", "hidden")
        })

}