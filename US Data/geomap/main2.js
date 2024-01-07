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
            fireSize: parseFloat(d.FIRE_SIZE)
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


let states_fires = new Map()

function ready(err, data, fires) {
    console.log(data)

    // var states = topojson.feature(data, data.objects.states).features // take all states
    var states = topojson.feature(data, data.objects.states)
        // console.log(states)
    console.log(states.features)

    for (let i = 0; i < us_states.length; i++) {
        states_fires[us_states[i]] = 0
    }

    for (let i = 0; i < fires.length; i++) {
        var ID = fires[i].state
        var fire_size = fires[i].fireSize
        states_fires[ID] += fire_size
    }

    var mn = 1000000000,
        mx = 0
    for (let i = 0; i < 53; i++) {
        var val = states_fires[us_states[i]]
        if (val > 0) {
            mn = Math.min(mn, val)
        }
        mx = Math.max(mx, val)
    }

    // set ID each state
    for (let i = 0; i < states.features.length; i++) {
        states.features[i].properties.ID = us_states[i]
        states.features[i].properties.name = us_states_name[i]
    }

    // Chorolepth
    for (let i = 0; i < fires.length; i++) {
        var ID = fires[i].state
        var val = states_fires[ID]
        for (let j = 0; j < states.features.length; j++) {
            var cur_ID = states.features[j].properties.ID
            if (ID == cur_ID) {
                states.features[j].properties.value = val
            }
        }
    }
    console.log(mn)
    console.log(mx)

    color.domain([mn, mx])

    svg.selectAll(".state")
        .data(states.features)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", path)
        .attr("fill", function(d) {
            var val = d.properties.value
            if (val >= 0) {
                // console.log("go")
                return color(val * 2)
            }
            // console.log("fail")
            return "steelblue"
        })
        .on("mouseover", function(d) {
            var val = d.properties.value
            d3.select("#value").text("State: " + d.properties.name)
            d3.select("#value2").text("Total fire size: " + val.toFixed(2) + " ha")

            d3.select("#tooltip")
                .style("top", 200 + "px")
                .style("left", 700 + "px")
                .style("visibility", "visible")
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("visibility", "hidden")
        })

}