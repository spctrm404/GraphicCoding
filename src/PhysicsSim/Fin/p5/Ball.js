class Ball {
  pos = createVector(0, 0);
  r = 10;
  fill = 0;
  mass = Math.PI * 10 ** 2;
  vel = createVector(0, 0);
  acc = createVector(0, 0);
  isGrabbed = false;
  offsetPos = createVector(0, 0);

  constructor(x, y, diameter, options) {
    this.pos.set(x, y);
    this.r = 0.5 * diameter;
    if (options?.fill) this.fill = options.fill;
    if (options?.mass)
      this.mass = Math.PI * this.r ** 2 * (options?.density || 1);
    if (options?.vel) this.vel.set(options.vel.x, options.vel.y);
    if (options?.acc) this.acc.set(options.acc.x, options.acc.y);
  }

  applyGravity(gravity) {
    this.acc.add(gravity);
  }
  applyForce(force) {
    this.acc.add(p5.Vector.div(force, this.mass));
  }
  update() {
    if (this.isGrabbed) return;

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  resolveWallCollision(restitution = 1, maxAttempts = 10) {
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
    let attempts = 0;
    do {
      attempts++;
      if (attempts > maxAttempts) break;
      resolve();
    } while (isOut());
  }

  isOverlapped(other) {
    const minDistSq = (this.r + other.r) ** 2;
    const toOtherVec = p5.Vector.sub(other.pos, this.pos);
    const distSq = toOtherVec.magSq();
    return distSq < minDistSq;
  }

  resolveBallCollision(other) {
    const minDist = this.r + other.r;
    const toOtherVec = p5.Vector.sub(other.pos, this.pos);
    const dist = toOtherVec.mag();
    if (dist >= minDist) return;

    // solve penetration
    const m1 = this.mass;
    const m2 = other.mass;
    const sumInvMass = 1 / m1 + 1 / m2;
    const penetration = dist - minDist;
    const fromThisToOtherNormVec = p5.Vector.normalize(toOtherVec);

    const thisCorrectionMult = (penetration * (1 / m1)) / sumInvMass;
    const otherCorrectionMult = this.isGrabbed
      ? -1 * penetration
      : (-1 * penetration * (1 / m2)) / sumInvMass;

    const thisCorrectionVec = p5.Vector.mult(
      fromThisToOtherNormVec,
      thisCorrectionMult
    );
    const otherCorrectionVec = p5.Vector.mult(
      fromThisToOtherNormVec,
      otherCorrectionMult
    );

    if (!this.isGrabbed) this.pos.add(thisCorrectionVec);
    if (!other.isGrabbed) other.pos.add(otherCorrectionVec);

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
    const otherVxRefVec = p5.Vector.mult(fromThisToOtherNormVec, vx2refAfter);

    const thisVyRefVec = p5.Vector.mult(tangentVec, vy1Ref);
    const otherVyRefVec = p5.Vector.mult(tangentVec, vy2Ref);

    if (!this.isGrabbed) this.vel = p5.Vector.add(thisVxRefVec, thisVyRefVec);
    if (!other.isGrabbed)
      other.vel = p5.Vector.add(otherVxRefVec, otherVyRefVec);
  }

  isHovered(mouse) {
    const minDistSq = this.r ** 2;
    const fromThisToMouseVec = p5.Vector.sub(mouse, this.pos);
    const distSq = fromThisToMouseVec.magSq();
    return distSq < minDistSq;
  }

  onGrab(mouse) {
    this.isGrabbed = true;
    this.offsetPos = p5.Vector.sub(this.pos, mouse);
    this.vel.set(0, 0);
    this.acc.set(0, 0);
  }

  onDrag(mouse) {
    if (!this.isGrabbed) return;

    this.pos = p5.Vector.add(mouse, this.offsetPos);
  }

  onRelease(vel) {
    if (!this.isGrabbed) return;

    this.vel.set(vel);
    this.acc.set(0, 0);
    this.isGrabbed = false;
  }

  show(isHovered) {
    push();
    if (isHovered) {
      stroke(this.fill);
      noFill();
    } else {
      fill(this.fill);
      noStroke();
    }
    circle(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }
}
