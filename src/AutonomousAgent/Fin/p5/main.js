let body;
let mouse;
let arms = [];
const armMovingThreshold = 70;

function setup() {
  createCanvas(600, 800);

  body = Links.createLinks(width / 2, height / 2, 10, 30, {
    from: (150 / 180) * Math.PI,
    to: (210 / 180) * Math.PI,
    dir: 'cw',
  });

  arms.push(Links.createLinks(body.nodes[3].pos.x, body.nodes[3].pos.y, 5));
  arms.push(Links.createLinks(body.nodes[3].pos.x, body.nodes[3].pos.y, 5));
  console.log(arms[0].length);

  mouse = createVector(0, 0);
}

function draw() {
  background(128);

  mouse.set(constrain(mouseX, 0, width), constrain(mouseY, 0, height));

  body.moveHead(mouse.x, mouse.y);
  body.resolve();
  // body.moveTail(mouse.x, mouse.y);
  // body.revResolve();
  body.show();

  arms.forEach((anArm, idx) => {
    if (p5.Vector.dist(anArm.head.pos, anArm.tail.pos) > armMovingThreshold) {
      const targetPos = p5.Vector.rotate(
        body.links[0].toHeadVec,
        idx % 2 === 0 ? (-150 / 180) * Math.PI : (150 / 180) * Math.PI
      )
        .setMag(50)
        .add(body.nodes[0].pos);
      anArm.moveTail(targetPos.x, targetPos.y);
    }
    anArm.moveHead(body.nodes[3].pos.x, body.nodes[3].pos.y);
    anArm.fabrikResolve();
    // anArm.resolve();
    anArm.show();
  });
  const targetPosL = p5.Vector.rotate(
    body.links[0].toHeadVec,
    (150 / 180) * Math.PI
  )
    .setMag(50)
    .add(body.nodes[0].pos);
  fill(0);
  circle(targetPosL.x, targetPosL.y, 8);
  const targetPosR = p5.Vector.rotate(
    body.links[0].toHeadVec,
    (-150 / 180) * Math.PI
  )
    .setMag(50)
    .add(body.nodes[0].pos);
  fill(255);
  circle(targetPosR.x, targetPosR.y, 8);
}
