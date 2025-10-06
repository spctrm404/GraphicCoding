const pursuers = [];
const evaders = [];
const vehicles = [];
let randomSeedNum = 0;

function setup() {
  createCanvas(800, 600);

  randomSeed(randomSeedNum);
  for (let n = 0; n < 3; n++) {
    const newPursuer = new Vehicle(random(width), random(height), {
      colour: '#FF0000',
      maxSpeed: 2.1,
      maxForce: 0.1,
      senseRad: 60,
    });
    newPursuer.randomizeVelocity();
    pursuers.push(newPursuer);
  }

  for (let n = 0; n < 10; n++) {
    evaders.push(
      new Vehicle(random(width), random(height), {
        colour: '#00FF00',
        maxSpeed: 2,
        maxForce: 1,
        senseRad: 50,
      })
    );
  }

  vehicles.push(...pursuers, ...evaders);
}

function draw() {
  background(0);

  pursuers.forEach((p) => {
    const target = p.findTarget(evaders);
    if (target) {
      p.pursue(target);
    }
  });

  evaders.forEach((e) => {
    const target = e.findTarget(pursuers);
    if (target) {
      e.evade(target);
    }
  });

  vehicles.forEach((v) => {
    v.update();
    v.wrapCoordinate();
    v.show();
    v.showSenseRad();
  });
}
