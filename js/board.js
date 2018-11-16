class Board {
    constructor(canvas, size) {
        this.canvas = canvas;
        this.size = size;
        this.squareSize = this.canvas.width / size;
        this.pieces = this.createPieces();
        this.isMouseDown = false;
        this.selectedPiece = null;
        this.selectedPieceOrigin = null;

        this.addEventListeners();
    }

    draw() {
        for(let y = 0; y < this.size; y++) {
            for(let x = 0; x < this.size; x++) {
                drawRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize, (x + y) % 2 === 0 ? whiteTheme : blackTheme);
            }
        }

        for(let i = 0; i < this.pieces.length; i++) {
            if(!this.selectedPiece || this.pieces[i] !== this.selectedPiece) {
                this.pieces[i].draw();
            }
        }

        if(this.selectedPiece) {
            this.selectedPiece.draw();
        }
    }

    createPieces() {
        return [
            new Rook(this, this.squareToPos(1, 1), "white"),
            new Knight(this, this.squareToPos(2, 1), "white"),
            new Bishop(this, this.squareToPos(3, 1), "white"),
            new Queen(this, this.squareToPos(4, 1), "white"),
            new King(this, this.squareToPos(5, 1), "white"),
            new Bishop(this, this.squareToPos(6, 1), "white"),
            new Knight(this, this.squareToPos(7, 1), "white"),
            new Rook(this, this.squareToPos(8, 1), "white"),
            new Pawn(this, this.squareToPos(1, 2), "white"),
            new Pawn(this, this.squareToPos(2, 2), "white"),
            new Pawn(this, this.squareToPos(3, 2), "white"),
            new Pawn(this, this.squareToPos(4, 2), "white"),
            new Pawn(this, this.squareToPos(5, 2), "white"),
            new Pawn(this, this.squareToPos(6, 2), "white"),
            new Pawn(this, this.squareToPos(7, 2), "white"),
            new Pawn(this, this.squareToPos(8, 2), "white"),

            new Rook(this, this.squareToPos(1, 8), "black"),
            new Knight(this, this.squareToPos(2, 8), "black"),
            new Bishop(this, this.squareToPos(3, 8), "black"),
            new Queen(this, this.squareToPos(4, 8), "black"),
            new King(this, this.squareToPos(5, 8), "black"),
            new Bishop(this, this.squareToPos(6, 8), "black"),
            new Knight(this, this.squareToPos(7, 8), "black"),
            new Rook(this, this.squareToPos(8, 8), "black"),
            new Pawn(this, this.squareToPos(1, 7), "black"),
            new Pawn(this, this.squareToPos(2, 7), "black"),
            new Pawn(this, this.squareToPos(3, 7), "black"),
            new Pawn(this, this.squareToPos(4, 7), "black"),
            new Pawn(this, this.squareToPos(5, 7), "black"),
            new Pawn(this, this.squareToPos(6, 7), "black"),
            new Pawn(this, this.squareToPos(7, 7), "black"),
            new Pawn(this, this.squareToPos(8, 7), "black")
        ];
    }

    mouseDown(point) {
        if(this.isMouseDown) {
            return;
        }

        for(let i = 0; i < this.pieces.length; i++) {
            if(this.onSquare(point, rect(this.pieces[i].position.x, this.pieces[i].position.y, this.squareSize, this.squareSize))) {
                this.selectedPiece = this.pieces[i];
                this.selectedPieceOrigin = JSON.parse(JSON.stringify(this.selectedPiece.position));
                this.isMouseDown = true;

                return;
            }
        }
    }

    mouseUp(point) {
        if(!this.isMouseDown) {
            return;
        }

        let square = pos(Math.floor(point.x / this.squareSize) * this.squareSize, Math.floor(point.y / this.squareSize) * this.squareSize);
        this.selectedPiece.position = square;
        
        for(let i = 0; i < this.pieces.length; i++) {
            if(JSON.stringify(this.pieces[i].position) == JSON.stringify(square) && this.pieces[i] != this.selectedPiece) {

                if(this.pieces[i].color == this.selectedPiece.color) {
                    console.log("same");
                    console.log(this.selectedPieceOrigin, this.selectedPiece.position);
                    this.selectedPiece.position = this.selectedPieceOrigin;
                    console.log(this.selectedPiece.position);
                } else {
                    this.pieces.splice(i, 1);
                    break;
                }
            }
        }

        this.selectedPiece = null;

        this.isMouseDown = false;
    }

    mouseMove(point) {
        if(this.isMouseDown) {
            this.selectedPiece.position = pos(point.x - this.squareSize / 2, point.y - this.squareSize / 2);
        }
    }

    addEventListeners() {
        let thisBoard = this; // TODO: Better solution?

        this.canvas.addEventListener("mousedown", function(event) {
            thisBoard.mouseDown(getMousePos(this, event));
        });

        this.canvas.addEventListener("mouseup", function(event) {
            thisBoard.mouseUp(getMousePos(this, event));
        });

        this.canvas.addEventListener("mousemove", function(event) {
            thisBoard.mouseMove(getMousePos(this, event));
        });
    }

    onSquare(point, box) {
        return point.x >= box.x && point.x < box.x + box.width && point.y >= box.y && point.y < box.y + box.height;
    }

    squareToPos(x, y) {
        return pos((x - 1) * this.squareSize, (8 - y) * this.squareSize);
    }
}