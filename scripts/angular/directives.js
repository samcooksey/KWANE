'use strict';
app.directive('headerDirective', [function(){
  return {
    templateUrl: '/partials/header.html',
    controller: 'homeController',
    controllerAs: 'HC'
  };
}]);

app.directive('footerDirective', [function(){
  return {
    templateUrl: '/partials/footer.html',
    controller: 'homeController',
    controllerAs: 'HC'
  };
}]);
