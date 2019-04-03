class SquareValues {

    static get _blackKing() {
        let king = this._whiteKing;

        for(let i = 0; i < king.length; i++) {
            king[i].reverse();
        }

        king.reverse();

        return king;
    }

    static getSquareValues(type, color, square) {
        let valueArray;

        if(type === "King") {
            valueArray = color === "white" ? SquareValues._whiteKing : SquareValues._blackKing;
        }

        else if(type === "Queen") {
            valueArray = color === "white" ? SquareValues._whiteQueen : SquareValues._blackQueen;
        }

        else if(type === "Bishop") {
            valueArray = color === "white" ? SquareValues._whiteBishop : SquareValues._blackBishop;
        }

        else if(type === "Knight") {
            valueArray = color === "white" ? SquareValues._whiteKnight : SquareValues._blackKnight;
        }

        else if(type === "Rook") {
            valueArray = color === "white" ? SquareValues._whiteRook : SquareValues._blackRook;
        }

        else if(type === "Pawn") {
            valueArray = color === "white" ? SquareValues._whitePawn : SquareValues._blackPawn;
        }
        
        return valueArray[square.y - 1][square.x - 1];
    }
}

// IIFE that inits squareValues.
(function () {
    SquareValues._whiteKing = [
        [+2.0, +3.0, +1.0, +0.0, +0.0, +1.0, +3.0, +2.0],
        [+2.0, +2.0, +0.0, +0.0, +0.0, +0.0, +2.0, +2.0],
        [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
        [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
        [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0]
    ];
    
    SquareValues._whiteQueen = [
        [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
        [-1.0, +0.0, +0.5, +0.0, +0.0, +0.0, +0.0, -1.0],
        [-1.0, +0.5, +0.5, +0.5, +0.5, +0.5, +0.0, -1.0],
        [+0.0, +0.0, +0.5, +0.5, +0.5, +0.5, +0.0, -0.5],
        [-0.5, +0.0, +0.5, +0.5, +0.5, +0.5, +0.0, -0.5],
        [-1.0, +0.0, +0.5, +0.5, +0.5, +0.5, +0.0, -1.0],
        [-1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -1.0],
        [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
    ];
    
    SquareValues._whiteBishop = [
        [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
        [-1.0, +0.5, +0.0, +0.0, +0.0, +0.0, +0.5, -1.0],
        [-1.0, +1.0, +1.0, +1.0, +1.0, +1.0, +1.0, -1.0],
        [-1.0, +0.0, +1.0, +1.0, +1.0, +1.0, +0.0, -1.0],
        [-1.0, +0.5, +0.5, +1.0, +1.0, +0.5, +0.5, -1.0],
        [-1.0, +0.0, +0.5, +1.0, +1.0, +0.5, +0.0, -1.0],
        [-1.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -1.0],
        [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    ];
    
    SquareValues._whiteKnight = [
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, +0.0, +0.5, +0.5, +0.0, -2.0, -4.0],
        [-3.0, +0.5, +1.0, +1.5, +1.5, +1.0, +0.5, -3.0],
        [-3.0, +0.0, +1.5, +2.0, +2.0, +1.5, +0.0, -3.0],
        [-3.0, +0.5, +1.5, +2.0, +2.0, +1.5, +0.5, -3.0],
        [-3.0, +0.0, +1.0, +1.5, +1.5, +1.0, +0.0, -3.0],
        [-4.0, -2.0, +0.0, +0.0, +0.0, +0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    ];
    
    SquareValues._whiteRook = [
        [+0.0, +0.0, +0.0, +0.5, +0.5, +0.0, +0.0, +0.0],
        [-0.5, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -0.5],
        [-0.5, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -0.5],
        [-0.5, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -0.5],
        [-0.5, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -0.5],
        [-0.5, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, -0.5],
        [+0.5, +1.0, +1.0, +1.0, +1.0, +1.0, +1.0, +0.5],
        [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
    ];
    
    SquareValues._whitePawn = [
        [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0],
        [+0.5, +1.0, +1.0, -2.0, -2.0, +1.0, +1.0, +0.5],
        [+0.5, -0.5, -1.0, +0.0, +0.0, -1.0, -0.5, +0.5],
        [+0.0, +0.0, +0.0, +2.0, +2.0, +0.0, +0.0, +0.0],
        [+0.5, +0.5, +1.0, +2.5, +2.5, +1.0, +0.5, +0.5],
        [+1.0, +1.0, +2.0, +3.0, +3.0, +2.0, +1.0, +1.0],
        [+5.0, +5.0, +5.0, +5.0, +5.0, +5.0, +5.0, +5.0],
        [+0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0, +0.0]
    ];
    
    let whitePieces = [SquareValues._whiteKing, SquareValues._whiteQueen, SquareValues._whiteBishop, SquareValues._whiteKnight, SquareValues._whiteRook, SquareValues._whitePawn];
    let blackPieces = [];
    
    for(let piece = 0; piece < whitePieces.length; piece++) {
        let whitePiece = whitePieces[piece].concat().reverse();
    
        blackPieces.push(whitePiece);
    }
    
    SquareValues._blackKing = blackPieces[0];
    SquareValues._blackQueen = blackPieces[1];
    SquareValues._blackBishop = blackPieces[2];
    SquareValues._blackKnight = blackPieces[3];
    SquareValues._blackRook = blackPieces[4];
    SquareValues._blackPawn = blackPieces[5];
})();