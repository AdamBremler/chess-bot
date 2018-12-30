class Board {
    constructor(canvas, size) {
        this.canvas = canvas;
        this.size = size;
        this.squareSize = this.canvas.width / size;
        this.pieces = this.createPieces();
        this.isMouseDown = false;
        this.selectedPiece = null;
        //this.selectedPieceOrigin = null;

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
            new Rook(this, this.squarePointsToPos(1, 1), "white"),
            new Knight(this, this.squarePointsToPos(2, 1), "white"),
            new Bishop(this, this.squarePointsToPos(3, 1), "white"),
            new Queen(this, this.squarePointsToPos(4, 1), "white"),
            new King(this, this.squarePointsToPos(5, 1), "white"),
            new Bishop(this, this.squarePointsToPos(6, 1), "white"),
            new Knight(this, this.squarePointsToPos(7, 1), "white"),
            new Rook(this, this.squarePointsToPos(8, 1), "white"),
            new Pawn(this, this.squarePointsToPos(1, 2), "white"),
            new Pawn(this, this.squarePointsToPos(2, 2), "white"),
            new Pawn(this, this.squarePointsToPos(3, 2), "white"),
            new Pawn(this, this.squarePointsToPos(4, 2), "white"),
            new Pawn(this, this.squarePointsToPos(5, 2), "white"),
            new Pawn(this, this.squarePointsToPos(6, 2), "white"),
            new Pawn(this, this.squarePointsToPos(7, 2), "white"),
            new Pawn(this, this.squarePointsToPos(8, 2), "white"),

            new Rook(this, this.squarePointsToPos(1, 8), "black"),
            new Knight(this, this.squarePointsToPos(2, 8), "black"),
            new Bishop(this, this.squarePointsToPos(3, 8), "black"),
            new Queen(this, this.squarePointsToPos(4, 8), "black"),
            new King(this, this.squarePointsToPos(5, 8), "black"),
            new Bishop(this, this.squarePointsToPos(6, 8), "black"),
            new Knight(this, this.squarePointsToPos(7, 8), "black"),
            new Rook(this, this.squarePointsToPos(8, 8), "black"),
            new Pawn(this, this.squarePointsToPos(1, 7), "black"),
            new Pawn(this, this.squarePointsToPos(2, 7), "black"),
            new Pawn(this, this.squarePointsToPos(3, 7), "black"),
            new Pawn(this, this.squarePointsToPos(4, 7), "black"),
            new Pawn(this, this.squarePointsToPos(5, 7), "black"),
            new Pawn(this, this.squarePointsToPos(6, 7), "black"),
            new Pawn(this, this.squarePointsToPos(7, 7), "black"),
            new Pawn(this, this.squarePointsToPos(8, 7), "black")
        ];
    }

    mouseDown(point) {
        if(this.isMouseDown) {
            return;
        }

        for(let i = 0; i < this.pieces.length; i++) {
            if(this.onSquare(point, rect(this.pieces[i].position.x, this.pieces[i].position.y, this.squareSize, this.squareSize))) {
                this.selectedPiece = this.pieces[i];
                //this.selectedPieceOrigin = JSON.parse(JSON.stringify(this.selectedPiece.position)); Replaced by piece.currentSquare
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
        /* let square = pos(point.x, point.y); */
        let move = new Move(this, this.selectedPiece, this.squareToPos(this.selectedPiece.currentSquare), square);

        // If move is allowed
        let t1 = performance.now();
        if(this.selectedPiece.moveAllowed(move)) {
            this.move(move);
            //this.selectedPiece.position = square;

            /* for(let i = 0; i < this.pieces.length; i++) {
                if(JSON.stringify(this.pieces[i].position) == JSON.stringify(square) && this.pieces[i] != this.selectedPiece) {
                    if(this.pieces[i].color == this.selectedPiece.color) {
                        this.selectedPiece.position = this.selectedPieceOrigin;
                    } else {
                        this.pieces.splice(i, 1);
                        break;
                    }
                }
            } */

            this.selectedPiece.addMove(move);

            console.log("moved");
        }
        
        // If move is not allowed
        else {
            this.selectedPiece.position = this.squareToPos(this.selectedPiece.currentSquare);
        }

        console.log(`Performance time: ${performance.now() - t1}`);
            
        this.selectedPiece = null;

        this.isMouseDown = false;
    }

    move(move) {
        if(move.targetOccupied) {
            this.removePiece(move.targetPiece);
        }
    }

    mouseMove(point) {
        if(this.isMouseDown) {
            this.selectedPiece.position = pos(point.x - this.squareSize / 2, point.y - this.squareSize / 2);
        }
    }

    addEventListeners() {
        this.canvas.addEventListener("mousedown", event => {
            this.mouseDown(getMousePos(this.canvas, event));
        });

        this.canvas.addEventListener("mouseup", event => {
            this.mouseUp(getMousePos(this.canvas, event));
        });

        this.canvas.addEventListener("mousemove", event => {
            this.mouseMove(getMousePos(this.canvas, event));
        });
    }

    onSquare(point, box) {
        return point.x >= box.x && point.x < box.x + box.width && point.y >= box.y && point.y < box.y + box.height;
    }

    squareToPos(square) {
        return pos((square.x - 1) * this.squareSize, (8 - square.y) * this.squareSize);
    }

    squarePointsToPos(x, y) {
        return this.squareToPos({ x, y });
    }

    posToSquare(position) {
        let roundPos = this.posToRoundPos(position);
        return pos((roundPos.x - (roundPos.x % this.squareSize)) / this.squareSize + 1, 8 - (roundPos.y - (roundPos.y % this.squareSize)) / this.squareSize);
    }

    posToRoundPos(position) {
        return pos(Math.floor(position.x / this.squareSize) * this.squareSize, Math.floor(position.y / this.squareSize) * this.squareSize);
    }

    getDistance(pos1, pos2) {
        return Math.max(Math.abs(pos1.x / this.squareSize - pos2.x / this.squareSize), Math.abs(pos1.y / this.squareSize - pos2.y / this.squareSize));
    }

    jsonCompare(s1, s2) {
        return JSON.stringify(s1) === JSON.stringify(s2);
    }

    // TODO: better comparison with boxes
    squareOccupied(square) {
        for(let i = 0; i < this.pieces.length; i++) {
            //if(this.jsonCompare(square, this.posToSquare(this.pieces[i].position)) && this.pieces[i] !== excludedPiece) {
            if(this.jsonCompare(square, this.pieces[i].currentSquare)) {
                return this.pieces[i];
            }
        }

        return false;
    }

    removePiece(piece) {
        this.pieces.splice(this.pieces.indexOf(piece), 1);
    }

    squareEquals(s1, s2) {
        return s1.x === s2.x && s1.y === s2.y;
    }

    // Color filter is optional
    getPieces(type, color = false) {
        let typePieces = [];

        for(let i = 0; i < this.pieces.length; i++) {
            if(this.pieces[i].isType(type) && (color === false || this.pieces[i].color === color)) {
                typePieces.push(this.pieces[i]);
            }
        }

        return typePieces;
    }
}