/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 06-05-2018
 *
 * Better Life Index: Education, Health & Life Satisfaciton, Scatter plot of
 * 2015/2016.
 *
 * https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
 * https://bl.ocks.org/shimizu/914c769f05f1b2e1d09428c7eedd7f8a
 * http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
 * https://bl.ocks.org/sebg/6f7f1dd55e0c52ce5ee0dac2b2769f4b
 * https://bl.ocks.org/ProQuestionAsker/9a909417edf206f2d3ff38cd41a30524/c7c24def8aea8d2e3f50453ee1d963e8f6ffc09b
 * http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
 */

/* Run code when files are loaded. */
window.onload = function() {
    loadData()
};

var data2015, data2016,
    countryList = [];

// Collecting data through API
function loadData() {
    const education2016 = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS.ES_EDUA.L.TOT/all?&dimensionAtObservation=allDimensions"
    const lifeSatisf2016 = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS.SW+SW_LIFS.L.TOT/all?&dimensionAtObservation=allDimensions"
    const reportHealth2016 = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS.HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions"

    const education2015 = "https://stats.oecd.org/SDMX-JSON/data/BLI2015/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS.ES_EDUA.L.TOT/all?&dimensionAtObservation=allDimensions"
    const lifeSatisf2015 = "https://stats.oecd.org/SDMX-JSON/data/BLI2015/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS.SW_LIFS.L.TOT/all?&dimensionAtObservation=allDimensions"
    const reportHealth2015 = "https://stats.oecd.org/SDMX-JSON/data/BLI2015/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS.HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions"

    // requests queries: when fulfilled, continue
    d3.queue()
        .defer(d3.request, education2016)
        .defer(d3.request, lifeSatisf2016)
        .defer(d3.request, reportHealth2016)
        .defer(d3.request, education2015)
        .defer(d3.request, lifeSatisf2015)
        .defer(d3.request, reportHealth2015)
        .awaitAll(parseData);

    // convert data to JSON
    function parseData(error, response) {
        if (error) throw error;

        let dataEdu16 = getData(convertToJSON(response[0].responseText)),
            dataLife16 = getData(convertToJSON(response[1].responseText)),
            dataHealth16 = getData(convertToJSON(response[2].responseText)),
            dataCountry = convertToJSON(response[0].responseText).structure.dimensions.observation[0].values,

            dataEdu15 = getData(convertToJSON(response[3].responseText)),
            dataLife15 = getData(convertToJSON(response[4].responseText)),
            dataHealth15 = getData(convertToJSON(response[5].responseText)),

            dataLength = Object.keys(dataEdu16).length;

        // List of countries: data
        getCountry(dataCountry);

        // Join dataset together
        data2016 = convertData(dataEdu16, dataLife16, dataHealth16, countryList, dataLength),
        data2015 = convertData(dataEdu15, dataLife15, dataHealth15, countryList, dataLength);

        // Initialize scatter plot 2016
        loadPlot(data2016);
    }
}

/* Convert data to JSON format. */
function convertToJSON(data) {
    return JSON.parse(data)
}

/* Get data from JSON object. */
function getData(data) {
    return data.dataSets[0].observations
}

/* Return list of countries belonging to data 2016/2015. */
function getCountry(data) {

    // Get country from dataset
    for (let i = 0; i < data.length; i++) {
        countryList.push(data[i].name);
    }
}

/* Converts data from JSON to an array containing three variables. */
function convertData(dataset1, dataset2, dataset3, dataset4, dataLength) {
    let data = [];

    // Add data variables to array
    for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < 1; j++) {
            var key = i + ":0:0:" + j;
            data.push([dataset1[key][0], dataset2[key][0], dataset3[key][0], dataset4[i]]);
        }
    }

    return data;
}

/* Creates canvas to draw on: scatter plot with x and y axis. */
function loadPlot(data) {

    // Set dimensions of canvas
    const margin = {top: 100, bottom: 50, right: 50, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const originChart = 0,
        paddingYLabel = 20;

    // Set the ranges
    let x = d3.scaleLinear()
        .range([0, width]),

        y = d3.scaleLinear()
        .range([height, 0]);

    // Define X axis
    let xAxis = d3.axisBottom(x),

    // Define Y axis
        yAxis = d3.axisLeft(y);

    // Scale the domain of the data
    x.domain(d3.extent(data, function(d) { return d[0]; })).nice();
    y.domain(d3.extent(data, function(d) { return d[1]; })).nice();

    // Create categories (4) for third variable: self-reported health
    const healthCat = {bucket1Min: 0, bucket1Max: 40, bucket2Max: 60, bucket3Max: 80, bucket4Max: 100}

    var healthCat1 = [], healthCat2 = [], healthCat3 = [], healthCat4 =[];

    categorizeHealth(data);

    /* Categorizes the third variable: self-reported Health into 4 categories
       (percentage: 0-40%, 40-60%, 60-80%, 80-100%). */
    function categorizeHealth(data){

        // Categorize data into percentage category
        for (let i = 0; i < data.length; i++) {
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
    };

    // Create SVG element
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Setup the tool tip.
    let tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) { return "Country: " + d[3]; });

    svg.call(tool_tip);

    // Create dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)
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

    // Add the X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    addLegend(data)

    /* Adds a legend to the svg canvas. */
    function addLegend(dataset) {
        var category = ["0-40", "40-60", "60-80", "80-100"];

        let legend = svg.selectAll(".legend")
            .data(category)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // Create legend color blocks: colors indicate third variable (self reported Health)
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

        // Create legend
        legend.append("text")
            .attr("x", width + margin.right)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
    };

    // Legend title
    svg.append("text")
        .attr("class","title")
        .attr("x", 730)
        .attr("y", originChart - margin.top / 4)
        .style("font-size", "12px")
        .text("Color: Self-reported Health");

    // Legend explanation
    svg.append("text")
        .attr("class","title")
        .attr("x", 730)
        .attr("y", originChart - paddingYLabel / 2)
        .style("font-size", "12px")
        .text("(% reported good)");


    let menu = d3.select("#dropdown");
    let year = ["2016", "2015"];

    // Create dropdown menu
    menu
    .append("select")
    .selectAll("option")
        .data(year)
        .enter()
        .append("option")
        .attr("value", function(d){
            return d;
        })
        .text(function(d){
            return d;
        })

    updateData(data)

    /* Updates the data when users switches to another year in dropdown menu. */
    function updateData(data) {
        d3.select("#dropdown")
            .on("change", function() {
                // get data depending on user input
                if (data == data2016) {
                    data = data2015
                } else {
                    data = data2016
                }

                let correctScale = 0.2;

                // Update scale domains
                x.domain(d3.extent(data, function(d) { return d[0]; })).nice();
                y.domain([d3.min(data, function(d) { return d[1]; }) - correctScale, d3.max(data, function(d) { return d[1]; })]).nice();

                // Update circles
                svg.selectAll("circle")
                    .data(data)
                    .transition()
                    .duration(1000)
                    .attr("cx", function(d) {
                        return x(d[0]);
                    })
                    .attr("cy", function(d) {
                        return y(d[1]);
                    })
                    // fill circles with different colors: third variable; health category
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

                // Update X Axis
                svg.select(".x.axis")
                    .transition()
                    .duration(1000)
                    .call(xAxis);

                // Update Y Axis
                svg.select(".y.axis")
                    .transition()
                    .duration(1000)
                    .call(yAxis);
                });
    }

    // X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - (paddingYLabel / 2))
        .style("font-size", "17px")
        .attr("text-anchor", "middle")
        .text("Educational attainment (%)");

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", originChart - (margin.left - paddingYLabel))
        .attr("x", originChart - (height - margin.bottom * 2))
        .style("font-size", "17px")
        .text("Life satisfaction (Average score)");

    // Scatter plot title
    svg.append("text")
        .attr("class","title")
        .attr("x", (width / 2))
        .attr("y", originChart - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Better Life Index: Education, Health & Life Satisfaction");
};
