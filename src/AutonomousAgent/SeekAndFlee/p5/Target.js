class Target {
  constructor(
    x,
    y,
    r,
    options = {
      colour: '#FFFFFF',
      speed: 5,
    }
  ) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.setMag(options?.speed || 5);
    this.r = r;
    this.colour = options?.colour || '#FFFFFF';
  }

  update() {
    this.pos.add(this.vel);
  }

  resolveWallCollision() {
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.colour);
    circle(0, 0, 2 * this.r);
    pop();
  }
}
