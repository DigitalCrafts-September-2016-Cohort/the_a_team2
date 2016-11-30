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
    $scope.all_points = [];
    $scope.navigating = false;
    $scope.time_left = 30;
    $scope.step_by_step = "Continue Straight";

    $scope.getAllPoints = function(){
        AirportConnect.getAllPoints().success(function(all_points){
            console.log('trying to get all points');
            var points = [];
            for (var point in all_points) {
                console.log('looking at point points');
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
                $scope.all_points.push(geoJSON);
            }
        });
    return $scope.all_points;
    };


    // console.log($scope.new_points);

    angular.extend($scope, {
        center: {
            lat: 33.640952,
            lng: -84.433220,
            zoom: 16
        },
        defaults: {
            zoomControl: false,
            tileLayer: 'https://api.mapbox.com/styles/v1/jesslyn-landgren/civzjfle8002l2kr3xkakr5ls/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ'
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
        },
        paths: {
            p1: {
                color: '#1d983e',
                weight: 5,
                latlngs: $scope.latlngs
            }
        }
    });

    $scope.search = function() {
        console.log($scope.query);
        AirportConnect.getSearchResults($scope.query).success(function(searchResults) {
            $scope.results = searchResults;
        }).error(function(){
            $scope.results = false;
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
                angular.extend($scope, {
                    paths: {
                        p1: {
                            color: '#1d983e',
                            weight: 5,
                            latlngs: latlngs
                        }
                    }
                });
            }
            map.on('locationfound', function (e) {
                console.log(e.latlng, e.accuracy);
                $scope.origin.lat = e.latlng.lat;
                $scope.origin.lng = e.latlng.lng;

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
            $scope.point_route = routeResult.points;
            $scope.instructions = routeResult.instructions;
            $scope.point_route_check = routeResult.points;
        });
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
