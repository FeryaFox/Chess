import './pieces'
import {convertSquareNameToCoordinates} from "./utlis";
import {colors, Rook, Knight, Bishop, Queen, King, Empty, Pawn} from "./pieces"

export class Board{
    pieces = []

    constructor(chessboard, onclick, move) {
        this.chessboard = chessboard
        this.onClickFunction = onclick
    }

    onClickSquare(ev){
        console.log(this.getFigure(0, 0))
        console.log(ev)

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

                if ((i + j) % 2 === 0){
                    cell.classList.add("square")
                    cell.classList.add("white-square")
                    cell.setAttribute("id", colum_name[j]+row_name[i])
                    cell.appendChild(piece)
                }
                else {
                    cell.classList.add("square")
                    cell.classList.add("black-square")
                    cell.setAttribute("id", colum_name[j]+row_name[i])
                    cell.appendChild(piece)
                }
                this.chessboard.appendChild(cell)
            }
        }
    }

    getFigures(){
        return this.pieces
    }
    getFigure(position_x, position_y){
        return this.pieces[position_y][position_x]
    }

    createPawns(color, position_y){
        let pawns = []
        for (let i = 0; i < 8; i++){
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