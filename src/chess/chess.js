import './pieces'
import {Board} from './board'
import {Move, sideMove} from "./move";
import {stepType} from "./pieces";

export class chess{
    constructor(chessboard, move, onClickSquare) {
        this.board = new Board(chessboard, onClickSquare)
        this.move = new Move(move)
        this.move.setMove(sideMove.WHITE)
        this.stepsCount = 0
    }
    initGame(){
        // TODO load game
        this.board.initBoard()
    }
    showLoss(){
        if (this.move.side === sideMove.WHITE) alert("Черные проиграли")
        else alert("Белые проиграли")
    }
    endGame(){
        this.showLoss()

    }
    incStepsCount(){
        this.stepsCount++
    }
    onCLick(ev){
        let return_data = this.board.onClick(ev, this.move.side)
        if (return_data !== undefined){
            this.incStepsCount()
            if (return_data.change_side) {
                this.move.reversMove()
            }
            if (return_data.king_is_beaten) {
                this.endGame()
            }
        }

        // TODO save game
    }
}

