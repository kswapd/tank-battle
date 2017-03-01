
var $ = function(id) {return document.getElementById(id)};
var dc = function(tag) {return document.createElement(tag)};
var pieceColors = ["#00f0f0", "#0000f0", "#a000f0", "#f0a000", "#f0f000", "#f00000", "#00f000"];

var bulletPosX = 0;
var bulletPosY = 0;
var tank;
var hasBullet = 0;
var divBullet = 0;
var timer;
var battleWidth = 400;
var battleHeight = 400;
var tankPosX = 200;
var tankPosY = 350;
var tankWidth = 40;
var tankHeight = 40;
var bulletWidth = 6;
var bulletHeight = 6;
var tankHeader = 0, bulletHeader = 0;
var refTankHeader = 0;
var posArray;
var tryMoveArray;
var tankType = 1;
var enermyType = 2;
var scaleTankMove = 5;
var tankLifeNum = 1;
var hasTank = 0;
var createEnermyNum = 2;
var controlTimerId = 0;
function setPos(x,y,w,h,value){
	for(j = y; j < y +h; j++){
		for(i = x; i < x + w; i ++){
			posArray[j][i]=value;
		}
	}
}
function clearPos(x,y,w,h){
	for(j = y; j < y +h; j++){
		for(i = x; i < x + w; i ++){
			posArray[j][i] = 0;
		}
	}
}
function canMovePos(refx, refy, x,y,w,h){
	var ret = 0;
	for(j = y; j < y +h; j++){
		for(i = x; i < x + w; i ++){
				tryMoveArray[j][i] = posArray[j][i];
		}
	}
	for(j = refy; j < refy +h; j++){
		for(i = refx; i < refx + w; i ++){
				tryMoveArray[j][i] = 0;
			}	
	}
	
	for(j = y; j < y +h; j++){
		for(i = x; i < x + w; i ++){
			if(tryMoveArray[j][i] != 0){
				//alert(j+":"+i);
				//ret = false;
				ret = tryMoveArray[j][i];
				return ret;
			}
		}
	}
	return ret;
}

function createTank()
{
	tank = dc("div");
	tank.style.position = "absolute";
	tank.style.top = tankPosY + "px";
	tank.style.left = tankPosX + "px";
	tank.style.width = tankWidth + "px";
	tank.style.height = tankHeight + "px";
	tank.style.backgroundImage="url(tank0.gif)";
	tank.className = "block";
	tank.innerHTML = "";
	tank.style.backgroundColor = pieceColors[0];
	tank.style.borderColor = pieceColors[0];
	zone = $("battle");
	zone.appendChild(tank);
	setPos(tankPosX, tankPosY, tankWidth, tankHeight, tankType);
	hasTank = 1;
}
function moveTank(x, y)
{
	if(refTankHeader != tankHeader){
		var bk = "url(tank"+tankHeader+".gif)";	
		tank.style.backgroundImage= bk;
	}
	if(tankPosY + scaleTankMove*y >= battleHeight-tankHeight || tankPosY + scaleTankMove*y <= 0 || tankPosX + scaleTankMove*x >= battleWidth-tankWidth || tankPosX + scaleTankMove*x <= 0 || canMovePos(tankPosX, tankPosY, tankPosX + scaleTankMove*x, tankPosY + scaleTankMove*y, tankWidth, tankHeight) != 0){
		return;
	}
	clearPos(tankPosX, tankPosY, tankWidth, tankHeight, tankType);
    tankPosX += 5*x;
	tankPosY += 5*y;
	tank.style.top = tankPosY + "px";
	tank.style.left = tankPosX + "px";
	setPos(tankPosX, tankPosY, tankWidth, tankHeight, tankType);
}
//-------------------bullet--------
	function createBullet()
{
	bulletHeader = tankHeader;
	bulletPosX = tankPosX + tankWidth/2 - bulletWidth/2;
	bulletPosY = tankPosY + tankHeight/2 - bulletHeight/2;;
	divBullet = dc("div");
	divBullet.style.position = "absolute";
	divBullet.style.top = bulletPosY  + "px";
	divBullet.style.left = bulletPosX  + "px";
	divBullet.style.width = bulletWidth + "px";
	divBullet.style.height = bulletHeight + "px";
	divBullet.style.overflow="hidden";
	divBullet.className = "block2";
	divBullet.innerHTML = "";
	divBullet.style.backgroundColor = pieceColors[5];
	divBullet.style.borderColor = pieceColors[5];
	zone = $("battle");
	zone.appendChild(divBullet);
	hasBullet = 1;
}
function moveBullet()
{
	switch(bulletHeader){
		case 0:
			bulletPosY -= 10;
			break;
		case 1:
			bulletPosY += 10;
			break;
		case 2:
			bulletPosX -= 10;
			break;
		case 3:
			bulletPosX += 10;
			break;
			
	}
	divBullet.style.top = bulletPosY + "px";
	divBullet.style.left = bulletPosX + "px";
	controlBullet();
}

function fireEnermySuccess()
{
	hr = false;
	for(i = 0; i < enermyNum; i ++){
		if(hasEnermy[i] != 0 && destroyedEnermy[i] == false){
		
			leftPos = enermyPosX[i];
			topPos = enermyPosY[i];
			rightPos = enermyPosX[i] + enermyWidth[i];
			bottomPos = enermyPosY[i] + enermyHeight[i];
			//
			if(bulletPosX > leftPos && bulletPosX < rightPos && bulletPosY > topPos && bulletPosY < bottomPos){
				//zone.removeChild(divEnermy[i]);
				//clearPos(enermyPosX[i], enermyPosY[i], enermyWidth[i], enermyHeight[i], enermyType);
				//hasEnermy[i] = 0;
				destroyedEnermy[i] = true;
				hr = true; 
			}
		}
	}
	return hr;
}

function controlBullet()
{
	clearTimeout(timer);
	if(bulletPosY > battleHeight || bulletPosY < 0 || bulletPosX > battleWidth || bulletPosX < 0 ||
	fireEnermySuccess()){
		zone.removeChild(divBullet);
		hasBullet = 0;
	}else if(enforceDestroyAllEnermyAndBullet == true){
		zone.removeChild(divBullet);
		hasBullet = 0;
	}else{
		timer = setTimeout(moveBullet, 15);
	}
}
function fire()
{
	if(hasBullet == 0){
		createBullet();
		controlBullet();	
	}
	
}
//--------------


var keyBuf = {};
function onKeyDownbk(e)
{
		e = e || window.event;
	var keyCode = e.which || e.keyCode;
	//keyBuf[keyCode] = true;
	//for (k=0;k<200; k++) {
    //    if (keyBuf[k] == true) {
			//alert(k);
			switch (keyCode) {
				case 13: // enter
					break;
				case 38: // up
					refTankHeader = tankHeader;
					tankHeader = 0;
					moveTank(0, -1);
					break;
				case 39: // right
					refTankHeader = tankHeader;
					tankHeader = 3;
					moveTank(1, 0);
					break;
				case 37: // left
					refTankHeader = tankHeader;
					tankHeader = 2;
					moveTank(-1, 0);
					break;
				case 40: // down
					refTankHeader = tankHeader;
					tankHeader = 1;
					moveTank(0, 1);
					break;
				case 70: // left
					fire();
					break;
				default : 
					return false;
			}
		//}
	//}
	if (e.preventDefault)
		e.preventDefault();
	return true;
}
function checkKeyStatus() {
				if(keyBuf[38]){ // up
					refTankHeader = tankHeader;
					tankHeader = 0;
					moveTank(0, -1);
				}
				if(keyBuf[39]){  // right
					refTankHeader = tankHeader;
					tankHeader = 3;
					moveTank(1, 0);
				}
				if(keyBuf[37]){ // left
					refTankHeader = tankHeader;
					tankHeader = 2;
					moveTank(-1, 0);
				}
				if(keyBuf[40]){ // down
					refTankHeader = tankHeader;
					tankHeader = 1;
					moveTank(0, 1);
				}			
				if(keyBuf[70]){  // left
					fire();
				}
}
function onKeyDown(e) {
	e = e || window.event;
	var keyCode = e.which || e.keyCode;
	keyBuf[keyCode] = true;
	if (e.preventDefault)
		e.preventDefault();
	return true;
}
function onKeyUp(e) {
	e = e || window.event;
	var keyCode = e.which || e.keyCode;
	keyBuf[keyCode] = false;
	if (e.preventDefault)
		e.preventDefault();
	return true;
}
function registerEvents() {
	addEvent(document, "keydown", onKeyDown);
	addEvent(document, "keyup", onKeyUp);
	controlTimerId = setInterval("checkKeyStatus()", 30);
}
function addEvent(el, event, handler) {
	if (el.addEventListener)
		el.addEventListener(event, handler, false); 
	else if (el.attachEvent)
		el.attachEvent("on" + event, handler); 
}







//--------------------------------------enermy------------------------



var enermyNum;
var enermyTimer;
var hasEnermy;
var destroyedEnermy;
var enermyWidth;
var enermyHeight;
var enermyPosX;
var enermyPosY;
var enermyHeader;
var divEnermy;
var restEnermy;
function createEnermy(index)
{
	hasEnermy[index] = 1;
	enermyPosX[index] = Math.floor(Math.random()*(battleWidth-enermyWidth[index]));
	enermyPosY[index] = Math.floor(Math.random()*(battleHeight-enermyHeight[index])/2);
	enermyHeader[index] = Math.floor(Math.random()*4);
	divEnermy[index] = dc("div");
	divEnermy[index].style.position = "absolute";
	divEnermy[index].style.top = enermyPosY[index] + "px";
	divEnermy[index].style.left = enermyPosX[index] + "px";
	divEnermy[index].style.width = enermyWidth[index] + "px";
	divEnermy[index].style.height = enermyHeight[index] + "px";
	divEnermy[index].className = "block3";
	divEnermy[index].innerHTML = "";
	divEnermy[index].style.backgroundColor = pieceColors[2];
	divEnermy[index].style.borderColor = pieceColors[2];
	var bk = "url(tank"+enermyHeader[index]+".gif)";
	divEnermy[index].style.backgroundImage= bk;
	zone = $("battle");
	zone.appendChild(divEnermy[index]);
	//setPos(enermyPosX[index], enermyPosY[index], enermyWidth[index], enermyHeight[index], enermyType);
	//alert(index);
	//setPos(200, 200, 40, 40, 1);
}

function moveEnermyPos(index, x, y)
{
	if(enermyPosY[index] + 5*y >= battleHeight-enermyHeight[index] || enermyPosY[index] + 5*y <= 0 || + 
	   enermyPosX[index] + 5*x >= battleWidth-enermyWidth[index]|| enermyPosX[index] + 5*x <= 0 ||+
	   canMovePos(enermyPosX[index], enermyPosY[index], enermyPosX[index] + 5*x, enermyPosY[index] + 5*y, enermyWidth[index], enermyHeight[index]) != 0){
		enermyHeader[index] = Math.floor(Math.random()*4);
		var bk = "url(tank"+enermyHeader[index]+".gif)";
		divEnermy[index].style.backgroundImage= bk;
		//alert(enermyHeader);
		return;
	}
	clearPos(enermyPosX[index], enermyPosY[index], enermyWidth[index], enermyHeight[index], enermyType);
    enermyPosX[index] += 5*x;
	enermyPosY[index] += 5*y;
	divEnermy[index].style.top = enermyPosY[index] + "px";
	divEnermy[index].style.left = enermyPosX[index] + "px";
	setPos(enermyPosX[index], enermyPosY[index], enermyWidth[index], enermyHeight[index], enermyType);
	
}
function moveEnermy(index)
{
	//alert(index);
	switch(enermyHeader[index]){
		case 0:
			moveEnermyPos(index, 0, -1);
			break;
		case 1:
			moveEnermyPos(index, 0, 1);
			break;
		case 2:
			moveEnermyPos(index, -1, 0);
			break;
		case 3:
			moveEnermyPos(index, 1, 0);
			break;
			
	}

	controlEnermy(index);
}
function controlEnermy(index)
{
		clearTimeout(enermyTimer[index]);
		if(hasEnermy[index] == 0 && destroyedEnermy[index] == false){
			createEnermy(index);	
		}else if(destroyedEnermy[index] == true){
			zone.removeChild(divEnermy[index]);
			clearPos(enermyPosX[index], enermyPosY[index], enermyWidth[index], enermyHeight[index], enermyType);
			hasEnermy[index] = 0;
			restEnermy--;
			allDestroyedEnermy ++;
			dispInfo();
			if(restEnermy == 0){
				resetBattle();
			}
		}else if(enforceDestroyAllEnermyAndBullet == true){
			zone.removeChild(divEnermy[index]);
			clearPos(enermyPosX[index], enermyPosY[index], enermyWidth[index], enermyHeight[index], enermyType);
			hasEnermy[index] = 0;	
		}
		if(hasEnermy[index] != 0 && destroyedEnermy[index] == false){
			toFire =  Math.floor(Math.random()*4);
			if(toFire == 1){
				enermyFire(index);		//enermy random to fire!
			}
			enermyTimer[index] = setTimeout(function(){moveEnermy(index);}, 100);
		}
}

//----------------------------------enermy fire-----------------------------------------
var enermyHasBullet;
var enermyBulletHeader;
var enermyBulletPosX;
var enermyBulletPosY;
var enermyBulletWidth;
var enermyBulletHeight;
var divEnermyBullet;
var enermyBulletTimer;
	function enermyCreateBullet(index)
{
	enermyBulletHeader[index] = enermyHeader[index];
	enermyBulletPosX[index] = enermyPosX[index] + enermyWidth[index]/2 - enermyBulletWidth[index]/2;
	enermyBulletPosY[index] = enermyPosY[index] + enermyHeight[index]/2 - enermyBulletHeight[index]/2;
	divEnermyBullet[index] = dc("div");
	divEnermyBullet[index].style.position = "absolute";
	divEnermyBullet[index].style.top = enermyBulletPosY[index]  + "px";
	divEnermyBullet[index].style.left = enermyBulletPosX[index]  + "px";
	divEnermyBullet[index].style.width = enermyBulletWidth[index] + "px";
	divEnermyBullet[index].style.height = enermyBulletHeight[index] + "px";
	divEnermyBullet[index].style.overflow="hidden";
	divEnermyBullet[index].className = "block2";
	divEnermyBullet[index].innerHTML = "";
	divEnermyBullet[index].style.backgroundColor = pieceColors[5];
	divEnermyBullet[index].style.borderColor = pieceColors[5];
	zone = $("battle");
	zone.appendChild(divEnermyBullet[index]);
	enermyHasBullet[index] = 1;
}
function enermyMoveBullet(index)
{
	switch(enermyBulletHeader[index]){
		case 0:
			enermyBulletPosY[index] -= 10;
			break;
		case 1:
			enermyBulletPosY[index] += 10;
			break;
		case 2:
			enermyBulletPosX[index] -= 10;
			break;
		case 3:
			enermyBulletPosX[index] += 10;
			break;
			
	}
	divEnermyBullet[index].style.top = enermyBulletPosY[index] + "px";
	divEnermyBullet[index].style.left = enermyBulletPosX[index] + "px";
	enermyControlBullet(index);
}

function onTankFired()
{
	tankLifeNum --;
	if(tankLifeNum <= 0){
		clearInterval(controlTimerId);
		zone.removeChild(tank);	
		//alert("Game Over!");
		var confirm = window.confirm("玩完了，还想继续吗?");
		//alert(confirm);
		if(confirm == true){
			//createEnermyNum = 0;
			allDestroyedEnermy = 0;
			resetBattle();
			dispInfo();
		}
	}
}
function enermyFireMeSuccess(index)
{
	hr = false;
		if(hasTank != 0){
		
			leftPos = tankPosX;
			topPos = tankPosY;
			rightPos = leftPos + tankWidth;
			bottomPos = topPos + tankHeight;
			//
			if(enermyBulletPosX[index] > leftPos && enermyBulletPosX[index] < rightPos && enermyBulletPosY[index] > topPos && enermyBulletPosY[index] < bottomPos && enforceDestroyAllEnermyAndBullet == false){
				//zone.removeChild(divEnermy[i]);
				//clearPos(enermyPosX[i], enermyPosY[i], enermyWidth[i], enermyHeight[i], enermyType);
				//hasEnermy[i] = 0;
				onTankFired();
				hasTank = 0
				hr = true; 
			}
		}
	return hr;
}
// ||fireEnermySuccess()
function enermyControlBullet(index)
{
	clearTimeout(enermyBulletTimer[index]);
	if(enermyBulletPosY[index] > battleHeight || enermyBulletPosY[index] < 0 || enermyBulletPosX[index] > battleWidth || enermyBulletPosX[index] < 0 || enermyFireMeSuccess(index)){
		zone.removeChild(divEnermyBullet[index]);
		enermyHasBullet[index] = 0;
	}else if(enforceDestroyAllEnermyAndBullet == true){
		zone.removeChild(divEnermyBullet[index]);
		enermyHasBullet[index] = 0;
	}else{
		enermyBulletTimer[index] = setTimeout(function(){enermyMoveBullet(index);}, 60);
	}
}
function enermyFire(index)
{
	if(enermyHasBullet[index] == 0){
		enermyCreateBullet(index);
		enermyControlBullet(index);	
	}
	
}

//--------------------------------------------------------------------------------------
function controlEnermys()
{
	for(i = 0; i < enermyNum; i++){
		controlEnermy(i);
	}
}
var allDestroyedEnermy = 0;
var allScore = 0;
var enforceDestroyAllEnermyAndBullet = false;
var warLevel = 1;
function resetBattle()
{
		enforceDestroyAllEnermyAndBullet = true;
		if(tankLifeNum <= 0){
			createEnermyNum = 2;
			restEnermy = createEnermyNum;
			warLevel = 1;
		}else if(restEnermy== 0){
			createEnermyNum += 2;
			warLevel ++;
		}
		
		setTimeout(function(){
				
				if(tankLifeNum > 0){
					clearInterval(controlTimerId);
					zone.removeChild(tank);	
				}
				tankLifeNum = 1;
				tankHeader = 0;
				refTankHeader = 0;
				keyBuf[37] = 0;
				keyBuf[38] = 0;
				keyBuf[39] = 0;
				keyBuf[40] = 0;
				keyBuf[70] = 0;
				tankPosX = 200;
				tankPosY = 350;			
				}, 1000);
		setTimeout(function(){createGame();}, 2000);
	

	
}
function dispInfo()
{
	allScore = 100 * allDestroyedEnermy;
	info.innerHTML = "Level:" + warLevel + "<p>" +  "Enermy:"+restEnermy + "<p>" + "Score:"+allScore;

}
function initEnermys()
{
	enforceDestroyAllEnermyAndBullet = false;
	enermyNum = createEnermyNum;
	restEnermy = enermyNum;
	enermyTimer = new Array();
	hasEnermy = new Array();
	enermyWidth = new Array();
	enermyHeight = new Array();
	enermyPosX = new Array();
	enermyPosY = new Array();
	enermyHeader = new Array();
	divEnermy = new Array();
	destroyedEnermy = new Array();
	enermyBulletTimer = new Array();
	
	enermyHasBullet = new Array();
	enermyBulletHeader = new Array();
	enermyBulletPosX = new Array();
	enermyBulletPosY = new Array();
	enermyBulletWidth = new Array();
	enermyBulletHeight = new Array();
	divEnermyBullet = new Array();
	for(i = 0; i < enermyNum; i ++){
		hasEnermy[i] = 0;
		enermyWidth[i] = 40;
		enermyHeight[i] = 40;
		enermyPosX[i] = 0;
		enermyPosY[i] = 0;
		enermyHeader[i] = 0;
		divEnermy[i] = 0;
		destroyedEnermy[i] = false;
		
		enermyHasBullet[i] = 0;
		enermyBulletHeader[i] = 0;
		enermyBulletWidth[i] = 6;
		enermyBulletHeight[i] = 6;
		divEnermyBullet[i] = 0;
		enermyBulletTimer[i] = 0;
		
	}
	
	posArray = new Array();
	tryMoveArray = new Array();
	for(j = 0; j < battleHeight; j ++){
			posArray[j] = new Array();
			tryMoveArray[j] = new Array();
			for(i = 0; i < battleWidth; i ++){			
				posArray[j][i] =0;
				tryMoveArray[j][i] =0;
			}
	}
	dispInfo();
}
function createGame()
{
		initEnermys();
		createTank();
		registerEvents();
		controlEnermys();
}
var hasLoadedImg = [0,0,0,0];
function waitLoadImg(num)
{
	hasLoadedImg[num] = 1;
	if(hasLoadedImg[0]==1 && hasLoadedImg[1]==1 &&hasLoadedImg[2]==1 &&hasLoadedImg[3]==1){
		createGame();
	}
}