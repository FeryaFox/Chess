import './style.css'
import {chess} from "./chess/chess";

const chessboard = document.getElementById("chessboard")
const move = document.getElementById("move")

const chessGame = new chess(chessboard, move)
chessGame.initGame()