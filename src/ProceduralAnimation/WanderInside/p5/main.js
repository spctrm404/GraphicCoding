let vehicle;
let mouse;

const showFlags = [true, true, true, true, true, true, true, true, true, true];

function setup() {
  createCanvas(600, 800);

  vehicle = new Vehicle(width / 2, height / 2, {
    vel: p5.Vector.random2D().setMag(2),
    maxSpeed: 3,
    maxForce: 0.15,
    wanderRad: 25,
    wanderDist: 80,
    wanderChangeRange: radians(15),
  });

  mouse = createVector(0, 0);
}

function draw() {
  background(0);

  mouse.set(mouseX, mouseY);

  vehicle.wander(0.5);
  vehicle.boundaries(100, 1);
  vehicle.update();
  vehicle.show();
  vehicle.showWander();
}

function keyPressed() {
  const num = parseInt(key);
  if (!isNaN(num)) {
    showFlags[num] = !showFlags[num];
  }
}
