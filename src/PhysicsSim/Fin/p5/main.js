const DEBUG = true;

const colors = ['#ff6b35', '#f7c59f', '#efefd0', '#004e89', '#1a659e'];
const numBalls = 40;
const balls = [];
let gravity;
let wind;
const windStrength = 15;
let mouse;
let trajectory = [];
let trajectorySize = 5;
let center;
let hoveredBall = null;
let grabbedBall = null;

function setup() {
  createCanvas(600, 400);
  for (let n = 0; n < numBalls; n++) {
    const maxAttempts = 10;
    let newBall;
    let attempts = 0;
    do {
      attempts++;
      if (attempts > maxAttempts) {
        console.warn('max attempts reached');
        break;
      }
      const randDiameter = random(10, 50);
      const randomX = random(0.5 * randDiameter, width - 0.5 * randDiameter);
      const randomY = random(0.5 * randDiameter, height - 0.5 * randDiameter);
      newBall = new Ball(randomX, randomY, randDiameter, {
        fill: colors[n % colors.length],
      });
    } while (balls.some((ball) => ball.isOverlapped(newBall)));
    if (attempts <= maxAttempts) balls.push(newBall);
  }
  console.log(balls);

  gravity = createVector(0, 0.1);
  wind = createVector(0, 0);
  mouse = createVector(0, 0);
  center = createVector(width / 2, height / 2);

  background('black');
}

function draw() {
  background('black');

  mouse.set(mouseX, mouseY);
  if (trajectory.length < trajectorySize) {
    trajectory.push(mouse.copy());
  } else {
    trajectory.shift();
    trajectory.push(mouse.copy());
  }

  if (!grabbedBall && !keyIsDown(SHIFT)) {
    if (mouseIsPressed) {
      wind.set(p5.Vector.sub(mouse, center).setMag(windStrength));
    } else {
      wind.set(0, 0);
    }
  }

  if (!grabbedBall) {
    hoveredBall = null;
    for (const aBall of balls) {
      if (aBall.isHovered(mouse)) {
        hoveredBall = aBall;
        break;
      }
    }
  }

  balls.forEach((aBall, idx) => {
    aBall.applyGravity(gravity);
    aBall.applyForce(wind);
    aBall.update();
    aBall.resolveWallCollision(0.5);
    for (let otherIdx = idx + 1; otherIdx < balls.length; otherIdx++) {
      const otherBall = balls[otherIdx];
      aBall.resolveBallCollision(otherBall);
    }
  });

  balls.forEach((ball) => {
    ball.show(ball === hoveredBall);
  });

  stroke('white');
  line(width / 2, height / 2, width / 2 + wind.x, height / 2 + wind.y);
}

function mousePressed() {
  if (keyIsDown(SHIFT)) {
    let newBall;
    const randDiameter = random(10, 50);
    newBall = new Ball(mouseX, mouseY, randDiameter, {
      fill: colors[balls.length % colors.length],
    });
    const isOverlapped = balls.some((ball) => ball.isOverlapped(newBall));
    if (!isOverlapped) balls.push(newBall);
  } else {
    if (hoveredBall) {
      grabbedBall = hoveredBall;
      grabbedBall.onGrab(mouse);
    }
  }
}

function mouseDragged() {
  if (!grabbedBall) return;
  grabbedBall.onDrag(mouse);
}

function mouseReleased() {
  if (!grabbedBall) return;

  let avgVel = createVector(0, 0);
  if (trajectory.length > 1) {
    for (let i = 1; i < trajectory.length; i++) {
      const vel = p5.Vector.sub(trajectory[i], trajectory[i - 1]);
      avgVel.add(vel);
    }
    avgVel.div(trajectory.length - 1);
  }
  grabbedBall.onRelease(avgVel);
  grabbedBall = null;
}

function keyPressed() {
  if (key === 'i' || key === 'I') {
    console.log(frameRate());
  }
}
