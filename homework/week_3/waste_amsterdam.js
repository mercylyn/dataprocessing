/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 26-04-2018
 *
 * Maximum temperature in De Bilt (NL) 1981.
 * This program creates a line graph of the temperature at De Bilt weather
 * station. The graph is included in a web page on github.
 *
 * Source of the data: Source: https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83452NED/table?ts=1524649884497
 *
 */


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
                in Amsterdam of the years 2001 to 2016.");

     d3.select("body")
        .append("p")
        .text("Source: https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83452NED/table?ts=1524649884497");

     d3.json("waste_amsterdam.json", function(data) {
          if(error) {console.log(error);}
     });
