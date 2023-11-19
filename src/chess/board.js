import './pieces'
import {convertCoordinatesToSquareName, convertSquareNameToCoordinates, reverseSide} from "./utlis";
import {colors, Rook, Knight, Bishop, Queen, King, Empty, Pawn, stepType, pieces} from "./pieces"

const figureTypes = {FIGURE_MAKING_MOVE: "figure_making_move", ATTACKED_FIGURE: "attacked", MOVING_FIGURE: "moving_figure"}

export class Board{
    pieces = []
    selectedPieces = []
    possibleSteps = []
    move_side
    constructor(chessboard, onclick) {
        this.chessboard = chessboard
        this.onClickFunction = onclick
    }

    checkIsPossibleAttack(position_x, position_y, possibleSteps){
        if (possibleSteps === undefined){
            for (const step of this.possibleSteps){
                if (step.position_x === position_x && step.position_y === position_y && step.step_type === stepType.ATTACK){
                    return true
                }
            }
            return false
        }
        for (const step of possibleSteps){
            if (step.position_x === position_x && step.position === position_y && step.step_type === stepType.ATTACK){
                return true
            }
        }
        return false
    }

    checkIsPossibleStep(position_x, position_y){
        for (const step of this.possibleSteps){
            if (step.position_x === position_x && step.position_y === position_y && step.step_type === stepType.STEP){
                return true
            }
        }
        return false
    }


    onClick(ev, side){
        function kingCheckCheck(future_position_x, future_position_y){
            //continue
        }

        let chessPosition;
        if (ev.target.className.includes("piece")){
            chessPosition = ev.target.parentElement.id
        }
        else {
            chessPosition = ev.target.id
        }

        let position = convertSquareNameToCoordinates(chessPosition)
        let figure = this.getFigure(position.position_x, position.position_y)
        let previousFigurePosition = this.selectedPieces.find(item => item.figure_type === figureTypes.FIGURE_MAKING_MOVE)
        if (figure.color !== side && this.checkIsPossibleAttack(position.position_x, position.position_y)){
            // этот кусок кода производит атаку
            let figureMakingMove = this.getFigureMakingMove() // получаем фигуру, которая ходит
            let figureMakingMoveObject = this.getFigure(figureMakingMove.position_x, figureMakingMove.position_y)

            let emptyPiece = new Empty(figureMakingMove.position_x, figureMakingMove.position_y)

            this.moveFigure(figureMakingMove.position_x, figureMakingMove.position_y, position.position_x, position.position_y, figureMakingMoveObject) // перемещаем фигуру

            this.setFigure(figureMakingMove.position_x, figureMakingMove.position_y, emptyPiece)

            const piece = document.createElement('div')
            piece.classList.add('piece')

            this.setDocumentElementToFigure(figureMakingMove.position_x, figureMakingMove.position_y, piece)
            this.setDocumentElementToCell(figureMakingMove.position_x, figureMakingMove.position_y, piece)


            // снимаем пометки с возможных ходов
            for (const step of this.selectedPieces){
                this.getFigure(step.position_x, step.position_y).setIsAttackedMove(false)
            }

            //убираем желтую ячейку и зеленый кружочек
            let temp = document.getElementById(convertCoordinatesToSquareName(figureMakingMove.position_x, figureMakingMove.position_y))
            temp.className = temp.className.replace(" moved-square", "")
            temp.children[0].className = temp.children[0].className.replace(" possible_step", "")

            // очищаем все возможные ходы
            this.selectedPieces = []
            this.possibleSteps = []
            if (figure.name === pieces.KING){
                return {change_side: false, board_info: JSON.stringify(this.getFigures()), king_is_beaten: true}
            }

            return {change_side: true, board_info: JSON.stringify(this.getFigures()) }
        }

        if (figure.color === colors.EMPTY && this.checkIsPossibleStep(position.position_x, position.position_y, figureTypes.MOVING_FIGURE)) {
            // проверка, может ли фигура походить на пустую клетку

            let figureMakingMove = this.getFigureMakingMove() // получаем фигуру, которая ходит
            let figureMakingMoveObject = this.getFigure(figureMakingMove.position_x, figureMakingMove.position_y)
            if (figureMakingMoveObject.name === pieces.PAWN && figureMakingMoveObject.isFirstStep) figureMakingMoveObject.isFirstStep = false
            this.moveFigure(figureMakingMove.position_x, figureMakingMove.position_y, position.position_x, position.position_y, figureMakingMoveObject) // перемещаем фигуру

            // снимаем пометки с возможных ходов
            for (const step of this.selectedPieces){
                this.getFigure(step.position_x, step.position_y).setIsAttackedMove(false)
            }

            //убираем желтую ячейку и зеленый кружочек
            let temp = document.getElementById(convertCoordinatesToSquareName(figureMakingMove.position_x, figureMakingMove.position_y))
            temp.className = temp.className.replace(" moved-square", "")
            temp.children[0].className = temp.children[0].className.replace(" possible_step", "")


            // очищаем все возможные ходы
            this.selectedPieces = []
            this.possibleSteps = []

            return {change_side: true, board_info: JSON.stringify(this.getFigures())}
        }

        if (this.selectedPieces.length === 0 && figure.color === side){
            // этот вариант выполняется, если фигура не была нажата и показывается точки, куда можно ходить
            let possibleStep = figure.possibleSteps()
            let filteredSteps = this.filterSteps(possibleStep, side, figure.name)
            if (filteredSteps === undefined) return;
            this.possibleSteps = Object.assign([], filteredSteps)
            document.getElementById(chessPosition).className += " moved-square"
            this.selectedPieces.push({
                figure_type: figureTypes.FIGURE_MAKING_MOVE,
                position_x: position.position_x,
                position_y: position.position_y
            })
            this.showPossibleSteps(filteredSteps, side, figure.name)
        }
        else if (figure.color === side && previousFigurePosition.position_x === figure.position_x && previousFigurePosition.position_y === figure.position_y){
            // эта ветка отрабатывается, когда нажали на туже фигуру
            let previousFigure = this.selectedPieces.find(item => item.figure_type === figureTypes.FIGURE_MAKING_MOVE)
            if (previousFigure.position_x === position.position_x && previousFigure.position_y === position.position_y){
                for (const step of this.selectedPieces){
                    this.getFigure(step.position_x, step.position_y).setIsAttackedMove(false)
                }
                this.selectedPieces = []
                if ((figure.position_x + figure.position_y) % 2 === 0){
                    document.getElementById(chessPosition).className = "square white-square"
                }
                else {
                    document.getElementById(chessPosition).className = "square black-square"
                }
            }
        }
        else if (figure.color === side) {
            // эта ветка отрабатывается, когда нажали на другую фигуру
            let previousFigure = this.selectedPieces.find(item => item.figure_type === figureTypes.FIGURE_MAKING_MOVE)
            let previousFigureSquareName = convertCoordinatesToSquareName(previousFigure.position_x, previousFigure.position_y)

            for (const step of this.selectedPieces){
                this.getFigure(step.position_x, step.position_y).setIsAttackedMove(false)
            }
            this.selectedPieces = []
            if ((previousFigure.position_x + previousFigure.position_y) % 2 === 0){
                document.getElementById(previousFigureSquareName).className = "square white-square"
            }
            else {
                document.getElementById(previousFigureSquareName).className = "square black-square"
            }

            let possibleStep = figure.possibleSteps()
            let filteredSteps = this.filterSteps(possibleStep, side, figure.name)
            this.possibleSteps = structuredClone(filteredSteps)
            document.getElementById(chessPosition).className += " moved-square"
            this.selectedPieces.push({
                figure_type: figureTypes.FIGURE_MAKING_MOVE,
                position_x: position.position_x,
                position_y: position.position_y
            })
            this.showPossibleSteps(filteredSteps, side, figure.name)
        }
    }
    initBoard(){
        this.pieces = [
            this.createFigures(colors.BLACK, 0),
            this.createPawns(colors.BLACK, 1),
            this.createEmpty(2),
            this.createEmpty(3),
            this.createEmpty(4),
            this.createEmpty(5),
            this.createPawns(colors.WHITE, 6),
            this.createFigures(colors.WHITE, 7)
        ]
        this.drawBoard()
    }

    drawBoard(){
        const colum_name = ["A", "B", "C", "D", "E", "F", "G", "H"]
        const row_name = [8, 7, 6, 5, 4, 3, 2, 1]
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){

                const piece = document.createElement('div')
                piece.classList.add('piece');
                piece.textContent = this.getFigure(j, i).img
                const cell = document.createElement('div');

                this.setDocumentElementToFigure(j, i, piece)

                cell.addEventListener("click", this.onClickFunction)
                cell.classList.add("square")
                cell.setAttribute("id", colum_name[j]+row_name[i])
                if ((i + j) % 2 === 0){
                    cell.classList.add("white-square")
                }
                else {
                    cell.classList.add("black-square")

                }
                cell.appendChild(piece)
                this.chessboard.appendChild(cell)
            }
        }
    }

    moveFigure(
        init_position_x,
        init_position_y,
        end_position_x,
        end_position_y,
        piece
    ){
        this.getFigure(init_position_x, init_position_y).setPosition(end_position_x, end_position_y)
        this.getFigure(end_position_x, end_position_y).setPosition(init_position_x, init_position_y)

        const tempPiece = this.getFigure(end_position_x, end_position_y)

        this.setFigure(end_position_x, end_position_y, piece)
        this.setFigure(init_position_x, init_position_y, tempPiece)
        this.drawFigure(init_position_x, init_position_y, tempPiece)
        this.drawFigure(end_position_x, end_position_y, piece)

    }
    getFigureMakingMove(){
        return this.selectedPieces.find(item => item.figure_type === figureTypes.FIGURE_MAKING_MOVE)
    }
    drawFigure(position_x, position_y, piece){
        let positionName = convertCoordinatesToSquareName(position_x, position_y)
        let cellElement = document.getElementById(positionName)
        cellElement.replaceChildren(piece.documentElement)
    }
     showPossibleSteps(steps, moveSide, figureClass){
        // let filteredSteps = this.filterSteps(steps, moveSide, figureClass)
        let filteredSteps = steps
        for (const step of filteredSteps){
            if (figureClass === "pawn" && step.stepType === "attack"){
                let temp = this.getFigure(step.position_x, step.position_y)
                if (temp.name !== pieces.EMPTY){
                    temp.setIsAttackedMove(true)
                    this.selectedPieces.push({
                        figure_type: figureTypes.ATTACKED_FIGURE,
                        position_x: step.position_x,
                        position_y: step.position_y
                    })
                }
                continue
            }

            if (step.step_type === stepType.STEP){
                this.selectedPieces.push({
                    figure_type: figureTypes.MOVING_FIGURE,
                    position_x: step.position_x,
                    position_y: step.position_y
                })
            }
            else if (step.step_type === stepType.ATTACK){
                this.selectedPieces.push({
                    figure_type: figureTypes.ATTACKED_FIGURE,
                    position_x: step.position_x,
                    position_y: step.position_y
                })
            }
            this.getFigure(step.position_x, step.position_y).setIsAttackedMove(true)
        }
    }
    filterSteps(steps, moveSide, figureClass){
        let filteredSteps = []
        let tempStep
        let currentGroup = steps.position[0].step_type === undefined ? undefined : 0
        let isBlockedStep = false
        let isStepPawn = false

        for (const step of steps.position){

            if (figureClass === pieces.PAWN && step.stepType === "step"){
                if (this.getFigure(step.position_x, step.position_y).name === pieces.EMPTY){
                    tempStep = step
                    tempStep["step_type"] = stepType.STEP
                    filteredSteps.push(tempStep)
                    isStepPawn = true
                }
                else {
                    break
                }
                continue
            }

            if (step.step_group !== undefined && step.step_group !== currentGroup){

                currentGroup = step.step_group
                isBlockedStep = false
            }
            let possibleMoveFigure = this.getFigure(step.position_x, step.position_y)
            if (possibleMoveFigure.color === colors.EMPTY && !isBlockedStep){
                tempStep = step
                tempStep["step_type"] = stepType.STEP
                filteredSteps.push(tempStep)
            }

            else if (moveSide !== possibleMoveFigure.color && !isBlockedStep){
                tempStep = step
                tempStep["step_type"] = stepType.ATTACK
                filteredSteps.push(step)
                if (currentGroup !== undefined) {isBlockedStep = true}
            }
            else if (step.step_group !== undefined && step.position_x === possibleMoveFigure.position_x && step.position_y === possibleMoveFigure.position_y){
                isBlockedStep = true
            }
        }
        return filteredSteps
    }
    getFigures(){
        return this.pieces
    }
    getFigure(position_x, position_y){
        return this.pieces[position_y][position_x]
    }
    setFigure(position_x, position_y, piece){
        this.pieces[position_y][position_x] = piece
    }
    createPawns(color, position_y){
        let pawns = []
        pawns[0] = new Empty()
        for (let i = 0; i < 8; i++){
            pawns[i] = new Pawn(color, i, position_y)
        }
        return pawns
    }

    createEmpty(position_y){
        let emptys = []
        for (let i = 0; i < 8; i++){
            emptys[i] = new Empty(i, position_y)
        }
        return emptys
    }
    createFigures(color, position_y){
        let figures = []
        figures[0] = new Rook(color, 0, position_y)
        figures[1] = new Knight(color, 1, position_y)
        figures[2] = new Bishop(color, 2, position_y)
        figures[3] = new Queen(color, 3, position_y)
        figures[4] = new King(color, 4, position_y)
        figures[5] = new Bishop(color, 5, position_y)
        figures[6] = new Knight(color, 6, position_y)
        figures[7] = new Rook(color, 7, position_y)
        return figures
    }

    setDocumentElementToFigure(position_x, position_y, documentElement){
        this.pieces[position_y][position_x].documentElement = documentElement
    }

    setDocumentElementToCell(position_x, position_y, documentElement){
        // данная функция присваивает объект фигура на доску
        let cellName = convertCoordinatesToSquareName(position_x, position_y)
        let cellDocumentElement = document.getElementById(cellName)
        cellDocumentElement.replaceChildren(documentElement)
    }

    getCertainPiece(pieceName, side){
        let findPieces = []
        for (let i of this.getFigures()){
            for (let j of i){
                if (j.name === pieceName){
                    if (side === undefined || j.color === side) findPieces.push(j)
                }
            }
        }
        return findPieces
    }

    getSideFigures(side) {
        let sideFigures = []
        for (let i of this.getFigures()){
            for (let j of i){
                if (j.color === side){
                    sideFigures.push(j)
                }
            }
        }
        return sideFigures
    }

    saveBoard(){
        let pieces = []
        for (let i = 0; i < 8; i++){
            pieces.push([])
            for (let j = 0; j < 8; j++){
                pieces[i].push([])
            }
        }
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                pieces[j][i] = this.pieces[j][i].toJSON()
            }
        }

        return {
            pieces: pieces,
            selectedPieces: this.selectedPieces,
            possibleSteps: this.possibleSteps
        }
    }

    loadBoard(board_info){
        let pieces = {
            "pawn": Pawn,
            "king": King,
            "queen": Queen,
            "bishop": Bishop,
            "knight": Knight,
            "rook": Rook,
            "empty": Empty
        }
        this.selectedPieces = board_info["selectedPieces"]
        this.possibleSteps = board_info["possibleSteps"]
        for (let i = 0; i < 8; i++){
            this.pieces.push([])
            for (let j = 0; j < 8; j++){
                this.pieces[i].push([])
            }
        }
        for (let i = 0; i < 8; i++){

            for (let j = 0; j < 8; j++){
                let current_piece = board_info["pieces"][j][i]
                this.pieces[j][i] = new pieces[current_piece.name](current_piece.color, current_piece.position_x, current_piece.position_y, current_piece.isFirstStep)

            }
        }
        this.drawBoard()
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                this.pieces[j][i].setIsAttackedMove(board_info.pieces[j][i].isAttackedMove)
            }
        }
        // let figureMakingMove = this.selectedPieces.find(item => item.figure_type === figureTypes.FIGURE_MAKING_MOVE)
        // document.getElementById(convertCoordinatesToSquareName(figureMakingMove.position_x, figureMakingMove.position_y)).className += " moved-square"
    }
    deleteBoard(){
        this.selectedPieces = []
        this.possibleSteps = []
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                document.getElementById(convertCoordinatesToSquareName(i, j)).remove()
            }
        }
        this.pieces = []
    }
    resetBoard(){
        this.deleteBoard()
        this.initBoard()
    }
}