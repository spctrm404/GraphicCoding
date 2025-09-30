class Node {
  pos = createVector(0, 0);
  colour;

  constructor(x, y, options) {
    this.pos.set(x, y);
    this.colour = options?.colour || color(255);
  }

  show() {
    push();
    stroke(this.colour);
    noFill();
    circle(this.pos.x, this.pos.y, 10);
    pop();
  }
}
