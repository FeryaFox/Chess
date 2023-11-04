import './pieces'
import {convertCoordinatesToSquareName, convertSquareNameToCoordinates} from "./utlis";
import {colors, Rook, Knight, Bishop, Queen, King, Empty, Pawn, stepType, pieces} from "./pieces"

const figureTypes = {FIGURE_MAKING_MOVE: "figure_making_move", ATTACKED_FIGURE: "attacked", MOVING_FIGURE: "moving_figure"}

export class Board{
    pieces = []
    selectedPieces = []
    possibleSteps = []

    constructor(chessboard, onclick) {
        this.chessboard = chessboard
        this.onClickFunction = onclick
    }

    checkIsPossibleAttack(position_x, position_y){
        for (const step of this.possibleSteps){
            console.log(step)
            if (step.position_x === position_x && step.position_y === position_y && step.step_type === stepType.ATTACK){
                return true
            }
        }
        return false
    }

    checkIsPossibleStep(position_x, position_y){
        for (const step of this.possibleSteps){
            if (step.position_x === position_x && step.position_y === position_y && step.stepType === stepType.STEP){
                return true
            }
        }
        return false
    }

    onClick(ev, side){
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
        console.log(this.checkIsPossibleAttack(position.position_x, position.position_y, figureTypes.MOVING_FIGURE))
        if (figure.color !== side && this.checkIsPossibleAttack(position.position_x, position.position_y, figureTypes.MOVING_FIGURE)){
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

            return {change_side: true, board_info: JSON.stringify(this.getFigures())}
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
            this.showPossibleSteps(possibleStep, side, figure.name)
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
            this.showPossibleSteps(possibleStep, side, figure.name)
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

                cell.onclick = this.onClickFunction
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

        // this.setDocumentElementToFigure(init_position_x, init_position_y, piece.documentElement)
        // this.setDocumentElementToFigure(end_position_x, end_position_y, tempPiece.documentElement)
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
        let filteredSteps = this.filterSteps(steps, moveSide, figureClass)
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
        let currentGroup = steps === undefined ? undefined : 0
        let isBlockedStep = false
        let isStepPawn = false
        if (steps === undefined) return;



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

            if (step.step_group !== currentGroup){
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
            else if (step.position_x === possibleMoveFigure.position_x && step.position_y === possibleMoveFigure.position_y){
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
        for (let i = 1; i < 8; i++){
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
}