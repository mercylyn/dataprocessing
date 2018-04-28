/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 28-04-2018
 *
 * Household waste per citizen in Amsterdam 2001-2016.
 * This program creates a bar chart of the total household waste per citizen
 * in Amsterdam from the years 2001-2016.
 * The graph is included in my web page on github.
 *
 * Source of the data: Source: https://opendata.cbs.nl/statline/#/CBS/nl/
 *                             dataset/83452NED/table?dl=B2B1
 * Sources used for bar chart:
 * https://bost.ocks.org/mike/bar/3/,
 * http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html
 * https://github.com/Caged/d3-tip, http://bl.ocks.org/Caged/6476579
 */

// adding information: myself, the bar chart and data source
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
    .attr("href", "https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83452NED/table?dl=B2B1")
    .html("Source of data: CBS");

const margin = {top: 50, bottom: 50, right: 20, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    positionTip = 10,
    originChart = 0;

// create scale functions: X and Y axis
let xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1),

    yScale = d3.scale.linear()
    .range([height, 0]);

// define X axis
let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom"),

    // define Y axis
    yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

// loading data into D3
d3.json("waste_amsterdam.json", function(error, data) {
    if (error) {
        return console.log("Error: json file not found.");
    }

    let dataset = data.data,
        max = d3.max(dataset, function(d) {
        return d.quantity;
    })
        min = d3.min(dataset, function(d) {
        return d.quantity;
    });

    // initialize tooltip
    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-positionTip, 0])
        .html(function(d) {
            return "<strong>Total:</strong> <span style='color:orange'>"
            + d.quantity + "</span>";
        });

    // create SVG element
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    // set domain X axis and Y axis
    xScale.domain(dataset.map(function(d) { return d.year; }));
    yScale.domain([originChart, max]);

    // create rectangles: bar chart
    svg.selectAll(".bar")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", function(d) {
            return xScale(d.year); })
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

    // Title of bar chart
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", originChart - margin.top / 2)
        .style("font-size", "20px")
        .text("Household waste per citizen in Amsterdam");

    // X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .style("font-size", "17px")
        .text("Year")

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", originChart - (margin.left / 2))
        .attr("x", originChart - (height / 2))
        .style("font-size", "17px")
        .text("Waste per citizen (kg)");
 });
