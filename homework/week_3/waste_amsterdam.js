/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 28-04-2018
 *
 * Household waste per citizen in Amsterdam 2001-2016.
 * This program creates a bar graph of the total household waste per citizen
 * in Amsterdam from the years 2001-2016.
 * The graph is included in a web page on github.
 *
 * Source of the data: Source: https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83452NED/table?ts=1524649884497
 *
 */

    d3.select("head")
         .append("title")
         .text("Household waste in Amsterdam")

    d3.select("body")
         .append("h1")
         .text("Household waste in Amsterdam")

    d3.select("body")
         .append("h2")
         .text("Mercylyn Wiemer (10749306)");

    d3.select("body")
         .append("p")
         .text("The barchart shows the household waste per year in kg per citizen \
                in Amsterdam of the years 2001-2016.");

    d3.select("body")
        .append("a")
        .attr("href", "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83452NED/table?ts=1524649884497")
        .html("Source of data: CBS");

    var margin = {top: 50, bottom: 50, right: 20, left: 100},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        barPadding = 10,
        padding = 30;

    d3.json("waste_amsterdam.json", function(error, data) {
        if (error) {
            return console.log("Error: json file not found.");
        }

        var dataset = data.data;
        var max = d3.max(dataset, function(d) {    //Returns 480
            return d.quantity;  //References first value in each sub-array
        });
        var min = d3.min(dataset, function(d) {    //Returns 480
            return d.quantity;  //References first value in each sub-array
        });

        // create scale functions
        var xScale = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var yScale = d3.scale.linear()
            .range([height, 0]);

        // define X axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")

        // define Y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            // .tickValues()

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Total:</strong> <span style='color:orange'>"
                    + d.quantity + "</span>";
          });

        // create SVG element
        var svg = d3.select("body")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        xScale.domain(dataset.map(function(d) { return d.year; }));
        yScale.domain([0, max]);

        // create rectangles
        svg.selectAll(".bar")
           .data(dataset)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("x", function(d) { return xScale(d.year); })
            .attr("y", function(d) {
                return yScale(d.quantity); })
           .attr("width", xScale.rangeBand())
           .attr("height", function(d) { return height - yScale(d.quantity); })
            .attr("fill", "teal")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

           // create X axis
           svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis)

            // create Y axis
            svg.append("g")
             .attr("class", "y axis")
             .call(yAxis)

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom)
                .style("text-anchor", "middle")
                .style("font-size", "17px")
                .text("Year")

            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 0 - margin.top / 2)
                .style("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Household waste per citizen in Amsterdam");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 -(margin.left / 2))
                .attr("x", 0 - (height / 2))
                .style("text-anchor", "middle")
                .style("font-size", "17px")
                .text("Waste per citizen (kg)");
     });
