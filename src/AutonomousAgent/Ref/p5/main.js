let chain;

function setup() {
  createCanvas(800, 600);

  chain = new Chain([width / 2, height / 2], 12, 64, Math.PI / 8);
}

function draw() {
  chain.moveTo(createVector(mouseX, mouseY));

  background(0);

  chain.show();
}
