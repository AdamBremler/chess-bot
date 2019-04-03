class Board {
    constructor(testBoard = true, canvas = null, pieces = [], turn = "white", playerColor = "white", size = 8) {
        
        if(!testBoard) {
            this.canvas = canvas;
            this.squareSize = this.canvas.width / size;
            this.isMouseDown = false;
            this.selectedPiece = null;
            this.playerColor = playerColor;
            this.pieces = this.createPieces();
            this.addEventListeners();
        }

        else {
            this.squareSize = 1000 / size;

            this.pieces = [];

            for(let i = 0; i < pieces.length; i++) {
                let piece = pieces[i];
                let position = this.squareToPos(piece.currentSquare);

                let pieceCopy;

                if(piece instanceof King) {
                    pieceCopy = new King(this, position, piece.color);
                }

                if(piece instanceof Queen) {
                    pieceCopy = new Queen(this, position, piece.color);
                }

                if(piece instanceof Bishop) {
                    pieceCopy = new Bishop(this, position, piece.color);
                }

                if(piece instanceof Knight) {
                    pieceCopy = new Knight(this, position, piece.color);
                }

                if(piece instanceof Rook) {
                    pieceCopy = new Rook(this, position, piece.color);
                }

                if(piece instanceof Pawn) {
                    pieceCopy = new Pawn(this, position, piece.color);
                }

                this.pieces.push(pieceCopy);
            }
        }

        this.size = size;
        this.boardSize = size * this.squareSize;
        this.turn = turn;
        this.whiteCheck = false;
        this.blackCheck = false;
        this.moves = [];

        this.advantage = this.getEvaluation();
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
            if(this.pieces[i].color === this.playerColor && this.onSquare(point, rect(this.pieces[i].position.x, this.pieces[i].position.y, this.squareSize, this.squareSize))) {
                this.selectedPiece = this.pieces[i];
                //this.selectedPieceOrigin = JSON.parse(JSON.stringify(this.selectedPiece.position)); Replaced by piece.currentSquare
                this.isMouseDown = true;

                return;
            }
        }
    }

    mouseUp(point) {
        let t1 = performance.now();
        if(!this.isMouseDown) {
            return;
        }

        let square = pos(Math.floor(point.x / this.squareSize) * this.squareSize, Math.floor(point.y / this.squareSize) * this.squareSize);
        /* let square = pos(point.x, point.y); */
        let move = new Move(this, this.selectedPiece, this.squareToPos(this.selectedPiece.currentSquare), square);

        // If move is allowed
        if(this.selectedPiece.moveAllowed(move, true)) {
            this.move(move);
            debugger;
            if(this.turn === "black") {
                this.makeBotMove(this.turn);
            }
        }
        
        // If move is not allowed
        else {
            this.selectedPiece.position = this.squareToPos(this.selectedPiece.currentSquare);
        }
        
        this.selectedPiece = null;
        
        this.isMouseDown = false;

        console.log("Time diff: ", (performance.now() - t1));
    }

    move(move) {
        this.moves.push(move);
        move.piece.addMove(move);

        // Pawn promotion (Auto queen for now)
        if(move.piece.isType(Pawn) && ((move.piece.color === "white" && move.toSquare.y === 8) || (move.piece.color === "black" && move.toSquare.y === 1))) {
            this.pieces.push(new Queen(this, move.to, move.piece.color));
            this.removePiece(move.piece);
        }
        
        if(move.targetOccupied) {
            this.removePiece(move.targetPiece);
        }

        this.resetCheck();

        this.turn = this.getOtherColor(this.turn);
        
        this.advantage = this.getEvaluation();

        console.log("lol", this.turn)

        // Castling
        if(move.piece.isType(King) && move.distance === 2) {
            move.castling = true;
            this.castle(move);
            this.turn = this.getOtherColor(this.turn);
        }
    }

    castle(move) {
        let rooks = this.getPieces(Rook, move.piece.color);

        for(let i = 0; i < rooks.length; i++) {
            if(rooks[i].moves.length === 0 && this.getDistance(move.fromSquare, rooks[i].currentSquare) > this.getDistance(move.toSquare, rooks[i].currentSquare)) {
                let rookNewPos = pos((move.from.x + move.to.x) / 2, rooks[i].position.y);
                let rookMove = new Move(this, rooks[i], rooks[i].position, rookNewPos, true);
                
                this.move(rookMove);
                this.turn = this.getOtherColor(this.turn);

                console.log("kek", this.turn)

                return;
            }
        }
    }

    unmakeMove(move) {
        // Promotion
        if(!this.pieceOnBoard(move.piece)) {
            this.removePiece(this.getPieceAt(move.toSquare));
            this.pieces.push(move.piece);
        }
        
        if(move.targetOccupied) {
            this.pieces.push(move.targetPiece);
        }
        
        move.piece.removeMove(move);
        spliceByValue(this.moves, move);
        
        if(move.castling && move.piece.isType(Rook) && this.moves[this.moves.length - 1].castling && this.moves[this.moves.length - 1].piece.isType(King)) {
            console.log("UNMAKING CASTLING")
            this.unmakeLastMove();
            this.turn = this.getOtherColor(this.turn);
        }

        this.resetCheck();

        this.turn = this.getOtherColor(this.turn);

        this.advantage = this.getEvaluation();
    }

    unmakeLastMove() {
        if(this.moves.length > 0) {
            let move = this.moves[this.moves.length - 1];
            this.unmakeMove(move);
        }

        else {
            return false;
        }
    }

    unmakeMovesUntil(move = null) {
        for(let i = this.moves.length - 1; i >= 0; i--) {
            // If selected move exists. (It won't exist if last move was castling move)
            if(this.moves[i] !== undefined) {
                let selectedMove = this.moves[i];
    
                if(move === selectedMove) {
                    return;
                }
    
                else {
                    this.unmakeMove(selectedMove);
                }
            }
        }
    }

    unmakeAllMoves() {
        this.unmakeMovesUntil();
    }

    makeBotMove(asColor) {
        console.log(asColor)
        // Getting pseudo-legal moves (legal without checking for check)
        //let testBoard = new Board(true, null, this.pieces, this.turn);
        //let possibleMoves = testBoard.getPossibleMoves(asColor, false);
        let possibleMoves = this.getPossibleMoves(asColor, false);
        console.log("Possible moves: ", possibleMoves.length);
        
        // No possible moves = Checkmate (inpossible when checking without check???)
        if(possibleMoves.length === 0) {
            alert("Checkmate!");
            return;
        }
        
        /* // Random move
        for(let i = 0; i < possibleMoves.length; i++) {
            let move = possibleMoves[i];

            if(!this.inCheckAfter(move, asColor)) {
                this.move(move);
                console.log(performance.now() - kek);
                return;
            }
        } */
        
        // Find best move
        //this.move(this.getEvaluatedMoves(possibleMoves)[0]);
        let k1 = performance.now();
        //let evaluations = testBoard.getEvaluatedMoves(possibleMoves);
        let evaluations = this.getEvaluatedMoves(possibleMoves);
        console.log(performance.now() - k1);
        
        // White => Max value || Black => Min value
        let descending = this.turn === "white";

        let sortedEvaluations = sortWithIndices(evaluations, descending);

        for(let i = 0; i < sortedEvaluations.length; i++) {
            if(!this.inCheckAfter(possibleMoves[sortedEvaluations[i]])) {
                let selectedTestMove = possibleMoves[sortedEvaluations[i]];
                
                //this.move(new Move(this, this.getPieceAt(selectedTestMove.fromSquare), selectedTestMove.from, selectedTestMove.to, selectedTestMove.castling));
                console.log("SELECTED BOT MOVE: ")
                console.log(selectedTestMove);
                this.move(selectedTestMove);
                return;
            }
        }

        return;
        
        // If none of the pseudo-legal moves are legal = Checkmate OR Draw
        if(this.inCheck(asColor)) {
            alert("Checkmate!");
        }

        else {
            alert("Draw!");
        }

        return;
    }

    getEvaluatedMoves(moves) {
        let evaluations = [];

        for(let i = 0; i < moves.length; i++) {
            this.move(moves[i]);

            evaluations[i] = this.advantage;

            this.unmakeMove(moves[i]);
        }

        return evaluations;
    }

    getEvaluation() {
        let whitePawns = 0;
        let blackPawns = 0;

        for(let i = 0; i < this.pieces.length; i++) {
            let currentPiece = this.pieces[i];

            let value = 0;

            value += currentPiece.pieceValue;

            value += SquareValues.getSquareValues(currentPiece.getType(), currentPiece.color, currentPiece.currentSquare);

            if(currentPiece.color === "white") {
                whitePawns += value;
            }

            else if(currentPiece.color === "black") {
                blackPawns += value;
            }
        }

        let advantage = (whitePawns - blackPawns) / 100;
        return advantage;
    }

    // TODO: Use piece specific methods for performance increase
    getPossibleMoves(color, checkForCheck) {
        let possibleMoves = [];

        for(let i = 0; i < this.pieces.length; i++) {
            let piece = this.pieces[i];

            if(piece.color === color) {
                possibleMoves.push(...piece.getAllowedMoves(checkForCheck));
            }
        }

        return possibleMoves;
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

        document.addEventListener('keydown', event => {
            if(event.keyCode === 37) {
                this.unmakeLastMove();
            }
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
        spliceByValue(this.pieces, piece);
    }

    squareEquals(s1, s2) {
        return s1.x === s2.x && s1.y === s2.y;
    }

    // Type and color filters are optional
    getPieces(type = Piece, color = false) {
        let typePieces = [];

        for(let i = 0; i < this.pieces.length; i++) {
            if(this.pieces[i].isType(type) && (color === false || this.pieces[i].color === color)) {
                typePieces.push(this.pieces[i]);
            }
        }

        return typePieces;
    }

    getOtherColor(color) {
        return color === "white" ? "black" : "white";
    }

    getPieceAt(square) {
        for(let i = 0; i < this.pieces.length; i++) {
            if(this.squareEquals(square, this.pieces[i].currentSquare)) {
                return this.pieces[i];
            }
        }

        return false;
    }

    /* updateChecks() {
        this.whiteCheck = this.getPieces(King, "white")[0].inCheck();
        this.blackCheck = this.getPieces(King, "black")[0].inCheck();
    } */

    resetCheck() {
        this.whiteCheck = null;
        this.blackCheck = null;
    }

    inCheck(color) {
        if(color === "white") {
            if(this.whiteCheck === null) {
                this.whiteCheck = this.getPieces(King, "white")[0].inCheck();
            }

            return this.whiteCheck;
        }

        else {
            if(this.blackCheck === null) {
                this.blackCheck = this.getPieces(King, "black")[0].inCheck();
            }

            return this.blackCheck;
        }
    }

    inCheckAfter(move, color) {
        let testBoard = new Board(true, null, this.pieces);

        let newMove = new Move(testBoard, testBoard.getPieceAt(move.fromSquare), move.from, move.to);
        testBoard.move(newMove);
        return testBoard.inCheck(color);
        
        this.move(move);
        let inCheck = this.inCheck(color);
        console.log(this.moves)
        console.log("UNMAKING MOVE (turn " + this.turn + "): ")
        console.log(this.moves[this.moves.length - 1])
        this.unmakeLastMove();
        console.log(this.moves)

        return inCheck;
    }

    inBounds(position) {
        return this.onSquare(position, box(0, 0, this.boardSize, this.boardSize));
    }

    squareInBounds(square) {
        return this.onSquare(square, box(1, 1, this.size, this.size));
    }

    pieceOnBoard(piece) {
        return this.pieces.includes(piece);
    }
}