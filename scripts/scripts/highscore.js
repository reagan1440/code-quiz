const highscoretable = document.getElementById("highscores-table");
const clearscorebtn = document.getElementById("clear-highscores");

clearscorebtn.addEventListener('click', clrHighScore);

createHighscoreTable();

function createHighscoreTable() {
  let highscores = localStorage.getItem("scoreList");
  if (highscores) {
    addHighscoreTbl(highscores);
  } 
}

function addHighscoreTbl(highscores) {
  highscores = JSON.parse(highscores);

  highscores.forEach(function(scoreItem, index) {
    const rankCell = makeRankCell(index + 1);
    const scoreCell = makeScoreCell(scoreItem.score);
    const initialsCell = makeIntlCell(scoreItem.initials);
    const highscoreTableRow = makeHighScoreTblRow(rankCell, scoreCell, initialsCell);
    highscoretable.appendChild(highscoreTableRow);
  });
}

function makeRankCell(rank) {
  const rankCell = document.createElement('td');
  rankCell.textContent = `#${rank}`;
  return rankCell;
}

function makeScoreCell(score) {
  const scoreCell = document.createElement('td');
  scoreCell.textContent = score;
  return scoreCell;
}

function makeIntlCell(initials) {
  const initialsCell = document.createElement('td');
  initialsCell.textContent = initials;
  return initialsCell;
}

function makeHighScoreTblRow(rankCell, scoreCell, initialsCell) {
  const tableRow = document.createElement('tr');
  tableRow.appendChild(rankCell);
  tableRow.appendChild(scoreCell);
  tableRow.appendChild(initialsCell);
  return tableRow;
}

function clrHighScore() {
  localStorage.setItem('scoreList', []);
  while (highscoretable.children.length > 1) {
    highscoretable.removeChild(highscoretable.lastChild);
  }
}