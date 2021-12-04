var origBoard;
var n;
var playerTurn = false;
var p1Score = '0';
var p2Score = '0';
var ties = '0';
const Player1 = 'X';
const Player2 = 'O';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [2,5,8],
    [1,4,7],
    [0,4,8],
    [2,4,6]
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for(var i =0; i<cells.length; i++){
	cells[i].innerText='';
	cells[i].style.removeProperty('background-color');
	cells[i].addEventListener('click', turnClick, false);
    }
    if(playerTurn)
	n=2;
    else
	n=1;
}

function turnClick(square){
    if(typeof origBoard[square.target.id] == 'number'){
	if(n%2==1){
	    turn(square.target.id, Player1);
	    cells[square.target.id].removeEventListener('click', turnClick, false);
	}
	else{
	    turn(square.target.id, Player2);
	    cells[square.target.id].removeEventListener('click', turnClick, false);
	}
    }
    n++;
    
}

function turn(squareId, player){
    console.log(player);
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function resetLeaderBoard(){
    aiScore = 0;
    p1Score = 0;
    p2Score = 0;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[2].innerHTML=p2Score;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[0].innerHTML=p1Score;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[1].innerHTML=ties;
}


function checkWin(board, player){
    let plays = board.reduce((a,e,i) =>
			     (e===player)?a.concat(i):a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
	if(win.every(elem => plays.indexOf(elem) > -1)) {
	    gameWon = {index, player: player};
	    break;
	}
    }
    if(gameWon == null)
	checkTie();
    return gameWon;
}

function playerMove(b){
    playerTurn=b;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
	document.getElementById(index).style.backgroundColor = gameWon.player == Player1 ? "blue" : "red";
    }
    for(var i=0; i<cells.length; i++){
	cells[i].removeEventListener('click', turnClick, false);
    }
    if(gameWon.player == Player1){
	p1Score++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[0].innerHTML=p1Score;
    }
    else if(gameWon.player == Player2){
	p2Score++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[2].innerHTML=p2Score;
    }
    declareWinner(gameWon.player == Player1 ? "Player 1 Wins!" : "Player 2 Wins!");
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function checkTie(){
    if(emptySquares().length == 0){
	for(var i = 0; i<cells.length; i++){
	    cells[i].style.backgroundColor = "green";
	    cells[i].removeEventListener('click', turnClick, false);    
	}
	ties++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[1].innerText=ties;
	declareWinner("Tie!");
    }
}

function changeTheme(x){
    if(x==1){
	document.body.style.backgroundImage = "url('../../images/rovertic.jpg')";
	var elements = document.querySelectorAll('.cell');
	for (var i = 0; i < elements.length; i++) {
	    elements[i].style.borderColor="white";
	    elements[i].style.color="white";
	}
	document.getElementById("rbutton").style.backgroundColor = "#234723";
	document.getElementById("rbutton").style.color = "white";

	document.getElementById("resetbutton").style.backgroundColor = "#234732";
	document.getElementById("resetbutton").style.color = "white";	

	var t = document.getElementsByClassName("diff");
	for (var i = 0; i <t.length; i++) {
	    t[i].style.backgroundColor="#234723";
	    t[i].style.color="white";
	}
	var f = document.getElementsByClassName("stp");
	for (var i = 0; i <f.length; i++) {
	    f[i].style.backgroundColor="#234723";
	    f[i].style.color="white";
	}
	var s = document.getElementsByClassName("ch");
	for (var i = 0; i <s.length; i++) {
	    s[i].style.backgroundColor="#234723";
	    s[i].style.color="white";
	}
	var m = document.getElementsByClassName("mbutton");
	for (var i = 0; i <m.length; i++) {
	    m[i].style.backgroundColor="#234723";
	    m[i].style.color="white";
	}
	document.getElementById("lboard").style.backgroundColor = "#444444";
	document.getElementById("dboard").style.backgroundColor = "#444444";
    }
    if(x==2){
	document.body.style.backgroundImage = "url('../../images/bg2.jpg')";
	var elements = document.querySelectorAll('.cell');
	for (var i = 0; i < elements.length; i++) {
	    elements[i].style.borderColor="black";
	    elements[i].style.color="black";
	}
	document.getElementById("rbutton").style.backgroundColor = "#222222";
	document.getElementById("rbutton").style.color = "white";
	document.getElementById("resetbutton").style.backgroundColor = "#222222";
	document.getElementById("resetbutton").style.color = "white";
	
	var t = document.getElementsByClassName("diff");
	for (var i = 0; i <t.length; i++) {
	    t[i].style.backgroundColor="#222222";
	    t[i].style.color="white";
	}
	var f = document.getElementsByClassName("stp");
	for (var i = 0; i <f.length; i++) {
	    f[i].style.color="white";
	    f[i].style.backgroundColor="#222222";
	}
	var s = document.getElementsByClassName("ch");
	for (var i = 0; i <s.length; i++) {
	    s[i].style.backgroundColor="#222222";
	    s[i].style.color="white";
	}
	var m = document.getElementsByClassName("mbutton");
	for (var i = 0; i <m.length; i++) {
	    m[i].style.backgroundColor="#222222";
	    m[i].style.color="white";
	}
	document.getElementById("lboard").style.backgroundColor = "#444444";
	document.getElementById("dboard").style.backgroundColor = "#444444";
    }
    
    if(x==3){
	document.body.style.backgroundImage = "url('../../images/bg3.jpg')";
	var elements = document.querySelectorAll('.cell');
	for (var i = 0; i < elements.length; i++) {
	    elements[i].style.borderColor="white";
	    elements[i].style.color="white";
	}
	document.getElementById("rbutton").style.backgroundColor = "#999999";
	document.getElementById("rbutton").style.color = "black";
	document.getElementById("resetbutton").style.backgroundColor = "#999999";
	document.getElementById("resetbutton").style.color = "black";
	
	var t = document.getElementsByClassName("diff");
	for (var i = 0; i <t.length; i++) {
	    t[i].style.backgroundColor="#999999";
	    t[i].style.color="black";
	}
	var f = document.getElementsByClassName("stp");
	for (var i = 0; i <f.length; i++) {
	    f[i].style.backgroundColor="#999999";
	    f[i].style.color="black";
	}
	var s = document.getElementsByClassName("ch");
	for (var i = 0; i <s.length; i++) {
	    s[i].style.backgroundColor="#999999";
	    s[i].style.color="black";
	}
	var m = document.getElementsByClassName("mbutton");
	for (var i = 0; i <m.length; i++) {
	    m[i].style.backgroundColor="#999999";
	    m[i].style.color="black";
	}
	document.getElementById("lboard").style.backgroundColor = "#444444";
	document.getElementById("dboard").style.backgroundColor = "#444444";
    }
}
