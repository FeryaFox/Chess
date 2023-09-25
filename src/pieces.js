export let colors = {WHITE: "white", BLACK: "black", EMPTY: "empty"}
export let pieces = {PAWN: "pawn", KING: "king", QUEEN: "queen", BISHOP: "bishop", KNIGHT: "knight", ROOK: "rook", EMPTY: "empty"}

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

export class Pawn extends Piece{
    // Пешка
    name = pieces.PAWN
    img_white = "♙"
    img_black = "♟"
    isFirstStep = true
}

export class King extends Piece{
    //Король
    name = pieces.KING
    img_white = "♔"
    img_black = "♚"
}
export class Queen extends Piece{
    //Ферзь
    name = pieces.QUEEN
    img_white = "♕"
    img_black = "♛"
}
export class Bishop extends Piece{
    //Слон
    name = pieces.BISHOP
    img_white = "♗"
    img_black = "♝"
}
export class Knight extends Piece{
    //Конь
    name = pieces.KNIGHT
    img_white = "♘"
    img_black = "♞"
}
export class Rook extends Piece{
    //Ладья
    name = pieces.ROOK
    img_white = "♖"
    img_black = "♜"
}
export class Empty extends Piece{
    name = pieces.EMPTY
    constructor(position_x, position_y) {
        super(colors.EMPTY, position_x, position_y);
    }
    get img(){
        return ""
    }
}