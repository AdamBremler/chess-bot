// Global variables
var updateTimer;
var updateSpeed = 10;

var canvas;
var ctx;
var canvasSize = 1000;

var advantageDisplay;

const blackTheme = "#444";
const whiteTheme = "#ddd";
var board;

const DIRECTIONS = [pos(0, -1), pos(1, -1), pos(1, 0), pos(1, 1), pos(0, 1), pos(-1, 1), pos(-1, 0), pos(-1, -1)];
const STRAIGHT_DIRECTIONS = [pos(0, -1), pos(1, 0), pos(0, 1), pos(-1, 0)];
const DIAGONAL_DIRECTIONS = [pos(1, -1), pos(1, 1), pos(-1, 1), pos(-1, -1)];


window.onload = init;

function init()  {
    canvas = document.getElementById("chess-board");
    canvas.width = canvas.height = canvasSize;
    ctx = canvas.getContext("2d");

    advantageDisplay = document.querySelector("#advantage-display");

    board = new Board(false, canvas);

    updateTimer = setInterval(update, updateSpeed);
}

function update() {
    board.draw();
    advantageDisplay.innerHTML = `${board.advantage >= 0 ? "+" : ""}${board.advantage.toFixed(1)}`;
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function drawImage(image, x, y, width, height) {
    ctx.drawImage(image, Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function getImage(file) {
    var image = new Image();
    image.src = "img/" + file;

    return image;
}

function pos(x, y) {
    return { x, y };
}

function box(x, y, width, height) {
    return { x, y, width, height };
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

function spliceByValue(array, value) {
    array.splice(array.indexOf(value), 1);
}

function sortWithIndices(array, descending = false) {
    let toSort = array.concat();

    for(let i = 0; i < toSort.length; i++) {
        toSort[i] = [toSort[i], i];
    }

    toSort.sort(function(left, right) {
        return left[0] < right[0] ? -1 : 1;
    });

    toSort.sortIndices = [];

    for(let j = 0; j < toSort.length; j++) {
        toSort.sortIndices.push(toSort[j][1]);
        toSort[j] = toSort[j][0];
    }

    if(descending) {
        return toSort.sortIndices.reverse();
    }

    else {
        return toSort.sortIndices;
    }
}