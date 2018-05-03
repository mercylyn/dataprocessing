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
    const margin = {top: 50, bottom: 50, right: 50, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var originChart = 0;
    var paddingYLabel = 20;
    var paddingXLabel = 100;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    x.domain(d3.extent(data, function(d) { return d[0]; })).nice();
    y.domain(d3.extent(data, function(d) { return d[1]; })).nice();

    let maxHealth = d3.max(data, function(d) { return d[2];}),
        minHealth = d3.min(data, function(d) { return d[2];});

    const healthCat = {bucket1Min: 0, bucket1Max: 40, bucket2Max: 60, bucket3Max: 80, bucket4Max: 100}

    // for (let i = 0; i < dataLength; i++) {
    var healthCat1 = [], healthCat2 = [], healthCat3 = [], healthCat4 =[];

    for (let i = 0; i < dataLength; i++) {
        if (data[i][2] >= healthCat.bucket1Min && data[i][2] < healthCat.bucket1Max) {
            healthCat1.push(data[i][2])
        }
        else if (data[i][2] >= healthCat.bucket1Max && data[i][2] < healthCat.bucket2Max) {
            healthCat2.push(data[i][2])
        }
        else if (data[i][2] >= healthCat.bucket2Max && data[i][2] < healthCat.bucket3Max) {
            healthCat3.push(data[i][2])
        }
        else {
            healthCat4.push(data[i][2])
        }

    };

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

    // add dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })
        .style("fill", function(d) {
            if (healthCat1.includes(d[2])) {
                return "#ffffcc";
            }
            else if (healthCat2.includes(d[2])) {
                return "#a1dab4";
            }
            else if (healthCat2.includes(d[2])) {
                return "#41b6c4";
            }
            else {
                return "#225ea8";
            }
        });

    // var color = d3.scaleOrdinal()
    //     .domain(["0-40", "40-60", "60-80", "80-100"])
    //     .range([ "#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"]);

    var category = ["0-40", "40-60", "60-80", "80-100"];

    var legend = svg.selectAll(".legend")
        .data(category)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {
            if (d === "0-40") {
                return "#ffffcc";
            }
            else if (d === "40-60") {
                return "#a1dab4";
            }
            else if (d === "60-80") {
                return "#41b6c4";
            }
            else {
                return "#225ea8";
            }
        });

    legend.append("text")
        .attr("x", width + margin.right)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

        // X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .style("font-size", "17px")
        .text("Educational attainment (%)")

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", originChart - (margin.left - paddingYLabel))
        .attr("x", originChart - (height - paddingXLabel))
        .style("font-size", "17px")
        .text("Life satisfaction (Average score)");
}
