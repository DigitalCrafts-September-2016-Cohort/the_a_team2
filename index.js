var poi = require('./points.json');
var train_stations = require('./train_stations');
var Graph = require('node-dijkstra');
var g = new Graph();

var concourses = [  {'name':'T', 'longitude':'-84.442447'},
                    {'name':'A', 'longitude':'-84.439175'},
                    {'name':'B', 'longitude':'-84.435897'},
                    {'name':'C', 'longitude':'-84.432600'},
                    {'name':'D', 'longitude':'-84.429307'},
                    {'name':'E', 'longitude':'-84.425720'},
                    {'name':'F', 'longitude':'-84.419815'} ];

var E_terminal_horizontal_gates = ["E14","E15","E16","E17","E18"];

// Cloning the origin points array
var clone = JSON.parse( JSON.stringify( poi ));

// Function to add a 2 way node
function add2WayNode(pointA,pointB,distance){
  g.addNode(pointA,{[pointB] : distance});
  g.addNode(pointB,{[pointA] : distance});
}

// Define a point
function Point(id,name,type,concourse,latitude,longitude){
  this.id = id;
  this.name = name;
  this.poi_type = type;
  this.concourse = concourse;
  this.latitude = latitude;
  this.longitude = longitude;
}


////////////////////////////////////////////////////////////////
//// Add center points in E Terminal for horizontal path////
///////////////////////////////////////////////////////////////

var point_id = 2000;
// Loop through each gate in E_terminal_horizontal_gates
E_terminal_horizontal_gates.forEach(function(egate){
  //Loop through all the points in points.json
  for(let i=0;i<clone.length;i++){
  // If the gate cotains in points.json
    if(egate === clone[i].name){
      // Make a dummy point for a center horizontal line for each gate in horizontal
      let dummy_horizonal_point = new Point(point_id.toString(),egate,"hcenter","E","33.640631",clone[i].longitude);
      // Add the point to all the points array
      poi.push(dummy_horizonal_point);
      //Add a two way node between the newly generated point and the Horizontal Gate Point on E Terminal.
      add2WayNode(point_id.toString(),clone[i].id,45);
    }
    // Increment the point_ids
    point_id++;
  }
});
// Set the point_id to a greater number
point_id = 3000;


////////////////////////////////////////////////////////////////
//// Add center points in each concourse for vertical paths////
///////////////////////////////////////////////////////////////

// Loop through each concourse
concourses.forEach(function(concourse){
  // Loop through each gate/restaurat point
  for(let i=0;i<clone.length;i++){
    // If the point exist in the horizontal part of E terminal, then bool1 will be true skip it.
    let bool1 = E_terminal_horizontal_gates.includes(clone[i].name)
    // Skip, if the point_type = 'train';
    let bool2 = clone[i].poi_type === 'train';
    // Checking if the concourse name in points array is same as the concourse name in concourses database & previous two steps
      if(clone[i].concourse === concourse.name && !bool1 && !bool2){
        // Create a point with using the Point class/function
        let dummy_vertical_point = new Point(point_id.toString(),concourse.name+clone[i].name,"vcenter",clone[i].concourse,clone[i].latitude,concourse.longitude);
        // push the point in the poi database
        poi.push(dummy_vertical_point);
        // add a two way node between the newly created point and a gate/restaurat point in the graph.
        add2WayNode(point_id.toString(),clone[i].id,46)
      }
    // Incrementing the point
    point_id += 1;
  }
});

// Cloning the array again
var clone2 = JSON.parse( JSON.stringify( poi ));
