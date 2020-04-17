//set margins
var margin = {top: 75, right: 150, bottom: 75, left: 150},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

document.getElementById("vizContainer").width = width;
document.getElementById("vizContainer").height = height;


var vizList = ["https://public.tableau.com/views/TallTable/Dashboard1?:display_count=y&publish=yes&:origin=viz_share_link&:toolbar=no"];

var viz,
vizLen = vizList.length,
vizDisplay = 0;

function createViz(vizDisplay) {
	var vizDiv = document.getElementById("vizContainer"),
	options = {
    hideTabs: true
    // ,
    // onFirstInteractive: function () {
    //   listenToMarksSelection();
  // }
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
finalData = [{"Address":"7380 S Rainbow Blvd, Ste 101","Business Id":"IhNASEZ3XnBHmuuVnWdIwA","Category":"All","City":"Las Vegas","Name":"Brew Tea Bar","Postal Code":"89139","State":"NV","Is category":"1","Latitude":"36.0542269","Longitude":"-115.2423924","Review Count":"1338","Review Stars Count":"1338","Stars":"5"},{"Address":"3430 E Tropicana Ave, Ste 32","Business Id":"8fFTJBh0RB2EKG53ibiBKw","Category":"All","City":"Las Vegas","Name":"Zenaida's Cafe","Postal Code":"89121","State":"NV","Is category":"1","Latitude":"36.1017406138","Longitude":"-115.1003590417","Review Count":"347","Review Stars Count":"347","Stars":"5"},{"Address":"3899 Spring Mountain Rd","Business Id":"3pSUr_cdrphurO6m1HMP9A","Category":"All","City":"Las Vegas","Name":"J Karaoke Bar","Postal Code":"89102","State":"NV","Is category":"1","Latitude":"36.1261962","Longitude":"-115.1917155","Review Count":"344","Review Stars Count":"344","Stars":"5"},{"Address":"3455 S Durango Dr, Ste 112","Business Id":"2B46bRpDh49eDyjXGhL_ZQ","Category":"All","City":"Las Vegas","Name":"La Maison de Maggie","Postal Code":"89117","State":"NV","Is category":"1","Latitude":"36.1271566","Longitude":"-115.2800102","Review Count":"320","Review Stars Count":"320","Stars":"5"},{"Address":"3957 S Maryland Pkwy","Business Id":"cePE3rCuUOVSCCAHSjWxoQ","Category":"All","City":"Las Vegas","Name":"Karved","Postal Code":"89119","State":"NV","Is category":"1","Latitude":"36.117091","Longitude":"-115.138401","Review Count":"217","Review Stars Count":"217","Stars":"5"},{"Address":"5900 W Charleston Blvd, Ste 10","Business Id":"vOMDU31gdylrzBhAKC9QbA","Category":"All","City":"Las Vegas","Name":"Sushi Hiroyoshi Japanese Cuisine","Postal Code":"89146","State":"NV","Is category":"1","Latitude":"36.1599423","Longitude":"-115.2222337","Review Count":"213","Review Stars Count":"213","Stars":"5"},{"Address":"1615 S Las Vegas Blvd","Business Id":"G4hjhtA_wQ-tSOGpgGlDjw","Category":"All","City":"Las Vegas","Name":"Bajamar Seafood & Tacos","Postal Code":"89104","State":"NV","Is category":"1","Latitude":"36.1517421042","Longitude":"-115.1518118808","Review Count":"197","Review Stars Count":"197","Stars":"5"},{"Address":"3635 Las Vegas Blvd S","Business Id":"iBPyahdJRP5y0t25fF2W9w","Category":"All","City":"Las Vegas","Name":"Lip Smacking Foodie Tours","Postal Code":"89109","State":"NV","Is category":"1","Latitude":"36.1145367627","Longitude":"-115.172678268","Review Count":"189","Review Stars Count":"189","Stars":"5"},{"Address":"4105 W Sahara Ave","Business Id":"4Pl-ziYL2oerGyIPlwVdmA","Category":"All","City":"Las Vegas","Name":"Chuchote Thai Bistro & Desserts","Postal Code":"89102","State":"NV","Is category":"1","Latitude":"36.1439688","Longitude":"-115.1959097","Review Count":"166","Review Stars Count":"166","Stars":"5"},{"Address":"3616 West Spring Mountain Rd, Ste 103","Business Id":"9P23-V64kYz3trn9ecaJJA","Category":"All","City":"Las Vegas","Name":"Kame Omakase and Kaiseki","Postal Code":"89102","State":"NV","Is category":"1","Latitude":"36.1265556","Longitude":"-115.1892231","Review Count":"126","Review Stars Count":"126","Stars":"5"}]

function FilterCategory(category, callback) {
  var sheet=viz.getWorkbook().getActiveSheet().getWorksheets().get("Map");
  sheet.clearFilterAsync('Business Id');
  sheet.applyFilterAsync("Category", category, tableau.FilterUpdateType.REPLACE);
  callback()
}

document.getElementById('category').onchange = function() {
  category = document.getElementById('category').value
  FilterCategory(category, getVizData);
  getVizData(update);
  // update();
}

function FilterName(Name) {
  var sheet=viz.getWorkbook().getActiveSheet().getWorksheets().get("Map");
  sheet.applyFilterAsync("Business Id", Name, tableau.FilterUpdateType.REPLACE);
}

function update() {
  star = '<span class="fa fa-star checked"></span>'

  document.getElementById('name1').innerHTML = "";
  document.getElementById('name2').innerHTML = "";
  document.getElementById('name3').innerHTML = "";
  document.getElementById('name4').innerHTML = "";
  document.getElementById('name5').innerHTML = "";

  document.getElementById('stars1').innerHTML = "";
  document.getElementById('stars2').innerHTML = "";
  document.getElementById('stars3').innerHTML = "";
  document.getElementById('stars4').innerHTML = "";
  document.getElementById('stars5').innerHTML = "";

  document.getElementById('num_reviews1').innerHTML = "";
  document.getElementById('num_reviews2').innerHTML = "";
  document.getElementById('num_reviews3').innerHTML = "";
  document.getElementById('num_reviews4').innerHTML = "";
  document.getElementById('num_reviews5').innerHTML = "";


  name1 = finalData[0]['Name']
  id1 = finalData[0]['Business Id']
  document.getElementById('name1').innerHTML = name1;
  document.getElementById('name1').onclick = function() {FilterName(id1);};
  document.getElementById('stars1').innerHTML = finalData[0]['Stars'] + star;
  document.getElementById('num_reviews1').innerHTML = "(" + finalData[0]['Review Count'] + " Reviews)";

  name2 = finalData[1]['Name']
  id2 = finalData[1]['Business Id']
  document.getElementById('name2').innerHTML = name2;
  document.getElementById('name2').onclick = function() {FilterName(id2);};
  document.getElementById('stars2').innerHTML = finalData[1]['Stars'] + star;
  document.getElementById('num_reviews2').innerHTML = "(" + finalData[1]['Review Count'] + " Reviews)";

  name3 = finalData[2]['Name']
  id3 = finalData[2]['Business Id']
  document.getElementById('name3').innerHTML = name3;
  document.getElementById('name3').onclick = function() {FilterName(id3);};
  document.getElementById('stars3').innerHTML = finalData[2]['Stars'] + star;
  document.getElementById('num_reviews3').innerHTML = "(" + finalData[2]['Review Count'] + " Reviews)";

  name4 = finalData[3]['Name']
  id4 = finalData[3]['Business Id']
  document.getElementById('name4').innerHTML = name4;
  document.getElementById('name4').onclick = function() {FilterName(id4);};
  document.getElementById('stars4').innerHTML = finalData[3]['Stars'] + star;
  document.getElementById('num_reviews4').innerHTML = "(" + finalData[3]['Review Count'] + " Reviews)";

  name5 = finalData[4]['Name']
  id5 = finalData[4]['Business Id']
  document.getElementById('name5').innerHTML = name5;
  document.getElementById('name5').onclick = function() {FilterName(id5);};
  document.getElementById('stars5').innerHTML = finalData[4]['Stars'] + star;
  document.getElementById('num_reviews5').innerHTML = "(" + finalData[4]['Review Count'] + " Reviews)";  
}

var select = document.getElementById("category"); 
var options = ["All","Afghan","African","Arabian","Argentine","Armenian","Asian Fusion","Brazilian","British","Caribbean","Chinese","Cuban","Eritrean","Ethiopian","Filipino","French","German","Greek","Halal","Hawaiian","Himalayan/Nepalese","Honduran","Indian","Irish","Italian","Japanese","Korean","Laotian","Latin American","Malaysian","Mediterranean","Mexican","Middle Eastern","Modern European","Mongolian","Moroccan","Nicaraguan","Pakistani","Persian/Iranian","Peruvian","Portuguese","Singaporean","Spanish","Taiwanese","Thai","Turkish","Ukrainian","Vietnamese"]; 

for(var i = 0; i < options.length; i++) {
    var opt = options[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    select.appendChild(el);
}

// function listenToMarksSelection() {
//   viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
// }

// function onMarksSelection(marksEvent) {
//   return marksEvent.getMarksAsync().then(function() {
//     getVizData(update)
//   });
// }

var Loading = document.body;
Loading.onload=function(){
  createViz(0);
  update();
}