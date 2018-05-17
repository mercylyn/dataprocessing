/**
 * Name: Mercylyn Wiemer (10749306)
 * Course: Data Processing
 * Date: 18-05-2018
 *
 * Linked-views: Better Life Index (Life expectancy, water quality and self-reported health)
 */

/* Run code when files are loaded. */
window.onload = function() {
    loadData();
};

let dataLifeExpect, dataAirPollution;

// Collecting data through API
function loadData() {
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

            console.log(dataAir);
        // Get length of data
        let dataLength = Object.keys(dataLife).length;

        // List of countries: data
        let countryList = getCountry(dataCountry);

        let listData = getData(dataLife, dataWater, dataHealth, dataAir, dataLength);

        console.log(listData)
        let categoryLife = categorizeLife(listData);
        console.log(categoryLife);

        let categoryPol = categorizePollution(listData);
        console.log(categoryPol);

        // Join dataset together
        dataLifeExpect = convertToDictionary(listData, categoryLife, countryList);

        console.log(dataLifeExpect);
        dataAirPollution = convertToDictionary(listData, categoryPol, countryList);

        // console.log(data2016);

        loadMap(dataLifeExpect);

    };
};

/* Converts data from JSON to an array containing three variables. */
function getData(dataset1, dataset2, dataset3, dataset4, dataLength) {
    let data = [];

    // Add data variables to array
    for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < 1; j++) {
            var key = i + ":0:0:" + j;
            data.push([dataset1[key][0], dataset2[key][0], dataset3[key][0], dataset4[key][0]]);
        }
    }

    return data;
}

/* Categorizes data into three categories: life expectancy (years)
   1) 70-75, 2) 75-80, 3) 80-85. */
function categorizeLife(data) {

    // Create categories (3): life expectancy
    const lifeCat = {bucket1Min: 70, bucket1Max: 75, bucket2Max: 80}
    let category = [];

    // Fetch data from dataset and determine category
    for (let i = 0; i < data.length; i++) {

        var lifeExpect = data[i][0];

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

/* Categorizes data into three categories: life expectancy (years)
   1) 70-75, 2) 75-80, 3) 80-85. */
function categorizePollution(data) {

    // Create categories (3): life expectancy
    const polCateg = {bucket1Min: 0, bucket1Max: 10, bucket2Max: 15}
    let category = [];

    // Fetch data from dataset and determine category
    for (let i = 0; i < data.length; i++) {

        var airPol = data[i][3];

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
        }

    // Assign data value to country (ISO) in JSON format
    for (let i = 0; i < dataset.length; i++) {
        dataCountry[countryList[i]] = data[i]
    }

    return {dataCountry};
};


/* Load map, create barchart: linked. */
function loadMap(dataLife) {
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
                    makeBars(geography.properties.iso, dataLifeExpect);
                    let updateName = d3.selectAll(".countryName")
                                        .text(geography.properties.name)
                };
            });
        },
        geographyConfig: {
            borderColor: "#252525",
            borderWidth: 1,
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                        'Country: ' + geo.properties.name,
                        ', life expectancy: ' + data.lifeExpect + ' years',
                        '</strong></div>'].join('');
            },
            highlightFillColor: function(data) {
                console.log(data);
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

    // Add legend
    let legend_params = {
        legendTitle: "Legend",
        defaultFillName: "No data:",
    };

    map.legend(legend_params);

    map.updateChoropleth(dataLifeExpect.dataCountry);

    var button = d3.selectAll(".btn")
                    .on("click", function() {
                        let button = this.getAttribute("value");

                        if (button == "lifeExpect") {
                            map.updateChoropleth(dataLifeExpect.dataCountry)
                        }
                        else {
                            map.updateChoropleth(dataAirPollution.dataCountry)
                        }
                    })

    /* Creates canvas to draw on: bar chart with x and y axis. */
    function makeBars(country, data) {
        dataset = (data.dataCountry[country]);

        console.log(country)
        dataDictBar = makeDictBar(dataset);

        // Set domain for scales
        x.domain(dataDictBar.map(function(d) { return d.indicator; }));
        // y.domain([0, d3.max(dataDictBar, function(d) { return d.percentage; })]);

        console.log("domein")

        // Create bars + update
        var bars = svg.selectAll(".bar")
            .data(dataDictBar)
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.indicator); })
            .attr("width", x.rangeBand())
            .transition().duration(1000)
            .attr("y", function(d) { return y(d.percentage); })
            .attr("height", function(d) { return height - y(d.percentage); })

        bars
            .transition().duration(1000)
            .attr("y", function(d) { return y(d.percentage); })
            .attr("height", function(d) { return height - y(d.percentage); });

        bars.exit().remove();
    };

    // Set dimensions of canvas
    const margin = {top: 100, bottom: 50, right:30, left: 60},
        width = 470 - margin.left - margin.right,
        height = 470 - margin.top - margin.bottom,
        barHeight = 20;

    var countryName = d3.select("#chart")
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
    // let svg = d3.select("body")
    var svg = d3.select("#chart")
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

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) { return d.percentage + " %"});

    svg.call(tip);


    dataDefault = makeDictBar(dataLife.dataCountry["NLD"]);

    var bars = svg.selectAll(".bar")
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
        .attr("y", - barHeight * 2)
        .attr("x", 0 - (height - margin.right * 2))
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
        .attr("y", 0 - 50)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Better life index: indicator per country");
}

/* Return list of countries (ISO) */
function getCountry(data) {
    countryList = [];

    // Get country iso from dataset
    for (let i = 0; i < data.length; i++) {
        countryList.push(data[i].id);
    }

    return countryList;
}

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
