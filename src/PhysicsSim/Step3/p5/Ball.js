class Ball {
  constructor(x, y, diameter, speed) {
    this.x = x;
    this.y = y;
    this.r = 0.5 * diameter;
    const randAngle = Math.random() * 2 * Math.PI;
    this.vx = speed * Math.cos(randAngle);
    this.vy = speed * Math.sin(randAngle);
  }

  boundary() {
    if (this.x > width - this.r) {
      this.vx *= -1;
      this.x = width - this.r;
    } else if (this.x < this.r) {
      this.vx *= -1;
      this.x = this.r;
    }
    if (this.y > height - this.r) {
      this.vy *= -1;
      this.y = height - this.r;
    } else if (this.y < this.r) {
      this.vy *= -1;
      this.y = this.r;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  render() {
    fill("white");
    noStroke();
    circle(this.x, this.y, 2 * this.r);
  }
}
