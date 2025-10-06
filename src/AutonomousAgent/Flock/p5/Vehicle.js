class Vehicle {
  constructor(
    x,
    y,
    options = {
      r: 25,
      colour: '#FFFFFF',
      maxSpeed: 5,
      maxForce: 1,
      neighborDist: 50,
    }
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = options?.r || 25;
    this.colour = options?.colour || '#FFFFFF';
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxForce = options?.maxForce || 1;
    this.neighborDist = options?.neighborDist || 50;
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

  seek(target, factor = 1) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering.mult(factor));
  }

  separate(vehicles, factor = 1) {
    const desiredSeparation = this.r * 2;
    const sumTowardMeVec = createVector(0, 0);
    let count = 0;
    for (const other of vehicles) {
      if (other !== this) {
        const d = p5.Vector.dist(this.pos, other.pos);
        if (d && d < desiredSeparation) {
          const diff = p5.Vector.sub(this.pos, other.pos);
          diff.div(d);
          sumTowardMeVec.add(diff);
          count++;
        }
      }
    }
    if (count > 0) {
      // const desired = p5.Vector.div(sumTowardMeVec, count);
      // desired.setMag(this.maxSpeed);
      // const steering = p5.Vector.sub(desired, this.vel);
      // steering.limit(this.maxForce);
      // this.applyForce(steering.mult(factor));
      const target = p5.Vector.div(sumTowardMeVec, count).add(this.pos);
      this.seek(target, factor);
    }
  }

  align(vehicles, factor = 1) {
    const sumNeighborVel = createVector(0, 0);
    let count = 0;
    for (const other of vehicles) {
      if (other !== this) {
        const d = p5.Vector.dist(this.pos, other.pos);
        if (d && d < this.neighborDist) {
          sumNeighborVel.add(other.vel);
          count++;
        }
      }
    }
    if (count > 0) {
      // const desired = p5.Vector.div(sumNeighborVel, count);
      // desired.setMag(this.maxSpeed);
      // const steering = p5.Vector.sub(desired, this.vel);
      // steering.limit(this.maxForce);
      // this.applyForce(steering.mult(factor));
      const target = p5.Vector.div(sumNeighborVel, count).add(this.pos);
      this.seek(target, factor);
    }
  }

  cohere(vehicles, factor = 1) {
    const sumNeighborPos = createVector(0, 0);
    let count = 0;
    for (const other of vehicles) {
      if (other !== this) {
        const d = p5.Vector.dist(this.pos, other.pos);
        if (d && d < this.neighborDist) {
          sumNeighborPos.add(other.pos);
          count++;
        }
      }
    }
    if (count > 0) {
      // const target = p5.Vector.div(sumNeighborPos, count);
      // const desired = p5.Vector.sub(target, this.pos);
      // desired.setMag(this.maxSpeed);
      // const steering = p5.Vector.sub(desired, this.vel);
      // steering.limit(this.maxForce);
      // this.applyForce(steering.mult(factor));
      const target = p5.Vector.div(sumNeighborPos, count);
      this.seek(target, factor);
    }
  }

  isColliding(other) {
    const d = p5.Vector.dist(this.pos, other.pos);
    return d < this.r + other.r;
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

  showBoundary() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noFill();
    stroke(this.colour);
    strokeWeight(1);
    circle(0, 0, this.r * 2);
    pop();
  }

  showNeighborDist() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noFill();
    stroke(this.colour);
    strokeWeight(1);
    circle(0, 0, this.neighborDist * 2);
    pop();
  }
}
