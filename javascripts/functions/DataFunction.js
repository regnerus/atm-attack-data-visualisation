function drawData(dataset, map, prop, fill) {
    console.log('got here!');
    // get any existing circles
    var data = map.selectAll("circle").data(dataset)
    var domain = [0, 1];

    var radius = d3.scale.linear()
        .range(range(4, 16))
        .domain(domain);

    var fillOpacity = d3.scale.linear()
        .range([.25, .50])
        .domain([0, 10000]);
                   //colours can be specified as any CSS colour string
    // function normalise (val, max, min) {
    //     return radius(Math.abs((val - min) / (max - min)));
    // }

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
            var property;

            if (prop == "mway_dist") {
                domain = [4, 4846];
                property = d.properties.mway_dist;
            }
            else if(prop == "police_dis") {
                domain = [3, 1707];
                property = d.properties.police_dis;
            }
            else if(prop == "prob_attacked") {
                domain = [0, 1];
                property = d.properties.prob_attacked;
            }
            else if(prop == "unp_rate") {
                domain = [2, 23];
                property = d.properties.unp_rate;
            }
            else if(prop == "age") {
                domain = [25, 65];
                property = d.properties.age;
            }
            else if(prop == "income") {
                domain = [14, 72];
                property = d.properties.income;
            }
            else if(prop == "density") {
                domain = [0, 42];
                property = d.properties.density;
            }
            else if(prop == "com_dens") {
                domain = [9, 84];
                property = d.properties.com_dens;
            }
            else if(prop == "number") {
                domain = [0, 3];
                property = d.properties.number;
            }

            radius = d3.scale.linear()
                .range(range(4, 16))
                .domain(domain);

            drawCircleLegend(d3.select('#circledatapoint'), domain, fill);

            return radius(property);
        })
        .style("fill-opacity", .25)
        .attr("data-tooltip", function(d) {
            return d.properties.bank;
        });


    data.exit()
        .transition()
        .attr("r", 0)
        .style("fill-opacity", 0)
        .remove();
}
