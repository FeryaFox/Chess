export let colors = {WHITE: "white", BLACK: "black", EMPTY: "empty"}
export let pieces = {PAWN: "pawn", KING: "king", QUEEN: "queen", BISHOP: "bishop", KNIGHT: "knight", ROOK: "rook", EMPTY: "empty"}
export let stepType = {ATTACK: "attack", STEP: "step", STEPANDATTACK: "stepandattack"}

class possibleStep{
    position_x = 0
    position_y = 0
    stepType
    step_group
    constructor(positionX, positionY, sT, sG) {
        this.position_x = positionX
        this.position_y = positionY
        this.stepType = sT
        this.step_group = sG
    }
}

class possibleSteps{
    position = []
}

class Piece{
    documentElement
    img_white = ""
    img_black = ""
    name = ""
    color = ""
    position_x = 0
    position_y = 0
    isAttackedMove = false
    setIsAttackedMove(isAttackedMove){
        if (isAttackedMove){
            this.documentElement.className = "piece attacked_piece"
        }
        else {
            this.documentElement.className = "piece"
        }
        this.isAttackedMove = isAttackedMove
    }
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
    setPosition(position_x, position_y){
        this.position_x = position_x
        this.position_y = position_y
    }
    toJSON(){
        return {
            color: this.color,
            position_x: this.position_x,
            position_y: this.position_y
        }
    }
}
export class Pawn extends Piece{
    // Пешка
    name = pieces.PAWN
    img_white = "♙"
    img_black = "♟"
    isFirstStep = true
    constructor(color, position_x, position_y ) {
        super(color, position_x, position_y);

    }
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
        ps.groups_count = 0
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
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP, 1)
        }
        for (let i = this.position_x - 1; i >= 0; i--) {
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP, 2)
        }
        for (let j = this.position_y + 1; j <= 7; j++) {
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP, 3)
        }
        for (let j = this.position_y - 1; j >= 0; j--) {
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP, 4)
        }

        // Ходы по диагонали (вправо вверх)
        let i = this.position_x + 1
        let j = this.position_y + 1
        while (i <= 7 && j <= 7) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 5)
            i++
            j++
        }

        // Ходы по диагонали (вправо вниз)
        i = this.position_x + 1
        j = this.position_y - 1
        while (i <= 7 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 6)
            i++
            j--
        }

        // Ходы по диагонали (влево вверх)
        i = this.position_x - 1
        j = this.position_y + 1
        while (i >= 0 && j <= 7) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 7)
            i--
            j++
        }

        // Ходы по диагонали (влево вниз)
        i = this.position_x - 1
        j = this.position_y - 1
        while (i >= 0 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 8)
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
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 1)
            i++
            j++
        }

        // Ходы по диагонали (вправо вниз)
        i = this.position_x + 1
        j = this.position_y - 1
        while (i <= 7 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 2)
            i++
            j--
        }

        // Ходы по диагонали (влево вверх)
        i = this.position_x - 1
        j = this.position_y + 1
        while (i >= 0 && j <= 7) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 3)
            i--
            j++
        }

        // Ходы по диагонали (влево вниз)
        i = this.position_x - 1
        j = this.position_y - 1
        while (i >= 0 && j >= 0) {
            ps.position[ps.position.length] = new possibleStep(i, j, stepType.STEP, 4)
            i--
            j--
        }

        return ps
    }
}

export class Knight extends Piece {
    // Конь
    name = pieces.KNIGHT
    img_white = "♘"
    img_black = "♞"

    possibleSteps() {
        let ps = new possibleSteps()

        // Ходы коня (вверх-влево)
        if (this.position_x - 1 >= 0 && this.position_y - 2 >= 0) {
            ps.position[ps.position.length] = new possibleStep(this.position_x - 1, this.position_y - 2, stepType.STEP)
        }

        // Ходы коня (вверх-вправо)
        if (this.position_x + 1 <= 7 && this.position_y - 2 >= 0) {
            ps.position[ps.position.length] = new possibleStep(this.position_x + 1, this.position_y - 2, stepType.STEP)
        }

        // Ходы коня (влево-вверх)
        if (this.position_x - 2 >= 0 && this.position_y - 1 >= 0) {
            ps.position[ps.position.length] = new possibleStep(this.position_x - 2, this.position_y - 1, stepType.STEP)
        }

        // Ходы коня (влево-вниз)
        if (this.position_x - 2 >= 0 && this.position_y + 1 <= 7) {
            ps.position[ps.position.length] = new possibleStep(this.position_x - 2, this.position_y + 1, stepType.STEP)
        }

        // Ходы коня (вниз-влево)
        if (this.position_x - 1 >= 0 && this.position_y + 2 <= 7) {
            ps.position[ps.position.length] = new possibleStep(this.position_x - 1, this.position_y + 2, stepType.STEP)
        }

        // Ходы коня (вниз-вправо)
        if (this.position_x + 1 <= 7 && this.position_y + 2 <= 7) {
            ps.position[ps.position.length] = new possibleStep(this.position_x + 1, this.position_y + 2, stepType.STEP)
        }

        // Ходы коня (вправо-вниз)
        if (this.position_x + 2 <= 7 && this.position_y + 1 <= 7) {
            ps.position[ps.position.length] = new possibleStep(this.position_x + 2, this.position_y + 1, stepType.STEP)
        }

        // Ходы коня (вправо-вверх)
        if (this.position_x + 2 <= 7 && this.position_y - 1 >= 0) {
            ps.position[ps.position.length] = new possibleStep(this.position_x + 2, this.position_y - 1, stepType.STEP)
        }

        return ps
    }
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
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP, 0)
        }

        // Ходы по вертикали вниз
        for (let j = this.position_y - 1; j >= 0; j--) {
            ps.position[ps.position.length] = new possibleStep(this.position_x, j, stepType.STEP, 1)
        }

        // Ходы по горизонтали вправо
        for (let i = this.position_x + 1; i <= 7; i++) {
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP, 2)
        }

        // Ходы по горизонтали влево
        for (let i = this.position_x - 1; i >= 0; i--) {
            ps.position[ps.position.length] = new possibleStep(i, this.position_y, stepType.STEP, 3)
        }

        return ps
    }
}

export class Empty extends Piece{
    name = pieces.EMPTY
    setIsAttackedMove(isAttackedMove){
        if (isAttackedMove){
            this.documentElement.className = "piece possible_step"
        }
        else {
            this.documentElement.className = "piece"
        }
        this.isAttackedMove = isAttackedMove
    }
    constructor(position_x, position_y) {
        super(colors.EMPTY, position_x, position_y);
    }
    get img(){
        return ""
    }
}