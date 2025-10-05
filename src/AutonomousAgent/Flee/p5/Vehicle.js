class Vehicle {
  constructor(
    x,
    y,
    options = {
      type: 'arrive',
      colour: '#FFFFFF',
      maxSpeed: 5,
      maxForce: 1,
      maxAngle: Math.PI * (15 / 180),
      senseRad: 100,
    }
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 25;
    this.type = options?.type || 'arrive';
    this.colour = options?.colour || '#FFFFFF';
    this.senseRad = options?.senseRad || 100;
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxForce = options?.maxForce || 1;
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
    const distance = p5.Vector.dist(this.pos, target);
    const normalized = distance / this.senseRad;
    if (normalized > 1) return;

    const desiredVec = p5.Vector.sub(this.pos, target);

    desiredVec.setMag((1 - normalized) * this.maxSpeed);

    const steerVec = p5.Vector.sub(desiredVec, this.vel);
    steerVec.limit(this.maxForce);
    this.applyForce(steerVec);
  }

  arrive(target) {
    const distance = p5.Vector.dist(this.pos, target);
    const normalized = distance / this.senseRad;

    const desiredVec = p5.Vector.sub(target, this.pos);

    desiredVec.setMag(
      distance < this.senseRad ? normalized * this.maxSpeed : this.maxSpeed
    );

    const steerVec = p5.Vector.sub(desiredVec, this.vel);
    steerVec.limit(this.maxForce);
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
    noFill();
    stroke(this.colour);
    circle(0, 0, this.senseRad * 2);
    pop();
  }
}
