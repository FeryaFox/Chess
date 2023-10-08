import './style.css'
import {chess} from "./chess/chess";

const chessboard = document.getElementById("chessboard")
const move = document.getElementById("move")


function onClickSquare(ev){
    chessGame.onCLick(ev)
}
const chessGame = new chess(chessboard, move, onClickSquare)
chessGame.initGame()
