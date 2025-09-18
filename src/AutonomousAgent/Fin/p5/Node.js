class Node {
  pos = createVector(0, 0);
  fill = color(255);

  constructor(x, y, options) {
    this.pos.set(x, y);
    if (options?.fill) this.fill = options.fill;
  }

  show() {
    push();
    stroke(this.fill);
    noFill();
    circle(this.pos.x, this.pos.y, 10);
    pop();
  }
}
