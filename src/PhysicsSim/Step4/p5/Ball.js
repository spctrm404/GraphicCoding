class Ball {
  constructor(x, y, diameter, speed) {
    this.x = x;
    this.y = y;
    this.r = 0.5 * diameter;
    const randAngle = Math.random() * 2 * Math.PI;
    this.vx = speed * Math.cos(randAngle);
    this.vy = speed * Math.sin(randAngle);
    // this.mass = Math.PI * this.r * this.r;
    this.mass = Math.PI * this.r ** 2;
    this.acc = [0, 0];
  }

  applyGravity(gravity) {
    this.acc[0] += gravity[0];
    this.acc[1] += gravity[1];
  }
  applyForce(force) {
    this.acc[0] += force[0] / this.mass;
    this.acc[1] += force[1] / this.mass;
  }

  boundary() {
    if (this.x > width - this.r) {
      this.vx *= -0.5;
      this.x = width - this.r;
    } else if (this.x < this.r) {
      this.vx *= -0.5;
      this.x = this.r;
    }
    if (this.y > height - this.r) {
      this.vy *= -0.5;
      this.y = height - this.r;
    }
    // else if (this.y < this.r) {
    //   this.vy *= -1;
    //   this.y = this.r;
    // }
  }

  update() {
    this.vx += this.acc[0];
    this.vy += this.acc[1];
    this.x += this.vx;
    this.y += this.vy;
    this.acc = [0, 0];
  }

  render() {
    stroke("white");
    noFill();
    circle(this.x, this.y, 2 * this.r);
  }
}
