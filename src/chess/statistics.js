export class Statistics{
    constructor() {
        const local_stats = localStorage.getItem("statistics")
        this.statistics = local_stats === null || local_stats === "" ? {"statistics": []} : JSON.parse(local_stats)
    }
    getStatistics(){
        return this.statistics
    }
    addRecord(firstName, secondName, whoWon, stepsCount){
        this.statistics["statistics"].push({
            firstName: firstName,
            secondName: secondName,
            whoWon: whoWon,
            stepsCount: stepsCount
        })
        console.log(this.statistics)
        localStorage.setItem("statistics", JSON.stringify(this.statistics))
    }
}