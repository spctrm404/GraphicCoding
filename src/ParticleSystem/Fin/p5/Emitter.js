class Emitter {
  particles = [];
  pos;
  emitRate;
  lifeSpan;
  area;
  initialSpeed = 5;
  initialVelAngleRange = 120;
  constructor(x, y, options) {
    this.pos = createVector(x, y);
    this.emitRate = options?.emitRate || 5;
    this.lifeSpan = options?.lifeSpan || 100;
    this.area = options?.area || 10;
    this.initialSpeed = options?.initialSpeed || 5;
    this.initialVelAngleRange = options?.initialVelAngleRange || 120;
  }

  emit() {
    for (let n = 0; n < this.emitRate; n++) {
      const randomWidth = random(1, this.area);
      const randomHeight = this.area / randomWidth;
      const randomAngle = random(TWO_PI);
      const randomColour = pallete[this.particles.length % pallete.length];
      const randomVelAngle = random(
        -90 - 0.5 * this.initialVelAngleRange,
        -90 + 0.5 * this.initialVelAngleRange
      );
      const initialVel = p5.Vector.fromAngle(radians(randomVelAngle)).mult(
        this.initialSpeed
      );
      const p = new Particle(
        this.pos.x,
        this.pos.y,
        randomWidth,
        randomHeight,
        {
          colour: randomColour,
          vel: initialVel,
          angle: randomAngle,
          lifeSpan: this.lifeSpan,
        }
      );
      this.particles.push(p);
    }
  }

  applyGravity(g) {
    this.particles.forEach((aParticle) => aParticle.applyGravity(g));
  }

  update() {
    for (let idx = this.particles.length - 1; idx >= 0; idx--) {
      const aParticle = this.particles[idx];
      aParticle.update();
      if (!aParticle.isAlive()) this.particles.splice(idx, 1);
    }
  }

  show() {
    this.particles.forEach((aParticle) => aParticle.show());
  }
}
