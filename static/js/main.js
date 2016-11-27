/////////////// CREATING AND DISPLAYING MAP VIEW //////////////////////
// Mapbox API token for custom map style
L.mapbox.accessToken = 'pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ';

// Initializing mapbox leaflet map and displaying in div with id=#map
var map = L.mapbox.map('map', false, {
        zoomControl: false,
        center: [33.640952, -84.433220],
        zoom: 15
    });

// Setting URL for custom basemap style (mapbox streets)
var styleURL = 'mapbox://styles/jesslyn-landgren/civzjfle8002l2kr3xkakr5ls';
L.mapbox.styleLayer(styleURL).addTo(map);
L.control.locate({
    clickBehavior: {inView:'setView', outOfView:'setView'},
    drawCircle: false,
    icon: 'fa fa-location-arrow',
    locateOptions: {watch: true}
}).addTo(map);
/////////////////////////////////////////////////////////////////


/////////////// AUTO DETECT USER LOCATION AND CENTER MAP //////////////////////
// //Create variable for user location "blue dot" layer
// var circle;
//
// // If user's location is found, render a 'blue dot' showing their location on the map
// function onLocationFound(e) {
//     if (circle) {
//         map.removeLayer(circle);
//     }
//     circle = L.circle(e.latlng, {
//         color: '#056ad2',
//         fillColor: '#056ad2',
//         fillOpacity: 0.5,
//         radius: 2
//     }).addTo(map);
// }
//
// // Execute the function above based on whether the user's location is available
// map.on('locationfound', onLocationFound);
//
// // Ask for the user's current location on page load, zoom to their current location and then and update the position of the dot with user movement
// map.locate({
//     setView: true,
//     maxZoom: 20,
//     watch: true,
//     enableHighAccuracy: true,
//     maximumAge: 15000,
//     timeout: 3000000
// });
/////////////////////////////////////////////////////////////////

////////// DECLARING VARIABLES ///////////////////////////////
// Creating empty graph object for storing feature network (see graph.js)
var g = new Graph();

// Creating an object with entries for each concourse to use in loops that auto create additional JSON points (for concourse center lines) and auto create network vertices
concourses = {'A': {'name':'A', 'long':'-84.439175'},
              'B': {'name':'B', 'long':'-84.435897'},
              'C': {'name':'C', 'long':'-84.432600'},
              'D': {'name':'D', 'long':'-84.429307'},
              'E': {'name':'E', 'long':'-84.425720'},
              'F': {'name':'F', 'long':'-84.419815'}
};
/////////////////////////////////////////////////////////////////


/////AUTO CREATES CENTER LINE POINTS & NETWORK VERTICES FOR STANDARD GATES
// For each concourse
for (var concourse in concourses) {
    // For each initial JSON point (from OpenStreetMap)
    for (var point in pointsJSON) {
        // Only look at points (gates) in the current concourse
        if (pointsJSON[point].name[0] === concourses[concourse].name) {
            // Create new JSON point that connects JSON point (gate) to concourse centerline
            var gate = pointsJSON[point];
            var center = {};
            // Longitude of new point is the centerline longitude of current concourse
            center.long = concourses[concourse].long;
            // Latitude of new point is the same as the gate that we are connecting to concourse centerline
            center.lat = gate.lat;
            // Name of new point is the same as the gate name but with a double letter for the concourse (ex: gate A1 connects to concourse centerline at point AA1)
            center.name = concourses[concourse].name + gate.name;
            center.type = 'center';
            center.concourse = gate.concourse;
            // Add new point to JSON points list
            pointsJSON.push(center);

            var cen_name = center.name;
            var gat_name = gate.name;
            var cen = {};
            var gat = {};
            cen[cen_name] =  46; //46 ft is half the approximate width of a concourse
            gat[gat_name] = 46;
            // Add vetices for new point (one in each direction)
            g.addVertex(gate.name, cen);
            g.addVertex(center.name, gat);
        }
    }
}
/////////////////////////////////////////////////////////////////


//////// CONNECTS CENTER LINE POINTS TO EACH OTHER IN THE NETWORK
// For each concourse
for (var concourse in concourses){
    // Create empty structures
    var concoursePoints = [];  // stores names of all points in current concourse
    var pointsSorted = {}; // all points in current concourse sorted by latitude
    // For each JSON point
    for (var point in pointsJSON){
        // If JSON point is in current concourse:
        if(pointsJSON[point].concourse === concourses[concourse].name){
            concoursePoints.push(pointsJSON[point]);
        }
    }

    // Sorting points for current concourse by latitude
    pointsSorted = concoursePoints.sort(function(a,b){
        return parseFloat(a.lat) - parseFloat(b.lat);
    });

    // Create empty array for center line points
    var midpoint_arr = [];
    for(var point in pointsSorted){
        if(pointsSorted[point].long === concourses[concourse].long){
            midpoint_arr.push(pointsSorted[point]);
        }
    }

    // For each center line point
    for(var i=0;i<midpoint_arr.length-1;i++){
        var first = {};
        var second ={};
        // Getting latitude distance between points and converting to distance for edge definition
        var dist = ((midpoint_arr[i+1].lat) - (midpoint_arr[i].lat)) * 363917.7912 ;
        // Setting edge for point i and point i+1
        first[midpoint_arr[i].name] = dist;
        second[midpoint_arr[i+1].name] = dist;
        // Adding vertices with edges from above
        g.addVertex(midpoint_arr[i].name,second);
        g.addVertex(midpoint_arr[i+1].name,first);
    }
}
/////////////////////////////////////////////////////////////////


////// GET ROUTE FOR TRIP //////////////////////////////////////
// Hard coded origin and destination for testing (temporary)
var origin = 'C3';
var destination = 'C57';

// Using the shortestPath method of the graph object to get the route for the current origin and destination (see graph.js)
var route = g.shortestPath(origin, destination);
// Manually adding origin to route (note: route is returned in reverse order)
route.push(origin);
console.log(route);
/////////////////////////////////////////////////////////////////


////// DISPLAY ROUTE //////////////////////////////////////
var pointsGeoJSON = [];
// For each JSON point
for (var point in pointsJSON) {
    // Only want to display origin and destination
    if (pointsJSON[point].name === origin || pointsJSON[point].name === destination){
        var geoJSON = {
            "type": "Feature",
                "properties": {
                    "concourse": pointsJSON[point].concourse,
                    "name": pointsJSON[point].name,
                    "type": pointsJSON[point].type
                }, "geometry":{
                    "type": "Point",
                    "coordinates": [pointsJSON[point].long, pointsJSON[point].lat]
                }
        };
        // Add to GeoJSON feature list to be displayed
        pointsGeoJSON.push(geoJSON);
    }
}

// Styling for Origin and Destination markers
var pointMarkerStyle = {
    radius: 3,
    fillColor: "#ff4f37",
    color: "#ff4f37",
    opacity: 1,
    fillOpacity: 0.8
};
// Add Origin and destination points to map
L.geoJSON(pointsGeoJSON, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, pointMarkerStyle);
    }
}).addTo(map);


// For all points along route, add geo coordinates to array
var line_coord = [];
for (var i=0; i<route.length; i++){
    for (var j=0; j<pointsJSON.length; j++){
        if (route[i] === pointsJSON[j].name){
            line_coord.push([pointsJSON[j].long, pointsJSON[j].lat]);
        }
    }
}
// Create GeoJSON feature for route (LineString) using coordinate array from above
var line =
    {   "type": "Feature",
        "properties": {},
        "geometry":{
            "type": "LineString",
            "coordinates": line_coord
        }
    };
// Styling for route LineString
var lineStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
// Add route LineString to map
L.geoJSON(line, {style: lineStyle}).addTo(map);
/////////////////////////////////////////////////////////////////
