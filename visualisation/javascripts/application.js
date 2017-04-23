var width               = window.innerWidth;
var height              = window.innerHeight;

var xy                  = d3.geo.mercator()
                            .scale(250000)
                            .translate([width/2, height/2])
                            .center([-9.14,38.74]);

var scale               = 1;
var prevScale           = 1;
var scaleFunc           = d3.scale.linear()
                            .range([1, .5])
                            .domain([1, 8]);

function range(min, max) {
    return [Math.round(min * scale), Math.round(max * scale)];
}

var path                = d3.geo.path();

var tooltip_atm = d3.select("body")
    .append("div")
        .attr("class", "tooltip tooltip--place")
        .style("opacity", 0);

var selected_prop = "";

var main, circlelegend, map, data;

function init() {

    var zoom                = d3.behavior.zoom()
                                .scaleExtent([1, 8])
                                .on("zoom", move);

        main                = d3.select('#map').append('svg')
                                .on("click", function(d) {
                                    tooltip_atm = d3.select(".tooltip--place").style("opacity", 0);
                                })
                                .call(zoom)
                                .append("g");

        circlelegend        = d3.select('#circlelegend').append('svg').attr("width", "100%");
                              circlelegend.append("g").attr("id", "circleattacks");
                              circlelegend.append("g").attr("id", "circledatapoint");

        map                 = {
                                'freguesia'     : main.append("g").attr("id", "freguesia"),
                                'atm'           : main.append("g").attr("id", "atm"),
                                'data'          : main.append("g").attr("id", "data"),
                                'attack'        : main.append("g").attr("id", "attack")
                            };

    var legend = new Legend('#legend', [
      {label: "Attack Probability", name: "prob_attacked", color: "#F5A623"},
      {label: "Moterway Distance", name: "mway_dist", color: "#F8E71C"},
      {label: "Police Distance", name: "police_dis", color: "#8B572A"},
      {label: "Offenders Density", name: "number", color: "#7ED321"},
      {label: "Unenployment Rate", name: "unp_rate", color: "#417505"},
      {label: "Median Age", name: "age", color: "#BD10E0"},
      {label: "Median Income", name: "income", color: "#9013FE"},
      {label: "Population Density", name: "density", color: "#4A90E2"},
      {label: "Commercial Density", name: "com_dens", color: "#50E3C2"},
      {label: "None", name: "none", color: "#FFFFFF"},
    ]);

    legend.draw();

    drawCircleLegend(d3.select('#circleattacks'), [0,1], "#D0021B", "Attack Frequency");

    draw();
}

window.onresize = function(event) {
    draw();
};

function draw() {
    prevScale = scale;
    for(var name in map) {
        main.select('#' + name).selectAll("*").remove();
    }

    // drawBarChart(data.earthquakes);

    // drawAttacks(data.attack, map.attack);

    drawAttacks(data.attack.filter(function(d) {
        return d.properties.freq_attack > 0.1;
    }), map.attack);

    // console.log(selected_prop.length);
    //
    // if (selected_prop.length > 1) {
    //     drawData(data.data, map.data);
    // }

    drawATMs(data.attack, map.atm);

    drawFreguesia(data.freguesia, map.freguesia);
}

queue()
    .defer(request, "./datasets/results.geojson")
    .defer(request, "./datasets/freguesia.geojson")
    .await(function(error, atm, freguesia) {
        data = {
            'atm': atm,
            'data': atm,
            'attack': atm,
            'freguesia': freguesia
        }

        init(data);
    });

function request(url, callback) {
    d3.json(url, function(err, data) {
        if(!err) {
            callback(null, data.features);
        }
        else {
            callback(err);
        }
    });
}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
        draw();
    }, 100);
}

function move() {
    tooltip_atm = d3.select(".tooltip--place").style("opacity", 0);

    main.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    scale = scaleFunc(d3.event.scale);

    if(prevScale !== scale) {
        console.log(scale);
        throttle();
    }
}

function drawCircleLegend(legend, domain, color, title) {
    color = color || "#D0021B";
    domain = domain || [0.0, 1.0];

    var scale = d3.scale.linear()
        .range([0, 55])
        .domain(domain)


    // 1
    var circleKey = circleLegend()
       .scale(scale)
       .color(color)
       // Return falsey value from tickFormat to remove it
       .ticks(4)

    legend.selectAll("*").remove();

    legend.append('g').call(circleKey);
    legend.append('text').attr('dy', '20px').attr('text-anchor', 'middle').text(title);


}
