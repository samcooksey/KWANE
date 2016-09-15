'use strict';
function buildMaze(ExtrusionHeight, mazeMaterial, partArray, positionArray, scale, floorWidth, floorMaterial){
  var degree = Math.PI / 180;
  var extrusionSettings = {
        bevelEnabled: false,
        amount: ExtrusionHeight,
        material:0,
        extrudeMaterial : 1
  };
  var maze = {};
  maze.parts = [];
  maze.points = [];
  for(var i = 0; i < partArray.length; i++){
    var part = partArray[i];
    var points = maze.points[i] = [];
    for(var j = 0; j < part.length; j++){
      points.push(new THREE.Vector2(part[j][0] * scale, part[j][1] * scale));
    }
    var shape = new THREE.Shape(points);
    var geometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);
    var materialArray = [mazeMaterial, mazeMaterial];
    var wallMaterial = new THREE.MeshFaceMaterial(materialArray);
    var finalPart = new THREE.Mesh(geometry, wallMaterial);
    finalPart.position.set(positionArray[0], positionArray[1], positionArray[2]);
    finalPart.rotation.x = -90 * degree;
    console.log(finalPart);
    console.log(maze.parts);
    maze.parts.push(finalPart);
    // console.log(maze);

  }
  var planeGeometry = new THREE.PlaneGeometry(floorWidth, floorWidth);
  var plane = new THREE.Mesh(planeGeometry, floorMaterial);
  plane.rotation.x = -90 * degree;
  maze.parts.push(plane);
  return maze
}
