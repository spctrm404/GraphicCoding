const vehicles = [];
let randomSeedNum = 1;
const vehicleOptions = {
  colour: '#FFFFFF',
  maxSpeed: 1,
  maxForce: 0.01,
  r: 10,
  neighborDist: 50,
};

function setup() {
  createCanvas(800, 600);

  randomSeed(randomSeedNum);
  for (let n = 0; n < 100; n++) {
    const newVehicle = new Vehicle(
      random(width),
      random(height),
      vehicleOptions
    );
    newVehicle.randomizeVelocity();
    vehicles.push(newVehicle);
  }
}

function draw() {
  if (mouseIsPressed) {
    const newVehicle = new Vehicle(
      mouseX + random(-1, 1),
      mouseY + random(-1, 1),
      vehicleOptions
    );
    newVehicle.randomizeVelocity();
    vehicles.push(newVehicle);
  }

  background(0);

  vehicles.forEach((v) => {
    v.separate(vehicles, 1);
    v.align(vehicles, 0.5);
    v.cohere(vehicles, 0.1);
    v.update();
    v.wrapCoordinate();
    v.show();
  });
}
