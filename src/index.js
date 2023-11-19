import './style.css'
import {chess} from "./chess/chess";
import {Statistics} from "./chess/statistics";
import {reverseSide} from "./chess/utlis";
import {sideMove} from "./chess/move";

const current_state = localStorage.getItem("current_state")
const appElement = document.getElementById("app")
const stats = new Statistics()

function changeState(state){
    localStorage.setItem("current_state", state)
    location.reload()
}

function lossGame(statistics, sideWon, stepsCount){
    stats.addRecord(localStorage.getItem("firstPlayerName"), localStorage.getItem("secondPlayerName"), sideWon === "white" ? 0 : 1, stepsCount)
    localStorage.setItem("game_save", "")
    changeState("statistics")
}

switch (current_state){
    case "main-menu":
    case null:
        document.title = "Главное меню"
        const mainHeader = document.createElement('h1')
        mainHeader.innerText = "Главное меню."

        const startGameButton = document.createElement("button")
        startGameButton.innerText = "Начать игру"

        const statsButton = document.createElement("button")
        statsButton.innerText = "Статистика"

        appElement.appendChild(mainHeader)
        appElement.appendChild(startGameButton)
        appElement.appendChild(statsButton)

        startGameButton.addEventListener("click", () => {
            const firstName = prompt("Введите имя первого игрока")
            const secondName = prompt("Введите имя второго игрока")
            localStorage.setItem("firstPlayerName", firstName)
            localStorage.setItem("secondPlayerName", secondName)
            localStorage.setItem("game_save", "")
            changeState("chess")
        })

        statsButton.addEventListener("click", ()=>{
            changeState("statistics")
        })

        break
    case "chess":
        document.title = "Шахматы"
        const chessboard = document.createElement("div")
        chessboard.className = "chessboard"

        const move = document.createElement("h2")
        const give_up = document.createElement("button")
        give_up.innerText = "Сдаться"

        const mainMenuButton = document.createElement("button")
        mainMenuButton.innerText = "Главное меню"



        appElement.appendChild(move)
        appElement.appendChild(chessboard)
        appElement.appendChild(give_up)
        appElement.appendChild(mainMenuButton)

        const chessGame = new chess(chessboard, move, () => {lossGame(stats, chessGame.move.side, chessGame.stepsCount)})
        chessGame.initGame()

        mainMenuButton.addEventListener("click", () => {
            chessGame.resetGame()
            changeState("main-menu")
        })

        give_up.addEventListener("click", () => {
            if (chessGame.move.side === sideMove.WHITE) alert("Белые проиграли")
            else alert("Черные проиграли")
            lossGame(stats, reverseSide(chessGame.move.side), chessGame.stepsCount)
        })

        break
    case "statistics":

        document.title = "Статистика"
        appElement.innerHTML = "<button id='main-menu-button'>Главное меню</button>" +
            "<table id=\"statisticsTable\">\n" +
            "    <thead>\n" +
            "        <tr>\n" +
            "            <th>Имя первого игрока</th>\n" +
            "            <th>Имя второго игрока</th>\n" +
            "            <th>Количество побед первого игрока</th>\n" +
            "            <th>Количество побед второго игрока</th>\n" +
            "        </tr>\n" +
            "    </thead>\n" +
            "    <tbody>\n" +
            "        <!-- Таблица будет заполнена динамически с использованием JavaScript -->\n" +
            "    </tbody>\n" +
            "</table>";

        const mm = document.getElementById("main-menu-button")
        mm.addEventListener("click", () => {
            changeState("main-menu")
        })

        let statisticsData = stats.getStatistics()

        let tableBody = document.getElementById('statisticsTable').getElementsByTagName('tbody')[0];
        let addedPairs = {};

        for (let i = 0; i < statisticsData.statistics.length; i++) {
            let pairKey = statisticsData.statistics[i].firstName + '-' + statisticsData.statistics[i].secondName;
            if (!addedPairs[pairKey]) {
                let row = tableBody.insertRow(tableBody.rows.length);
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);

                cell1.innerHTML = statisticsData.statistics[i].firstName;
                cell2.innerHTML = statisticsData.statistics[i].secondName;
                cell3.innerHTML = statisticsData.statistics[i].whoWon === 0 ? 1 : 0;
                cell4.innerHTML = statisticsData.statistics[i].whoWon === 1 ? 1 : 0;

                // Помечаем пару как добавленную
                addedPairs[pairKey] = true;
            } else {
                // Если пара уже добавлена, увеличиваем количество побед
                let existingRow = Array.from(tableBody.rows).find(row => row.cells[0].innerHTML === statisticsData.statistics[i].firstName && row.cells[1].innerHTML === statisticsData.statistics[i].secondName);
                existingRow.cells[statisticsData.statistics[i].whoWon + 2].innerHTML = parseInt(existingRow.cells[statisticsData.statistics[i].whoWon + 2].innerHTML) + 1;
            }
        }


        break

}
