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

    var education2016 = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.ES_EDUA.L.TOT+MN+WMN+HGH+LW/all?&dimensionAtObservation=allDimensions"
    var lifeSatisf2016 = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.SW+SW_LIFS.L.TOT+MN+WMN+HGH+LW/all?&dimensionAtObservation=allDimensions"
    var selfReportHealth = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.HS_SFRH.L.TOT+MN+WMN+HGH+LW/all?&dimensionAtObservation=allDimensions"

    d3.queue()
        .defer(d3.request, education2016)
        .defer(d3.request, lifeSatisf2016)
        .defer(d3.request, selfReportHealth)
        .awaitAll(doFunction);

    function doFunction(error, response) {
        if (error) throw error;

        console.log(JSON.parse(response[0].responseText))
        // console.log(JSON.parse(response[1].responseText))
        // console.log(JSON.parse(response[2].responseText))

        var dataEdu = (JSON.parse(response[0].responseText)).dataSets[0].observations
        var dataLife = JSON.parse(response[1].responseText)
        var dataHealth = JSON.parse(response[2].responseText)

        // console.log(dataEdu["0:0:0:0"]);
        // console.log(dataLife.dataSets[0].observations["0:0:0:0"][0]);
        // console.log(dataHealth.dataSets[0].observations["0:0:0:0"][0]);


        for (let i = 0; i < 39; i++) {
            for (let j = 0; j < 3; j++) {
                // console.log(i + ":0:0:" + j + ":");
                var key = i + ":0:0:" + j;
                // console.log(key)
                // console.log(dataEdu[key][0])
            }
        }
    }
};

const margin = {top: 50, bottom: 50, right: 20, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

// Add the x Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add the y Axis
svg.append("g")
    .call(d3.axisLeft(y));
