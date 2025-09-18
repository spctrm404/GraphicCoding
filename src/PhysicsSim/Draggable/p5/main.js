const DEBUG = true;

const colors = ['#ff6b35', '#f7c59f', '#efefd0', '#004e89', '#1a659e'];
const balls = [];
let mouse;
let hoveredBall = null;
let grabbedBall = null;

function setup() {
  createCanvas(600, 400);
  newBall = new Ball((1 / 4) * width, height / 2.0, 100, {
    fill: colors[1 % colors.length],
  });
  balls.push(newBall);
  newBall = new Ball((2 / 4) * width, height / 2.0, 150, {
    fill: colors[2 % colors.length],
  });
  balls.push(newBall);
  newBall = new Ball((3 / 4) * width, height / 2.0, 200, {
    fill: colors[3 % colors.length],
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

  balls.forEach((ball) => {
    ball.show(ball === hoveredBall);
  });

  stroke('white');
}

function mousePressed() {
  if (hoveredBall) {
    grabbedBall = hoveredBall;
    grabbedBall.onGrab(mouse);
  }
}

function mouseDragged() {
  if (!grabbedBall) return;

  grabbedBall.onDrag(mouse);
}

function mouseReleased() {
  if (!grabbedBall) return;

  grabbedBall = null;
}

function keyPressed() {
  if (key === 'i' || key === 'I') {
    console.log(frameRate());
  }
}
