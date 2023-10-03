import {removeElementFromArrayByIndex} from "./utlis";

export let colors = {WHITE: "white", BLACK: "black", EMPTY: "empty"}
export let pieces = {PAWN: "pawn", KING: "king", QUEEN: "queen", BISHOP: "bishop", KNIGHT: "knight", ROOK: "rook", EMPTY: "empty"}
export let stepType = {ATTACK: "attack", STEP: "step", STEPANDATTACK: "stepandattack"}

class possibleStep{
    position_x = 0
    position_y = 0
    stepType
    constructor(positionX, positionY, sT) {
        this.position_x = positionX
        this.position_y = positionY
        this.stepType = sT
    }
}

class possibleSteps{
    position = []
}

class Piece{
    documentElement = HTMLDivElement
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
    get documentElement(){
        return this.documentElement
    }
}

export class Pawn extends Piece{
    // Пешка
    name = pieces.PAWN
    img_white = "♙"
    img_black = "♟"
    isFirstStep = true
    possibleSteps() {
        let ps = new possibleSteps()
        if (this.color === colors.BLACK) {
            if (this.position_y < 7) {
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x,
                    this.position_y + 1,
                    stepType.STEP
                )
                if (this.isFirstStep) {
                    ps.position[ps.position.length] = new possibleStep(
                        this.position_x,
                        this.position_y + 2,
                        stepType.STEP
                    )
                }
            }
            if (this.position_x === 0){
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x + 1,
                    this.position_y + 1,
                    stepType.ATTACK
                )
            }
            else if (this.position_x === 7){
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x - 1,
                    this.position_y + 1,
                    stepType.ATTACK
                )
            }
            else {
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x + 1,
                    this.position_y + 1,
                    stepType.ATTACK
                )
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x - 1,
                    this.position_y + 1,
                    stepType.ATTACK
                )
            }
        }
        else if (this.color === colors.WHITE){
            if (this.position_y > 0) {
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x,
                    this.position_y - 1,
                    stepType.STEP
                )
            }
            if (this.isFirstStep){
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x,
                    this.position_y - 2,
                    stepType.STEP
                )
            }
            if (this.position_x === 0){
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x + 1,
                    this.position_y - 1,
                    stepType.ATTACK
                )
            }
            else if (this.position_x === 7){
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x - 1,
                    this.position_y - 1,
                    stepType.ATTACK
                )
            }
            else {
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x + 1,
                    this.position_y - 1,
                    stepType.ATTACK
                )
                ps.position[ps.position.length] = new possibleStep(
                    this.position_x - 1,
                    this.position_y - 1,
                    stepType.ATTACK
                )
            }
        }
        return ps
    }
}

export class King extends Piece{
    //Король
    name = pieces.KING
    img_white = "♔"
    img_black = "♚"
    possibleSteps() {

        let ps = new possibleSteps()
        ps.position[ps.position.length] = new possibleStep(
            this.position_x - 1,
            this.position_y + 1,
            stepType.STEPANDATTACK
        )
        ps.position[ps.position.length] = new possibleStep(
            this.position_x,
            this.position_y + 1,
            stepType.STEPANDATTACK
        )
        ps.position[ps.position.length] = new possibleStep(
            this.position_x + 1,
            this.position_y + 1,
            stepType.STEPANDATTACK
        )
        ps.position[ps.position.length] = new possibleStep(
            this.position_x - 1,
            this.position_y,
            stepType.STEPANDATTACK
        )
        ps.position[ps.position.length] = new possibleStep(
            this.position_x + 1,
            this.position_y,
            stepType.STEPANDATTACK
        )
        ps.position[ps.position.length] = new possibleStep(
            this.position_x - 1,
            this.position_y - 1,
            stepType.STEPANDATTACK
        )
        ps.position[ps.position.length] = new possibleStep(
            this.position_x + 1,
            this.position_y - 1,
            stepType.STEPANDATTACK
        )
        ps.position[ps.position.length] = new possibleStep(
            this.position_x,
            this.position_y - 1,
            stepType.STEPANDATTACK
        )
        let clearSteps = new possibleSteps()
        for (let i = 0; i < ps.position.length; i++){
            if (
                ps.position[i].position_x >= 0 &&
                ps.position[i].position_x <= 7 &&
                ps.position[i].position_y >= 0 &&
                ps.position[i].position_y <= 7
            ){
                clearSteps.position[clearSteps.position.length] = ps.position[i]
            }
        }
        return clearSteps
    }
}
export class Queen extends Piece{
    //Ферзь
    name = pieces.QUEEN
    img_white = "♕"
    img_black = "♛"
    possibleSteps() {
        let ps = new possibleSteps()

        // Ходы по вертикали и горизонтали
        for (let i = this.position_x + 1; i <= 7; i++) {
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP)
        }
        for (let i = this.position_x - 1; i >= 0; i--) {
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP)
        }
        for (let j = this.position_y + 1; j <= 7; j++) {
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP)
        }
        for (let j = this.position_y - 1; j >= 0; j--) {
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP)
        }

        // Ходы по диагонали (вправо вверх)
        let i = this.position_x + 1
        let j = this.position_y + 1
        while (i <= 7 && j <= 7) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i++
            j++
        }

        // Ходы по диагонали (вправо вниз)
        i = this.position_x + 1
        j = this.position_y - 1
        while (i <= 7 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i++
            j--
        }

        // Ходы по диагонали (влево вверх)
        i = this.position_x - 1
        j = this.position_y + 1
        while (i >= 0 && j <= 7) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i--
            j++
        }

        // Ходы по диагонали (влево вниз)
        i = this.position_x - 1
        j = this.position_y - 1
        while (i >= 0 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i--
            j--
        }

        return ps
    }
}
export class Bishop extends Piece {
    // Слон
    name = pieces.BISHOP
    img_white = "♗"
    img_black = "♝"

    possibleSteps() {
        let ps = new possibleSteps()

        // Ходы по диагонали (вправо вверх)
        let i = this.position_x + 1
        let j = this.position_y + 1
        while (i <= 7 && j <= 7) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i++
            j++
        }

        // Ходы по диагонали (вправо вниз)
        i = this.position_x + 1
        j = this.position_y - 1
        while (i <= 7 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i++
            j--
        }

        // Ходы по диагонали (влево вверх)
        i = this.position_x - 1
        j = this.position_y + 1
        while (i >= 0 && j <= 7) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i--
            j++
        }

        // Ходы по диагонали (влево вниз)
        i = this.position_x - 1
        j = this.position_y - 1
        while (i >= 0 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP)
            i--
            j--
        }

        return ps
    }
}

export class Knight extends Piece{
    //Конь
    name = pieces.KNIGHT
    img_white = "♘"
    img_black = "♞"
}
export class Rook extends Piece {
    // Ладья
    name = pieces.ROOK
    img_white = "♖"
    img_black = "♜"

    possibleSteps() {
        let ps = new possibleSteps()

        // Ходы по вертикали вверх
        for (let j = this.position_y + 1; j <= 7; j++) {
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP)
        }

        // Ходы по вертикали вниз
        for (let j = this.position_y - 1; j >= 0; j--) {
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP)
        }

        // Ходы по горизонтали вправо
        for (let i = this.position_x + 1; i <= 7; i++) {
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP)
        }

        // Ходы по горизонтали влево
        for (let i = this.position_x - 1; i >= 0; i--) {
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP)
        }

        return ps
    }
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