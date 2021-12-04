var limit;
var h=0;
var isWon=false;
var playerTurn=true;
var difficulty=3;
var aiScore = 0;
var huScore = 0;
var ties = 0;
var isHint = false;
const huPlayer = 'O';
const aiPlayer = 'X';
var depth=0;
var winstreak = [0,0,0,0];
var player1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var player2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const cells = document.querySelectorAll('.cell');
startGame();
function playerMove(b){
    playerTurn = b;
}

function startNew(){
    isWon=false;
    h=0;
    startGame();
}

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(25).keys());
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
    for(var i = 0; i<cells.length; i++){
	cells[i].removeEventListener('click', turnClick, false);
    }
     for(var i =0; i<cells.length; i++){
	cells[i].style.removeProperty('background-color');
    }
    if(typeof origBoard[square.target.id] == 'number'){
	decidelimit(convertBoard(origBoard));
	turn(square.target.id, huPlayer);
    }
    decidelimit(convertBoard(origBoard));
    turn(bestSpot(), aiPlayer);
    for(var i = 0; i<cells.length; i++){
	if(origBoard[i]!='X'&&origBoard[i]!='O')
	    cells[i].addEventListener('click', turnClick, false);
    }
    checkTie();
}

function turn(squareId, player){
    if(!isWon){
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
    }
}

function checkWin(board, player){
    let gameWon = null;
    var win = winner(convertBoard(origBoard));
    if ((win === 1)||(win === 2))
    {
	gameWon = {player: player};
	isWon=true;
    }
    
    return gameWon;
}

function setDiff(d){
    difficulty=d;
}

function gameOver(gameWon){
    for(var i=0; i<4; i++){
	var l =document.getElementById('tic').rows[Math.floor(winstreak[i]/5)].cells;
	l[winstreak[i]%5].style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
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
    var newBoard = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if(playerTurn){
	var x = 'X';
	var o = 'O';
    }
    else{
	var x = 'O';
	var o = 'X';
    }
    for(var i=0; i<25; i++){
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

function recurse(b){
    var num = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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
    for(var i=0;i<25;i++){
        if(b[i]==1){
            countx++;
        }
        else if (b[i]==2){
            counto++;
        }
    }
    
    if(countx==0){
        for(var i=0;i<25;i++){
            if(b[i]!=0){
                num[i]=-100;
            }
            else{
                num[i]=-1;
            }
        }
        num[12]=0;
        for(var i=0;i<25;i++){
            player1[i]=num[i];
        }
    }
    else if(countx==1&&counto==0){
        if(b[12]==0){
            for(var i=0;i<25;i++){
                if(b[i]!=0){
                    num[i]=100;
                }
                else{
                    num[i]=1;
                }
            }
            num[12]=0;
            for(var i=0;i<25;i++){
                player2[i]=num[i];
            }
        }
        else{
            for(var i=0;i<25;i++){
                if(b[i]!=0){
                    num[i]=100;
                }
                else{
                    num[i]=1;
                }
            }
            num[6]=0;
            num[8]=0;
            num[16]=0;
            num[18]=0;
            for(var i=0;i<25;i++){
                player2[i]=num[i];
            }
        }
    }
    else if(countx==1&&counto==1){
        if(b[12]==0){
            for(var i=0;i<25;i++){
                if(b[i]!=0){
                    num[i]=-100;
                }
                else{
                    num[i]=-1;
                }
            }
            num[12]=0;
            for(var i=0;i<25;i++){
                player1[i]=num[i];
            }
        }
        else {
            for(var i=0;i<25;i++){
                if(b[i]!=0){
                    num[i]=-100;
                }
                else{
                    num[i]=-1;
                }
            }
            if(b[6]==2||b[18]==2){
                num[8]=0;
                num[16]=0;
            }
            else if(b[8]==2||b[16]==2){
                num[6]=0;
                num[18]=0;
            }
	    else if(b[7]==2){
		num[16]=0;
		num[18]=0;
	    }
	    else if(b[11]==2){
		num[8]=0;
		num[18]=0;
	    }
	    else if(b[13]==2){
		num[6]=0;
		num[16]=0;
	    }
	    else if(b[17]==2){
		num[8]=0;
		num[6]=0;
	    }
            else{
                num[6]=0;
                num[8]=0;
                num[16]=0;
                num[18]=0;
            }
            for(var i=0;i<25;i++){
                player1[i]=num[i];
            }
        }
    }
    else if(countx==2&&counto==1){
        var h = findtwo(b,1);
        if(h!=99){
            for(var i=0;i<25;i++){
                if(b[i]!=0){
                    num[i]=100;
                }
                else{
                    num[i]=1;
                }
            }
            num[h]=0;
        }
        else{
            for(var i=0;i<25;i++){
                if(b[i]!=0){
                    num[i]=100;
                }
                else{
                    num[i]=1;
                }
            }
            var k = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            for(var i=0;i<25;i++){
                k[i]=b[i];
            }
            for(var i=0;i<25;i++){
                if(b[i]==0){
                    k[i]=2;
                    if (findtwo(k,2)!=996&&b[i]==0){
                        num[i]=0;
                    }
                    k[i]=0;
                }
            }
        }
        for(var i=0;i<25;i++){
            player2[i]=num[i];
        }
    }
    else if(countx==2&&counto==2){
        var h = findtwo(b,1);
        for(var i=0;i<25;i++){
            if(b[i]!=0){
                num[i]=-100;
            }
            else{
                num[i]=-1;
            }
        }
        if(h!=99){
            for(var i=0;i<25;i++){
                if(b[i]==0){
                    num[i]=0;
                }
            }
            num[h]=1;
        }
        else{
            h = findtwo(b,2);
            if(h!=99){
                num[h]=0;
            }
            else {
                var k = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                for(var i=0;i<25;i++){
                    k[i]=b[i];
                }
                for(var i=0;i<25;i++){
                    if(b[i]==0){
                        k[i]=1;
                        if (findtwo(k,1)!=99&&b[i]==0){
                            num[i]=0;
                        }
                        k[i]=0;
                    }
                }
            }
        }
        for(var i=0;i<25;i++){
            player1[i]=num[i];
        }
    }
    else{
	var player;
	player = player1;
	var player2turn=false;
	var n1=1;
	var n2=2;
	var m1=1;
	var m2=-1;
	if(countx>counto){
	    player = player2;
	    player2turn=true;
	    n1=2;
	    n2=1;
	    m1=-1;
	    m2=1;
	}
	var d = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var m=check(b,n1);
	if(m!=99){
	    if(depth==0){
		for(var i=0;i<25;i++){
		    if(b[i]!=0){
			num[i]=(100*m2);
		    }
		    else{
			num[i]=0;
		    }
		}
		num[m]=m1;
		for(var i=0;i<25;i++){
		    player[i]=num[i];
		}
	    }
	    return m1;
	}
	var c=check(b,n2);
	if(c!=99){
	    for(var j=0;j<25;j++){
		d[j]=b[j];
	    }
	    d[c]=n1;
	    depth++;
	    var u = recurse(d);
	    depth--;
	    if(depth==0){
		for(var i=0;i<25;i++){
		    if(b[i]!=0){
			num[i]=(100*m2);
		    }
		    else{
			num[i]=m2;
		    }
		}
		num[c]=0;
		for(var i=0;i<25;i++){
		    player[i]=num[i];
		}
	    }
	    return u;
	}
	for(var j=0;j<25;j++){
	    d[j]=b[j];
	}
	for(var i=0;i<25;i++){
	    if(b[i]==0){
		d[i]=n1;
		depth ++;
		num[i]= recurse(d);
		depth--;
		d[i]=0;
		if(num[i]==m1){
		    if(depth==0){
			for(var j=0;j<25;j++){
			    if(b[j]!=0){
				num[j]=(100*m2);
			    }
			    else{
				num[j]=0;
			    }
			}
			num[i]=m1;
			for(var j=0;j<25;j++){
			    player[j]=num[j];
			}
		    }
		    return m1;
		}
	    }
	    else{
		num [i] = (100*m2);
	    }
	}
	var min =100;
	var max =-100;
	for(var i=0;i<25;i++){
	    if(num[i]<min){
		min = num[i];
	    }
	    if(num[i]>max){
    		max = num[i];
	    }
	}
	if(depth==0){
	    for(var i=0;i<25;i++){
		player[i]=num[i];
	    }
	}
	if(player2turn){
	    return min;
	}
	else{
	    return max;
	}
    }
    return 0;
}
function findtwo(b, h){
    for(var i=0;i<5;i++){
        if(b[5+i]==h&&b[10+i]==h){
            if(b[15+i]==0&&b[i]==0&&b[20+i]==0){
                return (15+i);
            }
        }
        if(b[15+i]==h&&b[10+i]==h){
            if(b[5+i]==0&&b[i]==0&&b[20+i]==0){
                return (5+i);
            }
        }
        if(b[15+i]==h&&b[5+i]==h){
            if(b[10+i]==0&&b[i]==0&&b[20+i]==0){
                return (10+i);
            }
        }
        if(b[1+(5*i)]==h&&b[2+(i*5)]==h){
            if(b[(5*i)]==0&&b[3+(5*i)]==0&&b[4+(5*i)]==0){
                return (3+(5*i));
            }
        }
        if(b[3+(5*i)]==h&&b[2+(i*5)]==h){
            if(b[(5*i)]==0&&b[1+(5*i)]==0&&b[4+(5*i)]==0){
                return (1+(5*i));
            }
        }
        if(b[3+(5*i)]==h&&b[1+(i*5)]==h){
            if(b[(5*i)]==0&&b[2+(5*i)]==0&&b[4+(5*i)]==0){
                return (2+(5*i));
            }
        }
    }
    if(b[12]==h){
        if(b[0]==0&&b[24]==0){
            if(b[6]==0&&b[18]==h){
                return 6;
            }
            if(b[18]==0&&b[6]==h){
                return 18;
            }
        }
        if(b[4]==0&&b[20]==0){
            if(b[8]==0&&b[16]==h){
                return 8;
            }
            if(b[16]==0&&b[8]==h){
                return 16;
            }
        }
    }
    return 99;
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

function decidelimit(x){
    var y = countmove(x);
    if(y<=4){
        limit = 1;
    }
    else if((y==5)||(y==6)){
	limit=5;
    }
    else if(y<15){
        limit = 6;
    }
    else if(y<20){
        limit =7;
    }
    else{
        limit = 100;
    }
}
function check(b,p){
    var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0;i<25;i++){
        a[i]=b[i];
    }
    for(var i=0;i<25;i++){
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
function choose(x,p){
    var numwin=0;
    var numdraw=0;
    var numloss=0;
    if(p==1){
	var l =1;
    }
    else{
	var l =-1;
    }
    for(var i=0;i<25;i++){
        if(x[i]==l){
            numwin++;
        }
        else if(x[i]==0){
            numdraw++;
        }
        else if(x[i]==-l){
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
	c=1
    }
    if(c==1){
	    if(numwin==0&&numdraw!=0){
		if(x[12]==0){
		    return 12;
		}
		var y=0;
		for(var i=1;i<4;i++){
		    for(var j=1;j<4;j++){
		        if(x[i*5+j]==0){
		            y++;
		        }
		    }
		}
		if(y!=0){
		    var h = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		    var n=0;
		    for(var i=1;i<4;i++){
		        for(var j=1;j<4;j++){
		            if(x[i*5+j]==0){
		                h[n]=(i*5+j);
		                n++;
		            }
		        }
		    }
		    var a = Math.floor(Math.random()*y);
		    return h[a];
		}
	    }
	    if(numwin!=0){
		var t = Math.floor(Math.random()*numwin);
		var c=0;
		for(var i=0;i<25;i++){
		    if(x[i]==l){
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
		for(var i=0;i<25;i++){
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
		for(var i=0;i<25;i++){
		    if(x[i]==-l){
		        c++;
		    }
		    if(c>t){
		        return i;
		    }
		}
	    }
    }
    if(c==0){
	    if(numloss!=0){
		var t = Math.floor(Math.random()*numloss);
		var c=0;
		for(var i=0;i<25;i++){
		    if(x[i]==-l){
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
		for(var i=0;i<25;i++){
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
		for(var i=0;i<25;i++){
		    if(x[i]==l){
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
    for(var i =0;i<25;i++){
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
