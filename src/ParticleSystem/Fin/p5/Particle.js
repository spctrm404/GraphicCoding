class Particle {
  pos = createVector(0, 0);
  size = [0, 0];
  colour;
  vel;
  acc;
  life;
  lifeSpan;
  angle;

  constructor(x, y, w, h, options) {
    this.pos.set(x, y);
    this.size = [w, h];
    this.colour = options?.colour || 0;
    this.vel = options?.vel || createVector(0, 0);
    this.acc = options?.acc || createVector(0, 0);
    this.angle = options?.angle || 0;
    this.lifeSpan = options?.lifeSpan || 100;
    this.life = this.lifeSpan;
  }

  applyGravity(g) {
    this.acc.add(g);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.life--;
  }

  isAlive() {
    return this.life >= 0 && this.pos.y < height + 2 * Math.max(...this.size);
  }

  normalizedLife() {
    return this.life / this.lifeSpan;
  }

  show() {
    const [w, h] = this.size;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(this.colour);
    noStroke();
    rect(-0.5 * w, -0.5 * h, w, h);
    pop();
  }
}
