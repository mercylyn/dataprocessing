/*
 * Name: Mercylyn Wiemer
 * Course: Data Processing
 * Date: 20-04-2018
 *
 * This program
 *
 */
var dom = document.getElementById("rawdata").value;

var data = dom.split("\n", 365);
var date_list = []
var temp_list = []

for (var i = 0; i < data.length; i++)
{
  var temp = data[i].split(",");
  var date_iso_format = temp[0].replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  var date = new Date(date_iso_format);
  date_list.push(date);
  temp_list.push(+temp[1]);
}

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(200,0,0)';
ctx.fillRect(10, 10, 55, 50); 
