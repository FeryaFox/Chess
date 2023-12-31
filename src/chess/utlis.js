export function removeElementFromArrayByIndex(a, index) {
    return a.filter((value, i) => i !== index)
}

export function convertSquareNameToCoordinates(squareName){
    const colum_name = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const row_name = [8, 7, 6, 5, 4, 3, 2, 1]
    return {
        "position_x": colum_name.indexOf(squareName[0]),
        "position_y": row_name.indexOf(parseInt(squareName[1]))
    }
}

export function convertCoordinatesToSquareName(position_x, position_y){
    const colum_name = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const row_name = [8, 7, 6, 5, 4, 3, 2, 1]
    return colum_name[position_x] + row_name[position_y].toString()
}

export function reverseSide(side){
    return side === "white" ? "black" : "white"
}