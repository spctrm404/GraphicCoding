let center;
let currVec;
let angleRange;
let cwRange;
let ccwRange;
let newVec;
let constrainedVec;

const sliderCurrAngle = document.getElementById('currAngle');
function updateCurrVec(angle) {
  currVec = p5.Vector.fromAngle(angle);
  updateAngleRange();
}
const sliderAngleRange = document.getElementById('angleRange');
function updateAngleRange() {
  const currAngle = currVec.heading();
  cwRange = p5.Vector.fromAngle(currAngle + 0.5 * angleRange);
  ccwRange = p5.Vector.fromAngle(currAngle - 0.5 * angleRange);
}

function setup() {
  createCanvas(800, 600);
  center = createVector(width / 2, height / 2);
  const currAngle = radians(parseFloat(sliderCurrAngle.value));
  currVec = p5.Vector.fromAngle(currAngle);

  angleRange = radians(parseFloat(sliderAngleRange.value));
  cwRange = p5.Vector.fromAngle(currAngle + 0.5 * angleRange);
  ccwRange = p5.Vector.fromAngle(currAngle - 0.5 * angleRange);

  newVec = createVector(0, 0);

  constrainedVec = createVector(0, 0);

  sliderCurrAngle.addEventListener('input', () => {
    const currAngle = radians(parseFloat(sliderCurrAngle.value));
    updateCurrVec(currAngle);
  });

  sliderAngleRange.addEventListener('input', () => {
    angleRange = radians(parseFloat(sliderAngleRange.value));
    updateAngleRange();
  });
}

function drawVector(vec, length) {
  push();
  translate(center.x, center.y);
  line(0, 0, vec.x * length, vec.y * length);
  translate(vec.x * length, vec.y * length);
  rotate(vec.heading());
  line(0, 0, -10, -5);
  line(0, 0, -10, 5);
  pop();
}

function draw() {
  background(0);

  newVec.set(mouseX, mouseY);
  newVec.sub(center);
  newVec.setMag(1);

  const newAngle = newVec.heading();
  const currAngle = currVec.heading();
  const angleDiff = p5.Vector.angleBetween(currVec, newVec);
  if (Math.abs(angleDiff) > 0.5 * angleRange) {
    background('blue');
    constrainedVec.set(angleDiff > 0 ? cwRange : ccwRange);
  } else {
    constrainedVec.set(newVec);
  }
  fill('white');
  noStroke();
  text(`Cur: ${degrees(currAngle).toFixed(2)}°`, 10, 20);
  text(`Ran: ${degrees(0.5 * angleRange).toFixed(2)}°`, 10, 40);
  text(`New: ${degrees(newAngle).toFixed(2)}°`, 10, 60);
  text(`Dif: ${degrees(angleDiff).toFixed(2)}°`, 10, 80);

  stroke('white');
  drawVector(currVec, 100);
  stroke('red');
  drawVector(constrainedVec, 200);
  stroke('magenta');
  drawVector(cwRange, 100);
  drawVector(ccwRange, 100);
  stroke('yellow');
  drawVector(newVec, 100);
}
