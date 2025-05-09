let handpose;
let video;
let predictions = [];
let minYchange = 0; //these two ranges determine line overlap and width
let maxYchange = 50;
let layers = 5;
let rotStripe = 0; //rotation of each stripe; try 10 or 90;
// try lines = true with high alph or lines = false with low alph (100)
let lines = true;
let alph = 150; //out of 255
let colRand = false; //true = random color; false = color from palette table
let filling = true;
let colorLines = false; //false for black lines
let sw = 3; //line width
let extraBlack = 0; //1 for some black line and white fills; 0 for neither; -2 for fewer colors;
let extraBlackAlph = 220; //out of 255 - used if extraBlack=1 & lines, filling, colorLines all true, low alph, high sw
let r, g, b;
let table;
let classifier;
let button;

function preload() {
  table = loadTable("colors.csv", "csv", "header");
  
  video = createCapture(VIDEO);
  video.size(width, height);
  
  print("loading")
}

function setup() {
  background("lightblue");
  handpose = ml5.handpose(video, modelReady);
  video.hide();
  let canv = createCanvas(windowWidth, windowHeight);
  canv.mousePressed(setup);
  if (lines == true) {
    stroke(0, 0, 0, extraBlackAlph);
    strokeWeight(sw);
  } else {
    noStroke();
  }
  angleMode(DEGREES);
  let end = height / 2 + 500; //where lines stop
  let palette = floor(random(676));
  for (let i = 0; i < layers; i++) {
    let y1;
    if (i == 0) {
      y1 = -height / 2 - 300;
    } else {
      y1 = -height / 2 + (height / layers) * i;
    }
    //starting height for each layer
    let y2 = y1,
      y3 = y1,
      y4 = y1,
      y5 = y1,
      y6 = y1;
    let rotLayer = random(359); //layer rotation
    let rotThisStripe = 0;
    //keep going until all the lines are at the bottom
    while (
      (y1 < end) &
      (y2 < end) &
      (y3 < end) &
      (y4 < end) &
      (y5 < end) &
      (y6 < end) &
      (-maxYchange < minYchange)
    ) {
      y1 += random(minYchange, maxYchange);
      y2 += random(minYchange, maxYchange);
      y3 += random(minYchange, maxYchange);
      y4 += random(minYchange, maxYchange);
      y5 += random(minYchange, maxYchange);
      y6 += random(minYchange, maxYchange);
      if (colRand == true) {
        r = random(256);
        g = random(256);
        b = random(256);
      } else {
        let col = floor(random(5 + extraBlack));
        r = table.get(palette, col * 3);
        g = table.get(palette, col * 3 + 1);
        b = table.get(palette, col * 3 + 2);
      }
      if (filling == true) {
        fill(r, g, b, alph);
      } else {
        noFill();
      }
      if (colorLines == true) {
        stroke(r, g, b, alph);
      }
      push();
      translate(width / 2, height / 2);
      rotThisStripe += rotStripe; //rotating after each stripe
      rotate(rotThisStripe + rotLayer);
      let xStart = -width / 2;
      beginShape();
      curveVertex(xStart - 300, height / 2 + 500);
      curveVertex(xStart - 300, y1);
      curveVertex(xStart + (width / 5) * 1, y2);
      curveVertex(xStart + (width / 5) * 2, y3);
      curveVertex(xStart + (width / 5) * 3, y4);
      curveVertex(xStart + (width / 5) * 4, y5);
      curveVertex(width / 2 + 300, y6);
      curveVertex(width / 2 + 300, height / 2 + 500);
      endShape(CLOSE);
      pop();
    }
  }

}

function modelReady() {
  console.log("Model ready!");
    handpose.on("predict", function(results) {
      predictions = results;
    });
  handpose.predict(video);
}

function draw() {
  image(video, 0, 0, width, height);
  translate(width, 0);
  scale(-1, 1);


  let col = color(r,g,b, alph);
  button = createButton("reach for me?");

  button.style('background-color',col);
  button.style('font-size', '15px');
  button.style('border', '0px solid #000') ;
  button.style('border-radius', '5px');
  button.position(1200,500);
  button.mousePressed(redirect);

  drawObject();
}



// A function to draw ellipses over the detected keypoints
function drawObject() {
  if (predictions.length > 0) {
    let prediction = predictions[0];
    let x = prediction.annotations.indexFinger[3] [0]
    let y = prediction.annotations.indexFinger[3] [1]
    print(prediction, x, y)
    noStroke();

  ellipse(round(2*x), round(1.5*y), 60);

  if ((x > 200) && (x < 250) && (y>300) && (y < 350)){
    button.objectHover(redirect);
  } else {
    fill(r,g,b,alpha);
  }
  }
}

function redirect(){
  window.location.href = "page2.html"
}