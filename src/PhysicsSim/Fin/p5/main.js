const numBalls = 40;
let balls = [];
const gravity = [0, 0.1];
const windStrength = 50;
let wind = [0, 0];

let hoveredBall = null;
let grabbedBall = null;

function setup() {
  createCanvas(600, 400);
  background("black");
  for (let n = 0; n < numBalls; n++) {
    const randDiameter = random(10, 50);
    balls.push(
      new Ball(
        random(0.5 * randDiameter, width - 0.5 * randDiameter),
        random(0.5 * randDiameter, height - 0.5 * randDiameter),
        randDiameter
      )
    );
  }
}

const computeWind = () => {
  const windX = ((mouseX - 0.5 * width) / (0.5 * width)) * windStrength;
  const windY = ((mouseY - 0.5 * height) / (0.5 * height)) * windStrength;
  return [windX, windY];
};

function draw() {
  background("black");
  if (mouseIsPressed && !grabbedBall) {
    wind = computeWind();
  } else {
    wind = [0, 0];
  }

  if (grabbedBall) {
    grabbedBall.vel = [mouseX - pmouseX, mouseY - pmouseY];
  } else {
    let nothingHovered = true;
    for (const ball of balls) {
      if (ball.isHover([mouseX, mouseY])) {
        if (hoveredBall) hoveredBall.isHovered = false;
        hoveredBall = ball;
        hoveredBall.isHovered = true;
        nothingHovered = false;
        break;
      }
    }
    if (nothingHovered) {
      if (hoveredBall) hoveredBall.isHovered = false;
      hoveredBall = null;
    }
  }

  balls.forEach((ball, idx) => {
    ball.applyGravity(gravity);
    ball.applyForce(wind);
    ball.boundary();
    for (let otherIdx = idx + 1; otherIdx < balls.length; otherIdx++) {
      ball.collide(balls[otherIdx]);
    }
    ball.update();
  });

  balls.forEach((ball, idx) => {
    ball.render();
  });

  stroke("white");
  line(width / 2, height / 2, width / 2 + wind[0], height / 2 + wind[1]);
}

function mousePressed() {
  if (hoveredBall) {
    grabbedBall = hoveredBall;
    grabbedBall.setGrabbed([mouseX, mouseY]);
  }
}

function mouseReleased() {
  if (grabbedBall) {
    grabbedBall.vel = [mouseX - pmouseX, mouseY - pmouseY];
    grabbedBall.setGrabbed();
    grabbedBall = null;
  }
}

function mouseDragged() {
  if (grabbedBall) {
    grabbedBall.pos = [mouseX, mouseY].map(
      (m, idx) => m - grabbedBall.offset[idx]
    );
  }
}
