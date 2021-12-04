var depth = 0;
var h = 0;
var isWon = false;
var playerTurn = true;
var player1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var player2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var limit = 100;
var origBoard;
var aiScore = '0';
var huScore = '0';
var isHint = false;
var h = 0;
var ties = '0';
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [2, 5, 8],
    [1, 4, 7],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function playerMove(b) {
    playerTurn = b;
}

function startNew() {
    isWon = false;
    startGame();
    h = 0;
}

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    if (!playerTurn)
        turn(bestSpot(), aiPlayer);
}

function turnClick(square) {
    isHint = false;
    for (var i = 0; i < cells.length; i++) {
        cells[i].style.removeProperty('background-color');
    }
    if (typeof origBoard[square.target.id] == 'number') {
        if (!isWon) {
            turn(square.target.id, huPlayer);
            checkTie();
        }
        if (!isWon) {
            turn(bestSpot(), aiPlayer);
            checkTie();
        }
    }
}

function turn(squareId, player) {
    if (!isWon) {
        origBoard[squareId] = player;
        document.getElementById(squareId).innerText = player;
        let gameWon = checkWin(origBoard, player);
        if (gameWon) gameOver(gameWon);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index, player: player };
            isWon = true;
            break;
        }
    }
    return gameWon;
}

function convertBoard(origBoard) {
    var newBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (playerTurn) {
        var x = 'X';
        var o = 'O';
    } else {
        var x = 'O';
        var o = 'X';
    }
    for (var i = 0; i < 9; i++) {
        if (origBoard[i] === x) {
            newBoard[i] = 2;
        } else if (origBoard[i] === o) {
            newBoard[i] = 1;
        } else
            newBoard[i] = 0;
    }
    return newBoard;
}


function setDiff(x) {
    limit = x;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    if (gameWon.player == huPlayer) {
        huScore++;
        var x = document.getElementById('leaderboard').rows[1].cells;
        x[0].innerHTML = huScore;
    } else if (gameWon.player == aiPlayer) {
        aiScore++;
        var x = document.getElementById('leaderboard').rows[1].cells;
        x[2].innerHTML = aiScore;
    }
    declareWinner(gameWon.player == huPlayer ? "You  win!" : "You  Lose!");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    recurse(convertBoard(origBoard));
    if (playerTurn)
        return choose(player2, 2);
    else
        return choose(player1, 1);
}


function resetLeaderBoard() {
    aiScore = 0;
    huScore = 0;
    ties = 0;
    var x = document.getElementById('leaderboard').rows[1].cells;
    x[2].innerHTML = aiScore;
    var x = document.getElementById('leaderboard').rows[1].cells;
    x[0].innerHTML = huScore;
    var x = document.getElementById('leaderboard').rows[1].cells;
    x[1].innerHTML = ties;
}

function checkTie() {
    if (winner(convertBoard(origBoard)) === 4) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie!");
        ties++;
        isWon = true;
        var x = document.getElementById('leaderboard').rows[1].cells;
        x[1].innerText = ties;
        return true;
    }
    return false;
}


function recurse(b) {
    var y = winner(b);
    if (y == 1)
        return 1;
    else if (y == 2)
        return -1;
    else if (y == 4)
        return 0;
    if (depth >= limit)
        return 0;
    var countx = 0;
    var counto = 0;
    for (var i = 0; i < 9; i++) {
        if (b[i] == 1)
            countx++;
        else if (b[i] == 2)
            counto++;
    }
    var player2turn = false;
    var num = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var n = 1;
    if (countx > counto) {
        player2turn = true;
        n = 2;
    }
    var d = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var j = 0; j < 9; j++)
        d[j] = b[j];
    for (var i = 0; i < 9; i++) {
        if (b[i] == 0) {
            d[i] = n;
            depth++;
            num[i] = recurse(d);
            depth--;
            d[i] = 0;
        } else {
            num[i] = 100;
        }
    }
    var min = 100;
    var max = -100;
    for (var i = 0; i < 9; i++) {
        if (num[i] < min && num[i] != 100)
            min = num[i];
        if (num[i] > max && num[i] != 100)
            max = num[i];
    }
    if (depth == 0) {
        for (var i = 0; i < 9; i++) {
            if (player2turn)
                player2[i] = num[i];
            else
                player1[i] = num[i];
        }
    }
    if (player2turn)
        return min;
    else
        return max;
}

function winner(x) {
    if (x[0] == x[1] && x[2] == x[0]) {
        if (x[0] != 0) {
            return x[0];
        }
    }
    if (x[0] == x[3] && x[6] == x[0]) {
        if (x[0] != 0) {
            return x[0];
        }
    }
    if (x[3] == x[4] && x[5] == x[3]) {
        if (x[3] != 0) {
            return x[3];
        }
    }
    if (x[6] == x[7] && x[8] == x[7]) {
        if (x[6] != 0) {
            return x[6];
        }
    }
    if (x[1] == x[7] && x[4] == x[7]) {
        if (x[1] != 0) {
            return x[1];
        }
    }
    if (x[2] == x[5] && x[2] == x[8]) {
        if (x[2] != 0) {
            return x[2];
        }
    }
    if (x[0] == x[4] && x[4] == x[8]) {
        if (x[0] != 0) {
            return x[0];
        }
    }
    if (x[2] == x[4] && x[2] == x[6]) {
        if (x[2] != 0) {
            return x[2];
        }
    }
    var k = true;
    for (var i = 0; i < 9; i++) {
        if (x[i] == 0) {
            k = false;
            break;
        }
    }
    if (k) {
        return 4;
    }
    return 0;
}

function choose(x, r) {
    var numwin = 0;
    var numdraw = 0;
    var numloss = 0;
    var n1;
    if (r == 1) {
        n1 = 1;
    } else {
        n1 = -1;
    }
    for (var i = 0; i < 9; i++) {
        if (x[i] == n1) {
            numwin++;
        } else if (x[i] == 0) {
            numdraw++;
        } else if (x[i] == -n1) {
            numloss++;
        }
    }
    if (numwin != 0) {
        var t = Math.floor(Math.random() * numwin);
        var c = 0;
        for (var i = 0; i < 9; i++) {
            if (x[i] == n1) {
                c++;
            }
            if (c > t) {
                return i;
            }
        }
    }
    if (numdraw != 0) {
        var t = Math.floor(Math.random() * numdraw);
        var c = 0;
        for (var i = 0; i < 9; i++) {
            if (x[i] == 0) {
                c++;
            }
            if (c > t) {
                return i;
            }
        }
    }
    if (numloss != 0) {
        var t = Math.floor(Math.random() * numloss);
        var c = 0;
        for (var i = 0; i < 9; i++) {
            if (x[i] == -n1) {
                c++;
            }
            if (c > t) {
                return i;
            }
        }
    }
    return 99;
}

function giveHint() {
    recurse(convertBoard(origBoard));
    if (playerTurn)
        return choose(player1, 1);
    else
        return choose(player2, 2);
}

function showHint() {
    if (h < 3 && !isHint) {
        var m = limit;
        limit = 100;
        isHint = true;
        document.getElementById(giveHint()).style.backgroundColor = "#9ad333";
        h++;
        limit = m;
    }
}

function changeTheme(x) {
    if (x == 1) {
        document.body.style.backgroundImage = "url('../../images/rovertic.jpg')";
        var elements = document.querySelectorAll('.cell');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.borderColor = "white";
            elements[i].style.color = "white";
        }
        document.getElementById("rbutton").style.backgroundColor = "#234723";
        document.getElementById("rbutton").style.color = "white";

        document.getElementById("resetbutton").style.backgroundColor = "#234732";
        document.getElementById("resetbutton").style.color = "white";
        document.getElementById("hint").style.backgroundColor = "#234732";
        document.getElementById("hint").style.color = "white";


        var t = document.getElementsByClassName("diff");
        for (var i = 0; i < t.length; i++) {
            t[i].style.backgroundColor = "#234723";
            t[i].style.color = "white";
        }
        var f = document.getElementsByClassName("stp");
        for (var i = 0; i < f.length; i++) {
            f[i].style.backgroundColor = "#234723";
            f[i].style.color = "white";
        }
        var s = document.getElementsByClassName("ch");
        for (var i = 0; i < s.length; i++) {
            s[i].style.backgroundColor = "#234723";
            s[i].style.color = "white";
        }
        var m = document.getElementsByClassName("mbutton");
        for (var i = 0; i < m.length; i++) {
            m[i].style.backgroundColor = "#234723";
            m[i].style.color = "white";
        }
        document.getElementById("lboard").style.backgroundColor = "#444444";
        document.getElementById("dboard").style.backgroundColor = "#444444";
    }
    if (x == 2) {
        document.body.style.backgroundImage = "url('../../images/bg2.jpg')";
        var elements = document.querySelectorAll('.cell');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.borderColor = "black";
            elements[i].style.color = "black";
        }
        document.getElementById("rbutton").style.backgroundColor = "#222222";
        document.getElementById("rbutton").style.color = "white";
        document.getElementById("resetbutton").style.backgroundColor = "#222222";
        document.getElementById("resetbutton").style.color = "white";
        document.getElementById("hint").style.backgroundColor = "#222222";
        document.getElementById("hint").style.color = "white";

        var t = document.getElementsByClassName("diff");
        for (var i = 0; i < t.length; i++) {
            t[i].style.backgroundColor = "#222222";
            t[i].style.color = "white";
        }
        var f = document.getElementsByClassName("stp");
        for (var i = 0; i < f.length; i++) {
            f[i].style.color = "white";
            f[i].style.backgroundColor = "#222222";
        }
        var s = document.getElementsByClassName("ch");
        for (var i = 0; i < s.length; i++) {
            s[i].style.backgroundColor = "#222222";
            s[i].style.color = "white";
        }
        var m = document.getElementsByClassName("mbutton");
        for (var i = 0; i < m.length; i++) {
            m[i].style.backgroundColor = "#222222";
            m[i].style.color = "white";
        }
        document.getElementById("lboard").style.backgroundColor = "#444444";
        document.getElementById("dboard").style.backgroundColor = "#444444";
    }

    if (x == 3) {
        document.body.style.backgroundImage = "url('../../images/bg3.jpg')";
        var elements = document.querySelectorAll('.cell');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.borderColor = "white";
            elements[i].style.color = "white";
        }
        document.getElementById("rbutton").style.backgroundColor = "#999999";
        document.getElementById("rbutton").style.color = "black";
        document.getElementById("resetbutton").style.backgroundColor = "#999999";
        document.getElementById("resetbutton").style.color = "black";
        document.getElementById("hint").style.backgroundColor = "#999999";
        document.getElementById("hint").style.color = "black";

        var t = document.getElementsByClassName("diff");
        for (var i = 0; i < t.length; i++) {
            t[i].style.backgroundColor = "#999999";
            t[i].style.color = "black";
        }
        var f = document.getElementsByClassName("stp");
        for (var i = 0; i < f.length; i++) {
            f[i].style.backgroundColor = "#999999";
            f[i].style.color = "black";
        }
        var s = document.getElementsByClassName("ch");
        for (var i = 0; i < s.length; i++) {
            s[i].style.backgroundColor = "#999999";
            s[i].style.color = "black";
        }
        var m = document.getElementsByClassName("mbutton");
        for (var i = 0; i < m.length; i++) {
            m[i].style.backgroundColor = "#999999";
            m[i].style.color = "black";
        }
        document.getElementById("lboard").style.backgroundColor = "#444444";
        document.getElementById("dboard").style.backgroundColor = "#444444";
    }
}