class Vehicle {
  constructor(x, y, maxspeed = 8, maxforce = 0.2) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 6.0;
    this.maxSpeed = maxspeed;
    this.maxForce = maxforce;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    const desiredVec = p5.Vector.sub(target, this.pos);
    desiredVec.setMag(this.maxSpeed);
    const steerVec = p5.Vector.sub(desiredVec, this.vel);
    steerVec.limit(this.maxForce);
    this.applyForce(steerVec);
  }

  show() {
    const angle = this.vel.heading();
    fill(127);
    stroke(0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    beginShape();
    vertex(this.r * 2, 0);
    vertex(-this.r * 2, -this.r);
    vertex(-this.r * 2, this.r);
    endShape(CLOSE);
    pop();
  }
}
