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
    service.getRoute = function() {
        var url = '/shortest_path';
        return $http({
            method: 'GET',
            url: url,
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
            zoom: 16
        },
        defaults: {
            maxZoom: 20,
            zoomControl: false,
            tileLayer: 'https://api.mapbox.com/styles/v1/jesslyn-landgren/ciw4wyf68000c2jp64u1j4xzh/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ',
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
    $scope.navigating = true;
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
                            "name": all_points[point].name,
                            "type": all_points[point].poi_type
                        }, "geometry":{
                            "type": "Point",
                            "coordinates": [all_points[point].longitude, all_points[point].latitude]
                        }
                };
                // console.log(all_points[point].poi_type);
                $scope.geoJSON.push(geoJSON);
            }
            $scope.drawAllPoints();
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
                    return {color: 'rgb(94, 173, 117)'}
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
                    myIcon = L.divIcon({
                        className: 'label',
                        html: feature.properties.name,
                        iconSize: [100, 40]
                    });
                    return L.marker(latlng, {icon: myIcon});
                },
                onEachFeature: function(feature, layer){
                    return L.circleMarker([feature.coordinates], pointMarkerStyle);
                }
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
        var tolerance = 0.000137;
        leafletData.getMap('map').then(function(map) {
            map.locate({
                watch: true,
                setView: true,
                timeout: 8000,
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
                $scope.step_by_step = "Continue Straight";

                if ($scope.point_route_check) {
                    if ($scope.point_route_check.length === 1){
                        if (((e.latlng.lat - $scope.next_point.latitude) < tolerance) && ((e.latlng.lng - $scope.next_point.longitude) < tolerance)){
                            console.log("You have arrived!");
                            console.log("End of route check");
                        }
                    }else if ($scope.point_route_check.length > 1){
                    $scope.current_point = $scope.point_route_check[0];
                    $scope.next_point = $scope.point_route[1];
                    if (((e.latlng.lat - $scope.next_point.latitude) < tolerance) && ((e.latlng.lng - $scope.next_point.longitude) < tolerance)){
                        $scope.time_left = $scope.current_point.time
                        $scope.step_by_step = $
                        $scope.point_route_check.splice(0,1);
                        console.log($scope.point_route_check);
                    }

                }
                } else {

                }
            });
        });

        $scope.destination = point;
        AirportConnect.getRoute($scope.origin, $scope.destination).success(function(routeResult) {
            $scope.route_points = routeResult.points;
            $scope.instructions = routeResult.instructions;
            $scope.point_route_check = routeResult.points;
            $scope.point_route_check = routeResult.points;

            var points = [];
            for (var point in $scope.route_points) {
                var geoJSON = {
                    "type": "Feature",
                        "properties": {
                            "concourse": all_points[point].concourse,
                            "name": all_points[point].name,
                            "type": all_points[point].poi_type
                        }, "geometry":{
                            "type": "Point",
                            "coordinates": [all_points[point].longitude, all_points[point].latitude]
                        }
                };
                // console.log(all_points[point].poi_type);
                $scope.geoJSON.push(geoJSON);
            }
            $scope.drawAllPoints();
        });

        // Draws Route Path
        $scope.drawRoute = function(){
            leafletData.getMap('map').then(function(map) {
                L.geoJSON($scope.geoJSON, {

                }).addTo(map);
            });
        };
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
