var n;
var playerTurn = false;
var origBoard;
var p1Score = 0;
var p2Score = 0;
var ties = 0;
const Player1 = 'X';
const Player2 = 'O';
var winstreak = [0,0,0,0];
var player1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var player2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(25).keys());
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
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player){
    let gameWon = null;
    var win = winner(convertBoard(origBoard));
    if ((win === 1)||(win === 2))
    {
	gameWon = {player: player};
    }
    if(gameWon == null)
	checkTie();
    return gameWon;
}

function gameOver(gameWon){
    for(var i=0; i<4; i++){
	var l =document.getElementById('tic').rows[Math.floor(winstreak[i]/5)].cells;
	l[winstreak[i]%5].style.backgroundColor = gameWon.player == Player1 ? "blue" : "red";
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
    declareWinner(gameWon.player == Player1 ? "Player 1 wins!" : "Player 2 wins!");
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function playerMove(b){
    playerTurn=b;
}

function resetLeaderBoard(){
    p1Score = 0;
    p2Score = 0;
    ties = 0;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[2].innerHTML=p2Score;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[0].innerHTML=p1Score;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[1].innerHTML=ties;
}

function convertBoard(origBoard){
    var newBoard = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0; i<25; i++){
	if(origBoard[i]==='X'){
	    newBoard[i]=2;
	}
	else if(origBoard[i]==='O'){
	    newBoard[i]=1;
	}
	else
	    newBoard[i]=0;
    }
    return newBoard;
}


function checkTie(){
     if(winner(convertBoard(origBoard))===4){
	
	for(var i = 0; i<cells.length; i++){
	    cells[i].style.backgroundColor = "green";
	    cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner("Tie!");
	ties++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[1].innerText=ties;
	return true;
    }
    return false;
}


function winner(A){
    for(var i=0;i<5;i++){
        if(A[i*5+1]==A[i*5+2]&&A[i*5+1]==A[i*5+3]&&A[i*5+1]==A[i*5+4]){
            if(A[i*5+1]!=0){
		winstreak= [i*5+1,i*5+2,i*5+3,i*5+4];
                return A[i*5+1];
            }
        }
        if(A[i*5]==A[i*5+1]&&A[i*5]==A[i*5+2]&&A[i*5]==A[i*5+3]){
            if(A[i*5]!=0){
		winstreak= [i*5,i*5+1,i*5+2,i*5+3];
                return A[i*5];
            }
        }
        if(A[5+i]==A[10+i]&&A[5+i]==A[15+i]&&A[5+i]==A[20+i]){
            if(A[5+i]!=0){
		winstreak= [5+i,10+i,15+i,20+i];
                return A[5+i];
            }
        }
        if(A[0*5+i]==A[5+i]&&A[0*5+i]==A[10+i]&&A[0*5+i]==A[15+i]){
            if(A[0*5+i]!=0){
		winstreak= [i,5+i,10+i,15+i];
                return A[0*5+i];
            }
        }
    }
    if(A[6]==A[12]&&A[18]==A[6]){
        if(A[0]==A[6]&&A[0]!=0){
	    winstreak= [0,6,12,18];
            return A[0];
        }
        if(A[24]==A[6]&&A[24]!=0){
	    winstreak= [6,12,18,24];
            return A[24];
        }
    }
    if(A[8]==A[12]&&A[16]==A[12]){
        if(A[4]==A[12]&&A[4]!=0){
	    winstreak= [4,8,12,16];
            return A[4];
        }
        if(A[20]==A[12]&&A[20]!=0){
	    winstreak= [8,12,16,20];
            return A[20];
        }
    }
    if(A[1]==A[7]&&A[13]==A[19]&&A[7]==A[13]){
        if(A[1]!=0){
	    winstreak= [1,7,13,19];
            return A[1];
        }
    }
    if(A[5]==A[11]&&A[17]==A[23]&&A[17]==A[11]){
        if(A[5]!=0){
	    winstreak= [5,11,17,23];
            return A[5];
        }
    }
    if(A[3]==A[7]&&A[11]==A[15]&&A[7]==A[11]){
        if(A[3]!=0){
	    winstreak= [3,7,11,15];
            return A[3];
        }
    }
    if(A[9]==A[13]&&A[17]==A[21]&&A[17]==A[13]){
        if(A[9]!=0){
	    winstreak= [9,13,17,21];
            return A[9];
        }
    }
    var k= true;
    for(var i=0;i<5;i++){
        for(var j=0;j<5;j++){
            if(A[i*5+j]==0){
                k=false;
                break;
            }
        }
        if(!k){
            break;
        }
    }
    if(k){
        return 4;
    }
    return 0;
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
