let links;
let mouse;

function setup() {
  createCanvas(800, 600);

  links = new Links(width / 2, height / 2, 10, 20);
  mouse = createVector(0, 0);
}

function draw() {
  background(0);

  mouse.set(constrain(mouseX, 0, width), constrain(mouseY, 0, height));

  links.moveHead(mouse.x, mouse.y);
  links.resolve();
  // links.fabrikResolve();
  // links.moveTail(mouse.x, mouse.y);
  // links.reverseResolve();
  links.show();
}
