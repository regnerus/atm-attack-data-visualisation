function drawFreguesia(dataset, map) {
    // get any existing circles
    var freguesia = map.selectAll("path").data(dataset)

    var radius = d3.scale.pow()
        .range([2, 12])
        .domain([0, 5]);

    // add new circles for new earthquakes

    freguesia.enter()
        .append("path")
        .attr("d", path.projection(xy))

        .style("fill", "black")
        .style("fill-opacity", 0)
        .style('stroke', 'white')
        .style('stroke-width', '1.5')
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 1000;
        })
        .duration(1000)
        .style("fill-opacity", .15);

    // freguesia.append("text")
    //     .attr("class", "freguesialabel")
    //     .attr("transform", function(d) {
    //         return "translate(" + path.centroid(d) + ")";
    //     })
    //     .style("fill", "black")
    //     .style("fill-opacity", 1)
    //     .style('stroke', 'white')
    //     .style('stroke-width', '1')
    //     .text(function(d) {
    //         return d.properties.freguesia;
    //     });

    // remove circles for old earthquakes no longer in data
    freguesia.exit()
        .transition()
        .style("fill-opacity", 0)
        .remove();
}
