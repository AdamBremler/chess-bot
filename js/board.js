class Board {
    constructor(canvasSize, size) {
        this.size = size;
        this.squareSize = canvasSize / size;
    }

    draw() {
        for(let y = 0; y < this.size; y++) {
            for(let x = 0; x < this.size; x++) {
                drawRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize, (x + y) % 2 === 0 ? whiteTheme : blackTheme);
            }
        }
    }
}