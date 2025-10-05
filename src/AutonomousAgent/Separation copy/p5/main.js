const vehicles = [];

function setup() {
  createCanvas(800, 600);

  for (let n = 0; n < 10; n++) {
    vehicles.push(
      new Vehicle(random(width), random(height), {
        colour: '#FFFFFF',
        maxSpeed: 5,
        maxForce: 1,
        maxAngle: Math.PI * (15 / 180),
      })
    );
  }
}

function draw() {
  if (mouseIsPressed) {
    vehicles.push(
      new Vehicle(mouseX + random(-0.5, 0.5), mouseY + random(-0.5, 0.5), {
        colour: '#FFFFFF',
        maxSpeed: 5,
        maxForce: 1,
        maxAngle: Math.PI * (15 / 180),
      })
    );
  }

  background(0);

  vehicles.forEach((v) => {
    v.separate(vehicles);
    v.update();
    v.wrapCoordinate();
    v.show();
  });
}
