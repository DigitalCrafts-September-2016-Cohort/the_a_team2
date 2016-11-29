var app = angular.module("airport_connect", ['leaflet-directive']);

app.controller('MapDivController', ["$scope", function($scope) {
    angular.extend($scope, {
        center: {
            lat: 33.64,
            long: -84.43,
            zoom: 4
        },
        // tiles: {
        //     name: 'Mapbox Streets',
        //     url: 'https://api.mapbox.com/styles/v1/jesslyn-landgren/civzjfle8002l2kr3xkakr5ls/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ',
        //     type: 'mapbox'
        //         // options: {
        //         //     apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
        //         //     mapid: 'bufanuvols.lia35jfp'
        //         // }
        // },
        defaults: {
            zoomControl: false,
            tileLayer:'https://api.mapbox.com/styles/v1/jesslyn-landgren/civzjfle8002l2kr3xkakr5ls/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzc2x5bi1sYW5kZ3JlbiIsImEiOiJ4VUxXQ1BZIn0.6tb-5bu-J-kVGvAbTn6MQQ'
        }
    });
    console.log($scope.center);
}]);
