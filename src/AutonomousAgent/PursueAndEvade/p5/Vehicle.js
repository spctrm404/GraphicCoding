class Vehicle {
  constructor(
    x,
    y,
    options = {
      r: 25,
      colour: '#FFFFFF',
      maxSpeed: 5,
      maxForce: 1,
      senseRad: 200,
    }
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = options?.r || 25;
    this.colour = options?.colour || '#FFFFFF';
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxForce = options?.maxForce || 1;
    this.senseRad = options?.senseRad || 200;
  }

  randomizeVelocity() {
    this.vel = p5.Vector.fromAngle(random(2 * Math.PI));
    this.vel.setMag(this.maxSpeed);
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

  findTarget(vehicles) {
    let closest = null;
    let closestD = Infinity;
    for (const other of vehicles) {
      if (other !== this) {
        const d = p5.Vector.dist(this.pos, other.pos);
        if (d < closestD && d < this.senseRad) {
          closestD = d;
          closest = other;
        }
      }
    }
    return closest;
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  evade(target) {
    const predictedTarget = p5.Vector.mult(target.vel, 10).add(target.pos);
    const opposite = p5.Vector.add(
      this.pos,
      p5.Vector.sub(predictedTarget, this.pos).mult(-1)
    );
    this.seek(opposite);
  }

  pursue(target) {
    const predictedTarget = p5.Vector.mult(target.vel, 10).add(target.pos);
    this.seek(predictedTarget);
  }

  wrapCoordinate() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  wrapCoordinate() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
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
    vertex(this.r * Math.cos(radians(-160)), this.r * Math.sin(radians(-160)));
    vertex(this.r * Math.cos(radians(160)), this.r * Math.sin(radians(160)));
    endShape();
    pop();
  }

  showSenseRad() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noFill();
    stroke(this.colour);
    strokeWeight(1);
    circle(0, 0, this.senseRad * 2);
    pop();
  }
}
