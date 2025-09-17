class Node {
  pos = createVector(0, 0);

  constructor(x, y) {
    this.pos.set(x, y);
  }

  show() {
    push();
    stroke(255);
    noFill();
    circle(this.pos.x, this.pos.y, 10);
    pop();
  }
}
