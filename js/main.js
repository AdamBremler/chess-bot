// Global variables
var updateTimer;
var updateSpeed = 10;

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

    board = new Board(canvas, 8);

    updateTimer = setInterval(update, updateSpeed);
}

function update() {
    board.draw();
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(parseInt(x), parseInt(y), parseInt(width), parseInt(height));
}

function drawImage(image, x, y, width, height) {
    ctx.drawImage(image, x, y, width, height);
}

function getImage(file) {
    var image = new Image();
    image.src = "img/" + file;

    return image;
}

function pos(x, y) {
    return { x, y };
}

function rect(x, y, width, height) {
    return { x, y, width, height };
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}