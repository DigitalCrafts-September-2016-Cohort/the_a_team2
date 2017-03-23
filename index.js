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

var clone = JSON.parse( JSON.stringify( poi ));

function add2WayNode(pointA,pointB,distance){
  g.addNode(pointA,{[pointB] : distance});
  g.addNode(pointB,{[pointA] : distance});
}

function Point(id,name,type,concourse,latitude,longitude){
  this.id = id;
  this.name = name;
  this.poi_type = type;
  this.concourse = concourse;
  this.latitude = latitude;
  this.longitude = longitude;
}

var point_id = 2000;
// Loop through each gate in E_terminal_horizontal_gates
E_terminal_horizontal_gates.forEach(function(egate){
  //Loop through all the points in points.json
  for(var i=0;i<clone.length;i++){
  // If the gate cotains in points.json
    if(egate === clone[i].name){
      // Make a dummy point for a center horizontal line for each gate in horizontal
      var dummy_horizonal_point = new Point(point_id.toString(),egate,"hcenter","E","33.640631",clone[i].longitude);
      // Add the point to all the points array
      poi.push(dummy_horizonal_point);
      //Add a two way node between the newly generated point and the Horizontal Gate Point on E Terminal.
      add2WayNode(point_id.toString(),clone[i].id,45);
    }
    // Increment the point_ids
    point_id++;
  }
});
