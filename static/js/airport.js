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
        var url = '/search/route';
        return $http({
            method: 'GET',
            url: url,
        });
    };
    return service;
});


app.controller('NavController', function($scope, $state, AirportConnect, leafletData) {
    $scope.navigating = false;
    $scope.time_left = 30;
    $scope.step_by_step = "Continue Straight";

    $scope.search = function() {
        AirportConnect.getSearchResults($scope.query).success(function(searchResults) {
            $scope.results = searchResults;
        });
    };

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
        }
    });

    $scope.startRoute = function (point) {
        //sets time footer ng-if boolean to true & hides search bar ng-if
        $scope.navigating = true;

        leafletData.getMap('map').then(function(map) {
            map.locate({
                watch: true,
                setView: true,
                timeout: 8000,
                maximumAge: 20000,
                enableHighAccuracy: true
            });
            map.on('locationfound', function (e) {
                console.log(e.latlng, e.accuracy);
                $scope.origin.lat = e.latlng.lat;
                $scope.origin.lng = e.latlng.lng;
            });
        });
        $scope.destination = point;
        AirportConnect.getRoute($scope.origin, $scope.destination).success(function(routeResult) {
            $scope.point_route = routeResult.points;
            $scope.instructions = routeResult.instructions;

            var i=0;
            while (i < points.length) {
                if (i < checkStep(i, points, lat, long)){
                    i++;
                }
            }



            function checkStep(i, points, lat, lng){
                if (points[i].lat - lat < .5 && points[i].lng <.5){

                }
            }




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
