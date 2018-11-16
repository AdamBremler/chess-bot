class Piece {
    constructor(board, position, color, image) {
        this.board = board;
        this.position = position;
        this.color = color;
        this.image = image;
        this.padding = this.board.squareSize / 5;
    }

    move(newPos) {
        this.position = newPos;
    }

    draw() {
        drawImage(this.image, this.position.x + this.padding / 2, this.position.y + this.padding / 2, this.board.squareSize - this.padding, this.board.squareSize - this.padding);
    }
}

class King extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-king.png"));
    }
}

class Queen extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-queen.png"));
    }
}

class Bishop extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-bishop.png"));
    }
}

class Knight extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-knight.png"));
    }
}

class Rook extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-rook.png"));
    }
}

class Pawn extends Piece {
    constructor(board, position, color) {
        super(board, position, color, getImage(color + "-pawn.png"));
    }
}