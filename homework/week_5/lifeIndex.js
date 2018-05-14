/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 11-05-2018
 *
 *
 * Hoi Kim! Het is niet helemaal gelukt om t/m stap 3 te kunnen leveren.
 * Ik vind het lastig om de popup (datamap) te kunnen wijzigen. Kan er ook weinig
 * over vinden op het internet; wat ik kan vinden heb ik geïmplementeerd (geen succes).
 * Verder ben ik nog bezig de juiste dataset format te vinden. Voor de datamap lijkt
 * JSON format handig, maar bij de bargraph weer niet. (In ieder geval niet zoals ik
 * hem op dit moment heb: key bestaat uit landnaam + nested JSON).
 * De benodigdeheden voor de map en bargraph zijn er, maar niet werkend.
 * Het idee: map laten zien en wanneer men met de muis over een land gaat wordt het volgende
 * weergegeven: life Expectancy. Dan kan je klikken op dat land en wordt in de bargraph
 * de water kwaliteit (%) weergegeven.
 * Een volgende optie zou ook de basicFacilities zijn; eerst maar 2 variabelen!
 */

/* Run code when files are loaded. */
window.onload = function() {
    loadData();
};

// Collecting data through API
function loadData() {
    const lifeExpectancy = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS.HS_LEB.L.TOT/all?&dimensionAtObservation=allDimensions"
    const waterQuality = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS.EQ_WATER.L.TOT/all?&dimensionAtObservation=allDimensions"
    const selfHealth = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS.HS_SFRH.L.TOT/all?&dimensionAtObservation=allDimensions"

    // requests queries: when fulfilled, continue
    d3.queue()
        .defer(d3.request, lifeExpectancy)
        .defer(d3.request, waterQuality)
        .defer(d3.request, selfHealth)
        .awaitAll(parseData);

    // convert data to JSON
    function parseData(error, response) {
        if (error) throw error;

        let dataLife = JSON.parse(response[0].responseText).dataSets[0].observations,
            dataWater = JSON.parse(response[1].responseText).dataSets[0].observations,
            dataHealth = JSON.parse(response[2].responseText).dataSets[0].observations,
            dataCountry = JSON.parse(response[0].responseText).structure.dimensions.observation[0].values;

        let dataLength = Object.keys(dataLife).length;

        // List of countries: data
        let countryList = getCountry(dataCountry);

        let listData = getData(dataLife, dataWater, dataHealth, dataLength);

        let categoryLife = categorizeLife(listData);
        console.log(categoryLife);

        // Join dataset together
        let data2016 = convertToDictionary(listData, categoryLife, countryList);

        console.log(data2016);

        loadMap(data2016);

    };
};

/* Converts data from JSON to an array containing three variables. */
function getData(dataset1, dataset2, dataset3, dataLength) {
    let data = [];

    // Add data variables to array
    for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < 1; j++) {
            var key = i + ":0:0:" + j;
            data.push([dataset1[key][0], dataset2[key][0], dataset3[key][0]]);
        }
    }

    return data;
}

function categorizeLife(data) {

    // Create categories (4) for third variable: self-reported health
    const lifeCat = {bucket1Min: 70, bucket1Max: 75, bucket2Max: 80, bucket3Max: 85}
    var category = [];

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

/* Converts data from JSON to an array containing three variables. */
function convertToDictionary(dataset, categoryLife, countryList) {
    let data = [];
    let dataCountry = {};

    // Add data variables to array
    for (let i = 0; i < dataset.length; i++) {
            data.push({
                fillKey: categoryLife[i],
                lifeExpect: dataset[i][0],
                waterQuality: dataset[i][1],
                selfHealth: dataset[i][2]
            });
        }

    for (let i = 0; i < categoryLife.length; i++) {
        // dataCountry[JSON.stringify(countryList[i])] = JSON.stringify(data[i])
        dataCountry[countryList[i]] = data[i]
    }

    // return JSON.parse(JSON.stringify(dataCountry));
    return {dataCountry};
};


function loadMap(dataLife) {
    var map = new Datamap({
        scope: 'world',
        element: document.getElementById('container'),
        fills: {
            HIGH: '#de2d26',
            LOW: '#fee0d2',
            MEDIUM: '#fc9272',
            // UNKNOWN: '#fff7bc',
            defaultFill: '#bdbdbd'
        },
        data: dataLife.dataCountry,
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography, data) {
                console.log(dataLife)
                makeBars(geography.properties.iso, dataLife);
            });
        },
        geographyConfig: {
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                        'Country: ' + geo.properties.name,
                        ', life expectancy: ' + data.lifeExpect + ' years',
                        '</strong></div>'].join('');
            },
            highlightFillColor: function(data) {
                console.log(data);
                if (!data.fillKey){
                    return '#bdbdbd';
                } else {
                    return "orange";
                }
            }
        },
        setProjection: function(element) {
            var projection = d3.geo.equirectangular()
            .center([10, 40])
            .rotate([0, -15])
            .scale(650)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

            return {path: path, projection: projection};
        }
    });

    /* Creates canvas to draw on: scatter plot with x and y axis. */
    function makeBars(country, data) {
        dataset = (data.dataCountry[country]);

        dataDictBar = makeDictBar(dataset);

        x.domain(dataDictBar.map(function(d) { return d.indicator; }));
        y.domain([0, d3.max(dataDictBar, function(d) { return d.percentage; })]);

        console.log("domein")
        var bars = svg.selectAll(".bar")
            .data(dataDictBar)
        bars.enter().append("rect")
            .style("fill", "steelblue")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.indicator);})
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.percentage); })
            .attr("height", function(d) { return height - y(d.percentage); });

        bars
            .transition().duration(250)
            .attr("y", function(d) { return y(d.percentage); })
            .attr("height", function(d) { return height - y(d.percentage); });

        bars.exit().remove();
    }

    // Set dimensions of canvas
    const margin = {top: 100, bottom: 50, right: 50, left: 60},
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        barHeight = 20;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .4);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    dataLabels = ["Water Quality", "Self-reported Health"]
    x.domain(dataLabels);
    y.domain([0, 100]);

    // create X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)

    // create Y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
}

/* Return list of countries belonging to data 2016/2015. */
function getCountry(data) {
    countryList = [];

    // Get country from dataset
    for (let i = 0; i < data.length; i++) {
        countryList.push(data[i].id);
    }

    return countryList;
}

function makeDictBar(data) {
    convertedData = [];

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
