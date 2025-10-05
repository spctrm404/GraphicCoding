const vehicles = [];
let target;

function setup() {
  createCanvas(800, 600);
  vehicles.push(
    new Vehicle(width / 2, height / 2, { type: 'arrive', colour: '#FF0000' })
  );
  vehicles.push(
    new Vehicle(width / 2, height / 2, {
      type: 'flee',
      colour: '#00FF00',
      senseRad: 200,
    })
  );
  target = createVector(mouseX, mouseY);
}

function draw() {
  if (mouseIsPressed) {
    target.set(mouseX, mouseY);
  }
  background(0);
  fill(255, 255, 0);
  noStroke();
  circle(target.x, target.y, 16);
  vehicles.forEach((v) => {
    if (v.type === 'arrive') {
      v.arrive(target);
    } else if (v.type === 'flee') {
      v.flee(target);
    }
    v.update();
    v.show();
  });
}
