export const sideMove = {WHITE: "white", BLACK: "black"}

export class move{
    constructor(moveElement) {
        this.moveElement = moveElement
    }
    setMove(side){
        if (side === side["BLACK"]){
            this.moveElement.innerHTML = "Ход черных"
        }
        else {
            this.moveElement.innerHTML = "Ход белых"
        }
    }
}