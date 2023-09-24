import './pieces'

export class Board{
    pieces = []
    initBoard(){
        this.pieces = [
            this.createFigures(colors.BLACK, 7),
            this.createPawns(colors.BLACK, 6),
            this.createEmpty(5),
            this.createEmpty(4),
            this.createEmpty(3),
            this.createEmpty(2),
            this.createPawns(colors.WHITE, 1),
            this.createFigures(colors.WHITE, 0)
        ]
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
        if (color === colors.BLACK){
            figures[0] = new Rook(colors.BLACK, 0, position_y)
            figures[1] = new Knight(colors.BLACK, 1, position_y)
            figures[2] = new Bishop(colors.BLACK, 2, position_y)
            figures[3] = new Queen(colors.BLACK, 3, position_y)
            figures[4] = new King(colors.BLACK, 4, position_y)
            figures[5] = new Bishop(colors.BLACK, 5, position_y)
            figures[6] = new Knight(colors.BLACK, 6, position_y)
            figures[7] = new Rook(colors.BLACK, 7, position_y)
        }
        else {
            figures[0] = new Rook(colors.WHITE, 0, position_y)
            figures[1] = new Knight(colors.WHITE, 1, position_y)
            figures[2] = new Bishop(colors.WHITE, 2, position_y)
            figures[3] = new Queen(colors.WHITE, 3, position_y)
            figures[4] = new King(colors.WHITE, 4, position_y)
            figures[5] = new Bishop(colors.WHITE, 5, position_y)
            figures[6] = new Knight(colors.WHITE, 6, position_y)
            figures[7] = new Rook(colors.WHITE, 7, position_y)
        }
        return figures
    }
}