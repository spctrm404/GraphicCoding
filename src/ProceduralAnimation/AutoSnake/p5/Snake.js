class Snake {
  constructor(
    headPosX,
    headPosY,
    spineLength,
    bodyThicknesses,
    angleConstraints
  ) {
    this.spine = [];
    this.headPoints = [];
    this.rightPoints = [];
    this.tailPoints = [];
    this.leftPoints = [];
    colorMode(HSB, 360, 100, 100, 100);
    bodyThicknesses.forEach((aBodyThickness, idx) => {
      const x = headPosX;
      const y = headPosY + idx * spineLength;
      const colour = color(
        map(idx, 0, bodyThicknesses.length - 1, 0, 240),
        100,
        100
      );
      const options = {
        colour,
        distConstraint: spineLength,
        bodyThickness: aBodyThickness,
        angleConstraints,
      };
      const newPoint =
        idx === 0 ? new AutoPoint(x, y, options) : new Point(x, y, options);
      this.spine.push(newPoint);
      this.rightPoints.push(createVector(0, 0));
      this.leftPoints.push(createVector(0, 0));
    });
  }

  seek(target) {
    this.spine[0].seek(target);
  }

  update() {
    this.spine[0].update();

    this.spine.forEach((aPoint, idx) => {
      if (idx > 0) {
        aPoint.distConstrainedBy(this.spine[idx - 1], true);
      }
    });
    this.spine[0].setHeading(this.spine[1].heading);
    this.spine.forEach((aPoint, idx) => {
      if (idx > 1) {
        aPoint.angleConstrainedBy(this.spine[idx - 1], this.spine[idx - 2]);
      }
    });

    this.spine.forEach((aPoint, idx) => {
      this.rightPoints[idx] = aPoint.getBodyPoint(radians(90));
      this.leftPoints[this.spine.length - 1 - idx] = aPoint.getBodyPoint(
        radians(-90)
      );
    });

    this.headPoints[0] = this.spine[0].getBodyPoint(radians(-60));
    this.headPoints[1] = this.spine[0].getBodyPoint(radians(-15), 0, 1.5);
    this.headPoints[2] = this.spine[0].getBodyPoint(radians(15), 0, 1.5);
    this.headPoints[3] = this.spine[0].getBodyPoint(radians(60));

    this.tailPoints[0] = this.spine[this.spine.length - 1].getBodyPoint(
      radians(90 + 15)
    );
    this.tailPoints[1] = this.spine[this.spine.length - 1].getBodyPoint(
      radians(180),
      0,
      2
    );
    this.tailPoints[2] = this.spine[this.spine.length - 1].getBodyPoint(
      radians(-90 - 15)
    );
  }

  show() {
    this.spine.forEach((aPoint) => {
      aPoint.show();
    });
  }

  showDistConstraint() {
    this.spine.forEach((aPoint) => {
      aPoint.showDistConstraint();
    });
  }

  showBodyThickness() {
    this.spine.forEach((aPoint) => {
      aPoint.showBodyThickness();
    });
  }

  showBodyShapePoints() {
    this.rightPoints.forEach((aPoint) => {
      push();
      translate(aPoint.x, aPoint.y);
      stroke("#F00");
      strokeWeight(8);
      point(0, 0);
      pop();
    });
    this.leftPoints.forEach((aPoint) => {
      push();
      translate(aPoint.x, aPoint.y);
      stroke("#00F");
      strokeWeight(8);
      point(0, 0);
      pop();
    });
  }

  showBodyShape() {
    push();
    beginShape();
    noStroke();
    fill("#FFF");
    beginShape();
    this.headPoints.forEach((aPoint) => {
      curveVertex(aPoint.x, aPoint.y);
    });
    this.rightPoints.forEach((aPoint) => {
      curveVertex(aPoint.x, aPoint.y);
    });
    this.tailPoints.forEach((aPoint) => {
      curveVertex(aPoint.x, aPoint.y);
    });
    this.leftPoints.forEach((aPoint) => {
      curveVertex(aPoint.x, aPoint.y);
    });
    endShape(CLOSE);
    pop();
  }

  showEyes() {
    push();
    translate(this.spine[0].pos.x, this.spine[0].pos.y);
    rotate(this.spine[0].heading);
    fill("#000");
    noStroke();
    circle(10, -10, 5);
    circle(10, 10, 5);
    pop();
  }
}
