var playerTurn=true;
var difficulty=3;
var aiScore = 0;
var test;
var h=0;
var depth=0;
var limit=8;
var huScore = 0;
var ties = 0;
var isHint = false;
var isWon = false;
const huPlayer = 'O';
const aiPlayer = 'X';
var winstreak = [0,0,0,0,0];
var player1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var player2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const cells = document.querySelectorAll('.cell');
startGame();
function playerMove(b){
    playerTurn = b;
}

function startNew(){
    h=0;
    isWon=false;
    startGame();
}

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(49).keys());
    for(var i =0; i<cells.length; i++){
	cells[i].innerText='';
	cells[i].style.removeProperty('background-color');
	cells[i].addEventListener('click', turnClick, false);
    }
    if(!playerTurn){
	turn(bestSpot(), aiPlayer);
    }
}

function turnClick(square){
    isHint=false;
    for(var i =0; i<cells.length; i++){
	cells[i].style.removeProperty('background-color');
    }
    if(typeof origBoard[square.target.id] == 'number'){
	decidelimit();    
	turn(square.target.id, huPlayer);
	decidelimit();    
	turn(bestSpot(), aiPlayer);
	checkTie();
    }
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
    for(var i=0; i<5; i++){
	var l =document.getElementById('tic').rows[Math.floor(winstreak[i]/7)].cells;
	l[winstreak[i]%7].style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
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
function recurse(b){
    var y = winner(b);
    if(y==1)
        return 1;
    else if(y==2)
        return -1;
    else if(y==4)
        return 0;
    if(depth>=limit){
        var n = decideAdvantage(b);
        return n;
    }
    var countx=0;
    var counto=0;
    for(var i=0;i<49;i++){
        if(b[i]==1)
            countx++;
        else if (b[i]==2)
            counto++;
    }
    var player2turn=false;
    var num =[0];
    var n=1;
    if(countx>counto){
        player2turn=true;
        n=2;
    }
    var d = [0];
    for(var j=0;j<49;j++){
        d[j]=b[j];
    }
    var goodMoves = run(b);
    if(goodMoves.length==1&&depth==0){
	for(var i=0;i<49;i++){
            if(b[i]!=0){
		num [i] = 100;
            }
	    else if(player2turn){
		num[i] = 1;
	    }
	    else{
		num[i] = -1;
	    }
	}
	num[goodMoves[0]]=0;
	for(var i=0;i<49;i++){
            if(player2turn)
                player2[i]=num[i];
            else
                player1[i]=num[i];
        }
	return 0;
    }
    var z = [0];
    for(var i=0;i<49;i++){
        z[i]=0;
    }
    for(var i=0;i<goodMoves.length;i++){
        z[goodMoves[i]]=100;
    }
    var solved = false;
    for(var i=0;i<49;i++){
        if(b[i]==0&&z[i]==100&&(!solved)){
            d[i]=n;
            depth ++;
            num[i]= recurse(d);
            depth--;
            d[i]=0;
            if((num[i]==1&&(!player2turn))||(num[i]==-1&&player2turn)){
                solved = true;
            }
        }
        else if(b[i]!=0){
            num [i] = 100;
        }
        else{
            if(player2turn){
                num[i]=2;
            }
            else{
                num[i]=-2;
            }
        }
    }
    var min = 100;
    var max = -100;
    for(var i=0;i<49;i++){
        if(num[i]<min&&num[i]!=100)
            min = num[i];
        if(num[i]>max&&num[i]!=100)
            max = num[i];
    }
    if(depth==0){
        for(var i=0;i<49;i++){
            if(player2turn)
                player2[i]=num[i];
            else
                player1[i]=num[i];
        }
    }
    if(player2turn)
        return min;
    else
        return max;
}
function countmoves(x){
    var n=0;
    for(var i=0;i<49;i++){
	if(x[i]!=0){
	    n++;
	}
    }
    return n;
}
function choose(x,h){
    var n1=1;
    if(h==2){
	n1=-1;
    }
    var numwin=0;
    var numwin2=0;
    var numdraw=0;
    var numadvantage=0;
    var numdisadvantage=0;
    var numloss=0;
    var numloss2=0;
    for(var i=0;i<49;i++){
        if(x[i]==n1){
            numwin++;
        }
        else if(x[i]==(n1*2)){
            numwin2++;
        }
        else if(x[i]==0){
            numdraw++;
        }
        else if(x[i]==-n1){
            numloss++;
        }
        else if(x[i]==(-n1*2)){
            numloss2++;
        }
	else if(x[i]>0&&x[i]<1){
	    if(h==1){
		numadvantage++;			
	    }
	    else{
		numdisadvantage++;			
	    }
	}
	else if(x[i]<0&&x[i]>-1){
	    if(h==1){
		numdisadvantage++;			
	    }
	    else{
		numadvantage++;			
	    }	
	}
    }
    if(numwin!=0){
	var t = Math.floor(Math.random()*numwin);
	var c=0;
	for(var i=0;i<49;i++){
	    if(x[i]==n1){
	        c++;
	    }
	    if(c>t){
	        return i;
	    }
	}
    }
    if(numwin2!=0){
	var t = Math.floor(Math.random()*numwin2);
	var c=0;
	for(var i=0;i<49;i++){
	    if(x[i]==(n1*2)){
	        c++;
	    }
	    if(c>t){
	        return i;
	    }
	}
    }
    if(numadvantage!=0){
	var t = Math.floor(Math.random()*numadvantage);
	var c=0;
	for(var i=0;i<49;i++){
	    if(h==1&&x[i]>0&&x[i]<1){
	        c++;
	    }
	    if(h==2&&x[i]<0&&x[i]>-1){
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
	for(var i=0;i<49;i++){
	    if(x[i]==0){
	        c++;
	    }
	    if(c>t){
	        return i;
	    }
	}
    }
    if(numdisadvantage!=0){
	var t = Math.floor(Math.random()*numdisadvantage);
	var c=0;
	for(var i=0;i<49;i++){
	    if(h==1&&x[i]<0&&x[i]>-1){
	        c++;
	    }
	    if(h==2&&x[i]>0&&x[i]<1){
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
	for(var i=0;i<49;i++){
	    if(x[i]==-n1){
	        c++;
	    }
	    if(c>t){
	        return i;
	    }
	}
    }
    if(numloss2!=0){
	var t = Math.floor(Math.random()*numloss2);
	var c=0;
	for(var i=0;i<49;i++){
	    if(x[i]==(-n1*2)){
	        c++;
	    }
	    if(c>t){
	        return i;
	    }
	}
    }
}
function convertBoard(origBoard){
    var newBoard =[0];
    if(playerTurn){
	var x = 'X';
	var o = 'O';
    }
    else{
	var x = 'O';
	var o = 'X';
    }
    for(var i=0; i<49; i++){
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

function findSpot(x){
    var winmove;
    var c=0;
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
    if(c===1){
	recurse(x);
	var u;
	if(playerTurn){
	    u = choose(player2,2);
	}
	else {
	    u = choose(player1,1);
	}
	return u;
    }
    else{
	return randomchoice(x);
    }
}

function bestSpot(){
    return findSpot(convertBoard(origBoard));   
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
function decideAdvantage(b){
    var a1 = attack(b,1);
    var a2 = attack(b,2);
    var sum=0;
    sum+=a1[4]*a1[4]*0.1;
    sum-=a2[4]*a2[4]*0.1;
    sum+=a1[3]*a1[3]*0.025;
    sum-=a2[3]*a2[3]*0.025;
    sum+=a1[2]*a1[2]*0.00625;
    sum-=a2[2]*a2[2]*0.00625;
    sum+=a1[1]*a1[1]*(0.00625/4);
    sum-=a2[1]*a2[1]*(0.00625/4);
    sum+=a1[0]*a1[0]*(0.00625/16);
    sum-=a2[0]*a2[0]*(0.00625/16);
    if(sum>1){
        sum=0.99;
    }
    else if(sum<-1){
        sum=-0.99;
    }
    return sum;
}
function randomchoice(b){
    var p=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var n=0;
    for(var i=0;i<49;i++){
        if(b[i]==0){
            n++;
        }
    }
    p=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var a=0;
    for(var i=0;i<49;i++){
        if(b[i]==0){
            p[a]=i;
            a++;
        }
    }
    n = Math.floor(Math.random()*a);
    return p[n];
}

function run(b){
    var countx=0;
    var counto=0;
    var l;
    for(var i=0;i<49;i++){
        if(b[i]==1)
            countx++;
        else if (b[i]==2)
            counto++;
    }
    var n1=0;
    var n2=0;
    if(countx==counto){
        n1=1;
        n2=2;
    }
    else {
        n1=2;
        n2=1;
    }
    if(countx==0&&counto==0){
        l = [24];
        return l;
    }
    var attacklist= [[0]];
    var blocklist = [[0]];
    var d = [0];
    for(var i=0;i<49;i++){
        d[i]=b[i];
    }
    for(var i=0;i<49;i++){
        if(b[i]==0){
            d[i]=n1;
            var  c = attack(d,n1);
            var  g = block(d,n1);
            attacklist[i] = c;
            blocklist[i] = g;
            d[i]=0;
        }
	else{
	    attacklist[i]=[0,0,0,0,0];
	    blocklist[i]=[0,0,0,0,0];
	}
    }
    for(var i =0;i<49;i++){
        if(b[i]==0){
            if(attacklist[i][4]>0){
                l =[i];
                return l;
            }
        }
    }
    var v;
    for(v=0;v<49;v++){
        if(b[v]==0){
            break;
        }
    }
    var m = blocklist[v][4];
    for(var i=(v+1);i<49;i++){
        if(b[i]==0){
            if(blocklist[i][4]>m){
                l = [i];
                return l;
            }
            else if(blocklist[i][4]<m){
                l = [v];
                return l;
            }
        }
    }
    for(var i =0;i<49;i++){
        if(b[i]==0){
            if(attacklist[i][3]>=2){
                l = [i];
                l[0]=i;
                return l;
            }
        }
    }
    var attacklistenemy = [[0]];
    for(var i=0;i<49;i++){
        if(b[i]==0){
            d[i]=n2;
            var  c = attack(d,n2);
            attacklistenemy[i] = c;
            d[i]=0;
        }
	else{
	    attacklistenemy[i]=[0,0,0,0,0];
	}
    }
    attacklist = correct5(attacklist,b);
    blocklist = correct5(blocklist,b);
    var moveValue = [0];
    for(var i=0;i<49 ;i++){
        var sum=0;
        if(attacklistenemy[i][3]>=2){
            sum=sum+(attacklistenemy[i][3]*16384);
        }
        sum = sum + decideValue(attacklist[i],blocklist[i]);
        moveValue[i] = sum;
    }
    var  z = bestMoves(moveValue);
    if(z[0]==99){
        z[0]=randomchoice(b);
    }
    return z;
}
function decideValue( a,  b){
    var sum=0;
    sum = sum+(a[3]*a[3]*16384);
    sum = sum+(b[3]*b[3]*4096);
    sum = sum+(a[2]*a[2]*1024);
    sum = sum+(b[2]*b[2]*256);
    sum = sum+(a[1]*a[1]*64);
    sum = sum+(b[1]*b[1]*16);
    sum = sum+(a[0]*a[0]*4);
    sum = sum+(b[0]*b[0]);
    return sum;
}
function correct5(x,b){
    var a = [0];
    for(var i=0;i<49;i++){
	a[i] = [0,0,0,0,0];
    }
    for(var i=0;i<49;i++){
        for(var j=0;j<5;j++){
            a[i][j] = x[i][j];
        }
    }
    for(var j=0;j<5;j++){
        var min = 100000;
        for(var i=0;i<49;i++){
            if(b[i]==0){
                if(min>x[i][j]){
                    min=x[i][j];
                }
            }
        }
        for(var i=0;i<49;i++){
            if(b[i]==0){
                a[i][j] = x[i][j]-min;
            }
        }
    }
    return a;
}
function bestMoves( x){
    var max=0;
    var y = [0];
    for(var i=0;i<49;i++){
        y[i]=x[i];
    }
    y.sort(function(a, b){return a-b});
    max = y[48];
    if(max==0){
        var  t = [99];
        return t;
    }
    var n;
    for(n=48;n>=0;n--){
        var w = y[n]/max; 
        if(w<=0.5){
            break;
        }
    }
    n = 48-n;
    var q = 8;
    var l=8;
    if(n>q){
        var m;
        if(y[48-q]<y[49-q]){
            m=y[49-q];
        }
        else{
            m = y[48-q];
            if(y[48]!=m){
                var i;
                for(i=49-q;i<49;i++){
                    if(y[i]>m){
                        break;
                    }
                }
                l=49-i;
                m=y[i];
            }
        }
        var p = [0];
        var g=0;
        for(var i=0;i<49&&g<l;i++){
            if(x[i]>=m){
                p[g]=i;
                g++;
            }
        }
        return p;
    }
    else{
        var p = [0];
        var g=0;
        for(var i=0;i<49&&g<n;i++){
            var w = x[i]/max; 
            if(w>0.5){
                p[g]=i;
                g++;
            }
        }
        return p;
    }
}
function block(A, q){
    var blocks = [0,0,0,0,0];
    for(var i=0;i<7;i++){
        for(var j=0;j<3;j++){
            var u = i*7+j;
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+k]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+k]!=q&&A[u+k]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    for(var i=0;i<7;i++){
        for(var j=0;j<3;j++){
            var u = j*7+i;
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+(k*7)]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+(k*7)]!=q&&A[u+(k*7)]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+(k*8)]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+(k*8)]!=q&&A[u+(k*8)]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    for(var i=0;i<3;i++){
        for(var j=4;j<7;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+(k*6)]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+(k*6)]!=q&&A[u+(k*6)]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    return blocks;
}
function attack(A, q){
    var attacks = [0,0,0,0,0];
    for(var i=0;i<7;i++){
        for(var j=0;j<3;j++){
            var u = i*7+j;
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+k]!=q&&A[u+k]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+k]==q){
                        h++;
                    }
                }
            }
            
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    for(var i=0;i<7;i++){
        for(var j=0;j<3;j++){
            var u = j*7+i;
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+(k*7)]!=q&&A[u+(k*7)]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+(k*7)]==q){
                        h++;
                    }
                }
            }
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+(k*8)]!=q&&A[u+(k*8)]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+(k*8)]==q){
                        h++;
                    }
                }
            }
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=4;j<7;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<5;k++){
                if(A[u+(k*6)]!=q&&A[u+(k*6)]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<5;k++){
                    if(A[u+(k*6)]==q){
                        h++;
                    }
                }
            }
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    return attacks;
}
function winner(A){
    for(var i=0;i<7;i++){
        for(var j=0;j<3;j++){
            var u = i*7+j;
            var y = A[u];
            if(y!=0){
                var g = true;
                for(var k=1;k<5;k++){
                    if(A[u+k]!=y){
                        g=false;
                        break;
                    }
                }
                if(g){
                    for(var t=0;t<5;t++){
                        winstreak[t]=(u+t);
                    }
                    return A[u];
                }
            }
        }
    }
    for(var i=0;i<7;i++){
        for(var j=0;j<3;j++){
            var u = j*7+i;
            var y = A[u];
            if(y!=0){
                var g = true;
                for(var k=1;k<5;k++){
                    if(A[u+(k*7)]!=y){
                        g=false;
                        break;
                    }
                }
                if(g){
                    for(var t=0;t<5;t++){
                        winstreak[t]=(u+(t*7));
                    }
                    return A[u];
                }
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            var u = (i*7+j);
            var y = A[u];
            if(y!=0){
                var g = true;
                for(var k=1;k<5;k++){
                    if(A[u+(k*8)]!=y){
                        g=false;
                        break;
                    }
                }
                if(g){
                    for(var t=0;t<5;t++){
                        winstreak[t]=(u+(t*8));
                    }
                    return A[u];
                }
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=4;j<7;j++){
            var u = (i*7+j);
            var y = A[u];
            if(y!=0){
                var g = true;
                for(var k=1;k<5;k++){
                    if(A[u+(k*6)]!=y){
                        g=false;
                        break;
                    }
                }
                if(g){
                    for(var t=0;t<5;t++){
                        winstreak[t]=(u+(t*6));
                    }
                    return A[u];
                }
            }
        }
    }
    var k = false;
    for(var i=0;i<49;i++){
        if(A[i]==0){
            k=true;
            break;
        }
    }
    if(!k){
        return 4;
    }
    return 0;
}
function decidelimit(){
    var n = countmoves(convertBoard(origBoard));
    if(n<6){
	limit = 7;
    }
    else if(n<30){
	limit = 8;	
    }
    else {
	limit=9;	
    }
}
function countmoves(x){
    var n=0;	
    for(var i=0;i<49;i++){
	if(x[i]!=0){
	    n++;		
	}	
    }
    return n;
}
function giveHint(){
    recurse(convertBoard(origBoard));
    var u;
    if(!playerTurn){
	u = choose(player2,2);
    }
    else {
	u = choose(player1,1);
    }
    return u;
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
	document.getElementById("hint").style.backgroundColor = "999999";
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
