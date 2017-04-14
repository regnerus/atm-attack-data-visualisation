function drawAttacks(dataset, map) {

    // get any existing circles
    var attacks = map.selectAll("circle").data(dataset)

    var radius = d3.scale.linear()
        .range(range(4, 16))
        .domain([1, 5]);

    var fillOpacity = d3.scale.linear()
        .range([.25, .50])
        .domain([0, 10000]);

    var colourInterpolator = d3.interpolateHsl("red", "blue");
                   //colours can be specified as any CSS colour string

    attacks.enter()
        .append("circle")
        .attr("cx", function(d) {
            return xy(d.geometry.coordinates)[0]
        })
        .attr("cy", function(d) {
            return xy(d.geometry.coordinates)[1]
        })
        .attr("r", function(d) {
            return 0;
        })
        // .on("mouseover", function(d) {
        //     tooltip_earthquake = d3.select(".tooltip--earthquake").style("opacity", 0);
        //
        //     tooltip_place.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        //     tooltip_place.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        //     tooltip_place.html(d.properties.name)
        //         .style("left", (d3.event.pageX) + "px")
        //         .style("top", (d3.event.pageY - 28) + "px");
        //     })
        .style("fill", "#D0021B")
        .style("fill-opacity", 0)
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 200;
        })
        .duration(1000)
        .attr("r", function(d) {
            return radius(Math.abs(d.properties.freq_attack));
        })
        .style("fill-opacity", .5)
        .attr("data-tooltip", function(d) {
            return d.properties.bank;
        });

    // remove circles for old earthquakes no longer in data
    attacks.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}
