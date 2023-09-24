colors = {WHITE: "white", BLACK: "black", EMPTY: "empty"}
pieces = {PAWN: "pawn", KING: "king", QUEEN: "queen", BISHOP: "bishop", KNIGHT: "knight", ROOK: "rook", EMPTY: "empty"}

class Piece{
    img_white = ""
    img_black = ""
    name = ""
    color = ""
    position_x = 0
    position_y = 0
    constructor(color, position_x, position_y ) {
        this.color = color
        this.position_x = position_x
        this.position_y = position_y
    }
    canStep(movePositionX, movePositionY){}
    possibleSteps(){}
    get img(){
        return this.color === "white" ? this.img_white : this.img_black
    }
    get name() {
        return this.name
    }
}

class Pawn extends Piece{
    // Пешка
    name = pieces.PAWN
    img_white = "♙"
    img_black = "♟"
    isFirstStep = true
}

class King extends Piece{
    //Король
    name = pieces.KING
    img_white = "♔"
    img_black = "♚"
}
class Queen extends Piece{
    //Ферзь
    name = pieces.QUEEN
    img_white = "♕"
    img_black = "♛"
}
class Bishop extends Piece{
    //Слон
    name = pieces.BISHOP
    img_white = "♗"
    img_black = "♝"
}
class Knight extends Piece{
    //Конь
    name = pieces.KNIGHT
    img_white = "♘"
    img_black = "♞"
}
class Rook extends Piece{
    //Ладья
    name = pieces.ROOK
    img_white = "♖"
    img_black = "♜"
}
class Empty extends Piece{
    name = pieces.EMPTY
    constructor(position_x, position_y) {
        super(colors.EMPTY, position_x, position_y);
    }
    get img(){
        return ""
    }
}