/*
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 20-04-2018
 *
 * Maximum temperature in De Bilt (NL) 1981
 *
 */
var dom = document.getElementById("rawdata").value;

var knmi = dom.split("\n", 365);
var dateArray = []
var tempArray = []

for (var i = 0; i < knmi.length; i++)
{
    var data = knmi[i].split(",");
    var dateIsoFormat = data[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    dateArray.push(new Date(dateIsoFormat));
    tempArray.push(+data[1]);
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var dateTransform = createTransform([dateArray[0], dateArray[364]], [50, 600]);
var tempTransform = createTransform([Math.min(...tempArray), Math.max(...tempArray)], [50, 250]);

var scale = 300;
ctx.beginPath();

for(var i = 0; i < dateArray.length; i++)
{
    ctx.moveTo(dateTransform(dateArray[i]),scale - tempTransform(tempArray[i]));
    ctx.lineTo(dateTransform(dateArray[i + 1]), scale - tempTransform(tempArray[i + 1]));
}

ctx.stroke();

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
