export const sideMove = {WHITE: "white", BLACK: "black"}

export class Move{
    side
    constructor(moveElement) {
        this.moveElement = moveElement
    }
    setMove(side){
        if (side === sideMove.BLACK){
            this.side = sideMove.BLACK
            this.moveElement.innerHTML = "Ход черных"
        }
        else {
            this.side = sideMove.WHITE
            this.moveElement.innerHTML = "Ход белых"
        }
    }
    get side(){
        return this.side
    }
    reversMove(){
        if (this.side === sideMove.BLACK){
            this.side = sideMove.WHITE
            this.moveElement.innerHTML = "Ход белых"
        }
        else {
            this.side = sideMove.BLACK
            this.moveElement.innerHTML = "Ход черных"
        }
    }
}