class Vehicle {
  constructor(
    x,
    y,
    options = {
      colour: '#FFFFFF',
      maxSpeed: 5,
      maxSeekForce: 1,
      maxFleeForce: 2,
      maxAngle: Math.PI * (15 / 180),
      fleeSenseRad: 200,
    }
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 25;
    this.colour = options?.colour || '#FFFFFF';
    this.fleeSenseRad = options?.fleeSenseRad || 200;
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxSeekForce = options?.maxSeekForce || 1;
    this.maxFleeForce = options?.maxFleeForce || 2;
    this.maxAngle = options?.maxAngle || Math.PI * (15 / 180);
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

  flee(target) {
    const distance = p5.Vector.dist(this.pos, target.pos);
    const normalized = distance / this.fleeSenseRad;
    if (normalized > 1) return;

    const desiredVec = p5.Vector.sub(this.pos, target.pos);

    desiredVec.setMag(this.maxSpeed);

    const steerVec = p5.Vector.sub(desiredVec, this.vel);
    steerVec.limit(this.maxFleeForce);
    this.applyForce(steerVec);
  }

  seek(target) {
    const desiredVec = p5.Vector.sub(target.pos, this.pos);

    desiredVec.setMag(this.maxSpeed);

    const steerVec = p5.Vector.sub(desiredVec, this.vel);
    steerVec.limit(this.maxSeekForce);
    this.applyForce(steerVec);
  }

  show() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noStroke();
    fill(this.colour);
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

  showSenseRad() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke(this.colour);
    circle(0, 0, this.fleeSenseRad * 2);
    pop();
  }
}
