class Ball {
  pos = createVector(0, 0);
  r;
  fill = 0;
  mass;
  vel = createVector(0, 0);
  isGrabbed = false;
  offsetPos = createVector(0, 0);

  constructor(x, y, diameter, options) {
    this.pos.set(x, y);
    this.r = 0.5 * diameter;
    if (options?.fill) this.fill = options.fill;
    if (options?.mass) this.mass = options.mass;
    else this.mass = Math.PI * this.r ** 2 * (options?.density || 1);
    if (options?.vel) this.vel.set(options.vel.x, options.vel.y);
  }

  update() {
    if (this.isGrabbed) return;

    this.pos.add(this.vel);
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

    push();
    stroke('#00FFFF');
    strokeWeight(4);
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x + thisCorrectionVec.x,
      this.pos.y + thisCorrectionVec.y
    );
    line(
      other.pos.x,
      other.pos.y,
      other.pos.x + otherCorrectionVec.x,
      other.pos.y + otherCorrectionVec.y
    );
    pop();

    // if (!this.isGrabbed) this.pos.add(thisCorrectionVec);
    // if (!other.isGrabbed) other.pos.add(otherCorrectionVec);

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

    const thisVxRefBeforeVec = p5.Vector.mult(fromThisToOtherNormVec, vx1ref);
    const otherVxRefBeforeVec = p5.Vector.mult(fromThisToOtherNormVec, vx2ref);

    const thisVxRefVec = p5.Vector.mult(fromThisToOtherNormVec, vx1refAfter);
    const otherVxRefVec = p5.Vector.mult(fromThisToOtherNormVec, vx2refAfter);

    const thisVyRefVec = p5.Vector.mult(tangentVec, vy1Ref);
    const otherVyRefVec = p5.Vector.mult(tangentVec, vy2Ref);

    const thisVelAfter = p5.Vector.add(thisVxRefVec, thisVyRefVec);
    const otherVelAfter = p5.Vector.add(otherVxRefVec, otherVyRefVec);

    // if (!this.isGrabbed) this.vel = p5.Vector.add(thisVxRefVec, thisVyRefVec);
    // if (!other.isGrabbed)
    //   other.vel = p5.Vector.add(otherVxRefVec, otherVyRefVec);

    push();
    stroke('#ffff00');
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x + thisVxRefBeforeVec.x,
      this.pos.y + thisVxRefBeforeVec.y
    );
    line(
      other.pos.x,
      other.pos.y,
      other.pos.x + otherVxRefBeforeVec.x,
      other.pos.y + otherVxRefBeforeVec.y
    );
    stroke('#FF0000');
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x + thisVxRefVec.x,
      this.pos.y + thisVxRefVec.y
    );
    line(
      other.pos.x,
      other.pos.y,
      other.pos.x + otherVxRefVec.x,
      other.pos.y + otherVxRefVec.y
    );
    stroke('#0000FF');
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x + thisVyRefVec.x,
      this.pos.y + thisVyRefVec.y
    );
    line(
      other.pos.x,
      other.pos.y,
      other.pos.x + otherVyRefVec.x,
      other.pos.y + otherVyRefVec.y
    );
    stroke('#00FF00');
    strokeWeight(2);
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x + thisVelAfter.x,
      this.pos.y + thisVelAfter.y
    );
    line(
      other.pos.x,
      other.pos.y,
      other.pos.x + otherVelAfter.x,
      other.pos.y + otherVelAfter.y
    );
    pop();
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
  }

  onDrag(mouse) {
    if (!this.isGrabbed) return;

    this.pos = p5.Vector.add(mouse, this.offsetPos);
  }

  onRelease(vel) {
    if (!this.isGrabbed) return;

    this.isGrabbed = false;
  }

  show(isHovered) {
    push();
    if (isHovered) {
      stroke('#FF0000');
      noFill();
    } else {
      stroke(this.fill);
      noFill();
    }
    circle(this.pos.x, this.pos.y, this.r * 2);
    if (DEBUG) {
      stroke('#00FF00');
      noFill();
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vel.x,
        this.pos.y + this.vel.y
      );
    }
    pop();
  }
}
