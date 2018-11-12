// Global variables
var canvas;
var ctx;

var squareSize;
var boardSize = 8;


window.onload = init;

function init()  {
    canvas = document.getElementById("chess-board");
    canvas.width = canvas.height = 1000;
    ctx = canvas.getContext("2d");
    
    squareSize = canvas.width / boardSize;

    drawBoard();
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(parseInt(x), parseInt(y), parseInt(width), parseInt(height));
}

function drawBoard() {
    for(let y = 0; y < boardSize; y++) {
        for(let x = 0; x < boardSize; x++) {
            drawRect(x * squareSize, y * squareSize, squareSize, squareSize, (x + y) % 2 === 0 ? "#ddd" : "#333");
        }
    }
}