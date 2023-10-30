const highscore = document.getElementById("Highscore");
const clrhighscore = document.getElementById("clear-Highscore");

clrhighscore.addEventListener('click', clrhighscore);

createHighscoreTable();
function createHighscoreTable() {
    let highscores = localStorage.getItem("highscoreList");
    if (highscore) {
        addHighscoreTable (highscores);
    }
}

function addHighscoreTable(highscore) {
    highscore = JSON.parse(highscore);

    highscore.forEach(function(scoreItem, index){
        const rankCell = createRankCell(index + 1);
        const scoreCell = createScoreCell( scoreItem.score);
        const initalCell = createInitialCell(scoreItem.initial);
        const highscoreTable = createHighscoreTable(rankCell, scoreCell, initalCell);
        highscore.appendChild (highscoreTable);
    });
}