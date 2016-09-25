'use strict';
app.service('homeService', ['$http', '$location', function($http, $location){
  var sv = this;
  sv.startGame = function(_meName, _partnerName, _partnerNumber){

    $http.post(url + '/api/newGame', {
      oracleName: _meName,
      partnerName: _partnerName,
      partnerNumber: _partnerNumber
    })
    .then(function(data){
      // os.getOrientation(data.data[0]);
      $location.url('/oracle/' + data.data[0]);
    })
    .catch(function(err){
      console.log(err);
    });
  }

}]);
app.service('oracleService', ['$http','$location', function($http, $location){
  var sv = this;
  sv.squares = {};
  sv.success = {};

  sv.submitAnswer = function(answers){
    answers = ansers.split(' ')
    var usedAnswers = [];
    var counter = 0;

    for(var i = 0; i < answers.length; i ++){
      if(usedAnswers.indexOf(answers[i]) === -1 && sv.answerArray.indexOf(answers[i]) !== -1){
        usedAnswers.push(answers[i]);
        counter++;
      }
    }
    if(counter === 4){
      sv.success.response = 'YOU GOT IT!'
    }else{
      sv.success.response = 'Sorry. You got ' + counter + ' right';
    }
  }


  $http.get(url + '/api' + $location.path())
  .then(function(data){
    console.log(data.data);
    sv.puzzles = {};
    var orientation = data.data.orientation;
    var nums = [1,2,3,4];
    var colors = ['orange', 'blue', 'pink', 'green'];
    var letters = ['A', 'B', 'C', 'D'];
    var numWords = ['one', 'two', 'three', 'four'];
    var letter = letters[Math.floor(Math.random() * 4)];
    var quarters ={
      A: [1,2,4,3],
      B: [3,4,2,1],
      C: [4,1,3,2],
      D: [2,3,1,4]
    };
    var solutionArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127];
    sv.colorAnswers = {
      pink: -32,
      green: 32,
      orange: 0,
      blue: 64
    };
    sv.quarterAnswers = {};
    sv.quarterAnswers[1] = -4;
    sv.quarterAnswers[2] = 0;
    sv.quarterAnswers[3] = 8;
    sv.quarterAnswers[4] = 4;

    sv.rotationAnswers = {};
    sv.rotationAnswers[true] = 0;
    sv.rotationAnswers[false] = -16;

    sv.payloadAnswers = {};
    sv.payloadAnswers[1] = -3;
    sv.payloadAnswers[2] = -2;
    sv.payloadAnswers[3] = -1;
    sv.payloadAnswers[4] = 0;
    for(var i = 0; i < 4; i++){
      var quarter = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
      var color = colors.splice(Math.floor(Math.random() * colors.length), 1)[0];
      sv.squares[numWords[i]] = {};
      sv.squares[numWords[i]].path = 'resources/oracleViews/' + quarter + '-' + letter + '.png';
      sv.squares[numWords[i]].quarter = quarter;

      sv.puzzles[numWords[i]] = {};
      //established which of the rotating quarter pieces the puzzles belong to.
      sv.puzzles[numWords[i]].quarter = quarters[orientation][i];
      sv.puzzles[numWords[i]].color = color;
      sv.puzzles[numWords[i]].quadrant = i + 1;
      sv.puzzles[numWords[i]].payload = data.data['puzzle_' + (i+1) + '_payload'];
      sv.puzzles[numWords[i]].orientation = data.data['puzzle_' + (i+1) + '_orientation'];
    }
    sv.answerArray = [];
    for(var puzzleKey in sv.squares){
      for(var squareKey in sv.puzzles){
        if(sv.squares[squareKey].quarter === sv.puzzles[puzzleKey].quarter){
          sv.squares[squareKey].color = sv.puzzles[puzzleKey].color;
        }
      }
      sv.puzzles[puzzleKey].solution = solutionArray[sv.colorAnswers[sv.puzzles[puzzleKey].color] + sv.quarterAnswers[sv.puzzles[puzzleKey].quadrant] + sv.rotationAnswers[sv.puzzles[puzzleKey].orientation] + sv.payloadAnswers[sv.puzzles[puzzleKey].payload] + 55];
      sv.answerArray.push(sv.puzzles[puzzleKey].solution);
      console.log(sv.colorAnswers[sv.puzzles[puzzleKey].color] + sv.quarterAnswers[sv.puzzles[puzzleKey].quadrant] + sv.rotationAnswers[sv.puzzles[puzzleKey].orientation] + sv.payloadAnswers[sv.puzzles[puzzleKey].payload] + 55);
    }
    console.log('puzzles', sv.puzzles);


  });


}]);

app.service('runnerService', ['$http','$location', function($http, $location){
  var sv = this;
  var id = Number($location.path().slice(8))
  $http.get(url + '/api/runner/' + id )
  .then(function(data){
    sv.playerName = data.data[0].player_name;
    sv.puzzle1 = JSON.parse(data.data[0].puzzle_1);
    sv.puzzle1Payload = (data.data[0].puzzle_1_payload);
    sv.puzzle1Orientation = (data.data[0].puzzle_1_orientation);
    sv.puzzle2 = JSON.parse(data.data[0].puzzle_2);
    sv.puzzle2Payload = (data.data[0].puzzle_2_payload);
    sv.puzzle2Orientation = (data.data[0].puzzle_1_orientation);
    sv.puzzle3 = JSON.parse(data.data[0].puzzle_3);
    sv.puzzle3Payload = (data.data[0].puzzle_3_payload);
    sv.puzzle3Orientation = (data.data[0].puzzle_3_orientation);
    sv.puzzle4 = JSON.parse(data.data[0].puzzle_4);
    sv.puzzle4Payload = (data.data[0].puzzle_4_payload);
    sv.puzzle4Orientation = (data.data[0].puzzle_4_orientation);
    sv.orientation = data.data[0].orientation;


    var masterMaze = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1],[1,0,1,1,1,1,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,1],[1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],[1,0,1,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,1,1,0,1],[1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1],[1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],[1,1,1,0,1,1,1,0,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,0,1,0,1,0,1,0,1],[1,1,1,0,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,0,0,1],[1,1,1,0,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1],[1,0,0,0,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1,1,1,0,1,0,0,0,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,1,0,0,0,1],[1,0,1,0,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,0,1,0,1],[1,0,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,1,1,1,0,1,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,1,0,1,0,1],[1,0,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1],[1,0,0,0,0,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,1,0,1,0,1],[1,1,1,1,1,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,0,1,0,1],[1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1],[1,0,1,0,0,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1],[1,0,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1],[1,0,1,1,1,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,0,0,1,0,1],[1,0,1,1,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,0,0,0,0,1],[1,1,1,0,1,1,1,1,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,0,1,0,1,1,1,1,1],[1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1],[1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1],[1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1],[1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1],[1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,1,1,0,0,0,1],[1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,1,1,0,0,0,1],[1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],[1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1],[1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,1],[1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],[1,1,1,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,1],[1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1],[1,1,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1,0,1],[1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1],[1,1,1,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1],[1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],[1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1],[1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1],[1,0,1,1,1,1,1,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,0,0,0,1,1,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,1,0,0,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1],[1,1,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,1,1,1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1],[1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],[1,0,0,0,1,1,1,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1],[1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1],[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],[1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1],[1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,0,0,1,1,1],[1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],[1,0,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1],[1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,0,1,1,1,0,1,1,1],[1,1,1,1,1,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,1,1,1,0,1,0,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,1,1,1],[1,1,1,1,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1],[1,1,1,1,1,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,1,1,1,1,1,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,1,1],[1,1,1,0,1,1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,1,0,1,1,1,0,1,1,1,1,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1],[1,1,1,0,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1],[1,1,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,0,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1],[1,1,1,0,1,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1,1,1,1,1,0,1],[1,1,1,0,1,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,1,1,1,0,1,1,1,0,0,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1],[1,0,1,1,1,1,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,1,0,1,0,0,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,0,1,1,1,1,1],[1,0,0,0,1,1,1,1,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,1,1,1,1,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1,0,1,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1,0,0,0,1,1,1,1,1],[1,0,1,0,1,1,1,1,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,0,1,0,1,1,1,1,1,1,1],[1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,0,1,1,1,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

        var cardboard = false;
        // var cardboard = confirm('Welcome ' + sv.playerName + '! Press "OK" to play on Google Cardboard, and "cancel" to play without it');

        var camera, scene, renderer;
        var effect, controls;
        var element, container;
        var clock = new THREE.Clock();
        var degree = Math.PI / 180;
        var mazeParts = [];
        var payloads = [];

        //Variables//
        var IPD = 0.5;
        var camZ = 490;
        var camX = -490;
        var camY = -2;
        var walkingSpeed = 1;
        var bobbingRate = 0.05;
        var bobbingHeight = 0.1;


        init();
        animate();

        function init() {
          renderer = new THREE.WebGLRenderer({antialias: true});
          element = renderer.domElement;
          container = document.getElementById('maze');
          container.appendChild(element);

          effect = new THREE.StereoEffect(renderer);
          effect.separation = IPD;

          scene = new THREE.Scene();

          camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);

          // camera.rotation.z = 90 * degree;
          scene.add(camera);


          function setOrientationControls(e) {
            if (!e.alpha) {
              return;
            }

            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();

            element.addEventListener('click', fullscreen, false);

            window.removeEventListener('deviceorientation', setOrientationControls, true);
          }
          window.addEventListener('deviceorientation', setOrientationControls, true);

    // TEXTURES //
    var loader = new THREE.TextureLoader();
      var wood = loader.load('resources/textures/bigWood.jpg');
      wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
      wood.repeat.set( .125, .125 );
      var woodMaterial = new THREE.MeshBasicMaterial({ map: wood});

      var cobblestone = loader.load('resources/textures/cobblestone.jpg');
      cobblestone.wrapS = cobblestone.wrapT = THREE.RepeatWrapping;
      cobblestone.repeat.set(100, 100);
      var cobblestoneMaterial = new THREE.MeshBasicMaterial( { map: cobblestone} );

      var floor = loader.load('resources/textures/tile2.jpg');
      floor.wrapS = floor.wrapT = THREE.RepeatWrapping;
      floor.repeat.set(100, 100);
      var floorMaterial = new THREE.MeshBasicMaterial( { map: floor} );

      var stone1 = loader.load('resources/textures/stone1.jpg');
      var stone1Material = new THREE.MeshBasicMaterial({map: stone1});

      var stone2 = loader.load('resources/textures/stone2.jpg');
      var stone2Material = new THREE.MeshBasicMaterial({map: stone2});

      var stone3 = loader.load('resources/textures/stone3.jpg');
      var stone3Material = new THREE.MeshBasicMaterial({map: stone3});

      var stone4 = loader.load('resources/textures/stone4.png');
      var stone4Material = new THREE.MeshBasicMaterial({map: stone4});

      var puzzleTexture = loader.load('resources/textures/waves2.jpg');
      var puzzleMaterial = new THREE.MeshBasicMaterial({map: puzzleTexture});

      var roomWall = loader.load('resources/textures/waves.jpg');
      roomWall.wrapS  = roomWall.wrapT = THREE.repeatWrapping;
      roomWall.repeat.set(1, 3);
      var roomWallMaterial = new THREE.MeshBasicMaterial({map: roomWall});





      var testMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );



    // Geometry //
    var wallGeometry = new THREE.BoxGeometry( 10, 10, 10 );
    var tallWallGeometry = new THREE.BoxGeometry(10, 30, 10);

    var tallWallOffset = 10;


    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight);




    var build = {};
    build.A = function(){


    for (var i = masterMaze.length -1; i >= 0; i--){
    	for(var j = 0; j < masterMaze[i].length; j++){
    		if(masterMaze[i][j] ===1){
          var material;
          if(j <=49 && i <=49){
            material = stone1Material;
          }else if(j <= 49 && i > 49){
            material = stone2Material;
          }else if(j > 49 && i > 49){
            material = stone3Material;
          }else{
            material = stone4Material;
          }
    			var wall = new THREE.Mesh( wallGeometry, material );
    			scene.add( wall );
          mazeParts.push(wall);
    			wall.position.x = j * -10;
    			wall.position.z = (98 - i) * 10;
    		}else if(masterMaze[i][j] ===2){

          var wall = new THREE.Mesh( tallWallGeometry, roomWallMaterial);
    			scene.add( wall );
          mazeParts.push(wall);
    			wall.position.x = j * -10;
    			wall.position.z = (98 - i) * 10;
          wall.position.y = tallWallOffset;
        }

    	}

    }
  }

build.B = function(){


  for (var i = masterMaze.length -1; i >= 0; i--){
    for(var j = 0; j < masterMaze[i].length; j++){
      if(masterMaze[98-i][98-j] ===1){
        var material;
        if(j <=49 && i <=49){
          material = stone1Material;
        }else if(j <= 49 && i > 49){
          material = stone2Material;
        }else if(j > 49 && i > 49){
          material = stone3Material;
        }else{
          material = stone4Material;
        }
        var wall = new THREE.Mesh( wallGeometry, material );
        scene.add( wall );
        mazeParts.push(wall);
        wall.position.x = j * -10;
        wall.position.z = (98 - i) * 10;
      }else if(masterMaze[i][j] ===2){

        var wall = new THREE.Mesh( tallWallGeometry, roomWallMaterial);
        scene.add( wall );
        mazeParts.push(wall);
        wall.position.x = j * -10;
        wall.position.z = (98 - i) * 10;
        wall.position.y = tallWallOffset;
      }

    }

  }
}

build.C = function(){


for (var i = masterMaze.length -1; i >= 0; i--){
  for(var j = 0; j < masterMaze[i].length; j++){
    if(masterMaze[98-i][j] ===1){
      var material;
      if(j <=49 && i <=49){
        material = stone1Material;
      }else if(j <= 49 && i > 49){
        material = stone2Material;
      }else if(j > 49 && i > 49){
        material = stone3Material;
      }else{
        material = stone4Material;
      }
      var wall = new THREE.Mesh( wallGeometry, material );
      scene.add( wall );
      mazeParts.push(wall);
      wall.position.x = i * -10;
      wall.position.z = (98 - j) * 10;
    }else if(masterMaze[i][j] ===2){

      var wall = new THREE.Mesh( tallWallGeometry, roomWallMaterial);
      scene.add( wall );
      mazeParts.push(wall);
      wall.position.x = j * -10;
      wall.position.z = (98 - i) * 10;
      wall.position.y = tallWallOffset;
    }

  }

}
}

build.D = function(){


for (var i = masterMaze.length -1; i >= 0; i--){
  for(var j = 0; j < masterMaze[i].length; j++){
    if(masterMaze[i][98-j] ===1){
      var material;
      if(j <=49 && i <=49){
        material = stone1Material;
      }else if(j <= 49 && i > 49){
        material = stone2Material;
      }else if(j > 49 && i > 49){
        material = stone3Material;
      }else{
        material = stone4Material;
      }
      var wall = new THREE.Mesh( wallGeometry, material );
      scene.add( wall );
      mazeParts.push(wall);
      wall.position.x = i * -10;
      wall.position.z = (98 - j) * 10;
    }else if(masterMaze[i][j] ===2){

      var wall = new THREE.Mesh( tallWallGeometry, roomWallMaterial);
      scene.add( wall );
      mazeParts.push(wall);
      wall.position.x = j * -10;
      wall.position.z = (98 - i) * 10;
      wall.position.y = tallWallOffset;
    }

  }

}
}


  build[sv.orientation]();




  var trunkTexture = loader.load('resources/textures/bark.jpg');
  var trunkMaterial = new THREE.MeshBasicMaterial({map: trunkTexture});
  var glyphWallTexture = loader.load('resources/textures/glyph-blank.jpg');
  var glyphWallMaterial = new THREE.MeshBasicMaterial({map: glyphWallTexture});

  var marbleBlackTexture = loader.load('resources/textures/marble-black.jpg');
  var marbleWhiteTexture = loader.load('resources/textures/marble-white.jpg');
  var marbleBlueTexture = loader.load('resources/textures/marble-blue.jpg');
  var marbleRedTexture = loader.load('resources/textures/marble-orange.jpg');
  var marbleGreenTexture = loader.load('resources/textures/marble-green.jpg');
  var marbleYellowTexture = loader.load('resources/textures/marble-yellow.jpg');
  var marbleLightGreyTexture = loader.load('resources/textures/marble-lightgrey.jpg');
  var marbleDarkGreyTexture = loader.load('resources/textures/marble-darkgrey.jpg');
  var marblePurpleTexture = loader.load('resources/textures/marble-purple.jpg');

  var marbleBlackMaterial = new THREE.MeshBasicMaterial({map: marbleBlackTexture});
  var marbleWhiteMaterial = new THREE.MeshBasicMaterial({map: marbleWhiteTexture});
  var marbleBlueMaterial = new THREE.MeshBasicMaterial({map: marbleBlueTexture});
  var marbleRedMaterial = new THREE.MeshBasicMaterial({map: marbleRedTexture});
  var marbleGreenMaterial = new THREE.MeshBasicMaterial({map: marbleGreenTexture});
  var marbleYellowMaterial = new THREE.MeshBasicMaterial({map: marbleYellowTexture});
  var marbleLightGreyMaterial = new THREE.MeshBasicMaterial({map: marbleLightGreyTexture});
  var marbleDarkGreyMaterial = new THREE.MeshBasicMaterial({map: marbleDarkGreyTexture});
  var marblePurpleMaterial = new THREE.MeshBasicMaterial({map: marblePurpleTexture});





    function buildPuzzle(startI, startJ, puzzleArray, puzzleMaterial, payload, orientation){
      var checkerBoard = false;
      var glyphGeometry;
      var multiplier = 0;
      if(!orientation){
        multiplier = 4;
      }
      var checkerWall = new THREE.BoxGeometry(10,2,10);

      var payloadTexture;
      var branchTexture;
      if(payload === 1){
        payloadTexture = loader.load('resources/textures/neon-green.jpg');
        branchTexture = loader.load('resources/textures/leaves-pine.jpg');
      }else if(payload === 2){
        payloadTexture = loader.load('resources/textures/neon-blue.jpg');
        branchTexture = loader.load('resources/textures/leaves-fall.jpg');
      }else if(payload === 3){
        payloadTexture = loader.load('resources/textures/rainbow.jpg');
        branchTexture = loader.load('resources/textures/leaves-snow.jpg');
      }else{
        payloadTexture = loader.load('resources/textures/scales.jpg');
        branchTexture = loader.load('resources/textures/leaves-green.jpg');
      }
      var payloadMaterial = new THREE.MeshBasicMaterial({map: payloadTexture});
      var branchMaterial = new THREE.MeshBasicMaterial({map: branchTexture});
      var glyphTexture = loader.load('resources/textures/glyph-' + (payload + multiplier) + '.jpg');
      var glyphMaterial = new THREE.MeshBasicMaterial({map: glyphTexture});

      for(var i = 0; i < puzzleArray.length; i++){
        for(var j = 0; j < puzzleArray[i].length; j++){
          if(puzzleArray[i][j] === 1){
            var wall = new THREE.Mesh( wallGeometry, puzzleMaterial );
            scene.add( wall );
            mazeParts.push(wall);
            wall.position.x = ((j + startJ) * -10);
            wall.position.z = (98 - (i + startI)) * 10;
          }else if(puzzleArray[i][j] === 2){
            var wall = new THREE.Mesh( wallGeometry, payloadMaterial );
            payloads.push(wall);
            scene.add( wall );
            mazeParts.push(wall);
            wall.position.x = ((j + startJ) * -10);
            wall.position.z = (98 - (i + startI)) * 10;
            wall.position.y = 10;
          } else if(puzzleArray[i][j] === 3){
            for(var k = 0; k < 3; k++){
              var branch = new THREE.Mesh(wallGeometry, branchMaterial);
              scene.add( branch );
              branch.position.x = ((j + startJ) * -10);
              branch.position.z = (98 - (i + startI)) * 10;
              branch.position.y = (k * 10) + 20;
            }


          } else if(puzzleArray[i][j] === 5){
            for(var k = 0; k < 3; k++){
              var branch = new THREE.Mesh(wallGeometry, branchMaterial);
              scene.add( branch );
              branch.position.x = ((j + startJ) * -10);
              branch.position.z = (98 - (i + startI)) * 10;
              branch.position.y = (k * 10) + 30;
            }
          } else if(puzzleArray[i][j] === 4){
            for(var k = 0; k < 2; k++){
              var trunk = new THREE.Mesh(wallGeometry, trunkMaterial);
              scene.add( trunk );
              if(k === 0){
                mazeParts.push(trunk);
              }
              trunk.position.x = ((j + startJ) * -10);
              trunk.position.z = (98 - (i + startI)) * 10;
              trunk.position.y = (k * 10);
            }
          } else if(puzzleArray[i][j] === 6){
            for(var k = 0; k < 3; k++){
              var trunk = new THREE.Mesh(wallGeometry, trunkMaterial);
              scene.add( trunk );
              if(k === 0){
                mazeParts.push(trunk);
              }
              trunk.position.x = ((j + startJ) * -10);
              trunk.position.z = (98 - (i + startI)) * 10;
              trunk.position.y = (k * 10);
            }
          }else if(puzzleArray[i][j] === 7){
            console.log(orientation);
            if(orientation){
              glyphGeometry = new THREE.BoxGeometry( 10, 10, 1 );
            }else{
              glyphGeometry = new THREE.BoxGeometry( 1, 10, 10 );
            }
            // glyphGeometry = new THREE.BoxGeometry( 10, 10, 10 );
            for(var k = 0; k < 3; k++){

              var wall = new THREE.Mesh(glyphGeometry, glyphWallMaterial);
              scene.add( wall );
              if(k === 0){
                mazeParts.push(wall);
              }
              wall.position.x = ((j + startJ) * -10);
              wall.position.z = (98 - (i + startI)) * 10;
              wall.position.y = (k * 10);
            }

          }else if(puzzleArray[i][j] === 8){
            console.log(orientation);
            if(orientation){
              glyphGeometry = new THREE.BoxGeometry( 10, 10, 1 );
            }else{
              glyphGeometry = new THREE.BoxGeometry( 1, 10, 10 );
            }
            // glyphGeometry = new THREE.BoxGeometry( 10, 10, 10 );
            for(var k =0; k < 3; k++){
              if(k !== 1){
              var wall = new THREE.Mesh(glyphGeometry, glyphWallMaterial);
            }else{
              var wall = new THREE.Mesh(glyphGeometry, glyphMaterial);
            }
              scene.add( wall );
              if(k === 0){
                mazeParts.push(wall);
              }
              wall.position.x = ((j + startJ) * -10);
              wall.position.z = (98 - (i + startI)) * 10;
              wall.position.y = (k * 10);
            }
          }else if(typeof puzzleArray[i][j] === 'string'){
            if(puzzleArray[i][j] === 'B'){
              var wall = new THREE.Mesh(checkerWall, marbleBlackMaterial);
            }else if(puzzleArray[i][j] === 'W'){
              var wall = new THREE.Mesh(checkerWall, marbleWhiteMaterial);
            }else if(puzzleArray[i][j] === 'C'){
              var wall = new THREE.Mesh(checkerWall, marbleBlueMaterial);
            }else if(puzzleArray[i][j] === 'R'){
              var wall = new THREE.Mesh(checkerWall, marbleRedMaterial);
            }else if(puzzleArray[i][j] === 'G'){
              var wall = new THREE.Mesh(checkerWall, marbleGreenMaterial);
            }else if(puzzleArray[i][j] === 'Y'){
              var wall = new THREE.Mesh(checkerWall, marbleYellowMaterial);
            }else if(puzzleArray[i][j] === 'L'){
              var wall = new THREE.Mesh(checkerWall, marbleLightGreyMaterial);
            }else if(puzzleArray[i][j] === 'D'){
              var wall = new THREE.Mesh(checkerWall, marbleDarkGreyMaterial);
            }else if(puzzleArray[i][j] === 'P'){
              var wall = new THREE.Mesh(checkerWall, marblePurpleMaterial);
            }
            scene.add(wall);
            wall.position.x = ((j + startJ) * -10);
            wall.position.z = (98 - (i + startI)) * 10;
            wall.position.y = 30;
            checkerBoard = true;
          }
        }
      }
      if(checkerBoard){
      var middleCheckerArray = [
        ['D','L','L','L','L','L','D'],
        ['L','R','Y', 0 ,'R', 0 ,'L'],
        ['L','G','D','L','D','G','L'],
        ['L','Y','L','D','L','G','L'],
        ['L','R','D','L','D','Y','L'],
        ['L', 0 ,'C', 0 ,'R','C','L'],
        ['D','L','L','L','L','L','D']
      ];
      for(var i = 0; i < middleCheckerArray.length; i++){
        for(var j = 0; j< middleCheckerArray[i].length; j++){
          if(middleCheckerArray[i][j] !== 0){
          if(middleCheckerArray[i][j] === 'B'){
            var wall = new THREE.Mesh(checkerWall, marbleBlackMaterial);
          }else if(middleCheckerArray[i][j] === 'W'){
            var wall = new THREE.Mesh(checkerWall, marbleWhiteMaterial);
          }else if(middleCheckerArray[i][j] === 'C'){
            var wall = new THREE.Mesh(checkerWall, marbleBlueMaterial);
          }else if(middleCheckerArray[i][j] === 'R'){
            var wall = new THREE.Mesh(checkerWall, marbleRedMaterial);
          }else if(middleCheckerArray[i][j] === 'G'){
            var wall = new THREE.Mesh(checkerWall, marbleGreenMaterial);
          }else if(middleCheckerArray[i][j] === 'Y'){
            var wall = new THREE.Mesh(checkerWall, marbleYellowMaterial);
          }else if(middleCheckerArray[i][j] === 'L'){
            var wall = new THREE.Mesh(checkerWall, marbleLightGreyMaterial);
          }else if(middleCheckerArray[i][j] === 'D'){
            var wall = new THREE.Mesh(checkerWall, marbleDarkGreyMaterial);
          }else if(middleCheckerArray[i][j] === 'P'){
            var wall = new THREE.Mesh(checkerWall, marblePurpleMaterial);
          }
          scene.add(wall);
          wall.position.y = 40;
          wall.position.x = ((j + startJ + 5) * -10);
          wall.position.z = (98 - (i + startI + 5)) * 10;


        }

        }
      }

      var topCheckerArray = [
        ['D','L','L','L','L','L','D'],
        ['L','R','Y','G','C','Y','L'],
        ['L','C','D','L','D','G','L'],
        ['L','Y','L','D','L','R','L'],
        ['L','G','D','L','D','Y','L'],
        ['L','C','R','C','R','G','L'],
        ['D','L','L','L','L','L','D']
      ];

      for(var i = 0; i < topCheckerArray.length; i++){
        for(var j = 0; j< topCheckerArray[i].length; j++){
          if(topCheckerArray[i][j] !== 0){
          if(topCheckerArray[i][j] === 'B'){
            var wall = new THREE.Mesh(checkerWall, marbleBlackMaterial);
          }else if(topCheckerArray[i][j] === 'W'){
            var wall = new THREE.Mesh(checkerWall, marbleWhiteMaterial);
          }else if(topCheckerArray[i][j] === 'C'){
            var wall = new THREE.Mesh(checkerWall, marbleBlueMaterial);
          }else if(topCheckerArray[i][j] === 'R'){
            var wall = new THREE.Mesh(checkerWall, marbleRedMaterial);
          }else if(topCheckerArray[i][j] === 'G'){
            var wall = new THREE.Mesh(checkerWall, marbleGreenMaterial);
          }else if(topCheckerArray[i][j] === 'Y'){
            var wall = new THREE.Mesh(checkerWall, marbleYellowMaterial);
          }else if(topCheckerArray[i][j] === 'L'){
            var wall = new THREE.Mesh(checkerWall, marbleLightGreyMaterial);
          }else if(topCheckerArray[i][j] === 'D'){
            var wall = new THREE.Mesh(checkerWall, marbleDarkGreyMaterial);
          }else if(topCheckerArray[i][j] === 'P'){
            var wall = new THREE.Mesh(checkerWall, marblePurpleMaterial);
          }

          scene.add(wall);

          wall.position.y = 50;
          if(payload === 1){
          wall.position.x = ((j + startJ + 5) * -10);
          wall.position.z = (98 - (i + startI + 5)) * 10;
        }else if(payload === 2){
          wall.position.x = ((startJ + 11 -j) * -10);
          wall.position.z = (98 - (startI + 11-i)) * 10;
        }else if(payload === 3){
          wall.position.x = ((startJ + 11 -i) * -10);
          wall.position.z = (98 - (startI +j + 5)) * 10;
        }else if(payload === 4){
          wall.position.x = ((i + startJ + 5) * -10);
          wall.position.z = (98 - (startI + 11 - j)) * 10;
        }
        }

        }
      }
      checkerBoard = false;
    }
    }
    buildPuzzle(11, 11, sv.puzzle1, puzzleMaterial, sv.puzzle1Payload, sv.puzzle1Orientation);
    buildPuzzle(11, 71, sv.puzzle2, puzzleMaterial, sv.puzzle2Payload, sv.puzzle2Orientation);
    buildPuzzle(71, 11, sv.puzzle3, puzzleMaterial, sv.puzzle3Payload, sv.puzzle3Orientation);
    buildPuzzle(71, 71, sv.puzzle4, puzzleMaterial, sv.puzzle4Payload, sv.puzzle4Orientation);





    var planeGeometry = new THREE.PlaneGeometry( 1000, 1000);
    var plane = new THREE.Mesh( planeGeometry, floorMaterial );

    scene.add( plane );
    plane.position.z = 490;
    plane.position.x = -490;
    plane.position.y = -5;
    plane.rotation.x = -90 * degree;


    camera.position.z = camZ;
    camera.position.x = camX;
    camera.position.y = camY;

    // camera.position.z = 820;
    // camera.position.x = -210;
    //upper left



    // -----------------------------------DEV CAM-------------------------------------------------------------
    camera.position.z = 490;
    camera.position.x = -490;
    camera.position.y = 500;
    camera.rotation.x = -90 * degree;
    camera.rotation.z = 180 * degree;
    // -----------------------------------DEV CAM-------------------------------------------------------------

          window.addEventListener('resize', resize, false);
          setTimeout(resize, 1);
          element.addEventListener('touchstart', mouseDown);
          element.addEventListener('touchend', mouseUp);
          var intervalId;
          function mouseDown(){
            intervalId = setInterval(move, 16);
          }
          function mouseUp(){
            clearInterval(intervalId);
          }
          var up = false;
          var vectX = 1;
          var vectZ = -1;
          function move(){
            var wall = false;
            var vectro = new THREE.Vector3(vectX, 0, vectZ);
            var ray = new THREE.Raycaster(camera.position, vectro);
            var collisionResults = ray.intersectObjects(mazeParts);
            if(collisionResults.length > 0 && collisionResults[0].distance < 1){
              wall = true;
            }

            var alpha = camera.rotation.y * 180 / Math.PI;

          if(alpha < -90 && alpha >= -180){
            alpha = alpha + 180;
            vectZ = ((90 - alpha) / 90);
            vectX = (alpha / 90);

          }else if(alpha <0 && alpha >= -90){
            alpha = alpha + 90;
            vectZ = (alpha / 90) * -1;
            vectX = ((90 - alpha) / 90);

          }else if(alpha < 90 && alpha >= 0){
            vectZ = ((90 - alpha) / 90) * -1;
            vectX = (alpha / 90)* -1;

          }else if (alpha < 180 && alpha >= 90){
            alpha = alpha - 90;
            vectZ = (alpha / 90);
            vectX = ((90 - alpha) / 90) * -1;
          }
          if(!wall){
          camera.position.z += vectZ * walkingSpeed;
          camera.position.x += vectX * walkingSpeed;
        }
          if(camera.position.y > camY + bobbingHeight){
            up = !up;
          }else if(camera.position.y < camY){
            up = !up;
          }
          if(!up){
            camera.position.y += bobbingRate;
          }else{
            camera.position.y -= bobbingRate;
          }
        }
        }

        function resize() {
          var width = container.offsetWidth;
          var height = container.offsetHeight;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          renderer.setSize(width, height);
          effect.setSize(width, height);
        }

        function update(dt) {
          resize();

          camera.updateProjectionMatrix();
          if(controls){
          controls.update(dt);
        }
        }

        function render(dt) {
          payloads.forEach(function(payload){
            payload.rotation.y += 0.01;
          })
          if(cardboard){
            effect.render(scene, camera);
          }else{
            renderer.render(scene, camera);
          }
        }

        function animate(t) {
          requestAnimationFrame(animate);

          update(clock.getDelta());
          render(clock.getDelta());
        }

        function fullscreen() {
          if (container.requestFullscreen) {
            container.requestFullscreen();
          } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
          } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
          } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
          }
        }

  })
  .catch(function(err){
    console.log(err);
  })
}])
