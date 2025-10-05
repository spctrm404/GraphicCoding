const pursuerNum = 5;
const evaderNum = 10;
const pursuers = [];
const evaders = [];

function setup() {
  createCanvas(800, 600);
  for (let n = 0; n < pursuerNum; n++) {
    pursuers.push(
      new Vehicle(random(width), random(height), {
        colour: '#FF0000',
        maxSpeed: 2,
        maxSeekForce: 0.5,
        maxFleeForce: 0,
        maxAngle: Math.PI * (10 / 180),
        fleeSenseRad: 50,
      })
    );
  }

  for (let n = 0; n < evaderNum; n++) {
    evaders.push(
      new Vehicle(random(width), random(height), {
        colour: '#00FF00',
        maxSpeed: 10,
        maxSeekForce: 1,
        maxFleeForce: 0.8,
        maxAngle: Math.PI * (15 / 180),
        fleeSenseRad: 100,
      })
    );
  }
}

function draw() {
  background(0);

  pursuers.forEach((pursuer) => {
    let minDist = Infinity;
    let closestEvader = null;
    for (const evader of evaders) {
      const d = p5.Vector.dist(pursuer.pos, evader.pos);
      if (d < minDist) {
        minDist = d;
        closestEvader = evader;
      }
    }
    pursuer.pursue(closestEvader);
    pursuer.update();
    pursuer.wrapCoordinate();
    pursuer.show();
  });

  evaders.forEach((evader) => {
    let minDist = Infinity;
    let closestPursuer = null;
    for (const pursuer of pursuers) {
      const d = p5.Vector.dist(pursuer.pos, evader.pos);
      if (d < minDist) {
        minDist = d;
        closestPursuer = pursuer;
      }
    }
    evader.evade(closestPursuer);
    evader.update();
    evader.wrapCoordinate();
    evader.show();
    // evader.showSenseRad();
  });
}
