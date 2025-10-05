class Vehicle {
  constructor(
    x,
    y,
    options = {
      r: 25,
      colour: '#FFFFFF',
      maxSpeed: 5,
      maxForce: 1,
      maxAngle: Math.PI * (15 / 180),
    }
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = options?.r || 25;
    this.colour = options?.colour || '#FFFFFF';
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxForce = options?.maxForce || 1;
    this.maxAngle = options?.maxAngle || Math.PI * (15 / 180);
  }

  update() {
    const currSpeed = this.vel.mag();
    const normalizedSpeed = currSpeed / this.maxSpeed;
    const acceptableAngle = map(normalizedSpeed, 0, 1, Math.PI, this.maxAngle);
    const prevVel = this.vel.copy();
    this.vel.add(this.acc);
    const angleDiff = p5.Vector.angleBetween(prevVel, this.vel);
    if (Math.abs(angleDiff) > acceptableAngle) {
      prevVel.rotate(angleDiff > 0 ? acceptableAngle : -acceptableAngle);
      this.vel = prevVel;
    }
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  separate(vehicles) {
    const desiredSeparation = this.r * 2;
    const sum = createVector(0, 0);
    let count = 0;
    for (const other of vehicles) {
      if (other !== this) {
        const d = p5.Vector.dist(this.pos, other.pos);
        if (d && d < desiredSeparation) {
          const diff = p5.Vector.sub(this.pos, other.pos);
          diff.setMag(1 / d);
          sum.add(diff);
          count++;
        }
      }
    }
    if (count > 0) {
      sum.setMag(this.maxSpeed);
      const steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }

  wrapCoordinate() {
    if (this.pos.x > width + 100) this.pos.x = -100;
    if (this.pos.x < -100) this.pos.x = width + 100;
    if (this.pos.y > height + 100) this.pos.y = -100;
    if (this.pos.y < -100) this.pos.y = height + 100;
  }

  show() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noFill();
    stroke(this.colour);
    line(0, 0, this.r, 0);
    circle(0, 0, 2 * this.r);
    pop();
  }
}
