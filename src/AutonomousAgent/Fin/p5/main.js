let body;
let mouse;
const shoulders = [];
const armStep = [];
const arms = [];
let dist = 50;

function setup() {
  createCanvas(800, 600);

  body = new Links(width / 2, height / 2, 30);
  shoulders.push(createVector(0, 0));
  shoulders.push(createVector(0, 0));
  armStep.push(createVector(0, 0));
  armStep.push(createVector(0, 0));
  calculateShoulders();
  arms.push(new Links(shoulders[0].x, shoulders[0].y, 15, 5));
  arms.push(new Links(shoulders[1].x, shoulders[1].y, 15, 5));

  mouse = createVector(0, 0);
}

function calculateShoulders() {
  const toHeadVec = body.links[10].toBeginVec;
  const leftShoulderPos = p5.Vector.rotate(toHeadVec, -Math.PI / 2)
    .setMag(20)
    .add(body.links[10].endNode.pos);
  const rightShoulderPos = p5.Vector.rotate(toHeadVec, Math.PI / 2)
    .setMag(20)
    .add(body.links[10].endNode.pos);
  shoulders[0].set(leftShoulderPos);
  shoulders[1].set(rightShoulderPos);
  const leftStepPos = p5.Vector.rotate(toHeadVec, (-15 / 180) * Math.PI)
    .setMag(50)
    .add(shoulders[0]);
  const rightStepPos = p5.Vector.rotate(toHeadVec, (15 / 180) * Math.PI)
    .setMag(50)
    .add(shoulders[1]);
  armStep[0].set(leftStepPos);
  armStep[1].set(rightStepPos);
}

function draw() {
  background(0);

  mouse.set(constrain(mouseX, 0, width), constrain(mouseY, 0, height));

  body.moveHead(mouse.x, mouse.y);
  body.resolve();
  calculateShoulders();
  arms.forEach((arm, i) => {
    arm.moveHead(shoulders[i].x, shoulders[i].y);
    arm.fabrikResolve();
    const currDist = p5.Vector.dist(shoulders[i], arm.tail.pos);
    if (currDist > dist) {
      arm.moveTail(armStep[i].x, armStep[i].y);
    }
    arm.show();
  });
  fill('white');
  noStroke();
  circle(shoulders[0].x, shoulders[0].y, 10);
  circle(shoulders[1].x, shoulders[1].y, 10);
  fill('red');
  noStroke();
  circle(armStep[0].x, armStep[0].y, 10);
  circle(armStep[1].x, armStep[1].y, 10);
  body.show();
}
