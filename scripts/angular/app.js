'use strict';
var app = angular.module('kwaneApp', ['ngRoute']);
var url = 'https://operation-atlantis.herokuapp.com';

app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'templates/home.html',
    controller: 'homeController',
    controllerAs: 'HC'
  })
  .when('/oracle/:id', {
    templateUrl:'templates/oracleView.html',
    controller: 'oracleController',
    controllerAs: 'OC'
  })
  .when('/runner/:id', {
    templateUrl:'templates/runnerView.html',
    controller: 'runnerController',
    controllerAs: 'RC'
  })
  .otherwise({redirectTo:'/'});
});
