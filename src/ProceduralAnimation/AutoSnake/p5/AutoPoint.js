class AutoPoint extends Point {
  constructor(x, y, options) {
    super(x, y, options);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.maxSpeed = options.maxSpeed || 3;
    this.maxForce = options.maxForce || 0.05;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target, strength = 1) {
    const desired = p5.Vector.sub(target, this.pos);
    const prevHeading = p5.Vector.fromAngle(this.heading).mult(-1);
    let angleBetween = p5.Vector.angleBetween(prevHeading, desired);
    angleBetween = angleBetween < 0 ? angleBetween + 2 * Math.PI : angleBetween;
    let [minAngle, maxAngle] = this.angleConstraints;
    if (minAngle < 0) minAngle += 2 * Math.PI;
    if (maxAngle < 0) maxAngle += 2 * Math.PI;
    if (angleBetween < minAngle || angleBetween > maxAngle) {
      const rotAngle = angleBetween < minAngle ? minAngle : maxAngle;
      const newHeading = prevHeading.rotate(rotAngle);
      desired.set(newHeading);
    }
    desired.setMag(this.maxSpeed);
    const steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce * strength);
    this.applyForce(steer);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}
