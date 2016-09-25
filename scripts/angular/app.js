'use strict';
var app = angular.module('kwaneApp', ['ngRoute']);
var url = 'http://10.7.80.203:3000';

app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: '/templates/home.html',
    controller: 'homeController',
    controllerAs: 'HC'
  })
  .when('/oracle/:id', {
    templateUrl:'/templates/oracleView.html',
    controller: 'oracleController',
    controllerAs: 'OC'
  })
  // .when('/runner', {
  //   templateUrl:'/templates/runnerView.html',
  //   controller: 'runnerController',
  //   controllerAs: 'RC'
  // })
  .when('/runner/:id', {
    templateUrl:'/templates/runnerView.html',
    controller: 'runnerController',
    controllerAs: 'RC'
  })
  .otherwise({redirectTo:'/'});
});
