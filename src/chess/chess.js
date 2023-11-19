import './pieces'
import {Board} from './board'
import {Move, sideMove} from "./move";
import {stepType} from "./pieces";

export class chess{
    constructor(chessboard, move, lossFunction) {
        this.move = new Move(move)
        this.board = new Board(chessboard, (ev) => this.onCLick(ev))
        this.stepsCount = 0
        this.lossFunction = lossFunction
    }
    initGame(){
        if (!this.loadGame()) {
            this.move.setMove(sideMove.WHITE)
            this.board.initBoard()
        }
    }
    showLoss(){
        if (this.move.side === sideMove.WHITE) alert("Черные проиграли")
        else alert("Белые проиграли")
    }
    endGame(){
        this.showLoss()
        this.lossFunction()
    }
    resetGame(){
        localStorage.setItem("game_save", "")
        this.stepsCount = 0
        this.board.resetBoard()
        this.move.setMove(sideMove.WHITE)
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
        let boardInfo = this.board.saveBoard()
        this.saveGame(
            {
                board: boardInfo,
                moveSide: this.move.side,
                stepsCount: this.stepsCount
            }
        )
    }

    saveGame(chess_info){
        console.log(chess_info)
        localStorage.setItem("game_save", JSON.stringify(chess_info))
    }
    loadGame(){
        let game_save = localStorage.getItem("game_save")
        if (game_save === null || game_save === "") return false;
        game_save = JSON.parse(game_save)
        this.move.setMove(game_save.moveSide)
        this.board.loadBoard(game_save.board)
        this.stepsCount = game_save.stepsCount
        return true
    }
}

