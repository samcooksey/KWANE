'use strict';
var app = angular.module('kwaneApp', ['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: '/partials/home.html',
    controller: 'homeController',
    controllerAs: 'HC'
  })
  .when('/oracle', {
    templateUrl:'/partials/oracleView.html',
    controller: 'oracleController',
    controllerAs: 'OC'
  })
  .when('/runner', {
    templateUrl:'/partials/runnerView.html',
    controller: 'runnerController',
    controllerAs: 'RC'
  })
  .otherwise({redirectTo:'/'});
});
