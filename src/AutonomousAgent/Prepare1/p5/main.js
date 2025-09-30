let vehicle;
let target;

function setup() {
  createCanvas(800, 600);
  vehicle = new Vehicle(width / 2, height / 2);
  target = createVector(mouseX, mouseY);
}

function draw() {
  background(0);
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 16);
  vehicle.seek(target);
  vehicle.update();
  vehicle.show();
}

function mousePressed() {
  target.set(mouseX, mouseY);
}
