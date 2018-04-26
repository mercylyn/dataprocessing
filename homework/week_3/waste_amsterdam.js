/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 28-04-2018
 *
 * Maximum temperature in De Bilt (NL) 1981.
 * This program creates a line graph of the temperature at De Bilt weather
 * station. The graph is included in a web page on github.
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
                in Amsterdam of the years 2001 to 2016.");

    d3.select("body")
        .append("p")
        .text("Source: https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83452NED/table?ts=1524649884497");

    var width = 600, height = 300;
    var barPadding = 10;

    // create SVG element
    var svg = d3.select("body")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

    // var rect = svg.append("rect")
    //                 .attr("x", 10)
    //                 .attr("y", 10)
    //                 .attr("width", 50)
    //                 .attr("height", 100);
    //
    // var circle = svg.append("circle")
    //                 .attr("cx", 100)
    //                 .attr("cy", 20)
    //                 .attr("r", 20);
    //
    //
    // var text = svg.append("text")
    //                     .attr("x", 200)
    //                     .attr("y", 40)
    //                     .text("hoi")
    //                     .attr("font-family", "sans-serif")
    //                     .attr("font-size", "20px")
    //                     .attr("fill", "red");

     d3.json("waste_amsterdam.json", function(error, data) {
        if (error) {

            return console.log("Error");
        }

        var dataset = data.data;
        var padding = 100;
        var max = d3.max(dataset, function(d) {    //Returns 480
            return d.quantity;  //References first value in each sub-array
        });
        var min = d3.min(dataset, function(d) {    //Returns 480
            return d.quantity;  //References first value in each sub-array
        });

        // create scale functions
        var xScale = d3.scale.ordinal()
            .domain([0, max])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([min, max])
            .range([padding, height - barPadding]);

        // define x axis
        var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(5);

        // define y axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

        // create rectangles
        svg.selectAll("rect")
           .data(dataset)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {
               return i * (width / dataset.length);  //Bar width of 20 plus 1 for padding
            })
            .attr("y", function(d) {
                return height - yScale(d.quantity);  //Height minus data value
            })
           .attr("width", width / dataset.length - barPadding)
           .attr("height", function(d) {
               return yScale(d.quantity);
            })
            .attr("fill", "teal");

        // create labels
        svg.selectAll("text")
           .data(dataset)
           .enter()
           .append("text")
           .text(function(d) {
               return d.quantity;
           })
           .attr("x", function(d, i) {
                return i * (width / dataset.length);
           })
           .attr("y", function(d) {
                return height - (yScale(d.quantity));
           })
           .attr("font-family", "sans-serif")
           .attr("font-size", "11px")
           .attr("fill", "black");

           // create x axis
           svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
     });
