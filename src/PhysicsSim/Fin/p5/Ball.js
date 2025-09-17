class Ball {
  pos = createVector(0, 0);
  r;
  fill;
  mass;
  vel = createVector(0, 0);
  acc = createVector(0, 0);
  offsetPos;

  //debug
  penetrationCorrectionVec = createVector(0, 0);

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
    console.log(dist, minDist);
    if (dist >= minDist) return;

    // solve penetration
    const sumInvMass = this.mass ** -1 + other.mass ** -1;
    const penetration = minDist - dist;
    const penetrationCorrectionVec = fromThisToOtherVec
      .copy()
      .setMag(penetration)
      .mult(-1);
    this.pos.add(
      penetrationCorrectionVec.copy().mult(this.mass ** -1 / sumInvMass)
    );
    other.pos.sub(
      penetrationCorrectionVec.copy().mult(other.mass ** -1 / sumInvMass)
    );
    if (DEBUG) {
      this.penetrationCorrectionVec = penetrationCorrectionVec
        .copy()
        .mult(this.mass ** -1 / sumInvMass);
      other.penetrationCorrectionVec = penetrationCorrectionVec
        .copy()
        .mult(other.mass ** -1 / sumInvMass)
        .mult(-1);
    }

    // solve velocity
    // get angle of each ball`s velocity vector relative to the collision normal
    const collisionNormal = fromThisToOtherVec.copy().normalize();
    const thisVelAngle = this.vel.angleBetween(collisionNormal);
    const otherVelAngle = other.vel.angleBetween(collisionNormal);
    // find new velocity based on angle we found
  }

  show() {
    push();
    fill(this.fill);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
    if (DEBUG) {
      stroke('#00ff00');
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.vel.x,
        this.pos.y + this.vel.y
      );
      stroke('#ff0000');
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.penetrationCorrectionVec.x,
        this.pos.y + this.penetrationCorrectionVec.y
      );
    }
    pop();
  }
}
