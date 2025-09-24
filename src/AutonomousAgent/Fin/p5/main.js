let body;
let mouse;

function setup() {
  createCanvas(400, 300);

  body = new Links(width / 2, height / 2, 15, 30, {
    from: (150 / 180) * Math.PI,
    to: (210 / 180) * Math.PI,
    dir: 'cw',
  });

  mouse = createVector(0, 0);
}

function draw() {
  background(128);

  mouse.set(constrain(mouseX, 0, width), constrain(mouseY, 0, height));

  body.moveHead(mouse.x, mouse.y);
  body.resolve();
  body.show();
}
