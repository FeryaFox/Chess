import './pieces'
import {convertCoordinatesToSquareName, convertSquareNameToCoordinates} from "./utlis";
import {colors, Rook, Knight, Bishop, Queen, King, Empty, Pawn, stepType, pieces} from "./pieces"
import {sideMove} from "./move";

const figureTypes = {FIGURE_MAKING_MOVE: "figure_making_move", ATTACKED_FIGURE: "attacked", MOVING_FIGURE: "moving_figure"}
const sideType = {NOTHING: "nothing", CHANGESIDE: "changeside"}

export class Board{
    pieces = []
    selectedPieces = []
    possibleSteps = []

    constructor(chessboard, onclick) {
        this.chessboard = chessboard
        this.onClickFunction = onclick
    }

    checkIsPossibleStep(position_x, position_y, figureType){
        for (const step of this.possibleSteps){
            if (step.position_x === position_x && step.position_y === position_y && step.figure_type === figureType){
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

        console.log(this.checkIsPossibleStep(position.position_x, position.position_y, figureTypes.MOVING_FIGURE))
        if (figure.color === colors.EMPTY && this.checkIsPossibleStep(position.position_x, position.position_y, figureTypes.MOVING_FIGURE)) {
            let figureMakingMove = this.getFigureMakingMove()
            this.moveFigure(figureMakingMove.position_x, figureMakingMove.position_y, position.position_x, position.position_y, figure)
        }

        if (this.selectedPieces.length === 0){
            let possibleStep = figure.possibleSteps()
            let filteredSteps = this.filterSteps(possibleStep)
            console.log(filteredSteps)
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
            let filteredSteps = this.filterSteps(possibleStep)
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
                cell.onclick = (ev) => {

                }
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
        const tempPiece = this.getFigure(end_position_x, end_position_y)

        this.setFigure(end_position_x, end_position_y, piece)
        this.setFigure(init_position_x, init_position_y, tempPiece)
        this.drawFigure(init_position_x, init_position_y, tempPiece.documentElement)
        this.drawFigure(end_position_x, end_position_y, piece.documentElement)
    }
    getFigureMakingMove(){
        return this.selectedPieces.find(item => item.figure_type === figureTypes.FIGURE_MAKING_MOVE)
    }
    drawFigure(position_x, position_y, piece){
        let positionName = convertCoordinatesToSquareName(position_x, position_y)
        let cellElement = document.getElementById(positionName)
        cellElement.innerText = piece.documentElement
    }
    showPossibleSteps(steps, moveSide, figureClass){
        let filteredSteps = this.filterSteps(steps, moveSide)
        for (const step of filteredSteps){
            if (figureClass === pieces.PAWN && step.stepType === "attack"){
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
        // console.log(moveSide)
        // console.log(steps)
        let filteredSteps = []
        let tempStep
        let currentGroup = steps[0] === undefined ? undefined : 0
        let isBlockedStep = false
        for (const step of steps.position){
            if (step.step_group !== currentGroup){
                currentGroup = step.step_group
                isBlockedStep = false
            }
            let possibleMoveFigure = this.getFigure(step.position_x, step.position_y)

            // console.log(moveSide, possibleMoveFigure.color)
            // console.log(moveSide !== possibleMoveFigure.color)
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
}