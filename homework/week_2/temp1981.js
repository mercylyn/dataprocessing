/*
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 20-04-2018
 *
 * Maximum temperature in De Bilt (NL) 1981
 *
 */

function reqListener ()
{
    dom = this.responseText;

    var knmi = dom.split("\n", 365);
    var dateArray = [];
    var tempArray = [];

    for(var i = 0; i < knmi.length; i++)
    {
        var data = knmi[i].split(",");
        var dateIsoFormat = data[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        dateArray.push(new Date(dateIsoFormat));
        tempArray.push(+data[1]);
    }

    var canvas = document.getElementById("canvas");
    //if (canvas.getContext)
    var ctx = canvas.getContext('2d');

    var dateTransform = createTransform([dateArray[0], dateArray[364]], [50, 595]);
    var tempTransform = createTransform([Math.max(...tempArray), Math.min(...tempArray)], [50, 325]);


    var transformedDate = []
    var transformedTemp = []

    for(var i = 0; i < dateArray.length; i++)
    {
        transformedDate.push(dateTransform(dateArray[i]));
        transformedTemp.push(tempTransform(tempArray[i]));
    }

    console.log(transformedDate[31]);

    ctx.beginPath();
    for(var i = 0; i < dateArray.length; i++)
    {
        ctx.moveTo(transformedDate[i], transformedTemp[i]);
        ctx.lineTo(transformedDate[i + 1], transformedTemp[i + 1]);
    }
    ctx.stroke();

    // var transMaxTemp = Math.min(...transformedTemp);
    // var transMinTemp = Math.max(...transformedTemp);
    // var MaxTemp = Math.max(...tempArray);
    // var MinTemp = Math.min(...tempArray);

    // x-axis
    ctx.beginPath();
    ctx.moveTo(transformedDate[0], tempTransform(-150));
    ctx.lineTo(transformedDate[364], tempTransform(-150));

    // y-axis
    ctx.moveTo(40, tempTransform(250));
    ctx.lineTo(40, tempTransform(-150));

    var yAxis = [-150, -100, -50, 0, 50, 100, 150, 200, 250];
    var xAxis = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 30];

    for (var i = 0; i < yAxis.length; i++)
    {
        // values of y-axis
        ctx.moveTo(40, tempTransform(yAxis[i]));
        ctx.lineTo(30, tempTransform(yAxis[i]));

        ctx.font = "12px Arial";
        ctx.fillText(String(yAxis[i]), 5, tempTransform(yAxis[i]) + 5);

    }


    var month = 0;
    var month_name = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (var i = 0; i < xAxis.length; i++)
    {
        ctx.moveTo(transformedDate[month += xAxis[i]], tempTransform(-150));
        ctx.lineTo(transformedDate[month], tempTransform(-160));

        ctx.font = "12px Arial";
        ctx.fillText(String(month_name[i]), transformedDate[month] + 10, tempTransform(-170));
    }

    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillText("Maximum Temperature in De Bilt (NL) 1981", 140, 30);

    function createTransform(domain, range)
    {
    	// domain is a two-element array of the data bounds [domain_min, domain_max]
    	// range is a two-element array of the screen bounds [range_min, range_max]
    	// this gives you two equations to solve:
    	// range_min = alpha * domain_min + beta
    	// range_max = alpha * domain_max + beta
     		// a solution would be:

        var domain_min = domain[0]
        var domain_max = domain[1]
        var range_min = range[0]
        var range_max = range[1]

        // formulas to calculate the alpha and the beta
       	var alpha = (range_max - range_min) / (domain_max - domain_min)
        var beta = range_max - alpha * domain_max

        // returns the function for the linear transformation (y= a * x + b)
        return function(x)
        {
          return alpha * x + beta;
        }
    }
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://raw.githubusercontent.com/mercylyn/dataprocessing/master/homework/week_2/data_1981.csv");
oReq.send();
