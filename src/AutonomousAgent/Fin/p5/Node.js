class Node {
  pos = createVector(0, 0);
  fill;

  constructor(x, y, options) {
    this.pos.set(x, y);
    this.fill = options?.fill || color(255);
  }

  show() {
    push();
    stroke(this.fill);
    noFill();
    circle(this.pos.x, this.pos.y, 10);
    pop();
  }
}
