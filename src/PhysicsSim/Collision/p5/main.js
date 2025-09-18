const DEBUG = true;

const colors = ['#ff6b35', '#f7c59f', '#efefd0', '#004e89', '#1a659e'];
const balls = [];
let mouse;
let hoveredBall = null;
let grabbedBall = null;

function setup() {
  createCanvas(600, 400);
  newBall = new Ball(250, 200, 100, {
    fill: colors[1 % colors.length],
    vel: createVector(50, -20),
  });
  balls.push(newBall);
  newBall = new Ball(350, 250, 100, {
    fill: colors[2 % colors.length],
    vel: createVector(-80, 60),
  });
  balls.push(newBall);
  console.log(balls);

  mouse = createVector(0, 0);

  background('black');
}

function draw() {
  background('black');

  mouse.set(mouseX, mouseY);

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
    // aBall.update();
    for (let otherIdx = idx + 1; otherIdx < balls.length; otherIdx++) {
      const otherBall = balls[otherIdx];
      aBall.resolveBallCollision(otherBall);
    }
  });

  balls.forEach((ball) => {
    ball.show(ball === hoveredBall);
  });

  console.log(grabbedBall);
}

function mousePressed() {
  if (!hoveredBall) return;

  grabbedBall = hoveredBall;
  grabbedBall.onGrab(mouse);
}

function mouseDragged() {
  if (!grabbedBall) return;

  grabbedBall.onDrag(mouse);
}

function mouseReleased() {
  if (!grabbedBall) return;

  grabbedBall.onRelease();
  grabbedBall = null;
}

function keyPressed() {
  if (key === 'i' || key === 'I') {
    console.log(frameRate());
  }
}
