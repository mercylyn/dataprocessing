/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: Data Processing
 * Date: 18-05-2018
 *
 * Linked-views: Better Life Index (Life expectancy, water quality and self-reported health)
 * Datasets containt the life expectancy, air poluttion, life expectancy and self-reported health
 * are obtained from the OECD.
 * The life expectancy and air pollution per country can be observed in a datamaps
 * from Europe.
 * When selecting a country from the datamap: the water quality and self-reported
 * are visualized in a barchart.
 */

// global variables for datamap
let dataLifeExpect, dataAirPollution;

// Run code when files are loaded.
window.onload = function() {

    // Collecting data through API
    const lifeExpectancy = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS.HS_LEB.L.TOT/all?&dimensionAtObservation=allDimensions"
    const waterQuality = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS.EQ_WATER.L.TOT/all?&dimensionAtObservation=allDimensions"
    const selfHealth = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS.HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions"
    const airPol = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS+.EQ_AIRP.L.TOT/all?&dimensionAtObservation=allDimensions"

    // Requests queries: when fulfilled, continue
    d3.queue()
        .defer(d3.request, lifeExpectancy)
        .defer(d3.request, waterQuality)
        .defer(d3.request, selfHealth)
        .defer(d3.request, airPol)
        .awaitAll(parseData);

    // Convert data to JSON
    function parseData(error, response) {
        if (error) throw error;

        let dataLife = JSON.parse(response[0].responseText).dataSets[0].observations,
            dataWater = JSON.parse(response[1].responseText).dataSets[0].observations,
            dataHealth = JSON.parse(response[2].responseText).dataSets[0].observations,
            dataAir = JSON.parse(response[3].responseText).dataSets[0].observations,
            dataCountry = JSON.parse(response[0].responseText).structure.dimensions.observation[0].values;

        // List of countries: data
        let countryList = getCountry(dataCountry);

        // Get data from JSON object and format to list
        let listData = getData(dataLife, dataWater, dataHealth, dataAir);

        // Categorize data life expectancy for datamap
        let categoryLife = categorizeLife(listData);

        // Categorize data air pollution for datamap
        let categoryPol = categorizePollution(listData);

        // Join dataset together in dictionary: life expectancy / air pollution
        dataLifeExpect = convertToDictionary(listData, categoryLife, countryList);
        dataAirPollution = convertToDictionary(listData, categoryPol, countryList);

        createLinkedView(dataLifeExpect);
    };
};

/* Return list of countries (ISO) */
function getCountry(data) {
    countryList = [];

    // Get country iso from dataset
    for (let i = 0; i < data.length; i++) {
        countryList.push(data[i].id);
    };

    return countryList;
};

/* Converts data from JSON to an array containing four variables. */
function getData(dataset1, dataset2, dataset3, dataset4) {
    let data = [];

    // Add data variables to array
    for (let i = 0; i < Object.keys(dataset1).length; i++) {
        for (let j = 0; j < 1; j++) {
            let key = i + ":0:0:" + j;
            data.push([dataset1[key][0], dataset2[key][0], dataset3[key][0], dataset4[key][0]]);
        };
    };

    return data;
};

/* Categorizes data into three categories: life expectancy (years)
   1) 70-75, 2) 75-80, 3) >80 years. */
function categorizeLife(data) {

    // Create categories (3): life expectancy
    const lifeCat = {bucket1Min: 70, bucket1Max: 75, bucket2Max: 80};
    let category = [];

    // Fetch data from dataset and determine category
    for (let i = 0; i < data.length; i++) {

        let lifeExpect = data[i][0];

        if (lifeExpect >= lifeCat.bucket1Min && lifeExpect < lifeCat.bucket1Max) {
            category.push('LOW')
        }
        else if (lifeExpect >= lifeCat.bucket1Max && lifeExpect < lifeCat.bucket2Max) {
            category.push('MEDIUM')
        }
        else {
            category.push('HIGH')
        }
    };

    return category;
};

/* Categorizes data into three categories: air pollution (mg per cubic metre)
   1) 0-10, 2) 10-15, 3) >15. */
function categorizePollution(data) {

    // Create categories (3): life expectancy
    const polCateg = {bucket1Min: 0, bucket1Max: 10, bucket2Max: 15};
    let category = [];

    // Fetch data from dataset and determine category
    for (let i = 0; i < data.length; i++) {

        let airPol = data[i][3];

        if (airPol >= polCateg.bucket1Min && airPol < polCateg.bucket1Max) {
            category.push('LOW')
        }
        else if (airPol >= polCateg.bucket1Max && airPol < polCateg.bucket2Max) {
            category.push('MEDIUM')
        }
        else {
            category.push('HIGH')
        }
    };

    return category;
};

/* Converts data to custom JSON object for datamaps */
function convertToDictionary(dataset, category, countryList) {
    let data = [];
    let dataCountry = {};

    // Fetch data variables, put in JSON format and add to dataList
    for (let i = 0; i < dataset.length; i++) {
        data.push({
            fillKey: category[i],
            lifeExpect: dataset[i][0],
            waterQuality: dataset[i][1],
            selfHealth: dataset[i][2],
            airPolution: dataset[i][3]
        });
    };

    // Assign data value to country (ISO) in JSON format
    for (let i = 0; i < dataset.length; i++) {
        dataCountry[countryList[i]] = data[i]
    };

    return {dataCountry};
};

/* Load map, create barchart: linked. */
function createLinkedView(dataLife) {

    // Set dimensions of canvas
    const margin = {top: 100, bottom: 50, right:30, left: 60},
        width = 470 - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom,
        barHeight = 20,
        originChart = 0;

    let countryName = d3.select("#chart")
                        .append("h3")
                        .attr("class", "countryName")
                        .text("Netherlands")

    // Set the ranges
    let x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .4),

        y = d3.scale.linear()
        .range([height, 0]);

    // Define X axis
    let xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom"),

        // Define Y axis
        yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // Create SVG element

    let svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .   attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    dataLabels = ["Water Quality", "Self-reported Health"]
    dataPercentage = [0, 100];

    // Scale domain of the data
    x.domain(dataLabels);
    y.domain(dataPercentage);

    // Setup the tool tip.
    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) { return d.percentage + " %"});

    svg.call(tip);

    dataDefault = makeDictBar(dataLife.dataCountry["NLD"]);

    // Fill barchart with default data (Netherlands)
    let bars = svg.selectAll(".bar")
        .data(dataDefault)
    bars.enter().append("rect")
        .style("fill", "steelblue")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.indicator); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.percentage); })
        .attr("height", function(d) { return height - y(d.percentage); })
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

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", originChart - barHeight * 2)
        .attr("x", originChart - (height - margin.right * 2))
        .style("font-size", "20px")
        .text("% of people reported good/satisfied");

    // X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .style("font-size", "17px")
        .attr("text-anchor", "middle")
        .text("Indicators");

    // Scatter plot title
    svg.append("text")
        .attr("class","title")
        .attr("x", (width / 2))
        .attr("y", originChart - margin.bottom)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Better life index: indicator per country");

    // Keeps track of data selected by user
    let currentData = "lifeExpectancy";

    // Create datamap (Zoom on Europe) and set configruation
    let map = new Datamap({
        scope: 'world',
        element: document.getElementById('datamap'),
        fills: {
            HIGH: '#2b8cbe',
            MEDIUM: '#7bccc4',
            LOW: '#ccebc5',
            defaultFill: '#bdbdbd'
        },
        data: {},
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                if (dataLifeExpect.dataCountry[geography.properties.iso] == null) {
                    console.log("Data is not available.");
                }
                else {
                    updateBars(geography.properties.iso, dataLifeExpect);
                    let updateName = d3.selectAll(".countryName")
                                        .text(geography.properties.name)
                };
            });
        },
        geographyConfig: {
            borderColor: "#252525",
            borderWidth: 1,
            popupTemplate: function(geo, data) {
                if (currentData === "lifeExpectancy") {
                    return ['<div class="hoverinfo"><strong>',
                            'Country: ' + geo.properties.name,
                            ', Life expectancy: ' + data.lifeExpect + ' years',
                            '</strong></div>'].join('');
                } else {
                    return ['<div class="hoverinfo"><strong>',
                            'Country: ' + geo.properties.name,
                            '<br/>Air pollution: ' + data.airPolution +
                            ' mg per cubic metre',
                            '</strong></div>'].join('');
                }
            },
            highlightFillColor: function(data) {
                if (!data.fillKey) {
                    return '#bdbdbd';
                } else {
                    return "#fcbba1";
                }
            },
            highlightBorderColor: "#252525",
            highlightBorderWidth: 1,
        },
        setProjection: function(element) {
            let projection = d3.geo.equirectangular()
            .center([10, 40])
            .rotate([0, -15])
            .scale(550)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        let path = d3.geo.path()
            .projection(projection);

            return {path: path, projection: projection};
        }
    });

    let legend_params = {
        legendTitle: "legend",
        defaultFillName: "No data:",
    };

    // Add legend to datamap
    map.legend(legend_params);

    // Set data of map to default: life expectancy
    map.updateChoropleth(dataLifeExpect.dataCountry);

    // Keep track of user input: switching between datasets
    let button = d3.selectAll(".btn")
                    .on("click", function() {
                        let button = this.getAttribute("value");

                        if (button == "lifeExpect") {
                            map.updateChoropleth(dataLifeExpect.dataCountry)
                            currentData = "lifeExpectancy";
                        }
                        else {
                            map.updateChoropleth(dataAirPollution.dataCountry)
                            currentData = "airPolution";
                        }
                    });

    /* Creates canvas to draw on: bar chart with x and y axis. */
    function updateBars(country, data) {

        // Convert data to dictionary
        dataDictBar = makeDictBar(data.dataCountry[country]);

        // Set domain for x scale
        x.domain(dataDictBar.map(function(d) { return d.indicator; }));

        // Create bars + update
        let bars = svg.selectAll(".bar")
            .data(dataDictBar)
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.indicator); })
            .attr("width", x.rangeBand())
            .transition().duration(1000)
            .attr("y", function(d) { return y(d.percentage); })
            .attr("height", function(d) { return height - y(d.percentage); });

        bars
            .transition().duration(1000)
            .attr("y", function(d) { return y(d.percentage); })
            .attr("height", function(d) { return height - y(d.percentage); });

        bars.exit().remove();
    };
};

// Convert dataset to dictionary format: for creating the barchart. */
function makeDictBar(data) {
    convertedData = [];

    // Fetch data and join to array in custom format (dictionary)
    convertedData.push(
        {
            indicator: "Water Quality",
            percentage: data.waterQuality
        },
        {
            indicator: "Self-reported Health",
            percentage: data.selfHealth
        });

    return convertedData;
};
