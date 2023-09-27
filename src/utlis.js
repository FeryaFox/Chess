export function removeElementFromArrayByIndex(a, index) {
    return a.filter((value, i) => i !== index)
}