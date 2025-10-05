class Vehicle {
  constructor(
    x,
    y,
    maxSpeed = 5,
    maxForce = 1,
    maxAngle = Math.PI * (15 / 180)
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 25;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.maxAngle = maxAngle;
  }

  update() {
    const prevVel = this.vel.copy();
    this.vel.add(this.acc);
    const angleDiff = p5.Vector.angleBetween(prevVel, this.vel);
    if (Math.abs(angleDiff) > this.maxAngle) {
      prevVel.rotate(angleDiff > 0 ? this.maxAngle : -this.maxAngle);
      this.vel = prevVel;
    }
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    const distance = p5.Vector.dist(this.pos, target);
    const normalized = distance / this.decRad;
    const desiredVec = p5.Vector.sub(target, this.pos);
    desiredVec.setMag(this.maxSpeed);
    const steerVec = p5.Vector.sub(desiredVec, this.vel);
    steerVec.limit(this.maxForce);
    this.applyForce(steerVec);
  }

  show() {
    const angle = this.vel.heading();
    fill(255);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    beginShape();
    vertex(0, 0);
    vertex(
      -this.r + this.r * Math.cos(radians(-120)),
      this.r * Math.sin(radians(-120))
    );
    vertex(
      -this.r + this.r * Math.cos(radians(120)),
      this.r * Math.sin(radians(120))
    );
    endShape(CLOSE);
    pop();
  }
}
