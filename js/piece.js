class Piece {
    constructor(board, position, color, image) {
        this.board = board;
        this.position = position;
        this.color = color;
        this.image = image;
        this.padding = this.board.squareSize / 5;
        this.moves = [];
        this.currentSquare = this.board.posToSquare(this.position);
    }

    draw() {
        drawImage(this.image, this.position.x + this.padding / 2, this.position.y + this.padding / 2, this.board.squareSize - this.padding, this.board.squareSize - this.padding);
    }

    /* moveAllowed(move) {
        for(let i = 0; i < move.board.pieces.length; i++) {
            if(JSON.stringify(move.board.pieces[i].position) == JSON.stringify(move.toSquare) && this.pieces[i] != this.selectedPiece) {
                if(this.pieces[i].color == this.selectedPiece.color) {
                    this.selectedPiece.position = this.selectedPieceOrigin;
                } else {
                    this.pieces.splice(i, 1);
                    break;
                }
            }
        }
    } */

    moveGenerallyAllowed(move) {
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

        return true;
    }

    addMove(move) {
        this.moves.push(move);
        this.position = move.to;
        this.currentSquare = this.board.posToSquare(this.position);
    }

    sameColor(color) {
        return this.color === color;
    }

    isType(pieceType) {
        return this instanceof pieceType;
    }

    // TODO: color enum with getter
}

class King extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-king.png"));
    }

    moveAllowed(move) {
        if(!this.moveGenerallyAllowed(move)) {
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
                    let rookMove = new Move(this.board, rooks[i], rooks[i].position, rookNewPos);
                    
                    if(rooks[i].moveAllowed(rookMove)) {
                        rooks[i].addMove(rookMove);
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

    moveAllowed(move) {
        if(!this.moveGenerallyAllowed(move)) {
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

    moveAllowed(move) {
        if(!this.moveGenerallyAllowed(move)) {
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

    moveAllowed(move) {
        if(!this.moveGenerallyAllowed(move)) {
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

    moveAllowed(move) {
        if(!this.moveGenerallyAllowed(move)) {
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

    moveAllowed(move) {
        if(!this.moveGenerallyAllowed(move)) {
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