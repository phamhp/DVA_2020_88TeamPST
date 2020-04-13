//set margins
var margin = {top: 75, right: 150, bottom: 75, left: 150},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

document.getElementById("vizContainer").width = width;
document.getElementById("vizContainer").height = height;


var vizList = ["https://public.tableau.com/views/LasVegasMap/Dashboard2?:display_count=y&publish=yes&:origin=viz_share_link"];

var viz,
vizLen = vizList.length,
vizDisplay = 0;

function createViz(vizDisplay) {
	var vizDiv = document.getElementById("vizContainer"),
	options = {
		hideTabs: true
	};
			
	if (viz) { // If a viz object exists, delete it.
		viz.dispose();
	}
	var vizURL = vizList[vizDisplay];
    viz = new tableau.Viz(vizDiv, vizURL, options); 
}


// inspired by https://interworks.com/blog/rrouse/2016/06/07/pull-viz-data-new-javascript-api-features-tableau-10
function getVizData(callback) {
	options = {
		maxRows: 200, // Max rows to return. Use 0 to return all rows
		ignoreAliases: false,
		ignoreSelection: true,
		includeAllColumns: false
	};
  
  sheet = viz.getWorkbook().getActiveSheet().getWorksheets().get("Top");
	// sheet = viz.getWorkbook().getActiveSheet();
	sheet.getUnderlyingDataAsync(options).then(function (t) {
      cleanData(t);
      callback();
		}); 
}

function formatData(cols,data) {
  var colNames = $.map(cols, function(col) { return col.getFieldName(); });
  var finalData = $.map(data, function(d) {
                  return d.reduce(function(memo, value, idx) {
                    memo[colNames[idx]] = value.value; return memo;
                  }, {});
                });
  return finalData;
}

function cleanData(table) {
	var columns = table.getColumns();
	var data = table.getData();	
  finalData = formatData(columns, data).sort(function(obj1, obj2) {
    return obj2.Stars - obj1.Stars || obj2['Review Count'] - obj1['Review Count'];
  })
};

// starting data
finalData = [{"Business Id":"AN0bWhisCf6LN9eHZ7DQ3w","Categories":"Restaurants, Italian","City":"Las Vegas","Document Index (generated)":"60893","Name":"Los Olivos Ristorante","Postal Code":"89121","State":"NV","Latitude":"36.1291778","Longitude":"-115.0924833","Review Count":"102","Stars":"5"},{"Business Id":"7RR1rbyEKKo2G-RACqAfoA","Categories":"Restaurants, Fast Food, Sandwiches, Food Trucks, Hot Dogs, Food, Burgers, Modern European","City":"Las  Vegas","Document Index (generated)":"85873","Name":"King's  Sausage","Postal Code":"89101","State":"NV","Latitude":"36.1697096","Longitude":"-115.1236952","Review Count":"100","Stars":"5"},{"Business Id":"k9b96JXlNewj36ddrce9Jw","Categories":"Restaurants, Farmers Market, Street Vendors, Mexican, Vegan, Food, Tacos, Vegetarian","City":"Las Vegas","Document Index (generated)":"109928","Name":"Garden Grill","Postal Code":"89145","State":"NV","Latitude":"36.1667834","Longitude":"-115.2861968","Review Count":"94","Stars":"5"},{"Business Id":"VONg0lyHm7fUdARWjkkjCQ","Categories":"Restaurants, Mexican","City":"Las Vegas","Document Index (generated)":"4504","Name":"Las Enchiladas Demama","Postal Code":"89119","State":"NV","Latitude":"36.1013621","Longitude":"-115.1203282","Review Count":"66","Stars":"5"},{"Business Id":"wph0jjOIJQ6U3vPMUooM_A","Categories":"Restaurants, Fast Food, American (New)","City":"Las Vegas","Document Index (generated)":"165431","Name":"Chew & Chug","Postal Code":"89109","State":"NV","Latitude":"36.1067731","Longitude":"-115.1721488","Review Count":"44","Stars":"5"},{"Business Id":"prIta4agQiDpUQVY3MliFA","Categories":"Restaurants, Caterers, Event Planning & Services, Personal Chefs","City":"Las Vegas","Document Index (generated)":"48008","Name":"Chef @ Your Home","Postal Code":"89118","State":"NV","Latitude":"36.179696","Longitude":"-115.345235","Review Count":"40","Stars":"5"},{"Business Id":"mC_nDW9tAQwWcHsfvjUAEQ","Categories":"Restaurants, Filipino, Hawaiian","City":"Las Vegas","Document Index (generated)":"93435","Name":"Lefty-J's Island Favorites","Postal Code":"89169","State":"NV","Latitude":"36.1225777","Longitude":"-115.1441707","Review Count":"40","Stars":"5"},{"Business Id":"rWrx9B1L0jCQm-uUmznBVQ","Categories":"Restaurants, Mexican","City":"Las Vegas","Document Index (generated)":"101755","Name":"El Pollito Charro","Postal Code":"89108","State":"NV","Latitude":"36.196362","Longitude":"-115.2351831","Review Count":"40","Stars":"5"},{"Business Id":"KBA0yGsblufetQgs6Sm_nQ","Categories":"Restaurants, Seafood, Mexican","City":"Las Vegas","Document Index (generated)":"97001","Name":"Mariscos 7 Mares Mexican Restaurant","Postal Code":"89104","State":"NV","Latitude":"36.1585441","Longitude":"-115.121042","Review Count":"30","Stars":"5"},{"Business Id":"RVEmagXK4BzWp8Qws25PDw","Categories":"Restaurants, Burgers, Pizza, Italian","City":"Las Vegas","Document Index (generated)":"37710","Name":"Arnie's Pizzeria","Postal Code":"89139","State":"NV","Latitude":"36.0484864","Longitude":"-115.2243463","Review Count":"28","Stars":"5"}]

function FilterCategory(category, callback) {
  var sheet=viz.getWorkbook().getActiveSheet().getWorksheets().get("Map");
  sheet.applyFilterAsync("Categories", category, tableau.FilterUpdateType.REPLACE);
  callback()
}

document.getElementById('category').onchange = function() {
  category = document.getElementById('category').value
  FilterCategory(category, getVizData);
  getVizData(update);
  // update();
}

function update() {
  document.getElementById('name1').innerHTML = finalData[0]['Name'];
  document.getElementById('name2').innerHTML = finalData[1]['Name'];
  document.getElementById('name3').innerHTML = finalData[2]['Name'];
  document.getElementById('name4').innerHTML = finalData[3]['Name'];
  document.getElementById('name5').innerHTML = finalData[4]['Name'];

  document.getElementById('stars1').innerHTML = "Stars: " + finalData[0]['Stars'];
  document.getElementById('stars2').innerHTML = "Stars: " + finalData[1]['Stars'];
  document.getElementById('stars3').innerHTML = "Stars: " + finalData[2]['Stars'];
  document.getElementById('stars4').innerHTML = "Stars: " + finalData[3]['Stars'];
  document.getElementById('stars5').innerHTML = "Stars: " + finalData[4]['Stars'];
}


var Loading = document.body;
Loading.onload=function(){
  createViz(0);
  update();
}