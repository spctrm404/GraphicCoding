let body;
let mouse;
let arms = [];

function setup() {
  createCanvas(400, 300);

  body = Links.createLinks(width / 2, height / 2, 10, 30, {
    from: (150 / 180) * Math.PI,
    to: (210 / 180) * Math.PI,
    dir: 'cw',
  });

  arms.push(Links.createLinks(0, 0, 4));
  arms.forEach((anArm) => {
    anArm.addNode(0, body.nodes[2]);
  });

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

  arms.forEach((anArm) => {
    anArm.resolve();
    anArm.show();
  });
}
