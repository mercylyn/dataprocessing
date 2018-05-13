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
    // const basicFacilities = "https://stats.oecd.org/SDMX-JSON/data/BLI2016/AUT+BEL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ITA+LVA+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+NMEC+RUS.HO_BASE.L.TOT/all?&dimensionAtObservation=allDimensions"

    // requests queries: when fulfilled, continue
    d3.queue()
        .defer(d3.request, lifeExpectancy)
        .defer(d3.request, waterQuality)
        // .defer(d3.request, basicFacilities)
        .awaitAll(parseData);

    // convert data to JSON
    function parseData(error, response) {
        if (error) throw error;

        let dataLife = JSON.parse(response[0].responseText).dataSets[0].observations,
            dataWater = JSON.parse(response[1].responseText).dataSets[0].observations,
            // dataBasic = JSON.parse(response[2].responseText).dataSets[0].observations,
            dataCountry1 = JSON.parse(response[0].responseText).structure.dimensions.observation[0].values;
            dataCountry2 = JSON.parse(response[1].responseText).structure.dimensions.observation[0].values;
            // dataCountry3 = JSON.parse(response[2].responseText).structure.dimensions.observation[0].values;


        // console.log(JSON.parse(response[0].responseText));
        // console.log(dataWater);
        // console.log(dataBasic);

        dataLength = Object.keys(dataLife).length;

        // List of countries: data
        countryList1 = getCountry(dataCountry1);
        // countryList2 = getCountry(dataCountry2);
        // countryList3 = getCountry(dataCountry3);
        console.log(countryList1);

        listLife = getData(dataLife, dataLength);
        console.log(listLife);

        categoryLife = categorizeLife(listLife);
        console.log(categoryLife);

        // Join dataset together
        data2016 = convertToDictionary(listLife, categoryLife, countryList1);

        console.log(data2016);

        loadMap(data2016);

        // loadsvg(data2016);
        // data2016.forEach(function(element) {
        //     console.log(element);
        // });
        //
        // for (let i = 0; i < dataLength; i++) {
        //     console.log(data2016[i])
        // }
        // console.log(data2016);
    };
};

// function convertToJSON(data, countryList) {
//     // {
//     //   "Austria": {"lifeExpect": "81.2", "waterQuality": "93"},
//     //   "Belgium": {"lifeExpect": "80.7", "waterQuality": "83"}
//     // }
//     let dataJSON = {};
//
//
//     data.forEach(function (element) {
//         dataJSON.push{}
//     })
// }

/* Categorize country: life expectancy (years). Three categories 1) 70-75,
   2) 75-80, 3) 80-85. */

/* Converts data from JSON to an array containing three variables. */
function getData(dataset1, dataLength) {
    let data = [];

    // Add data variables to array
    for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < 1; j++) {
            var key = i + ":0:0:" + j;
            data.push(dataset1[key][0]);
        }
    }

    return data;
}

function categorizeLife(data) {

    // Create categories (4) for third variable: self-reported health
    const lifeCat = {bucket1Min: 70, bucket1Max: 75, bucket2Max: 80, bucket3Max: 85}
    var category = [];

    for (let i = 0; i < data.length; i++) {

        var lifeExpect = data[i];

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
                lifeExpect: dataset[i]
            });
        }
    //
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
            HIGH: '#afafaf',
            LOW: '#123456',
            MEDIUM: 'blue',
            // UNKNOWN: 'rgb(0,0,0)',
            defaultFill: 'green'
        },
        geographyConfig: {
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                        'Country: ' + geo.properties.name,
                        ', life expectancy: ' + data.lifeExpect + ' years',
                        '</strong></div>'].join('');
            }
        },
        setProjection: function(element) {
            var projection = d3.geo.equirectangular()
            .center([10, 40])
            .rotate([0, -15])
            .scale(900)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

            return {path: path, projection: projection};
        }
    });
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

/* Creates canvas to draw on: scatter plot with x and y axis. */
// function loadsvg(data) {
//
//     // Set dimensions of canvas
//     const margin = {top: 100, bottom: 50, right: 50, left: 60},
//         width = 960 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom,
//         barHeight = 20;
//
//         var x = d3.scale.ordinal()
//         .rangeRoundBands([0, width], .1);
//
//     var x = d3.scale.ordinal()
//         .rangeRoundBands([0, width], .1);
//
//     var y = d3.scale.linear()
//         .range([height, 0]);
//
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom");
//
//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left");
//
//     var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform",
//               "translate(" + margin.left + "," + margin.top + ")");
//
//     let dataset = [];
//     let dataCountry = [];
//
//     for (var key in data) {
//
//         // d.lifeExpect = +d.lifeExpect;
//         // console.log(key, data[key].lifeExpect);
//         dataset.push([key, data[key].lifeExpect, data[key].waterQuality]);
//         dataCountry.push(key);
//         // d.waterQuality = +d.waterQuality;
//     }
//
//     console.log(dataset);
//     // for (let i = 0; i < dataCountry.length; i++) {
//     //     dataset.push(data[dataCountry[i]]);
//     // }
//     // // console.log(data[dataCountry[0]]);
//     // console.log(dataset);
//
//     x.domain(dataset.map(function(d) { return d[0]; }));
//     y.domain([0, d3.max(dataset, function(d) { return d[1]; })]);
//
//     // create X axis
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + (height) + ")")
//         .call(xAxis)
//
//     // create Y axis
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis)
//
//     svg.selectAll("bar")
//             .data(dataset)
//         .enter().append("rect")
//             .style("fill", "steelblue")
//             .attr("x", dataCountry.forEach(function(element) { return x(element); }))
//             .attr("width", x.rangeBand())
//             .attr("y", function(d) { return y(d.waterQuality); })
//             .attr("height", function(d) { return height - y(d.value); });
// }
