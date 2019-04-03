class Piece {
    constructor(board, position, color, image) {
        this.board = board;
        this.position = position;
        this.color = color;
        this.image = image;
        this.padding = this.board.squareSize / 4;
        this.moves = [];
        this.currentSquare = this.board.posToSquare(this.position);
    }

    draw() {
        drawImage(this.image, this.position.x + this.padding / 2, this.position.y + this.padding / 2, this.board.squareSize - this.padding, this.board.squareSize - this.padding);
    }

    moveGenerallyAllowed(move, checkForCheck) {
        // Kings can't be captured (Unable to check for checks if no king on board)
        if(checkForCheck && move.targetOccupied && move.targetPiece.isType(King)) {
            return false;
        }

        // If target square out of bounds (unnecessary???)
        if(!move.inBounds()) {
            return false;
        }

        // If same square
        if(this.board.squareEquals(move.toSquare, this.currentSquare)) {
            return false;
        }

        // If same color
        if(move.targetOccupied && move.targetColor === this.color) {
            return false;
        }

        // If path from start square to end square is clear
        if(!move.pathClear()) {
            return false;
        }

        // If in check
        if(checkForCheck && this.board.inCheckAfter(move, this.color)) {
            return false;
        }

        return true;
    }

    getAllowedMoves(checkForCheck) {
        let allowedMoves = [];

        let moveCheckList = this.getPossibleMovesChecklist();
        for(let i = 0; i < moveCheckList.length; i++) {
            if(this.moveAllowed(moveCheckList[i], checkForCheck)) {
                allowedMoves.push(moveCheckList[i]);
            }
        }

        return allowedMoves;
    }

    addMove(move) {
        this.moves.push(move);
        this.setPosition(move.to);
    }

    removeMove(move) {
        spliceByValue(this.moves, move);
        this.setPosition(move.from);
    }

    setPosition(position) {
        this.position = position;
        this.currentSquare = this.board.posToSquare(position);
    }

    sameColor(color) {
        return this.color === color;
    }

    isType(pieceType) {
        return this instanceof pieceType;
    }

    getType() {
        return this.constructor.name;
    }

    // TODO: color enum with getter
}

class King extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-king.png"));
    }

    get pieceValue() {
        return 100000;
    }

    inCheck() {
        let enemyPieces = this.board.getPieces(Piece, this.board.getOtherColor(this.color));

        for(let i = 0; i < enemyPieces.length; i++) {
            let piece = enemyPieces[i];

            if(piece.moveAllowed(new Move(this.board, piece, piece.position, this.position), false)) {
                return true;
            }
        }

        return false;
    }

    getPossibleMovesChecklist() {
        let moveList = [];

        for(let i = 0; i < DIRECTIONS.length; i++) {
            let direction = DIRECTIONS[i];

            for(let dist = 1; dist <= 2; dist++) {
                let square = pos(this.currentSquare.x + direction.x * dist, this.currentSquare.y + direction.y * dist);

                if(this.board.squareInBounds(square) && (dist === 1 || (this.moves.length === 0 && square.y === this.currentSquare.y))) {
                    moveList.push(new Move(this.board, this, this.board.squareToPos(this.currentSquare), this.board.squareToPos(square)));
                }

                else {
                    break;
                }
            }
        }

        return moveList;
    }

    moveAllowed(move, checkForCheck) {
        if(!this.moveGenerallyAllowed(move, checkForCheck)) {
            return false;
        }
        
        // Regular move
        if(move.distance === 1) {
            return true;
        }

        // Castling
        if(move.distance === 2 && move.horizontalOnly && this.moves.length === 0) {
            let rooks = this.board.getPieces(Rook, this.color);

            for(let i = 0; i < rooks.length; i++) {
                if(rooks[i].moves.length === 0 && this.board.getDistance(move.fromSquare, rooks[i].currentSquare) > this.board.getDistance(move.toSquare, rooks[i].currentSquare)) {
                    let rookNewPos = pos((move.from.x + move.to.x) / 2, rooks[i].position.y);
                    let rookMove = new Move(this.board, rooks[i], rooks[i].position, rookNewPos, true);
                    
                    if(rooks[i].moveAllowed(rookMove, checkForCheck)) {
                        return true;
                    }

                    else {
                        return false;
                    }
                }
            }
        }

        return false;
    }
}

class Queen extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-queen.png"));
    }

    get pieceValue() {
        return 900;
    }

    getPossibleMovesChecklist() {
        let moveList = [];

        for(let i = 0; i < DIRECTIONS.length; i++) {
            let direction = DIRECTIONS[i];

            for(let dist = 1;; dist++) {
                let square = pos(this.currentSquare.x + direction.x * dist, this.currentSquare.y + direction.y * dist);

                if(this.board.squareInBounds(square)) {
                    moveList.push(new Move(this.board, this, this.board.squareToPos(this.currentSquare), this.board.squareToPos(square)));
                }

                else {
                    break;
                }
            }
        }

        return moveList;
    }

    moveAllowed(move, checkForCheck) {
        if(!this.moveGenerallyAllowed(move, checkForCheck)) {
            return false;
        }
        
        if(move.diagonal || move.straight) {
            return true;
        }

        return false;
    }
}

class Bishop extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-bishop.png"));
    }

    get pieceValue() {
        return 300;
    }

    getPossibleMovesChecklist() {
        let moveList = [];

        for(let i = 0; i < DIAGONAL_DIRECTIONS.length; i++) {
            let direction = DIAGONAL_DIRECTIONS[i];

            for(let dist = 1;; dist++) {
                let square = pos(this.currentSquare.x + direction.x * dist, this.currentSquare.y + direction.y * dist);
                
                if(this.board.squareInBounds(square)) {
                    moveList.push(new Move(this.board, this, this.board.squareToPos(this.currentSquare), this.board.squareToPos(square)));
                }

                else {
                    break;
                }
            }
        }

        return moveList;
    }

    moveAllowed(move, checkForCheck) {
        if(!this.moveGenerallyAllowed(move, checkForCheck)) {
            return false;
        }

        if(move.diagonal) {
            return true;
        }

        return false;
    }
}

class Knight extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-knight.png"));
    }

    get pieceValue() {
        return 300;
    }

    getPossibleMovesChecklist() {
        let moveList = [];

        for(let i = 0; i < DIAGONAL_DIRECTIONS.length; i++) {
            let direction = DIAGONAL_DIRECTIONS[i];

            let squares = [pos(this.currentSquare.x + direction.x, this.currentSquare.y + direction.y * 2), pos(this.currentSquare.x + direction.x * 2, this.currentSquare.y + direction.y)];
            
            for(let j = 0; j < squares.length; j++) {
                if(this.board.squareInBounds(squares[j])) {
                    moveList.push(new Move(this.board, this, this.board.squareToPos(this.currentSquare), this.board.squareToPos(squares[j])));
                }
            }
        }

        return moveList;
    }

    moveAllowed(move, checkForCheck) {
        if(!this.moveGenerallyAllowed(move, checkForCheck)) {
            return false;
        }
        
        if(!move.diagonal && !move.straight && move.distance === 2) {
            return true;
        }

        return false;
    }
}

class Rook extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-rook.png"));
    }

    get pieceValue() {
        return 500;
    }

    getPossibleMovesChecklist() {
        let moveList = [];

        for(let i = 0; i < STRAIGHT_DIRECTIONS.length; i++) {
            let direction = STRAIGHT_DIRECTIONS[i];

            for(let dist = 1;; dist++) {
                let square = pos(this.currentSquare.x + direction.x * dist, this.currentSquare.y + direction.y * dist);
                
                if(this.board.squareInBounds(square)) {
                    moveList.push(new Move(this.board, this, this.board.squareToPos(this.currentSquare), this.board.squareToPos(square)));
                }

                else {
                    break;
                }
            }
        }

        return moveList;
    }

    moveAllowed(move, checkForCheck) {
        if(!this.moveGenerallyAllowed(move, checkForCheck)) {
            return false;
        }
        
        if(move.straight) {
            return true;
        }

        return false;
    }
}

class Pawn extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-pawn.png"));
    }

    get pieceValue() {
        return 100;
    }

    getPossibleMovesChecklist() {
        let moveList = [];

        for(let i = 0; i < DIRECTIONS.length; i++) {
            let direction = DIRECTIONS[i];
            
            if((this.color === "white" && direction.y > 0) || (this.color === "black" && direction.y < 0)) {
                let squares = [pos(this.currentSquare.x + direction.x, this.currentSquare.y + direction.y)];

                if(direction.x === 0) {
                    squares.push(pos(this.currentSquare.x, this.currentSquare.y + direction.y * 2));
                }

                for(let j = 0; j < squares.length; j++) {
                    if(this.board.squareInBounds(squares[j])) {
                        moveList.push(new Move(this.board, this, this.board.squareToPos(this.currentSquare), this.board.squareToPos(squares[j])));
                    }
                }
            }
        }

        return moveList;
    }

    moveAllowed(move, checkForCheck) {
        if(!this.moveGenerallyAllowed(move, checkForCheck)) {
            return false;
        }
        
        // Regular move
        if(move.straight && move.yDiff <= 2 && move.forward && !move.targetOccupied) {
            if(this.color === "white") {
                if(move.forward && (move.yDiff === 1 || move.fromSquare.y === 2))
                return true;
            } else {
                if(move.forward && (move.yDiff === 1 || move.fromSquare.y === 7))
                return true;
            }
        }    
        
        // Regular capture
        if(move.diagonal && move.forward && move.targetOccupied && move.targetColor != this.color && move.distance === 1) {
            return true;
        }

        return false;
    }
}