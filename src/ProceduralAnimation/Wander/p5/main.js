let vehicle;
let mouse;

const showFlags = [true, true, true, true, true, true, true, true, true, true];

function setup() {
  createCanvas(600, 800);

  vehicle = new Vehicle(width / 2, height / 2, {
    maxSpeed: 5,
    maxForce: 0.05,
    wanderRad: 25,
    wanderDist: 80,
    wanderChangeRange: radians(15),
  });

  mouse = createVector(0, 0);
}

function draw() {
  background(0);

  mouse.set(mouseX, mouseY);

  vehicle.wander();
  vehicle.update();
  vehicle.wrapCoordinate();
  vehicle.show();
  vehicle.showWander();
}

function keyPressed() {
  const num = parseInt(key);
  if (!isNaN(num)) {
    showFlags[num] = !showFlags[num];
  }
}
