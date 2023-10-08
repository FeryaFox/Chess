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