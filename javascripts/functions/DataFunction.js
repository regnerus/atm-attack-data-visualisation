function drawData(dataset, map, prop, fill) {
    console.log('got here!');
    // get any existing circles
    var data = map.selectAll("circle").data(dataset)

    var radius = d3.scale.sqrt()
        .range(range(4, 16))
        .domain([0, 1]);

    var fillOpacity = d3.scale.sqrt()
        .range([.25, .50])
        .domain([0, 10000]);
                   //colours can be specified as any CSS colour string
    function normalise (val, max, min) {
        return radius(Math.abs((val - min) / (max - min)));
    }

    data.enter()
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
        .style("fill", fill)
        .style("fill-opacity", 0)
        .transition()
        .delay(function(d, i) {
            return i / dataset.length * 200;
        })
        .duration(1000)
        .attr("r", function(d) {
            if (prop == "mway_dist") {
                return normalise(d.properties.mway_dist, 4846, 4);
            }
            else if(prop == "police_dis") {
                return normalise(d.properties.police_dis, 1707, 3);
            }
            else if(prop == "prob_attacked") {
                return normalise(d.properties.prob_attacked, 1, 0);
            }
            else if(prop == "unp_rate") {
                return normalise(d.properties.unp_rate, 23, 2);
            }
            else if(prop == "age") {
                return normalise(d.properties.age, 65, 25);
            }
            else if(prop == "income") {
                return normalise(d.properties.income, 72, 14);
            }
            else if(prop == "density") {
                return normalise(d.properties.density, 42, 0);
            }
            else if(prop == "com_dens") {
                return normalise(d.properties.com_dens, 84, 9);
            }
            else if(prop == "number") {
                return normalise(d.properties.number, 3, 0);
            }
        })
        .style("fill-opacity", .25)
        .attr("data-tooltip", function(d) {
            return d.properties.bank;
        });

    // remove circles for old earthquakes no longer in data
    data.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}
