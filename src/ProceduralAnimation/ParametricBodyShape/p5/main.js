let snake;
let mouse;
const showFlags = [true, true, true, true, true, true, true, true, true, true];

function setup() {
  createCanvas(600, 800);

  snake = new Snake(
    width / 2,
    height / 4,
    30,
    [
      40, 30, 40, 30, 40, 30, 40, 30, 40, 30, 40, 30, 40, 30, 40, 30, 40, 30,
      25, 20, 15, 10,
    ]
  );

  mouse = createVector(0, 0);
}

function draw() {
  background(0);

  mouse.set(mouseX, mouseY);

  snake.setHeadPos(mouse);
  snake.update();
  if (showFlags[0]) snake.show();
  if (showFlags[1]) snake.showDistConstraint();
  if (showFlags[2]) snake.showBodyThickness();
  if (showFlags[3]) snake.showBodyShapePoints();
  if (showFlags[4]) snake.showBodyShape();
  if (showFlags[5]) snake.showEyes();
}

function keyPressed() {
  const num = parseInt(key);
  if (!isNaN(num)) {
    showFlags[num] = !showFlags[num];
  }
}
