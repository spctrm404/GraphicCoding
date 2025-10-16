class Vehicle {
  constructor(x, y, options) {
    this.pos = createVector(x, y);
    this.vel = options.vel || createVector(0, 0);
    this.heading = 0;
    this.acc = createVector(0, 0);
    this.rad = options.rad || 25;
    this.maxSpeed = options.maxSpeed || 5;
    this.maxForce = options.maxForce || 0.05;
    this.wanderRad = options.wanderRad || 25;
    this.wanderDist = options.wanderDist || 80;
    this.wanderChangeRange = options.wanderChangeRange || radians(5);
    this.wanderTheta = 0;

    console.log(this);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (this.vel.mag() > 0) {
      this.heading = this.vel.heading();
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target, multiplier = 1) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering.mult(multiplier));
  }

  wander(multiplier = 1) {
    const thetaChange = random(
      -0.5 * this.wanderChangeRange,
      0.5 * this.wanderChangeRange
    );
    this.wanderTheta += thetaChange;

    const wanderTarget = p5.Vector.add(
      this.getFromWanderCenterToTarget(),
      this.getWanderCenter()
    );
    this.seek(wanderTarget, multiplier);
  }

  getFromWanderCenterToTarget() {
    const fromWanderCenterToTarget = p5.Vector.fromAngle(this.heading);
    fromWanderCenterToTarget.setMag(this.wanderRad);
    fromWanderCenterToTarget.rotate(this.wanderTheta);
    return fromWanderCenterToTarget;
  }

  getWanderCenter() {
    const wanderCenter = p5.Vector.fromAngle(this.heading);
    wanderCenter.setMag(this.wanderDist);
    wanderCenter.add(this.pos);
    return wanderCenter;
  }

  boundaries(offset, multiplier) {
    let target = null;

    if (this.pos.x < offset) {
      target = createVector(width, this.pos.y);
    } else if (this.pos.x > width - offset) {
      target = createVector(0, this.pos.y);
    }

    if (this.pos.y < offset) {
      target = createVector(this.pos.x, height);
    } else if (this.pos.y > height - offset) {
      target = createVector(this.pos.x, 0);
    }

    if (target !== null) {
      this.seek(target, multiplier);
    }
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
    fill(255);
    beginShape();
    vertex(0, 0);
    vertex(
      this.rad * Math.cos(radians(-160)),
      this.rad * Math.sin(radians(-160))
    );
    vertex(
      this.rad * Math.cos(radians(160)),
      this.rad * Math.sin(radians(160))
    );
    endShape();
    pop();
  }

  showWander() {
    const fromWanderCenterToTarget = this.getFromWanderCenterToTarget();
    const wanderCenter = this.getWanderCenter();

    push();
    noFill();
    stroke('#F00');
    line(this.pos.x, this.pos.y, wanderCenter.x, wanderCenter.y);
    translate(wanderCenter.x, wanderCenter.y);
    circle(0, 0, this.wanderRad * 2);
    line(0, 0, fromWanderCenterToTarget.x, fromWanderCenterToTarget.y);
    translate(fromWanderCenterToTarget.x, fromWanderCenterToTarget.y);
    noStroke();
    fill('#FFF');
    circle(0, 0, 8);
    pop();
  }
}
