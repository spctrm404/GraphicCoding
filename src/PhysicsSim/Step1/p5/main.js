let x;
let y;
let r;
let vx = 10;
let vy = 1;

function setup() {
  createCanvas(600, 400);
  x = 0.5 * width;
  y = 0.5 * height;
  r = 50;
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

  fill("white");
  noStroke();
  circle(x, y, 2 * r);
}
