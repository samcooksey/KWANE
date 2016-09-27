'use strict';
app.controller('homeController', ['homeService', function(hs){
  var vm = this;
  vm.name = 'Home';
  vm.startGame = hs.startGame;
  hs.spinServer();
}])

app.controller('oracleController', ['oracleService', function(os){
  var vm = this;
  vm.name = 'Oracle';
  vm.squares = os.squares;
  vm.puzzles = os.puzzles;
  vm.submitAnswer = os.submitAnswer;
  vm.success = os.success;
  vm.answerCorrectness = os.answerCorrectness;
  vm.player = os.player;
  os.getSolutions();
}]);

app.controller('runnerController', ['runnerService', function(rs){
  var vm = this;
  vm.name = 'Runner';

}]);
