let x;
let y;
let r;
let vx = 10;
let vy = 1;

let x2;
let y2;
let r2;
let vx2 = 3;
let vy2 = 5;

function setup() {
  createCanvas(600, 400);
  x = 0.5 * width;
  y = 0.5 * height;
  r = 50;

  x2 = 0.25 * width;
  y2 = 0.25 * height;
  r2 = 25;
}

function draw() {
  background("black");

  x += vx;
  if (x > width - r) {
    vx *= -1;
    x = width - r;
  } else if (x < r) {
    vx *= -1;
    x = r;
  }
  y += vy;
  if (y > height - r) {
    vy *= -1;
    y = height - r;
  } else if (y < r) {
    vy *= -1;
    y = r;
  }

  x2 += vx2;
  if (x2 > width - r2) {
    vx2 *= -1;
    x2 = width - r2;
  } else if (x2 < r2) {
    vx2 *= -1;
    x2 = r2;
  }
  y2 += vy2;
  if (y2 > height - r2) {
    vy2 *= -1;
    y2 = height - r2;
  } else if (y2 < r2) {
    vy2 *= -1;
    y2 = r2;
  }

  fill("white");
  noStroke();
  circle(x, y, 2 * r);

  fill("red");
  noStroke();
  circle(x2, y2, 2 * r2);
}
