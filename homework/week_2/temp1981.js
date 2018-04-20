/**
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 20-04-2018
 *
 * Maximum temperature in De Bilt (NL) 1981.
 * This program creates a line graph of the temperature at De Bilt weather
 * station. The graph is included in a web page on github.
 *
 * Source of data: http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi
 *
 */

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

    let canvas = document.getElementById("canvas");
    if (canvas.getContext)
    {
        let ctx = canvas.getContext('2d');

        /* create functions to transform dates and temperatures. */
        let dateTransform = createTransform([dateArray[0], dateArray[364]], [50, 595]);
        let tempTransform = createTransform([Math.max(...tempArray), Math.min(...tempArray)], [50, 325]);


        let transformedDate = []
        let transformedTemp = []

        /* transform the data: dates and temperatures. */
        for(let i = 0; i < dateArray.length; i++)
        {
            transformedDate.push(dateTransform(dateArray[i]));
            transformedTemp.push(tempTransform(tempArray[i]));
        }

        /* Draw graph: temperature per day. */
        ctx.beginPath();
        for(let i = 0; i < transformedDate.length; i++)
        {
            ctx.moveTo(transformedDate[i], transformedTemp[i]);
            ctx.lineTo(transformedDate[i + 1], transformedTemp[i + 1]);
        }
        ctx.stroke();

        // let transMaxTemp = Math.min(...transformedTemp);
        // var transMinTemp = Math.max(...transformedTemp);
        // var MaxTemp = Math.max(...tempArray);
        // var MinTemp = Math.min(...tempArray);

        /* Draw the x-axis. */
        ctx.beginPath();
        ctx.moveTo(transformedDate[0], tempTransform(-150));
        ctx.lineTo(transformedDate[364], tempTransform(-150));

        /* Draw the y-axis. */
        ctx.moveTo(40, tempTransform(250));
        ctx.lineTo(40, tempTransform(-150));

        let yAxis = [-150, -100, -50, 0, 50, 100, 150, 200, 250];
        let xAxis = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 30];

        /* Draw the values of y-axis (temperature). */
        for (let i = 0; i < yAxis.length; i++)
        {
            // values of y-axis
            ctx.moveTo(40, tempTransform(yAxis[i]));
            ctx.lineTo(30, tempTransform(yAxis[i]));

            ctx.font = "12px Arial";
            ctx.fillText(String(yAxis[i]), 5, tempTransform(yAxis[i]) + 5);

        }


        let month_days = 0;
        let month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        /* Draw the values of the x-axis (month name). */
        for (let i = 0; i < xAxis.length; i++)
        {
            ctx.moveTo(transformedDate[month_days += xAxis[i]], tempTransform(-150));
            ctx.lineTo(transformedDate[month_days], tempTransform(-160));

            ctx.font = "12px Arial";
            ctx.fillText(String(month_name[i]), transformedDate[month_days] + 10, tempTransform(-170));
        }

        ctx.stroke();

        /* Title. */
        ctx.font = "20px Arial";
        ctx.fillText("Maximum Temperature in De Bilt (NL) 1981", 140, 30);
    }

    function createTransform(domain, range)
    {
    	// domain is a two-element array of the data bounds [domain_min, domain_max]
    	// range is a two-element array of the screen bounds [range_min, range_max]
    	// this gives you two equations to solve:
    	// range_min = alpha * domain_min + beta
    	// range_max = alpha * domain_max + beta
     		// a solution would be:

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

let oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://raw.githubusercontent.com/mercylyn/dataprocessing/master/homework/week_2/data_1981.csv");
oReq.send();
