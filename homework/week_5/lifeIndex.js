/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 06-05-2018
 *
 * Better Life Index: Education, Health & Life Satisfaciton, Scatter plot of
 * 2015/2016.
 *
 *
 */

/* Run code when files are loaded. */
window.onload = function() {
    loadData();
};

// Collecting data through API
function loadData() {
    const lifeExpectancy = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.HS_LEB.L.TOT/all?&dimensionAtObservation=allDimensions"
    const waterQuality = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.EQ_WATER.L.TOT/all?&dimensionAtObservation=allDimensions"
    const basicFacilities = "http://stats.oecd.org/SDMX-JSON/data/BLI2016/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OECD+NMEC+BRA+RUS+ZAF.HO_BASE.L.TOT/all?&dimensionAtObservation=allDimensions"

    // requests queries: when fulfilled, continue
    d3.queue()
        .defer(d3.request, lifeExpectancy)
        .defer(d3.request, waterQuality)
        .defer(d3.request, basicFacilities)
        .awaitAll(parseData);

    // convert data to JSON
    function parseData(error, response) {
        if (error) throw error;

        let dataLife = JSON.parse(response[0].responseText).dataSets[0].observations,
            dataWater = JSON.parse(response[1].responseText).dataSets[0].observations,
            dataBasic = JSON.parse(response[2].responseText).dataSets[0].observations,
            dataCountry = JSON.parse(response[0].responseText).structure.dimensions.observation[0].values;


        console.log(dataLife);
        console.log(dataWater);
        console.log(dataBasic);

        dataLength = Object.keys(dataLife).length;

        // List of countries: data
        countryList = getCountry(dataCountry);
        console.log(countryList);

        // Join dataset together
        data2016 = convertData(dataLife, dataWater, dataBasic, dataLength);

        console.log(data2016);
    };
};

/* Converts data from JSON to an array containing three variables. */
function convertData(dataset1, dataset2, dataset3, dataLength) {
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

/* Return list of countries belonging to data 2016/2015. */
function getCountry(data) {
    countryList = [];

    // Get country from dataset
    for (let i = 0; i < data.length; i++) {
        countryList.push(data[i].name);
    }

    return countryList;
}

/* Creates canvas to draw on: scatter plot with x and y axis. */
function loadsvg() {

    // Set dimensions of canvas
    const margin = {top: 100, bottom: 50, right: 50, left: 60},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

    // var projection = d3.geo.albersUsa()
    // 	.scale(1000)
    // 	.translate([width / 2, height / 2]);
    //
    // var path = d3.geo.path()
    // 	.projection(projection);
}

function makeMyMap(error, states, cities) {
	svg.append('path')
		.datum(topojson.feature(states, states.objects.usStates))
			.attr('d', path)
			.attr('class', 'states');
	svg.selectAll('.cities')
		.data(cities.features)
		.enter()
		.append('path')
		.attr('d', path.pointRadius(5))
		.attr('class', 'cities');
}
