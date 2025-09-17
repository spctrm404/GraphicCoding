const DEBUG = true;

const colors = ['#ff6b35', '#f7c59f', '#efefd0', '#004e89', '#1a659e'];
const numBalls = 2;
const balls = [];
let gravity;
let wind;
const windStrength = 15;
let mouse;
let center;

function setup() {
  createCanvas(600, 400);

  // const maxAttempts = 10;
  // for (let n = 0; n < numBalls; n++) {
  //   let newBall;
  //   let attempts = 0;
  //   do {
  //     const randDiameter = random(10, 50);
  //     const randomX = random(0.5 * randDiameter, width - 0.5 * randDiameter);
  //     const randomY = random(0.5 * randDiameter, height - 0.5 * randDiameter);
  //     newBall = new Ball(randomX, randomY, randDiameter, {
  //       fill: colors[n % colors.length],
  //     });
  //     attempts++;
  //     if (attempts > maxAttempts) {
  //       console.warn('max attempts reached');
  //       break;
  //     }
  //   } while (balls.some((ball) => ball.isOverlapped(newBall)));
  //   if (attempts <= maxAttempts) balls.push(newBall);
  // }
  balls.push(
    new Ball(200, 200, 80, { fill: colors[0], vel: createVector(10, -5) })
  );
  balls.push(
    new Ball(220, 220, 80, { fill: colors[1], vel: createVector(-15, 10) })
  );
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
  if (mouseIsPressed) {
    wind.set(p5.Vector.sub(mouse, center).setMag(windStrength));
  } else {
    wind.set(0, 0);
  }

  balls.forEach((aBall, idx) => {
    // aBall.applyGravity(gravity);
    // aBall.applyForce(wind);
    // aBall.update();
    // aBall.resolveWallCollision(0.5);
    for (let otherIdx = idx - 1; otherIdx >= 0; otherIdx--) {
      const otherBall = balls[otherIdx];
      aBall.resolveBallCollision(otherBall);
    }
  });

  balls.forEach((ball) => {
    ball.show();
  });

  stroke('white');
  line(width / 2, height / 2, width / 2 + wind.x, height / 2 + wind.y);
}

function keyPressed() {
  if (key === 'i' || key === 'I') {
    console.log(frameRate());
  }
}
