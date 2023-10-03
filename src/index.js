
import './style.css'

import './pieces'
import {Board} from './board'

const chessboard = document.getElementById("chessboard")
const colum_name = ["A", "B", "C", "D", "E", "F", "G", "H"]

const board = new Board()
board.initBoard()

for (let i = 0; i < 8; i++){
for (let j = 0; j < 8; j++){

    const piece = document.createElement('div')
    piece.classList.add('piece');
    piece.textContent = board.getFigure(j, i).img
    const cell = document.createElement('div');

    board.setDocumentElementToFigure(j, i, piece)

    if ((i + j) % 2 === 0){
        cell.classList.add("square")
        cell.classList.add("white-square")
        cell.setAttribute("id", colum_name[j]+i)
        cell.appendChild(piece)
    }
    else {
        cell.classList.add("square")
        cell.classList.add("black-square")
        cell.setAttribute("id", colum_name[j]+i)
        cell.appendChild(piece)
    }
    chessboard.appendChild(cell)
}
}

console.log(board.getFigure(4, 0).documentElement)