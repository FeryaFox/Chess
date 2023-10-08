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
        this.board.initBoard()
    }
    onCLick(ev){
        this.board.onClick(ev, this.move.side)
    }
}

