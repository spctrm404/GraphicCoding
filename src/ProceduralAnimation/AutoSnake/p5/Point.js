class Point {
  constructor(x, y, options) {
    this.pos = createVector(x, y);
    this.r = options.r || 10;
    this.colour = options.colour || '#FFF';
    this.distConstraint = options.distConstraint || 50;
    this.heading = 0;
    this.bodyThickness = options.bodyThickness || 20;
    // 0 to 2 * PI
    this.angleConstraints = options.angleConstraints || [
      radians(150),
      radians(210),
    ];
  }

  setPos(pos) {
    this.pos.set(pos);
  }

  setHeading(heading) {
    this.heading = heading;
  }

  distConstrain(other, isStrong = false) {
    const toOther = p5.Vector.sub(other.pos, this.pos);
    if (isStrong || toOther.mag() > this.distConstraint) {
      const otherPos = p5.Vector.add(
        this.pos,
        toOther.setMag(this.distConstraint)
      );
      other.setPos(otherPos);
      other.setHeading(toOther.mult(-1).heading());
    }
  }

  distConstrainedBy(other, isStrong = false) {
    const toMe = p5.Vector.sub(this.pos, other.pos);
    if (isStrong || toMe.mag() > other.distConstraint) {
      const myPos = p5.Vector.add(other.pos, toMe.setMag(other.distConstraint));
      this.setPos(myPos);
      this.setHeading(toMe.mult(-1).heading());
    }
  }

  angleConstrainedBy(parent, grandParent) {
    const parentToGrandParent = p5.Vector.sub(grandParent.pos, parent.pos);
    const parentToMe = p5.Vector.sub(this.pos, parent.pos);
    let angle = p5.Vector.angleBetween(parentToMe, parentToGrandParent);
    angle = angle < 0 ? angle + 2 * Math.PI : angle;
    let [minAngle, maxAngle] = this.angleConstraints;
    if (minAngle < 0) minAngle += 2 * Math.PI;
    if (maxAngle < 0) maxAngle += 2 * Math.PI;
    if (angle < minAngle || angle > maxAngle) {
      const rotAngle = angle < minAngle ? -minAngle : -maxAngle;
      parentToGrandParent.rotate(rotAngle);
      this.setPos(
        p5.Vector.add(
          parent.pos,
          parentToGrandParent.setMag(parent.distConstraint)
        )
      );
      this.setHeading(parentToGrandParent.mult(-1).heading());
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    noStroke();
    fill(this.colour);
    beginShape();
    vertex(this.r, 0);
    vertex(0, this.r);
    vertex(-this.r, 0);
    vertex(0, -this.r);
    endShape(CLOSE);
    arc(0, 0, this.r * 2, this.r * 2, radians(90), radians(270));
    pop();
  }

  showDistConstraint() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    noFill();
    stroke(this.colour);
    circle(0, 0, this.distConstraint * 2);
    pop();
  }

  showBodyThickness() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    noFill();
    stroke(255);
    circle(0, 0, this.bodyThickness);
    pop();
  }

  getBodyPoint(angle, thicknessOffset = 0, thicknessScale = 1) {
    return p5.Vector.fromAngle(this.heading + angle)
      .setMag((0.5 * this.bodyThickness + thicknessOffset) * thicknessScale)
      .add(this.pos);
  }
}
