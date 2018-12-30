class Move {
    constructor(board, piece, from, to) {
        this.board = board;
        this.piece = piece;
        this.from = from;
        this.to = to;
        this.fromSquare = board.posToSquare(from);
        this.toSquare = board.posToSquare(to);
        this.x = (to.x - from.x) / board.squareSize;
        this.y = (to.y - from.y) / board.squareSize;
        this.xDiff = Math.abs(this.x);
        this.yDiff = Math.abs(this.y);
        this.xDir = this.xDiff !== 0 ? this.x / this.xDiff : 0;
        this.yDir = this.yDiff !== 0 ? this.y / this.yDiff : 0;
        this.straight = this.x === 0 || this.y === 0;
        this.diagonal = this.xDiff === this.yDiff;
        this.forward = piece.color === "white" ? (this.y < 0) : (this.y > 0);
        this.vertical = this.y !== 0;
        this.horizontal = this.x !== 0;
        this.verticalOnly = this.y !== 0 && this.x === 0;
        this.horizontalOnly = this.x !== 0 && this.y === 0;
        this.targetPiece = board.squareOccupied(this.toSquare);
        this.targetOccupied = this.targetPiece === false ? false : true;
        this.targetColor = this.targetPiece !== false ? this.targetPiece.color : null;
        this.distance = board.getDistance(to, from);
    }

    pathClear() {
        // Knights have no paths
        if(this.diagonal || this.straight) {
            for(let i = 1; i < this.distance; i++) {
                if(this.board.squareOccupied(pos(this.fromSquare.x + this.xDir * i, this.fromSquare.y - this.yDir * i))) { // Negative yDir because of pos to square conversion effect
                    return false;
                }
            }
        }

        return true;
    }
}