// Initializes AngularJS App
var app = angular.module('airport_connect', ['ui.router', 'leaflet-directive']);
var domain = 'http://localhost:5000/';

app.factory('AirportConnect', function($http) {
    var service = {};
    service.getSearchResults = function(query) {
        var url = '/search';
        return $http({
            method: 'GET',
            url: url,
            params: {
                query: query
            }
        });
    };
    service.getRoute = function(origin, destination) {
        var url = '/shortest_path';
        return $http({
            method: 'GET',
            url: url,
            params: {
                origin: origin.id,
                destination: destination.id
            }
        });
    };

    service.getAllPoints = function() {
        var url = '/all_points';
        return $http({
            method: 'GET',
            url: url,
        });
    };
    return service;
});


app.controller('NavController', function($scope, $state, AirportConnect, leafletData) {

    angular.extend($scope, {
        center: {
            lat: 33.640952,
            lng: -84.433220,
            zoom: 14
        },
        defaults: {
            maxZoom: 20,
            zoomControl: false,
            tileLayer: 'https://api.mapbox.com/styles/v1/jesslyn-landgren/ciw6blbhw001u2kmgu04klrja/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ',
            tileLayerOptions: {maxZoom:20}
        },
        controls: {
            custom: [
                L.control.locate({
                    clickBehavior: {
                        inView: 'setView',
                        outOfView: 'setView'
                    },
                    drawCircle: false,
                    icon: 'fa fa-location-arrow',
                    locateOptions: {
                        watch: false
                    }
                })
            ]
        }
    });

    $scope.all_points = [];
    $scope.navigating = false;
    // $scope.time_left = 30;
    // $scope.step_by_step = "Continue Straight";
    $scope.geoJSON = [];

    // Creates GeoJSON for all points (network nodes)
    $scope.getAllPoints = function(){
        AirportConnect.getAllPoints().success(function(all_points){
            var points = [];
            for (var point in all_points) {
                var geoJSON = {
                    "type": "Feature",
                        "properties": {
                            "concourse": all_points[point].concourse,
                            "name": all_points[point].id,
                            "type": all_points[point].poi_type
                        }, "geometry":{
                            "type": "Point",
                            "coordinates": [all_points[point].longitude, all_points[point].latitude]
                        }
                };
                $scope.geoJSON.push(geoJSON);
            }
            // $scope.drawAllPoints();
        });
    };

    // Displays all points using their GeoJSON data
    $scope.drawAllPoints = function(){
        leafletData.getMap('map').then(function(map) {
            var pointMarkerStyle = {
                radius: 3,
                opacity: 1,
                fillOpacity: 1
            };
            L.geoJSON($scope.geoJSON, {
                style: function(feature) {
                    return {color: '#5fad75'};
                    switch (feature.properties.poi_type) {
                        case 'station':   return {color: '#ffa100'};
                        case 'center':   return {color: "#0000ff"};
                        case 'hcenter':   return {color: "#0000ff"};
                        case 'gate': return {color: "#ff0000"};
                        case 'center':   return {color: "#0000ff"};
                        case 'concourse':   return {color: "#0000ff"};
                        case 'toilet':   return {color: "#0000ff"};
                        case 'coffee':   return {color: "#0000ff"};
                        case 'fast_food':   return {color: "#0000ff"};
                        case 'restaurant':   return {color: "#0000ff"};
                    }
                },
                pointToLayer: function (feature, latlng){
                    console.log('Origin GeoJSON coord', latlng);
                    return L.circleMarker(latlng, pointMarkerStyle);
                    // myIcon = L.divIcon({
                    //     className: 'label',
                    //     html: feature.properties.name,
                    //     iconSize: [100, 40]
                    // });
                    // pointToLayer: function (feature, latlng) {
                    //     console.log('Origin GeoJSON coord', latlng);
                    //     return L.circleMarker(latlng, geojsonMarkerOptions);
                    // }
                    // return L.marker(latlng, {icon: myIcon});
                }
                // ,
                // onEachFeature: function(feature, layer){
                //     return L.circleMarker([feature.coordinates], pointMarkerStyle);
                // }
            }).addTo(map);
        });
    };

    //Draws all the points in the network on the map every time page is loaded. (comment the next line to turn off)
    $scope.getAllPoints();

    $scope.search = function() {
        console.log($scope.query);
        AirportConnect.getSearchResults($scope.query).success(function(searchResults) {
            $scope.results = searchResults;
            if ($scope.results.length > 0){
                $scope.show_results = true;
            } else {
                $scope.show_results = false;
            }

        }).error(function(){
            $scope.show_results= false;
            console.log('no search results');
        });
    };

    $scope.startRoute = function (point) {
        //sets time footer ng-if boolean to true & hides search bar ng-if
        $scope.navigating = true;
        $scope.show_steps = false;

        $scope.showSteps = function(){
            console.log('Show Steps');
            $scope.show_steps = !$scope.show_steps;
        };

        var tolerance = 0.000137;
        leafletData.getMap('map').then(function(map) {
            map.invalidateSize(true);
            map.locate({
                watch: true,
                setView: false,
                timeout: 1000,
                maximumAge: 20000,
                enableHighAccuracy: true
            });


            if ($scope.point_route_check) {
                var latlngs = [];
                for (var i=0; i<$scope.point_route_check; i++){
                    if (i === 0 || i == $scope.point_route_check.length-1){
                        $scope.latlngs.push({lat: parseFloat($scope.point_route_check).lat,
                                      lng: parseFloat($scope.point_route_check).lng
                                  });
                    }
                }
            }
            map.on('locationfound', function (e) {
                console.log(e.latlng, e.accuracy);
                $scope.origin.lat = e.latlng.lat;
                $scope.origin.lng = e.latlng.lng;


                $scope.time_left = 30;
                $scope.step_by_step = $scope.steps[0];

                if ($scope.point_route_check) {
                    if ($scope.point_route_check.length === 1){
                        if (((e.latlng.lat - $scope.next_point.latitude) < tolerance) && ((e.latlng.lng - $scope.next_point.longitude) < tolerance)){
                            console.log("You have arrived!");
                            console.log("End of route check");
                        }
                    }else if ($scope.point_route_check.length > 1){
                    $scope.current_point = $scope.point_route_check[0];
                    $scope.next_point = $scope.point_route_check[1];
                        if (((e.latlng.lat - $scope.next_point.latitude) < tolerance) && ((e.latlng.lng - $scope.next_point.longitude) < tolerance)){
                            $scope.step_by_step = $scope.instructions_check[0];
                            $scope.time_left = $scope.current_point.time;
                            $scope.instructions_check.splice(0,1);
                            $scope.point_route_check.splice(0,1);
                            console.log($scope.point_route_check);
                        }
                    }
                } else {

                }
            });

        });

        $scope.destination = point;
        $scope.origin = {
    		"id": "2",
    		"name": "A2",
    		"latitude": "33.637749",
    		"longitude": "-84.4393355",
    		"poi_type": "gate",
    		"concourse": "A"
    	};

        AirportConnect.getRoute($scope.origin, $scope.destination).success(function(routeResult) {
            $scope.route_points = routeResult.points;
            $scope.instructions = routeResult.instructions;
            console.log($scope.instructions);

            // Get steps (eliminates instructions for points where instruction does not change)
            var current_step = '';
            var next_step = '';
            $scope.steps = [$scope.instructions[0]];
            for (var i=0; i<$scope.instructions.length-1; i++){
                current_step = $scope.instructions[i];
                next_step = $scope.instructions[i+1];
                console.log('Current:', current_step);
                console.log('Next:', current_step);
                if (next_step !== current_step) {
                    $scope.steps.push(next_step);
                }
            }
            console.log($scope.steps);

            // Only use these variables for checking current position along route (on locationfound)
            $scope.point_route_check = routeResult.points;
            $scope.instructions_check = routeResult.instructions;

            $scope.line_coord = [];
            $scope.originGeoJSON = [];
            $scope.destGeoJSON = [];
            $scope.stationsGeoJSON = [];
            var last = ($scope.route_points.length-1).toString();
            for (var point in $scope.route_points) {
                for (var test in $scope.route_points[point]){
                    var current_node = $scope.route_points[point][test];
                    var tempGeoJSON = {
                        "type": "Feature",
                            "properties": {
                                // "concourse": $scope.route_points[point].concourse,
                                // "name": $scope.route_points[point].name,
                                "type": current_node.poi_type
                            }, "geometry":{
                                "type": "Point",
                                "coordinates": [current_node.longitude, current_node.latitude]
                            }
                    };
                    $scope.line_coord.push([current_node.longitude, current_node.latitude]);
                    // console.log($scope.line_coord);
                    if (point === '0'){
                        // console.log("got origin");
                        $scope.originGeoJSON.push(tempGeoJSON);
                        $scope.origin_lat = parseFloat(current_node.latitude);
                        $scope.origin_lng = parseFloat(current_node.longitude);
                    } else if (point === last) {
                        // console.log("got dest");
                        $scope.destGeoJSON.push(tempGeoJSON);
                        $scope.destination_lat = parseFloat(current_node.latitude);
                        $scope.destination_lng = parseFloat(current_node.longitude);
                    } else if (current_node.poi_type === 'escalator'){
                        // console.log("got train station");
                        $scope.stationsGeoJSON.push(tempGeoJSON);
                    }
                    break;
                }

            }
            $scope.line = {
                "type": "Feature",
                    "properties": {
                    }, "geometry":{
                        "type": "LineString",
                        "coordinates": $scope.line_coord
                    }
            };
            leafletData.getMap('map').then(function(map) {
                map.fitBounds(L.latLngBounds([$scope.origin_lat, $scope.origin_lng], [$scope.destination_lat, $scope.destination_lng]));
            });
            $scope.drawRoute();
        });

        // Draws Route Path
        $scope.drawRoute = function(){
            leafletData.getMap('map').then(function(map) {

                var originStyle = {
                    radius: 5,
                    fillColor: "#5fad75",
                    color: "#5fad75",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1
                };

                var destinationStyle = {
                    radius: 5,
                    fillColor: "#d63d3d",
                    color: "#d63d3d",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1
                };

                var stationStyle = {
                    radius: 5,
                    fillColor: "#2e66d2",
                    color: "#2e66d2",
                    weight: 1,
                    opacity: 0,
                    fillOpacity: 0
                };

                L.geoJSON($scope.originGeoJSON, {
                    pointToLayer: function (feature, latlng) {
                        // console.log('Plotting origin');
                        return L.circleMarker(latlng, originStyle);
                    }
                }).addTo(map);

                L.geoJSON($scope.destGeoJSON, {
                    pointToLayer: function (feature, latlng) {
                        // console.log('Plotting destination');
                        return L.circleMarker(latlng, destinationStyle);
                    }
                }).addTo(map);

                L.geoJSON($scope.stationsGeoJSON, {
                    pointToLayer: function (feature, latlng) {
                        // console.log('Plotting train station');
                        return L.circleMarker(latlng, stationStyle);
                    }
                }).addTo(map);

                var lineStyle = {
                    "color": "#0085ff",
                    "weight": 5,
                    "opacity": 0.65
                };

                L.geoJSON($scope.line, {
                    style: lineStyle
                }).addTo(map);
            });
        };
    };

    $scope.stopNav = function (){
        $scope.navigating = false;
        leafletData.getMap('map').then(function(map) {
            map.eachLayer(function(layer){
                map.removeLayer(layer);
            });
            L.tileLayer('https://api.mapbox.com/styles/v1/jesslyn-landgren/ciw6blbhw001u2kmgu04klrja/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ', {maxZoom:20}).addTo(map);
        });
        $scope.query = '';
        $scope.results = false;
        $scope.show_results = false;
    };
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state({
            name: 'home',
            url: '/home',
            templateUrl: 'map.html',
            controller: 'NavController'
        });
    $urlRouterProvider.otherwise('/home');
});
