const vehicles = [];

function setup() {
  createCanvas(800, 600);
  vehicles.push(
    new Vehicle(width / 2 - 50, height / 2, {
      colour: '#FF0000',
      maxSpeed: 3,
      maxSeekForce: 1,
      maxFleeForce: 2,
      maxAngle: Math.PI * (5 / 180),
      fleeSenseRad: 50,
    })
  );
  vehicles.push(
    new Vehicle(width / 2 + 50, height / 2, {
      colour: '#00FF00',
      maxSpeed: 10,
      maxSeekForce: 1,
      maxFleeForce: 2,
      maxAngle: Math.PI * (5 / 180),
      fleeSenseRad: 200,
    })
  );
}

function draw() {
  background(0);

  vehicles[0].pursue(vehicles[1]);
  vehicles[0].update();
  vehicles[1].evade(vehicles[0]);
  vehicles[1].update();
  vehicles.forEach((v, idx) => {
    v.wrapCoordinate();
    v.show();
  });
  vehicles[1].showSenseRad();
}
