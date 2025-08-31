class Ball {
  constructor(x, y, diameter, options) {
    this.pos = [x, y];
    this.vel = options?.vel ? [...options.vel] : [0, 0];
    this.acc = options?.acc ? [...options.acc] : [0, 0];
    this.r = 0.5 * diameter;
    this.mass =
      options?.mass || Math.PI * this.r ** 2 * (options?.density || 1);
    this.damping = options?.damping || 0.5;
    this.color = options?.color || "white";
    this.isHovered = false;
    this.isGrabbed = false;
    this.offset = [0, 0];
  }

  applyGravity(gravity) {
    if (this.isGrabbed) return;
    this.acc = this.acc.map((aComp, idx) => aComp + gravity[idx]);
  }

  applyForce(force) {
    if (this.isGrabbed) return;
    this.acc = this.acc.map((aComp, idx) => aComp + force[idx] / this.mass);
  }

  boundary() {
    if (this.isGrabbed) return;
    const [x, y] = this.pos;
    if (x < this.r) {
      this.pos[0] = this.r;
      this.vel[0] *= -this.damping;
    } else if (x > width - this.r) {
      this.pos[0] = width - this.r;
      this.vel[0] *= -this.damping;
    }

    // if (y < this.r) {
    //   this.pos[1] = this.r;
    //   this.vel[1] *= -this.damping;
    // } else
    if (y > height - this.r) {
      this.pos[1] = height - this.r;
      this.vel[1] *= -this.damping;
    }
  }

  collide(other) {
    const impactVec = this.pos.map((aComp, idx) => other.pos[idx] - aComp);
    const dist = Math.hypot(...impactVec);
    const minDist = this.r + other.r;
    if (dist < minDist && dist > 0) {
      const overlap = dist - minDist;
      const normalImpactVec = impactVec.map((aComp) => aComp / dist);
      const sumMass = this.mass + other.mass;
      if (!this.isGrabbed) {
        this.pos = this.pos.map(
          (aComp, idx) =>
            aComp + (normalImpactVec[idx] * overlap * other.mass) / sumMass
        );
      }
      if (!other.isGrabbed) {
        other.pos = other.pos.map(
          (aComp, idx) =>
            aComp - (normalImpactVec[idx] * overlap * this.mass) / sumMass
        );
      }

      const minDistVec = normalImpactVec.map((aComp) => aComp * minDist);
      const vecDiff = this.vel.map((aComp, idx) => other.vel[idx] - aComp);
      const num = vecDiff[0] * minDistVec[0] + vecDiff[1] * minDistVec[1];
      const den = sumMass * minDist ** 2;
      if (!this.isGrabbed) {
        const forceThis = minDistVec.map(
          (aComp) => (aComp * 2 * other.mass * num) / den
        );
        this.vel = this.vel.map((aComp, idx) => aComp + forceThis[idx]);
      }
      if (!other.isGrabbed) {
        const forceOther = minDistVec.map(
          (aComp) => (aComp * 2 * this.mass * num) / den
        );
        other.vel = other.vel.map((aComp, idx) => aComp - forceOther[idx]);
      }
    }
  }

  isHover(mouse) {
    const [mx, my] = mouse;
    const [x, y] = this.pos;
    const distSq = (mx - x) ** 2 + (my - y) ** 2;
    return distSq < this.r ** 2;
  }

  setGrabbed(mouse) {
    this.isGrabbed = mouse ? true : false;
    if (this.isGrabbed) {
      this.vel = [0, 0];
      this.acc = [0, 0];
      this.offset = this.pos.map((aComp, idx) => mouse[idx] - aComp);
    }
  }

  update() {
    if (this.isGrabbed) return;
    this.vel = this.vel.map((aComp, idx) => aComp + this.acc[idx]);
    this.pos = this.pos.map((aComp, idx) => aComp + this.vel[idx]);
    this.acc = [0, 0];
  }

  render() {
    const [x, y] = this.pos;
    noStroke();
    fill(this.isGrabbed ? "red" : this.isHovered ? "blue" : this.color);
    circle(x, y, 2 * this.r);
  }
}
