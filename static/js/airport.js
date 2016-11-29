// Initializes AngularJS App
var app = angular.module('airport_connect', ['ui.router', 'leaflet-directive']);
var domain = 'http://localhost:5000/';

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: 'map.html',
            controller: 'NavController'
        })
    $urlRouterProvider.otherwise('/');
});

app.factory('AirportConnect', function($http) {
    var service = {};

    service.getRoute = function() {
        var url = domain + 'api/products';
        return $http({
            method: 'GET',
            url: url
        });
    };
    return service;
});

app.controller('NavController', function($scope) {
    $scope.test = 'test';
});

// app.controller('MapDivController', function($scope) {
//     angular.extend($scope, {
//         center: {
//             lat: 33.640952,
//             lng: -84.433220,
//             zoom: 16
//         },
//         defaults: {
//             zoomControl: false,
//             tileLayer:'https://api.mapbox.com/styles/v1/jesslyn-landgren/civzjfle8002l2kr3xkakr5ls/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ'
//         },
//         controls: {
//             custom: [
//                 L.control.locate({
//                 clickBehavior: {inView:'setView', outOfView:'setView'},
//                 drawCircle: false,
//                 icon: 'fa fa-location-arrow',
//                 locateOptions: {watch: true}
//                 })
//             ]
//         }
//     });
});
