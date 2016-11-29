// Initializes AngularJS App
var app = angular.module('airport_connect', ['ui.router', 'leaflet-directive']);
var domain = 'http://localhost:5000/';

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


app.factory('AirportConnect', function($http) {
    var service = {};
    service.getSearchResults = function(query) {
        var url = '/search';
        return $http({
            method: 'GET',
            url: url,
            params: {
              query : query
            }
        });
    };
    return service;
});

app.controller('NavController', function($scope, $state, AirportConnect) {
  $scope.search = function(){
    AirportConnect.getSearchResults($scope.query).success(function(searchResults){
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
          tileLayer:'https://api.mapbox.com/styles/v1/jesslyn-landgren/civzjfle8002l2kr3xkakr5ls/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ'
      },
      controls: {
          custom: [
              L.control.locate({
              clickBehavior: {inView:'setView', outOfView:'setView'},
              drawCircle: false,
              icon: 'fa fa-location-arrow',
              locateOptions: {watch: true}
              })
          ]
      }
  });
});
