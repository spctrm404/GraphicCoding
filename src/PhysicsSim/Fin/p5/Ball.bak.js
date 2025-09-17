class Ball {
  pos = createVector(0, 0);
  r;
  fill;
  mass;
  vel = createVector(0, 0);
  acc = createVector(0, 0);
  offsetPos;

  //debug
  prevPos = createVector(0, 0);
  prevVel = createVector(0, 0);
  correctionVec = createVector(0, 0);
  vxRef = createVector(0, 0);
  vyRef = createVector(0, 0);
  vxRefAfter = createVector(0, 0);

  constructor(x, y, diameter, options) {
    this.pos.set(x, y);
    this.r = 0.5 * diameter;
    this.fill = options?.fill || color(255);
    this.mass =
      options?.mass || Math.PI * this.r ** 2 * (options?.density || 1);
    if (options?.vel) this.vel.set(options.vel.x, options.vel.y);
  }

  applyGravity(gravity) {
    this.acc.add(gravity);
  }
  applyForce(force) {
    this.acc.add(p5.Vector.div(force, this.mass));
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  resolveWallCollision(restitution = 1, iterLimit = 10) {
    const isOut = () => {
      return (
        this.pos.x < this.r ||
        this.pos.x > width - this.r ||
        this.pos.y > height - this.r
      );
    };
    const resolve = () => {
      if (this.pos.x < this.r) {
        const penetration = this.r - this.pos.x;
        this.pos.x = this.r + restitution * penetration;
        this.vel.x *= -restitution;
      }
      if (this.pos.x > width - this.r) {
        const penetration = width - this.r - this.pos.x;
        this.pos.x = width - this.r + restitution * penetration;
        this.vel.x *= -restitution;
      }
      if (this.pos.y > height - this.r) {
        const penetration = height - this.r - this.pos.y;
        this.pos.y = height - this.r + restitution * penetration;
        this.vel.y *= -restitution;
      }
    };

    for (let iter = 0; iter < iterLimit; iter++) {
      if (!isOut()) break;
      resolve();
    }
  }

  isOverlapped(other) {
    const minDistSq = (this.r + other.r) ** 2;
    const fromThisToOtherVec = p5.Vector.sub(other.pos, this.pos);
    const distSq = fromThisToOtherVec.magSq();
    return distSq < minDistSq;
  }

  resolveBallCollision(other) {
    const minDist = this.r + other.r;
    const fromThisToOtherVec = p5.Vector.sub(other.pos, this.pos);
    const dist = fromThisToOtherVec.mag();
    if (dist >= minDist) return;

    if (DEBUG) {
      this.prevPos.set(this.pos);
      this.prevVel.set(this.vel);
      other.prevPos.set(other.pos);
      other.prevVel.set(other.vel);
    }

    // solve penetration
    const m1 = this.mass;
    const m2 = other.mass;
    const sumInvMass = m1 ** -1 + m2 ** -1;
    const penetration = minDist - dist;
    const fromThisToOtherNormVec = p5.Vector.normalize(fromThisToOtherVec);

    const thisCorrectionMult = (-1 * penetration * m1 ** -1) / sumInvMass;
    const otherCorrectionMult = (penetration * m2 ** -1) / sumInvMass;

    const thisCorrectionVec = p5.Vector.mult(
      fromThisToOtherNormVec,
      thisCorrectionMult
    );
    const otherCorrectionVec = p5.Vector.mult(
      fromThisToOtherNormVec,
      otherCorrectionMult
    );

    this.pos.add(thisCorrectionVec);
    other.pos.add(otherCorrectionVec);

    if (DEBUG) {
      this.correctionVec = thisCorrectionVec;
      other.correctionVec = otherCorrectionVec;
    }

    // solve velocity
    const vx1ref = fromThisToOtherNormVec.dot(this.vel);
    const vx2ref = fromThisToOtherNormVec.dot(other.vel);
    const vx1refAfter = (vx1ref * (m1 - m2) + 2 * m2 * vx2ref) / (m1 + m2);
    const vx2refAfter = (vx2ref * (m2 - m1) + 2 * m1 * vx1ref) / (m1 + m2);

    const tangentVec = createVector(
      -fromThisToOtherNormVec.y,
      fromThisToOtherNormVec.x
    );
    const vy1Ref = tangentVec.dot(this.vel);
    const vy2Ref = tangentVec.dot(other.vel);

    const thisVxRefVec = p5.Vector.mult(fromThisToOtherNormVec, vx1refAfter);
    const thisVyRefVec = p5.Vector.mult(tangentVec, vy1Ref);
    this.vel = p5.Vector.add(thisVxRefVec, thisVyRefVec);

    const otherVxRefVec = p5.Vector.mult(fromThisToOtherNormVec, vx2refAfter);
    const otherVyRefVec = p5.Vector.mult(tangentVec, vy2Ref);
    other.vel = p5.Vector.add(otherVxRefVec, otherVyRefVec);

    if (DEBUG) {
      this.vxRef = p5.Vector.mult(fromThisToOtherNormVec, vx1ref);
      other.vxRef = p5.Vector.mult(fromThisToOtherNormVec, vx2ref);
      this.vxRefAfter = p5.Vector.mult(fromThisToOtherNormVec, vx1refAfter);
      other.vxRefAfter = p5.Vector.mult(fromThisToOtherNormVec, vx2refAfter);
      this.vyRef = p5.Vector.mult(tangentVec, vy1Ref);
      other.vyRef = p5.Vector.mult(tangentVec, vy2Ref);
    }
  }

  show() {
    push();
    fill(this.fill);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
    if (DEBUG) {
      stroke('#00ff00');
      strokeWeight(1);
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vel.x,
        this.pos.y + this.vel.y
      );
      stroke('#00ff00');
      strokeWeight(1);
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.prevVel.x,
        this.pos.y + this.prevVel.y
      );
      stroke('#000000');
      strokeWeight(4);
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.correctionVec.x,
        this.pos.y + this.correctionVec.y
      );
      stroke('#ff0000');
      strokeWeight(1);
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vxRef.x,
        this.pos.y + this.vxRef.y
      );
      stroke('#ff0000');
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vxRefAfter.x,
        this.pos.y + this.vxRefAfter.y
      );
      stroke('#0000ff');
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vyRef.x,
        this.pos.y + this.vyRef.y
      );
    }
    pop();
  }
}
