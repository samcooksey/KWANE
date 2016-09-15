'use strict';
app.controller('homeController', [function(){
  var vm = this;
  vm.name = 'Home';
}])

app.controller('oracleController', [function(){
  var vm = this;
  vm.name = 'Oracle';
}]);

app.controller('runnerController', [function(){
  var vm = this;
  vm.name = 'Runner';
}]);
