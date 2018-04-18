/*
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 20-04-2018
 *
 * This program
 *
 *
 */
var dom = document.getElementById("rawdata").value;

var knmi = dom.split("\n", 365);
var date_list = []
var temp_list = []

for (var i = 0; i < knmi.length; i++)
{
    var data = knmi[i].split(",");
    var date_iso_format = data[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    var date = new Date(date_iso_format);
    date_list.push(date);
    temp_list.push(+data[1]);
}

console.log(temp_list)

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var x = 0;
ctx.beginPath();

for(temp in temp_list)
{
    console.log(temp_list[temp], x);
    ctx.moveTo(0,0);
    ctx.lineTo(x += 1, temp_list[temp]);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
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

createTransform
