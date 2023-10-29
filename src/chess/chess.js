import './pieces'
import {Board} from './board'
import {Move, sideMove} from "./move";

export class chess{
    constructor(chessboard, move, onClickSquare) {

        this.board = new Board(chessboard, onClickSquare)
        this.move = new Move(move)
        this.move.setMove(sideMove.WHITE)
    }
    initGame(){
        // TODO load game
        this.board.initBoard()
    }
    onCLick(ev){
        let return_data = this.board.onClick(ev, this.move.side)
        if (return_data !== undefined){
            if (return_data.change_side) this.move.reversMove()
        }

        // TODO save game
    }
}

