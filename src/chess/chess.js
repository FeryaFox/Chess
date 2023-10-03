import './pieces'
import {Board} from './board'
import {move} from "./move";

export class chess{
    constructor(chessboard, move) {
        function onClickSquare(ev){
            this.board.onClickSquare(ev)
        }

        this.board = new Board(chessboard, onClickSquare, move)

        onClickSquare.bind(this.board)
    }
    createOnClick(){

    }
    initGame(){
        this.board.initBoard()

    }
}

