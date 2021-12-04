var limit;
var h=0
var isWon=false;
var playerTurn=true;
var difficulty=3;
var aiScore = '0';
var huScore = '0';
var ties = '0';
var depth=0;
var isHint = false;
var h=0;
var player1= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var player2= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const huPlayer = 'O';
const aiPlayer = 'X';
const wincombos = [
    [0,1,2,3],
    [4,5,6,7],
    [8,9,10,11],
    [12,13,14,15],
    [0,4,8,12],
    [1,5,9,13],
    [2,6,10,14],
    [3,7,11,15],
    [0,5,10,15],
    [3,6,9,12]
]

const cells = document.querySelectorAll('.cell');
startGame();
function playerMove(b){
    playerTurn = b;
}

function startNew(){
    isWon=false;
    startGame();
    h=0;
}

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(16).keys());
    for(var i =0; i<cells.length; i++){
	cells[i].innerText='';
	cells[i].style.removeProperty('background-color');
	cells[i].addEventListener('click', turnClick, false);
    }
    decidelimit(convertBoard(origBoard));
    if(!playerTurn){
    	turn(bestSpot(), aiPlayer);
    }
}

function turnClick(square){
    isHint = false;
    for(var i =0; i<cells.length; i++){
	cells[i].style.removeProperty('background-color'); }
    if(typeof origBoard[square.target.id] == 'number'){
	decidelimit(convertBoard(origBoard));
	if(!checkTie())
	    turn(square.target.id, huPlayer);
	decidelimit(convertBoard(origBoard));
	if(!checkTie())
	    turn(bestSpot(), aiPlayer);
	checkTie();
    }
}

function turn(squareId, player){
    if(!isWon){
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon)
	    gameOver(gameWon);
    }
}

function checkWin(board, player){
    let plays = board.reduce((a,e,i) =>
			     (e===player)?a.concat(i):a, []);
    let gameWon = null;
    for(let [index, win] of wincombos.entries()){
	if(win.every(elem => plays.indexOf(elem) > -1)) {
	    gameWon = {index, player: player};
	    isWon=true;
	    break;
	}
    }
    return gameWon;
}

function setDiff(d){
    difficulty=d;
}

function gameOver(gameWon){
    for(let index of wincombos[gameWon.index]){
	document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
    }
    for(var i=0; i<cells.length; i++){
	cells[i].removeEventListener('click', turnClick, false);
    }
    if(gameWon.player == huPlayer){
	huScore++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[0].innerHTML=huScore;
    }
    else if(gameWon.player == aiPlayer){
	aiScore++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[2].innerHTML=aiScore;
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You Lose!");
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function convertBoard(origBoard){
    var newBoard = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if(playerTurn){
	var x = 'X';
	var o = 'O';
    }
    else{
	var x = 'O';
	var o = 'X';
    }
    for(var i=0; i<16; i++){
	if(origBoard[i]===x){
	    newBoard[i]=2;
	}
	else if(origBoard[i]===o){
	    newBoard[i]=1;
	}
	else
	    newBoard[i]=0;
    }
    return newBoard;
}

function bestSpot(){
    recurse(convertBoard(origBoard));
    if(playerTurn)
	return choose(player2,2);
    else
	return choose(player1,1);
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

function resetLeaderBoard(){
    aiScore = 0;
    huScore = 0;
    ties = 0;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[2].innerHTML=aiScore;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[0].innerHTML=huScore;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[1].innerHTML=ties;
}

function recurse(b){
    var y = winner(b);
    if(y==1){
	return 1;    
    }
    else if(y==2){
	return -1;
    }
    else if(y==4){
	return 0;
    }
    if(depth>=limit){
	return 0;
    }
    var countx=0;
    var counto=0;
    for(var i=0;i<16;i++){
	if(b[i]==1){
	    countx++;
	}
	else if (b[i]==2){
	    counto++;
	}
    }
    var n1=1;
    var n2=2;
    var m1=1;
    var m2=-1;
    var player2turn = false;
    if(countx>counto){
	player2turn = true;	
	n1=2;
	n2=1;
	m1=-1;
	m2=1;
    }
    var d = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var num = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var m=check(b,n1);
    if(m!=99){
	if(depth==0){
	    for(var i=0;i<16;i++){
		if(b[i]!=0){
		    num[i]=100;
		}
		else{
		    num[i]=0;
		}
	    }
	    num[m]=m1;
	    for(var i=0;i<16;i++){
		if(player2turn){
		    player2[i]=num[i];
		}
		else{
		    player1[i]=num[i];	
		}
	    }
	}
	return m1;
    }
    var c=check(b,n2);
    if(c!=99){
	for(var j=0;j<16;j++){
	    d[j]=b[j];
	}
	d[c]=n1;
	depth++;
	var u = recurse(d);
	depth--;
	if(depth==0){
	    for(var i=0;i<16;i++){
		if(b[i]!=0){
		    num[i]=100;
		}
		else{
		    num[i]=m2;
		}
	    }
	    num[c]=0;
	    for(var i=0;i<16;i++){
		if(player2turn){
		    player2[i]=num[i];
		}
		else{
		    player1[i]=num[i];	
		}
	    }
	}
	return u;
    }
    for(var j=0;j<16;j++){
	d[j]=b[j];
    }
    for(var i=0;i<16;i++){
	if(b[i]==0){
	    d[i]=n1;
	    depth ++;
	    num[i]= recurse(d);
	    depth--;
	    d[i]=0;
	    if(num[i]==m1){
		if(depth==0){
		    for(var j=0;j<16;j++){
			if(b[j]!=0){
			    num[j]=100;
			}
			else{
			    num[j]=0;
			}
		    }
		    num[i]=m1;
		    for(var j=0;j<16;j++){
			if(player2turn){
			    player2[i]=num[i];
			}
			else{
			    player1[i]=num[i];	
			}
		    }
		}
		return m1;
	    }
	}
	else{
	    num [i] = 100;
	}
    }
    var min =100;
    var max =-100;
    var g=0;
    for(var i=0;i<16;i++){
	if(num[i]<min&&num[i]!=100){
	    min = num[i];
	    g=i;
	}
	if(num[i]>max&&num[i]!=100){
	    max = num[i];
	    g=i;
	}
    }
    if(depth===0){
	for(var i=0;i<16;i++){
	    if(player2turn){
		player2[i]=num[i];
	    }
	    else{
		player1[i]=num[i];	
	    }
	}
    }
    if(player2turn){
	return min;
    }
    else{
	return max;	
    }

}

function winner(x){
    for (var i=0;i<10;i++){
	var c=wincombos[i][0];
	if(x[c]!=0){
	    var win = true;
	    for(var j=1;j<4;j++){
		if(x[wincombos[i][j]]!=x[c]){
		    win=false;
		    break;
		}
	    }
	    if(win){
		return x[c];
	    }
	}
    }
    var k=true;
    for(var i=0;i<16;i++){
	if(x[i]==0){
	    k=false;
	    break;
	}
    }
    if(k){
	return 4;
    }
    return 0;
    
}

function check(b,p){
    var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0;i<16;i++){
	a[i]=b[i];
    }
    for(var i=0;i<16;i++){
	if(b[i]==0){
	    a[i]=p;
	    if(winner(a)==p){
		return i;
	    }
	    a[i]=0;
	}
    }
    return 99;
}

function decidelimit(x){
    var y = countmove(x);
    if(y==0||y==1||y==2||y==3){
	limit = 1;
    }
    else if(y==4||y==5){
	limit = 6;
    }
    else if(y==6||y==7){
	limit = 7;
    }
    else{
	limit = 100;
    }
}
function choose(x,l){
    var numwin=0;
    var numdraw=0;
    var numloss=0;	
    if(l==1){
	var p = 1;
    }
    else{
	var p =-1;	
    }
    for(var i=0;i<16;i++){

	if(x[i]==p){
	    numwin++;
	}
	else if(x[i]==0){
	    numdraw++;
	}
	else if(x[i]==-p){
	    numloss++;
	}
	
    }
    var c=0;
    var winmove;
    if(difficulty == 0){
	winmove = 50;
    }
    else if(difficulty == 1){
	winmove = 65;
    }
    else if(difficulty == 2){
	winmove = 80;
    }
    else if(difficulty == 3){
	winmove = 100;
    }
    var e = Math.floor(Math.random()*100);
    if(e<winmove){
	c=1;
    }
    if(c==1){
	if(numwin!=0){
	    var t = Math.floor(Math.random()*numwin);
	    var c=0;
	    for(var i=0;i<16;i++){
		if(x[i]==p){
		    c++;
		}
		if(c>t){
		    return i;
		}
	    }
	}
	if(numdraw!=0){
	    var t = Math.floor(Math.random()*numdraw);
	    var c=0;
	    for(var i=0;i<16;i++){
		if(x[i]==0){
		    c++;
		}
		if(c>t){
		    return i;
		}
	    }
	}
	if(numloss!=0){
	    var t = Math.floor(Math.random()*numloss);
	    var c=0;
	    for(var i=0;i<16;i++){
		if(x[i]==-p){
		    c++;
		}
		if(c>t){
		    return i;
		}
	    }
	}
    } 
    else if(c==0){
	if(numloss!=0){
	    var t = Math.floor(Math.random()*numloss);
	    var c=0;
	    for(var i=0;i<16;i++){
		if(x[i]==-p){
		    c++;
		}
		if(c>t){
		    return i;
		}
	    }
	}
	if(numdraw!=0){
	    var t = Math.floor(Math.random()*numdraw);
	    var c=0;
	    for(var i=0;i<16;i++){
		if(x[i]==0){
		    c++;
		}
		if(c>t){
		    return i;
		}
	    }
	}
	if(numwin!=0){
	    var t = Math.floor(Math.random()*numwin);
	    var c=0;
	    for(var i=0;i<16;i++){
		if(x[i]==p){
		    c++;
		}
		if(c>t){
		    return i;
		}
	    }
	}
    } 
    return 99;
}

function countmove(x){
    var n=0;
    for(var i =0;i<16;i++){
	if(x[i]!=0){
	    n++;
	}
    }
    return n;
}

function giveHint(){
    decidelimit(convertBoard(origBoard));
    recurse(convertBoard(origBoard));
    if(playerTurn)
	return choose(player1,1);
    else
	return choose(player2,2);
}

function showHint(){
    if(h<3&&!isHint){
	var m = difficulty;
	difficulty = 3;
	isHint = true;
	document.getElementById(giveHint()).style.backgroundColor = "#9ad333";
	h++;
	difficulty = m;
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
	document.getElementById("hint").style.backgroundColor = "#234732";
	document.getElementById("hint").style.color = "white";
	

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
	document.getElementById("hint").style.backgroundColor = "#222222";
	document.getElementById("hint").style.color = "white";
	
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
	document.getElementById("hint").style.backgroundColor = "#999999";
	document.getElementById("hint").style.color = "black";
	
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
