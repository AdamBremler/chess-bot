// Global variables
var canvas;
var ctx;
var canvasSize = 1000;

const blackTheme = "#333";
const whiteTheme = "#ddd";
var board;


window.onload = init;

function init()  {
    canvas = document.getElementById("chess-board");
    canvas.width = canvas.height = canvasSize;
    ctx = canvas.getContext("2d");

    board = new Board(canvasSize, 8);

    board.draw();
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(parseInt(x), parseInt(y), parseInt(width), parseInt(height));
}