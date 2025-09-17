let links;

function setup() {
  createCanvas(800, 600);

  links = new Links(100, height / 2, 30, 20);
}

function draw() {
  background(0);
  links.moveHead(mouseX, mouseY);
  links.constrain();
  links.show();
}
