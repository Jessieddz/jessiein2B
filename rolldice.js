let cats = [];
let description = "";


function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(60);
  textAlign(RIGHT, TOP);
  fill(100);

}

function draw() {
  background(255);
  
  textAlign(RIGHT, TOP);
  fill("black");
  textSize(40);
  text("Roll the dice.Thinking about what color scarf to wear for Dora? Click the mouse！", width - 1500, 130);

  
  for (let i = 0; i < cats.length; i++) {
    let cat = cats[i];
    drawCatFace(cat.x, cat.y, cat.color);
  }

 textAlign(CENTER,CENTER);
 textSize(100);
  fill(0);
  text(description, width - 1500, 1000);
 

}

function mousePressed() {
  let x = random(100, width - 100);
  let y = random(150, height - 100); 
  let catInfo = getRandomCatColor(); 

  cats.push({ x: x, y: y, color: catInfo.color });
  description = catInfo.label;
}


function getRandomCatColor() {
  let r = random();
  if (r < 0.2) return { color: color("#c79399"), label: "This is a pink cat! #c79399" };
  else if (r < 0.4) return { color: color("#5883af"), label: "This is a blue cat! #5883af" };
  else if (r < 0.6) return { color: color("#22887a"), label: "This is a green cat! #22887a" };
  else if (r < 0.8) return { color: color("#e1ab0c"), label: "This is a yellow cat! #e1ab0c" };
  else if (r < 0.4) return { color: color("#75e4fd"), label: "This is a blue cat! #75e4fd" };
  else if (r < 0.6) return { color: color("#d4fb7a"), label: "This is a green cat! #d4fb7a" };
  else if (r < 0.5) return { color: color("#ff006e"), label: "This is a red cat! #ff006e" };
  else if (r < 0.4) return { color: color("#c4fd7a"), label: "This is a blue cat! #c4fd7a" };
  else if (r < 0.7) return { color: color("#f9623f"), label: "This is a green cat! #f9623f" };
  else if (r < 0.8) return { color: color("#d18df8"), label: "This is a red cat! #d18df8" };
  else return { color: color("#e64521"), label: "This is a red cat! #e64521" };
}

// 画猫脸
function drawCatFace(x, y, c) {
  noStroke();
  fill(c);
  ellipse(x, y, 200, 200);

  // 左耳
  triangle(x - 80, y - 20, x - 40, y - 140, x - 20, y - 90);
  // 右耳
  triangle(x + 80, y - 20, x + 40, y - 140, x + 20, y - 90);


  // 鼻子
  fill("pink");
  triangle(x - 10, y + 10, x + 10, y + 10, x, y + 25);
}
