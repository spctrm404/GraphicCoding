const vehicles = [];
const targets = [];

function setup() {
  createCanvas(800, 600);
  vehicles.push(
    new Vehicle(width / 2, height / 2, {
      colour: '#FF0000',
      maxSpeed: 3,
      maxSeekForce: 1,
      maxFleeForce: 2,
      maxAngle: Math.PI * (5 / 180),
      fleeSenseRad: 50,
    })
  );
  vehicles.push(
    new Vehicle(width / 2, height / 2, {
      colour: '#00FF00',
      maxSpeed: 10,
      maxSeekForce: 1,
      maxFleeForce: 2,
      maxAngle: Math.PI * (5 / 180),
      fleeSenseRad: 200,
    })
  );
  targets.push(
    new Target(0.5 * width, 0.5 * height, 25, { colour: '#FF0000', speed: 5 })
  );
  targets.push(
    new Target(0.5 * width, 0.5 * height, 25, { colour: '#00FF00', speed: 5 })
  );
}

function draw() {
  background(0);

  targets.forEach((t) => {
    t.update();
    t.resolveWallCollision();
    t.show();
  });

  vehicles[0].seek(targets[0]);
  vehicles[0].update();
  vehicles[1].seek(targets[1]);
  vehicles[1].flee(vehicles[0]);
  vehicles[1].update();
  vehicles.forEach((v, idx) => {
    v.show();
  });
  vehicles[1].showSenseRad();
}
