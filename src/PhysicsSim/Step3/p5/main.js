// let ball;
let ballNum = 5;
let balls = [];

function setup() {
  createCanvas(600, 400);
  // ball = new Ball(0.5 * width, 0.5 * height, 100, 5);
  for (let n = 0; n < ballNum; n++) {
    const randomDiameter = random(30, 100);
    const randomX = random(0.5 * randomDiameter, width - 0.5 * randomDiameter);
    const randomY = random(0.5 * randomDiameter, height - 0.5 * randomDiameter);
    const randomSpeed = random(3, 10);
    balls.push(new Ball(randomX, randomY, randomDiameter, randomSpeed));
  }
}

function draw() {
  background("black");

  // ball.boundary();
  // ball.update();
  balls.forEach((aBall) => {
    aBall.boundary();
    aBall.update();
  });

  // ball.render();
  for (let idx = 0; idx < balls.length; idx++) {
    balls[idx].render();
  }
}
