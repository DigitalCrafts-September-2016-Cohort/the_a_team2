// Mapbox API token for custom map style
L.mapbox.accessToken = 'pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ';

// Initializing mapbox leaflet map with s
var map = L.mapbox.map('map', false, {
        zoomControl: false,
        center: [33.640952, -84.433220],
        zoom: 15
    });

// Setting URL for custom basemap style
var styleURL = 'mapbox://styles/jesslyn-landgren/civzjfle8002l2kr3xkakr5ls';
L.mapbox.styleLayer(styleURL).addTo(map);

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


concourses = {'A': {'name':'A', 'long':'-84.439175'},
              'B': {'name':'B', 'long':'-84.435897'},
              'C': {'name':'C', 'long':'-84.432600'},
              'D': {'name':'D', 'long':'-84.429307'},
              'E': {'name':'E', 'long':'-84.425720'},
              'F': {'name':'F', 'long':'-84.419815'}
};

var g = new Graph();

for (var concourse in concourses) {
    for (var point in pointsJSON) {
        if (pointsJSON[point].name[0] === concourses[concourse].name) {
            var gate = pointsJSON[point];
            var center = {};
            center.long = concourses[concourse].long;
            center.lat = gate.lat;
            center.name = concourses[concourse].name + gate.name;
            center.type = 'center';
            center.concourse = gate.concourse;
            pointsJSON.push(center);

            var cen_name = center.name;
            var gat_name = gate.name;
            var cen = {};
            var gat = {};
            // console.log(cen_name);
            // console.log(gat_name);
            //
            cen[cen_name] =  46;
            gat[gat_name] = 46;

            // console.log(cen);
            // console.log(gat);

            g.addVertex(gate.name, cen);
            g.addVertex(center.name, gat);
        }
    }
}
//
// var pointsSorted = {};
// var concoursePoints = [];
for (var concourse in concourses){
    var pointsSorted = {};
    var concoursePoints = [];

// only point on middle straight lines and pushing into concoursePoints
    for (var point in pointsJSON){
        // console.log(concourses[concourse].name);
        if(pointsJSON[point].concourse === concourses[concourse].name){
            concoursePoints.push(pointsJSON[point]);

        }
    }

//sorting only a concourse's points
    pointsSorted = concoursePoints.sort(function(a,b){
        return parseFloat(a.lat) - parseFloat(b.lat);
    });

//pushing only mid points into midpoint_arr
    var midpoint_arr = [];
    for(var point in pointsSorted){
        if(pointsSorted[point].long === concourses[concourse].long){
            midpoint_arr.push(pointsSorted[point]);
        }
    }

//adding vertices for all midpoint_arr points
    for(var i=0;i<midpoint_arr.length-1;i++){
        var first = {};
        var second ={};
        var dist = ((midpoint_arr[i+1].lat) - (midpoint_arr[i].lat)) * 363917.7912 ;

        first[midpoint_arr[i].name] = dist;
        second[midpoint_arr[i+1].name] = dist;

        g.addVertex(midpoint_arr[i].name,second);
        g.addVertex(midpoint_arr[i+1].name,first);
    }
    console.log(midpoint_arr);
}

console.log(g);






// g.addVertex('D26', {D11A : 20});
// g.addVertex('D11A', {C40 : 15});
// g.addVertex('C40', {E26 : 23});
// g.addVertex('E17', {E26 : 4});
// g.addVertex('E26', {E17 : 4, C40: 5});

var origin = 'C3';
var destination = 'C57';

var route = g.shortestPath(origin, destination);

route.push(origin);

console.log(route);
var pointsGeoJSON = [];
var line_coord = [];
for (var point in pointsJSON) {
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
        pointsGeoJSON.push(geoJSON);
    }

}
for (var i=0; i<route.length; i++){
    for (var j=0; j<pointsJSON.length; j++){
        if (route[i] === pointsJSON[j].name){
            line_coord.push([pointsJSON[j].long, pointsJSON[j].lat]);
        }
    }
}



// if (route.includes(pointsJSON[point].name)) {
//     line_coord.push([pointsJSON[point].long, pointsJSON[point].lat]);
// }
// console.log(pointsJSON);
// console.log(route);
// console.log(line_coord);

var pointMarkerStyle = {
    radius: 3,
    fillColor: "#ff4f37",
    color: "#ff4f37",
    opacity: 1,
    fillOpacity: 0.8
};
L.geoJSON(pointsGeoJSON, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, pointMarkerStyle);
    }
}).addTo(map);


var line =
    {   "type": "Feature",
        "properties": {},
        "geometry":{
            "type": "LineString",
            "coordinates": line_coord
        }
    };

var lineStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
L.geoJSON(line, {style: lineStyle}).addTo(map);
