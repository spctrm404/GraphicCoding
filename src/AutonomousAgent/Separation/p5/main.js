const vehicles = [];
let randomSeedNum = 0;
const vehicleOptions = {
  colour: '#FFFFFF',
  maxSpeed: 2,
  maxForce: 0.1,
};

function setup() {
  createCanvas(800, 600);

  randomSeed(randomSeedNum);
  for (let n = 0; n < 50; n++) {
    const newVehicle = new Vehicle(
      random(width),
      random(height),
      vehicleOptions
    );
    const maxAttempts = 100;
    for (
      let attempts = 0;
      vehicles.some((v) => v.isColliding(newVehicle)) && attempts < maxAttempts;
      attempts++
    ) {
      newVehicle.pos.set(random(width), random(height));
    }
    vehicles.push(newVehicle);
  }
}

function draw() {
  if (mouseIsPressed) {
    vehicles.push(
      new Vehicle(
        mouseX + random(-0.5, 0.5),
        mouseY + random(-0.5, 0.5),
        vehicleOptions
      )
    );
  }

  background(0);

  vehicles.forEach((v) => {
    v.separate(vehicles);
    v.update();
    v.wrapCoordinate();
    v.show();
    v.showBoundary();
  });
}
