class Vehicle {
  constructor(x, y, maxSpeed = 5, maxForce = 1, decRad = 100) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 25;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.decRad = decRad;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  arrive(target) {
    const distance = p5.Vector.dist(this.pos, target);
    const normalized = distance / this.decRad;

    const desired = p5.Vector.sub(target, this.pos);

    desired.setMag(
      distance < this.decRad ? normalized * this.maxSpeed : this.maxSpeed
    );

    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  show() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noStroke();
    fill(255);
    beginShape();
    vertex(0, 0);
    vertex(this.r * Math.cos(radians(-160)), this.r * Math.sin(radians(-160)));
    vertex(this.r * Math.cos(radians(160)), this.r * Math.sin(radians(160)));
    endShape();
    pop();
  }

  showDecRad() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    noFill();
    stroke(255);
    circle(0, 0, this.decRad * 2);
    pop();
  }
}
