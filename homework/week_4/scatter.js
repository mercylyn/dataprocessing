/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 04-05-2018
 *
 * https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
 * https://bl.ocks.org/shimizu/914c769f05f1b2e1d09428c7eedd7f8a
 */

 // adding information: myself, the bar chart and data source
d3.select("head")
 .append("title")
 .text("Better Life Index")

d3.select("body")
  .append("h1")
  .text("Better Life Index: education attainment, life satisfaction and self-reported health")

d3.select("body")
 .append("h2")
 .text("Mercylyn Wiemer (10749306)");

d3.select("body")
 .append("p")
 .text("The scatterplot.");

d3.select("body")
 .append("a")
 .attr("href", "http://stats.oecd.org/viewhtml.aspx?datasetcode=BLI2016&lang=en#")
 .html("Source of data: OECD")

window.onload = function() {
    loadData()
};

function loadData() {
    var education2016 = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.ES_EDUA.L.TOT/all?&dimensionAtObservation=allDimensions"
    var lifeSatisf2016 = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.SW+SW_LIFS.L.TOT/all?&dimensionAtObservation=allDimensions"
    var selfReportHealth = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions"
    // var data = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.ES_EDUA+HS_SFRH+SW_LIFS.L.TOT+MN+WMN+HGH+LW/all?&dimensionAtObservation=allDimensions"
    d3.queue()
        .defer(d3.request, education2016)
        .defer(d3.request, lifeSatisf2016)
        .defer(d3.request, selfReportHealth)
        // .defer(d3.request, data)
        .awaitAll(getData);

    function getData(error, response) {
        if (error) throw error;

        var dataEdu = (JSON.parse(response[0].responseText)).dataSets[0].observations,
            dataLife = (JSON.parse(response[1].responseText)).dataSets[0].observations,
            dataHealth = (JSON.parse(response[2].responseText)).dataSets[0].observations
            dataLength = Object.keys(dataEdu).length;

        var data = convertData(dataEdu, dataLife, dataHealth, dataLength);
        console.log(dataLength)
        console.log(data)

        console.log(JSON.parse(response[0].responseText))

        makePlot(data);
    }
}

function convertData(dataset1, dataset2, dataset3, dataLength) {
    var data = [];

    for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < 1; j++) {
            var key = i + ":0:0:" + j;
            data.push([dataset1[key][0], dataset2[key][0], dataset3[key][0]]);
        }
    }

    return data;
}

function makePlot(data) {
    const margin = {top: 20, bottom: 40, right: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(d3.extent(data, function(d) { return d[0]; })).nice();
    y.domain(d3.extent(data, function(d) { return d[1]; })).nice();


    let svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })
        // .style("fill", function(d) { return color(d.); });
}
