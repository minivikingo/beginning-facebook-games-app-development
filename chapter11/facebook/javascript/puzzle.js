var canvas;
var context;

var image;

var solved;

var music;

var gameSize;
var gridSize;

var tileWidth;
var tileHeight;

var tileSize;
var boardParts = {};

var score = {};

var clickLoc = {
  x: 0,
  y: 0
};

var emptyLoc = {
  x: 0,
  y: 0
};

var start, stopped, totalTime;

function startTimer() {
  start = new Date().getTime();
}

function stopTimer() {
  stopped = new Date().getTime();
}

function calcTime() {
  totalTime = Math.abs(stopped - start);
}

function formatTime() {
  return totalTime / 1000;
}

function setImage(imagePath) {
  image = new Image();
  image.src = imagePath;
  image.addEventListener('load', drawTiles, false);
}

function addEvents(canvas) {
  canvas.onmousemove = function(event) {
    clickLoc.x = Math.floor((event.pageX - this.offsetLeft) / tileWidth);
    clickLoc.y = Math.floor((event.pageY - this.offsetTop) / tileHeight);
  };

  canvas.onclick = function() {
    if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) === 1) {
      slideTile(emptyLoc, clickLoc);
      drawTiles();
    }
    if (solved) {
      stopTimer();
      calcTime();
      setTimeout(function() {
        alert("You solved it! And it only took you " + formatTime() + " seconds.");
        score.level = gridSize;
        score.completion_time = totalTime;
        $.ajax({
          url: 'score.php',
          data: score,
          type: 'POST'
        });
      }, 500);
    }
  };
}

function setBoard() {
  boardParts = new Array(gridSize);
  for (var i = 0; i < gridSize; ++i) {
    boardParts[i] = new Array(gridSize);
    for (var j = 0; j < gridSize; ++j) {
      boardParts[i][j] = {
        x: (gridSize - 1) - i,
        y: (gridSize - 1) - j
      };
    }
  }
  emptyLoc.x = boardParts[gridSize - 1][gridSize - 1].x;
  emptyLoc.y = boardParts[gridSize - 1][gridSize - 1].y;
  solved = false;
}

function drawTiles() {
  context.clearRect ( 0 , 0 , gameSize , gameSize );
  for (var i = 0; i < gridSize; ++i) {
    for (var j = 0; j < gridSize; ++j) {
      var x = boardParts[i][j].x;
      var y = boardParts[i][j].y;
      if(i !== emptyLoc.x || j !== emptyLoc.y || solved === true) {

        context.drawImage(image, x * tileWidth, y * tileHeight, tileWidth, tileHeight,
                          i * tileWidth, j * tileHeight, tileWidth, tileHeight);
      }
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
  if (!solved) {
    boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
    boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
    boardParts[fromLoc.x][fromLoc.y].x = gridSize - 1;
    boardParts[fromLoc.x][fromLoc.y].y = gridSize - 1;
    toLoc.x = fromLoc.x;
    toLoc.y = fromLoc.y;
    checkSolved();
  }
}

function checkSolved() {
  var flag = true;
  for (var i = 0; i < gridSize; ++i) {
    for (var j = 0; j < gridSize; ++j) {
      if (boardParts[i][j].x !== i || boardParts[i][j].y !== j) {
        flag = false;
      }
    }
  }
  solved = flag;
}

function init(canvasId, imagePath, gridCount) {
  canvas = document.getElementById(canvasId);
  context = canvas.getContext('2d');

  gameSize = canvas.width;

  gridWidth = canvas.width;
  gridHeight = canvas.height;

  gridSize = gridCount;

  tileSize = gameSize / gridSize;

  tileWidth = Math.floor(gridWidth / gridSize);
  tileHeight = Math.floor(gridHeight / gridSize);


  setImage(imagePath);
  addEvents(canvas);

  solved = false;

  setBoard();
}


function playMusic(musicPath, filename) {
  music = new Audio();
  var soundStub = musicPath + "/" + filename;
  
  if(music.canPlayType('audio/ogg')) {
    music = new Audio(soundStub + '.ogg');
  } else if(music.canPlayType('audio/mp3')) {
    music = new Audio(soundStub + '.mp3');
  }

  music.load();
  music.play();

}

//playMusic('sounds', 'DST-Rialto');

/**
 * document.getElementById('pause').onclick = (function(event) {
 * music.pause();
 * });
 */




