// let ball;
let ballNum = 50;
let balls = [];
let wind = [0, 0];
const windStrength = 50;
let gravity = [0, 0.1];

function setup() {
  createCanvas(600, 400);
  // ball = new Ball(0.5 * width, 0.5 * height, 100, 5);
  for (let n = 0; n < ballNum; n++) {
    const randomDiameter = random(20, 100);
    const randomX = random(0.5 * randomDiameter, width - 0.5 * randomDiameter);
    const randomY = random(0.5 * randomDiameter, height - 0.5 * randomDiameter);
    const randomSpeed = 0;
    balls.push(new Ball(randomX, randomY, randomDiameter, randomSpeed));
  }
}

function draw() {
  background("black");

  wind[0] = map(mouseX - 0.5 * width, -0.5 * width, +0.5 * width, -1, 1);
  wind[1] = map(mouseY - 0.5 * height, -0.5 * height, +0.5 * height, -1, 1);
  noFill();
  stroke("white");
  line(
    0.5 * width,
    0.5 * height,
    0.5 * width + 100 * wind[0],
    0.5 * height + 100 * wind[1]
  );
  wind[0] *= windStrength;
  wind[1] *= windStrength;

  // ball.boundary();
  // ball.update();
  balls.forEach((aBall) => {
    aBall.applyForce(wind);
    aBall.applyGravity(gravity);
    aBall.boundary();
    aBall.update();
  });

  // ball.render();
  for (let idx = 0; idx < balls.length; idx++) {
    balls[idx].render();
  }
}
