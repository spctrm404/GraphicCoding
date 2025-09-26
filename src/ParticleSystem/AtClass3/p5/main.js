const palette = ["#84994F", "#FFE797", "#FCB53B", "#B45253"];

let ps = [];

function setup() {
  createCanvas(500, 400);

  for (let n = 0; n < 2000; n++) {
    ps.push(new Particle(0.5 * width, 0.5 * height, 30, random(1, 5), 20));
  }
}

function draw() {
  background(127);
  // for (let idx = 0; idx < ps.length; idx++) {
  //   const aParticle = ps[idx];
  //   aParticle.drawRect();
  // }
  // for (const aParticle of ps) {
  //   aParticle.drawRect();
  // }
  ps.forEach((aParticle, idx) => {
    aParticle.applyGravity(0.01);
    aParticle.update();
    aParticle.drawRect();
  });
}
