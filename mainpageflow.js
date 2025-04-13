

const cloudPixelScale      = 16;
const cloudCutOff          = 0.5;
const panSpeed             = 8;
const cloudEvolutionSpeed  = 4;
const message              = "Waiting";



const linkData = [
  { url: "inspirationk.html", desc:"Inspiration", size:100,hue:348},
  { url: "Creaticecode.html", desc: "Creative coding", size:80,hue:260},
  { url: "https://example.com/3", desc: "progress", size:70,hue:71},
  { url: "interativee.html", desc: "Interactivities",size:80,hue:61 },
];

let flowers = [];
let nextFlowerIndex = 0;      // 下一个要种的花索引
const spawnInterval = 30;    // 两朵花之间的帧数间隔（60fps≈2s）
let lastSpawnFrame = 0;       // 上一次种花时的 frameCount

let myFont;
function preload() {
  myFont = loadFont('myfont/WinkyRough-Black.ttf');  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  colorMode(HSB, 360, 255, 255, 255); 
  textFont(myFont);

}


  function draw() {
   
    background('#138ec0');
    drawClouds();
  

  if (isReadyToSpawn()) {
    spawnNextFlower();
  }
  // Draw and update every flower
  for (let i = flowers.length - 1; i >= 0; i--) {
    flowers[i].grow();
    flowers[i].display();
  }
}

function drawClouds(){
	// Nested loop to draw a grid of letters across the canvas.
	for (let x = 0; x <= width; x += cloudPixelScale) {
		for (let y = 0; y <= height; y += cloudPixelScale) {
			let tinyTimeOffset = millis() / 100000;
			// Defines the scale of noise for visually appealing clouds.
			let noiseScale = 0.01; 
			
			// 3D noise sampling: The first two dimensions are tied to
			// the canvas position, with the x and y values panning
      // slowly over time. The third dimension is solely influenced
			// by time, enabling the clouds to gradually change shape.
			let n = noise(
				x * noiseScale + tinyTimeOffset * panSpeed,
				y * noiseScale + tinyTimeOffset * 0.25 * panSpeed,
				tinyTimeOffset * cloudEvolutionSpeed
			);
			
			// Skip this position/letter if noise value is under cutoff.
			if (n < cloudCutOff) { continue; }

			// Use the alpha channel to fade out the edges of the clouds.
			let alpha = map(n, cloudCutOff, 0.65, 10, 255);
			fill(255, alpha);

			// Set the text size to be 15% larger than the grid.
			textSize(cloudPixelScale * 1.2);
			text(getLetterForCoordinate(x, y), x, y);
		}
	}
}



function getLetterForCoordinate(x, y) {
  
  const col = Math.floor(x / cloudPixelScale);
  const row = Math.floor(y / cloudPixelScale);
  const colsPerRow = Math.ceil(width / cloudPixelScale);
  const idx = (row * colsPerRow + col) % message.length;
  return message.charAt(idx);
}

function isReadyToSpawn() {
  return nextFlowerIndex < linkData.length && frameCount - lastSpawnFrame >= spawnInterval;
}

function spawnNextFlower() {
  const data = linkData[nextFlowerIndex];
  // 在画布上均匀分布 X 坐标，Y 随机
  const x = map(nextFlowerIndex, 0, linkData.length - 1, width * 0.15, width * 0.85);
  const y = random(height * 0.3, height * 0.7);
  
  const { url, desc, size, hue } = data;
  flowers.push(new Flower(x, y, url, desc, size, hue));

  nextFlowerIndex++;
  lastSpawnFrame = frameCount;
}


function mousePressed() {
  // First check whether we clicked on an existing flower head
  for (let i = flowers.length - 1; i >= 0; i--) {
    if (flowers[i].isClicked(mouseX, mouseY)) {
      flowers[i].handleClick();
      return; // Stop – don’t plant a new flower if we just clicked one
    }
  }
  const idx = flowers.length;
  if (idx < linkData.length) {
    const { url, desc, size, hue } = linkData[idx];
    flowers.push(new Flower(mouseX, mouseY, url, desc, size, hue));
  } else {
    flowers.push(new Flower(mouseX, mouseY));   // 随机大小/颜色
  }
}




class Flower {
  constructor(x, y, link = null, desc = null,
    fixedSize = null, fixedHue = null) {
    // Positioning
    this.base = createVector(x, height); // Bottom of the stem
    this.targetY = y;                    // Where the bloom should end up

    // Stem growth
    this.stemLength = 0;
    this.maxStemLength = this.base.y - this.targetY;
    this.stemGrowthRate = random(20, 24);
    this.bloomed = false;

    // Petal growth
    this.numPetals = int(random(5, 12));
    this.petalGrowth = 0;
    this.maxPetalGrowth = random(100, 140);
    this.petalColor = color(fixedHue ?? random(360), 200, 255, 200);

    // Interactivity
    this.link = link;
    this.desc = desc;
  }

  grow() {
    if (!this.bloomed) {
      this.stemLength += this.stemGrowthRate;
      if (this.stemLength >= this.maxStemLength) this.bloomed = true;
    } else {
      if (this.petalGrowth < this.maxPetalGrowth) this.petalGrowth += 10;
    }
  }

  display() {
    push();

    // Draw stem
    translate(this.base.x, this.base.y);
    stroke(120, 200, 120); // Green stem in HSB
    strokeWeight(10);
    line(0, 0, 0, -this.stemLength);

    if (this.bloomed) {
      translate(0, -this.stemLength); // Move to flower head
      noStroke();
      fill(this.petalColor);

      // Draw petals
      for (let i = 0; i < this.numPetals; i++) {
        const angle = map(i, 0, this.numPetals, 0, TWO_PI);
        push();
        rotate(angle + frameCount * 0.01); // Gentle rotation animation
        ellipse(0, this.petalGrowth / 2, this.petalGrowth, this.petalGrowth * 2);
        pop();
      }

      // Center of the flower
      fill(60, 255, 255); // Bright yellow in HSB
      ellipse(0, 0, this.maxPetalGrowth * 1);

      // Description text (if any)
      if (this.desc) {
        fill(0, 0, 50); // Dark gray text
        textSize(this.maxPetalGrowth*0.7);
        textAlign(CENTER, CENTER);
        text(this.desc, 0, 0);

      }
    }

    pop();
  }

  // ---------- Interactivity helpers ----------

  isClicked(px, py) {
    if (!this.bloomed) return false;
    const headX = this.base.x;
    const headY = this.base.y - this.stemLength;
    const radius = this.petalGrowth * 1.5;  
    return dist(px, py, headX, headY) < radius;
  }

  handleClick() {
    if (this.link) window.open(this.link, "_blank");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}