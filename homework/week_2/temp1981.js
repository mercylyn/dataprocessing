/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 20-04-2018
 *
 * Maximum temperature in De Bilt (NL) 1981.
 * This program creates a line graph of the temperature at De Bilt weather
 * station. The graph is included in a web page on github.
 *
 * Source of the data: http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi
 *
 */

/* Event listener is requested: data to web page. */
function reqListener ()
{
    dom = this.responseText;

    let knmi_split = dom.split("\n", 365);
    let dateArray = [];
    let tempArray = [];

    // Store dates and temperatures in individual arrays.
    for(let i = 0; i < knmi_split.length; i++)
    {
        let data = knmi_split[i].split(",");
        let dateIsoFormat = data[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        dateArray.push(new Date(dateIsoFormat));
        tempArray.push(+data[1]);
    }

    // Make canvas to draw line graph on.
    let canvas = document.getElementById("canvas");

    // Check if canvas is supported by browser.
    if (canvas.getContext)
    {
        // Create functions to transform dates and temperatures.
        let dateTransform = createTransform([dateArray[0], dateArray[364]],
                                            [100, 595]);
        let tempTransform = createTransform([Math.max(...tempArray),
                                             Math.min(...tempArray)], [50, 300]);
        let ctx = canvas.getContext('2d');
        let width = 600;
        let transformedDate = [];
        let transformedTemp = [];
        let xAxisBorder = tempTransform(-150);
        let yAxisBorder = 90;
        let month_days = 0;

        // Temperature values.
        let yAxis = [-150, -100, -50, 0, 50, 100, 150, 200, 250];

        // Number of days per month: starting value is zero to indicate begin x-axis.
        let xAxis = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 30];

        let month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                          "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Transform the data: dates and temperatures.
        for(let i = 0; i < dateArray.length; i++)
        {
            transformedDate.push(dateTransform(dateArray[i]));
            transformedTemp.push(tempTransform(tempArray[i]));
        }

        ctx.beginPath();
        ctx.strokeStyle = "red";

        // Plot data: temperature per day (1 year).
        for(let i = 0; i < transformedDate.length; i++)
        {
            ctx.moveTo(transformedDate[i], transformedTemp[i]);
            ctx.lineTo(transformedDate[i + 1], transformedTemp[i + 1]);
        }

        ctx.stroke();

        // Draw the x-axis.
        ctx.beginPath();
        ctx.strokeStyle = "black";

        // Use first and last date of the year.
        ctx.moveTo(transformedDate[0], xAxisBorder);
        ctx.lineTo(transformedDate[364], xAxisBorder);

        // Draw the y-axis.
        ctx.moveTo(yAxisBorder, tempTransform(250));
        ctx.lineTo(yAxisBorder, xAxisBorder);
        ctx.stroke();

        ctx.beginPath();

        // Draw the values of y-axis (temperature).
        for (let i = 0; i < yAxis.length; i++)
        {
            // dashes of y-axis
            ctx.moveTo(yAxisBorder, tempTransform(yAxis[i]));
            ctx.lineTo(yAxisBorder - 10, tempTransform(yAxis[i]));

            ctx.font = "12px Arial";
            ctx.fillText(String(yAxis[i]), 50, tempTransform(yAxis[i]) + 5);
        }

        // Draw the values of the x-axis (month name).
        for (let i = 0; i < xAxis.length; i++)
        {
            ctx.moveTo(transformedDate[month_days += xAxis[i]], tempTransform(-150));
            ctx.lineTo(transformedDate[month_days], tempTransform(-160));

            ctx.font = "12px Arial";
            ctx.fillText(String(month_name[i]), transformedDate[month_days] + 10, tempTransform(-170));
        }

        ctx.stroke();

        // Indicate zero line.
        ctx.beginPath();
        ctx.setLineDash([5,3]);
        ctx.moveTo(transformedDate[0], tempTransform(0));
        ctx.lineTo(transformedDate[364], tempTransform(0));
        ctx.stroke();

        // Title of line graph.
        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillText("Maximum Temperature in De Bilt (NL) 1981", 140, 30);
        ctx.stroke();

        // Set x-label.
        ctx.beginPath();
        ctx.fillText("Month", width / 2, 380);

        // Set y-label.
        ctx.translate(0, 300);
        ctx.rotate(-Math.PI / 2)
        ctx.fillText("Mean temperature (°C x 0.1)", 20, 30);
    }

    /* Returns a function that, for a given domain and range, calculates at
     * which coordinate the next data point will be plotted.
     */
    function createTransform(domain, range)
    {
        let domain_min = domain[0]
        let domain_max = domain[1]
        let range_min = range[0]
        let range_max = range[1]

        // formulas to calculate the alpha and the beta
       	let alpha = (range_max - range_min) / (domain_max - domain_min)
        let beta = range_max - alpha * domain_max

        // returns the function for the linear transformation (y= a * x + b)
        return function(x)
        {
            return alpha * x + beta;
        }
    }
}

// Send HTTP request.
let oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://raw.githubusercontent.com/mercylyn/dataprocessing/master/homework/week_2/data_1981.csv");
oReq.send();
