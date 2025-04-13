let colors = [];
let butterflies = [];
let numButterflies = 200;
let noiseOffset = 0;
let currentWord = "Click me!";
let altWord = "Listen!";
let isSwitched = false;


var song; //initiating our variable
var analyzer;
function preload() {
 song = loadSound ('sound/spring.mp3'); 
 myFont = loadFont('myfont/WinkyRough-VariableFont_wght.ttf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(myFont);
  background(0);
  analyzer = new p5.Amplitude();
  analyzer.setInput(song);






  // Define a watercolor color palette
  colors = [
    color("#e64521"),
    color("#e1ab0c"),
    color("#AC3B21"),
    color("#F6FF00"),
    color("#AC5441"),
  ];

  noStroke();
  generateButterflies();
}

function draw() {
  background(0, 10);

  var volume = analyzer.getLevel();
  volume*=300;
  //ellipse(width/2,height/2,volume,volume);
  fill(255);
  textSize(200 + volume * 2);
  textAlign(CENTER, CENTER); 
  push();
  translate(width / 2, height / 2);
  rotate(volume * 0.1);
  text(currentWord, 0, 0);
  pop();
  

  for (let butterfly of butterflies) {
    butterfly.update();
    butterfly.display();
  }

  noiseOffset += 0.005;
}

function generateButterflies() {
  butterflies = [];
  for (let i = 0; i < numButterflies; i++) {
    let x = random(width);
    let y = random(height);
    let fillColor = random(colors);

    butterflies.push(new Butterfly(x, y, fillColor));
  }
}

class Butterfly {
  constructor(x, y, fillColor) {
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
    this.angle = random(TWO_PI);
    this.size = random(10, 30);
    this.speed = random(1, 3);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
  }

  update() {
    // Apply Perlin noise to the butterfly's position
    let xOffset = noise(this.noiseOffsetX) * 10 - 4;
    let yOffset = noise(this.noiseOffsetY) * 10 - 4;
    this.x += xOffset;
    this.y += yOffset;

    // Fluttering effect using Perlin noise
    let flutter = noise(this.noiseOffsetX + 500) * 10 - 2;
    this.angle += radians(flutter);
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    scale(1);
    
    let numPetals=10;
    fill(this.fillColor);
    
     for (let i = 0; i < numPetals; i++) {
    rotate(TWO_PI / numPetals);
    ellipse(0, this.size, this.size * 1.2, this.size * 3); 
  }


    // Draw butterfly wings
    fill(this.fillColor);
    ellipse(0, 0, this.size, this.size * 5);
    ellipse(0, 0, this.size * 5, this.size);
    

    // Draw butterfly body
    fill(0, 0, 0);
    ellipse(0, 0, this.size / 1, this.size *1);

    pop();
  }
}

function keyPressed() {
  // Regenerate butterflies and change colors when a key is pressed
  generateButterflies();
  for (let butterfly of butterflies) {
    butterfly.fillColor = random(colors);
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    background(255);
    song.stop(); // if the song is playing, stop it
    song.noLoop();
  }
  else {
    background(0);
    song.loop();
    song.play(); 
  }

  
let d = dist(mouseX, mouseY, width / 2, height / 2);
if (d < 150) { 
  isSwitched = !isSwitched;
  currentWord = isSwitched ? altWord : "click Listen!";
}

}
