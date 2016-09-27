'use strict';
app.controller('homeController', ['homeService', function(hs){
  var vm = this;
  vm.name = 'Home';
  vm.startGame = hs.startGame;
}])

app.controller('oracleController', ['oracleService', function(os){
  var vm = this;
  vm.name = 'Oracle';
  vm.squares = os.squares;
  vm.puzzles = os.puzzles;
  vm.submitAnswer = os.submitAnswer;
  vm.success = os.success;
  vm.answerCorrectness = os.answerCorrectness;
  os.getSolutions();
}]);

app.controller('runnerController', ['runnerService', function(rs){
  var vm = this;
  vm.name = 'Runner';

}]);
