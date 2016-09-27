'use strict';
app.directive('headerDirective', [function(){
  return {
    templateUrl: '/partials/header.html'
  };
}]);

app.directive('footerDirective', [function(){
  return {
    templateUrl: '/partials/footer.html'
  };
}]);
