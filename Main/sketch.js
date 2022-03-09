/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

let game_score;
let flagpole;
let lives;
let jumpSound;
let gameOverSound;
let oneLessLive;
let levelCompleteSound;
let collectItemSound;
let enemies = [];
let enemyDeathSound;
function preload() {
	soundFormats('mp3');
	jumpSound = loadSound('assets/jumpsound')
	// jumpsound.setVolume(1);
	gameOverSound = loadSound('assets/game-over')
	oneLessLive = loadSound('assets/pop-sound-effect')
	levelCompleteSound = loadSound('assets/level-complete')
	gameOverSound.setVolume(.3);
	collectItemSound = loadSound('assets/collect-item')
	enemyDeathSound = loadSound('assets/enemy_death')
}
function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;


	//character lives
	lives = 3;

//	start the game
	startGame();

}
	function startGame(){
		gameChar_x = width/2;
		gameChar_y = floorPos_y;
	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	trees_x = [100, 1900, 700, 1500];
	clouds = [{x_pos: 200, y_pos: 100},
		{x_pos: 600, y_pos: 200},
		{x_pos: 800, y_pos: 100},
		{x_pos: 1500, y_pos: 100},
		{x_pos: 2000, y_pos: 100}];
	mountains = [
		{x_pos: 500, y_pos: 150},
		{x_pos: 1200, y_pos: 150},
		{x_pos: 1600, y_pos: 150}];
	canyons = [
		{x_pos: 0, width: 70},
		{x_pos: 900, width: 70},
		{x_pos: 1200, width: 70}
	];
	collectables = [
			{x_pos: 100, y_pos: 100, size: 40, isFound: false},
			{x_pos: 700, y_pos: 100, size: 40, isFound: false},
			{x_pos: 1500, y_pos: 100, size: 40, isFound: false}
		];
	livesTokens = [
			{x_pos: 800, y_pos: 0},
			{x_pos: 850, y_pos: 0},
			{x_pos: 900, y_pos: 0}
		]
	flagpole = {isReached: false, x_pos: 1700}
	game_score = 0;

	gameOver()
		enemies.push(new Enemies(100, floorPos_y - 50,40,40, 400))
		enemies.push(new Enemies(600, floorPos_y - 50,40,40, 400))
		enemies.push(new Enemies(1200, floorPos_y - 50,40,40, 400))
		enemies.push(new Enemies(800, floorPos_y - 50,40,40, 200))
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
	push();
	translate(scrollPos, 0)
	// Draw clouds.
	drawClouds();
	// Draw mountains.
	drawMountains();
	// Draw trees.
	drawTrees ();
	//draw flagpole
	renderFlagpole()
	// Draw canyons.
	for (let i = 0; i < canyons.length; i++){
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	// Draw collectable items.
	for (let i = 0; i < collectables.length; i++){
		if (collectables[i].isFound === false) {
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}
	for (let i = 0; i < enemies.length; i++){
		if (lives > 0){
			enemies[i].draw()
		}
		if (enemies[i].isNear()){
			lives -= 1;
			oneLessLive.play();
			enemies = []
			startGame();

		}
		if (gameChar_y >= enemies[i].y && gameChar_world_x > enemies[i].x && gameChar_world_x < enemies[i].x +enemies[i].w && gameChar_y !== floorPos_y){
				enemies.splice(i, 1)
				game_score += 1
				enemyDeathSound.play()
				}

	}
	// 	else if(dist(this.x + this.w, this.y, gameChar_x, gameChar_y) < 40 && gameChar_y <= this.y){
	// 			enemies.splice(i,1)
	// 		}
	// 	}
	// }

	pop()
	// Draw game character.


	drawGameChar();

	//score

	fill(255);
	noStroke();
	textSize(15);
	text("Score:" + game_score, 20,20)

	if (lives < 1){
		fill(0,0,0,100)
		rect(0,0,width,height)
		fill(255);
		noStroke();
		textSize(40);
		text("Game Over", 400,200)
		text("Press space to continue", 300,300)
		if (keyCode === 32){
			lives = 3
			gameOverSound.stop()
		}
	return;


	}
	if (flagpole.isReached){
		fill(0,0,0,100)
		rect(0,0,width,height)
		fill(255);
		noStroke();
		textSize(40);
		text("Level complete", 400,200)
		text("Press space to continue", 300,300)
		if (keyCode === 32 && keyCode !== 39){
			lives = 3
			startGame()
		}
		return;
	}
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	if (gameChar_y < floorPos_y){
		isFalling = true;
		gameChar_y += 5
	}

	else {
		isFalling = false
	}
	if (isPlummeting === true){
		gameChar_y += 10
	}
	//flagpole check
	if (flagpole.isReached === false){
		checkFlagpole();
	}
	//lives
	checkPlayerDie();

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;


}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);

	if (keyCode === 37){
		isLeft = true
	}
	else if (keyCode === 39){
		isRight = true
	}
	else if (keyCode === 32 && gameChar_y > floorPos_y - 200){
		gameChar_y -= 100;
		jumpSound.play();

	}

}

function keyReleased()
{

	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);

	if (keyCode === 37){
		isLeft = false
	}
	else if (keyCode === 39){
		isRight = false
	}

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		fill(255, 204, 0)
		ellipse(gameChar_x, gameChar_y - 60, 25, 25);
		stroke(255, 204, 0);
		strokeWeight(4);
		line(gameChar_x, gameChar_y - 60, gameChar_x, gameChar_y - 20);

		line(gameChar_x,gameChar_y - 10, gameChar_x + 10, gameChar_y- 10);
		line(gameChar_x,gameChar_y - 20, gameChar_x, gameChar_y- 10);

		line(gameChar_x - 10,gameChar_y - 20, gameChar_x - 10, gameChar_y - 10);
		line(gameChar_x - 10,gameChar_y - 20 , gameChar_x, gameChar_y - 20);

		line(gameChar_x, gameChar_y - 30, gameChar_x - 10, gameChar_y - 40);
		line(gameChar_x, gameChar_y - 30, gameChar_x + 10, gameChar_y - 30);
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		fill(255, 204, 0)
		ellipse(gameChar_x, gameChar_y - 60, 25, 25);
		stroke(255, 204, 0);
		strokeWeight(4);
		line(gameChar_x, gameChar_y - 60, gameChar_x, gameChar_y - 20);

		line(gameChar_x,gameChar_y - 20, gameChar_x + 10, gameChar_y- 20);
		line(gameChar_x + 10,gameChar_y - 20, gameChar_x + 10, gameChar_y- 10);

		line(gameChar_x,gameChar_y - 20, gameChar_x, gameChar_y - 10);
		line(gameChar_x - 10,gameChar_y - 10 , gameChar_x, gameChar_y - 10);

		line(gameChar_x, gameChar_y - 30, gameChar_x - 10, gameChar_y - 30);
		line(gameChar_x, gameChar_y - 30, gameChar_x + 10, gameChar_y - 35);
	}
	else if(isLeft)
	{
		fill(255, 204, 0)
		ellipse(gameChar_x, gameChar_y - 60, 25, 25);
		stroke(255, 204, 0);
		strokeWeight(4);
		line(gameChar_x, gameChar_y - 60, gameChar_x, gameChar_y - 20);
		line(gameChar_x,gameChar_y - 20, gameChar_x + 10, gameChar_y);
		line(gameChar_x,gameChar_y - 20, gameChar_x - 10, gameChar_y);
		line(gameChar_x, gameChar_y - 30, gameChar_x - 10, gameChar_y - 30);

	}
	else if(isRight)
	{
		fill(255, 204, 0)
		ellipse(gameChar_x, gameChar_y - 60, 25, 25);
		stroke(255, 204, 0);
		strokeWeight(4);
		line(gameChar_x, gameChar_y - 60, gameChar_x, gameChar_y - 20);
		line(gameChar_x,gameChar_y - 20, gameChar_x + 10, gameChar_y);
		line(gameChar_x,gameChar_y - 20, gameChar_x - 10, gameChar_y);

		line(gameChar_x, gameChar_y - 30, gameChar_x + 10, gameChar_y - 30);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		fill(255, 204, 0)
		ellipse(gameChar_x, gameChar_y - 60, 25, 25);
		stroke(255, 204, 0);
		strokeWeight(4);
		line(gameChar_x, gameChar_y - 60, gameChar_x, gameChar_y - 20);
		line(gameChar_x,gameChar_y - 20, gameChar_x + 10, gameChar_y);
		line(gameChar_x,gameChar_y - 20, gameChar_x - 10, gameChar_y);
		line(gameChar_x, gameChar_y - 30, gameChar_x - 10, gameChar_y - 40);
		line(gameChar_x, gameChar_y - 30, gameChar_x + 10, gameChar_y - 40);
	}
	else
	{
		fill(255, 204, 0)
		ellipse(gameChar_x, gameChar_y - 60, 25, 25);
		stroke(255, 204, 0);
		strokeWeight(4);
		line(gameChar_x, gameChar_y - 60, gameChar_x, gameChar_y - 20);
		line(gameChar_x,gameChar_y - 20, gameChar_x + 10, gameChar_y);
		line(gameChar_x,gameChar_y - 20, gameChar_x - 10, gameChar_y);
		line(gameChar_x, gameChar_y - 30, gameChar_x - 10, gameChar_y - 30);
		line(gameChar_x, gameChar_y - 30, gameChar_x + 10, gameChar_y - 30);

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds(){
	for (let i = 0; i < clouds.length; i++) {
		fill(241, 250, 238);
		rect(clouds[i].x_pos, clouds[i].y_pos, 100, 50);
		ellipse(clouds[i].x_pos + 50, clouds[i].y_pos, 70, 70);
		ellipse(clouds[i].x_pos + 99, clouds[i].y_pos + 19, 65, 65);
		ellipse(clouds[i].x_pos, clouds[i].y_pos + 19, 65, 65);
	}
}
// Function to draw mountains objects.
function drawMountains() {
	for (let i = 0; i < mountains.length; i++) {
		fill(168, 218, 220)
		triangle(mountains[i].x_pos + 18, mountains[i].y_pos, mountains[i].x_pos - 192, mountains[i].y_pos + 282, mountains[i].x_pos + 200, mountains[i].y_pos + 282);
		triangle(mountains[i].x_pos + 149, mountains[i].y_pos + 103, mountains[i].x_pos, mountains[i].y_pos + 282, mountains[i].x_pos + 250, mountains[i].y_pos + 282);
	}
}
// Function to draw trees objects.
function drawTrees() {
	for (let i = 0; i < trees_x.length; i++) {
		noStroke();
		fill(105, 48, 195);
		rect(trees_x[i], floorPos_y / 1.5, 40, 150);

		fill(94, 96, 206);
		rect(trees_x[i] - 60, floorPos_y / 1.5, 150, 40);
		rect(trees_x[i] - 60, (floorPos_y / 1.5) - 25, 150, 40);
		rect(trees_x[i] - 20, (floorPos_y / 1.5) - 65, 75, 40);
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
	fill(0)
	rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 1000);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if (gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y === floorPos_y){
		isPlummeting = true
	}

	// if (dist(gameChar_world_x,gameChar_y, t_canyon.x_pos, t_canyon.width < 10 && gameChar_y === floorPos_y){
	// 	isPlummeting = true
	// }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
		fill(255, 165, 0);
		ellipse(t_collectable.x_pos, t_collectable.y_pos + 200, t_collectable.size, t_collectable.size);
		triangle(t_collectable.x_pos, t_collectable.y_pos + 181, t_collectable.x_pos + 3, t_collectable.y_pos + 182, t_collectable.x_pos + 30, t_collectable.y_pos + 170);

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if (dist(gameChar_world_x,gameChar_y,t_collectable.x_pos, t_collectable.y_pos + 200) < 40){
		t_collectable.isFound = true
		collectItemSound.play()
		game_score += 1
		console.log(1)
	}
}
// flagpole draw
function renderFlagpole(){
	push();
	strokeWeight(5);
	stroke(100);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
	pop();
	if (flagpole.isReached === false){
		fill(255,0,0)
		rect(flagpole.x_pos, floorPos_y - 200, 100, 50)
		fill(255)
		textSize(10);
		text('you havent finished', flagpole.x_pos + 5, floorPos_y - 175 )
	}
	else {
		fill(207, 233, 0)
		rect(flagpole.x_pos, floorPos_y - 200, 100, 50)
		fill(0)
		textSize(10);
		text('you finished!', flagpole.x_pos + 5, floorPos_y - 175 )
	}

	}
	//	flagpole check
	function checkFlagpole(){
		let chartdist = abs(gameChar_world_x - flagpole.x_pos);
		if (chartdist < 10){
			flagpole.isReached = true;
			levelCompleteSound.play();
		}
}
	function checkPlayerDie(){
		if (gameChar_y > height && lives >= 1){
			lives -= 1;
			enemies = []
			oneLessLive.play();
			startGame();
		}
		fill(255)
		textSize(15);
		text('lives left:', 700, 20)
		for (let i = lives -1; i > -1; i--){
			fill(249, 231, 159);
			rect(livesTokens[i].x_pos,livesTokens[i].y_pos,10,10);
			rect(livesTokens[i].x_pos+ 20,livesTokens[i].y_pos,10,10);
			rect(livesTokens[i].x_pos,livesTokens[i].y_pos + 10,30,10);
			rect(livesTokens[i].x_pos + 5,livesTokens[i].y_pos + 20,20,10);
			fill(0)
			rect(livesTokens[i].x_pos + 5,livesTokens[i].y_pos + 20,3,3);
			rect(livesTokens[i].x_pos + 15,20,3,3);
		}
		console.log(livesTokens.length)
}
	function gameOver(){
		if (lives < 1){
			gameOverSound.play();
		}
	}
	function Enemies(x,y,w,h, range){

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.inc = 3
	this.range = range
	this.orginialX = x
	 this.update = function (){
		this.x += this.inc
				if (this.x >= this.orginialX + this.range){
					this.inc = -3
				}
				else if (this.x === this.orginialX){
					this.inc = 3
				}
	}
	this.draw = function (){
		this.update()
		this.isNear()
		fill(255,69,0)
		rect(this.x,this.y,this.w, this.h)
		// fill(64,71, 109)
		// rect(this.x - 10, this.y + 20, this.w -40,this.h + 10)
		// rect(this.x + 50, this.y + 20, this.w - 40,this.h + 10)
		fill(255)
		rect(this.x + 12, this. y + 12, this.w - 45, this.h - 30)
		rect(this.x + 38, this. y + 12, this.w - 45, this.h - 30)
	}
	this.isNear = function(){
		if (dist(this.x + this.w, this.y + 30, gameChar_world_x, gameChar_y) < 40 && gameChar_y === floorPos_y){
			return true
		}
		return false
	}


}
