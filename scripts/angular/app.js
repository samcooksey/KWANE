'use strict';
var app = angular.module('kwaneApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: '/templates/home.html',
    controller: 'homeController',
    controllerAs: 'HC'
  })
  .when('/oracle', {
    templateUrl:'/templates/oracleView.html',
    controller: 'oracleController',
    controllerAs: 'OC'
  })
  .when('/runner', {
    templateUrl:'/templates/runnerView.html',
    controller: 'runnerController',
    controllerAs: 'RC'
  })
  .otherwise({redirectTo:'/'});
});
