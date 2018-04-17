var dom = document.getElementById("rawdata").value;

var data = dom.split("\n");
var date_list = []
var temp_list = []

for (var i = 0; i < data.length; i++)
{
  var temp = data[i].split(",");
  date_list.push(temp[0]);
  temp_list.push(temp[1]);
}
