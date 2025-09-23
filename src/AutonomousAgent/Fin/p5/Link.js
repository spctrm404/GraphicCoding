class Link {
  beginNode;
  endNode;
  distConstraint;
  prevLink = null;
  nextLink = null;
  angleConstraint;

  constructor(beginNode, endNode, distConstraint = 20, angleConstraint = null) {
    this.beginNode = beginNode;
    this.endNode = endNode;
    this.distConstraint = distConstraint;
    this.angleConstraint = angleConstraint;
  }

  positivizeAngle(angle) {
    let positivizeAngle = angle;
    while (positivizeAngle < 0) {
      positivizeAngle += 2 * Math.PI;
    }
    positivizeAngle = positivizeAngle % (2 * Math.PI);
    return positivizeAngle;
  }

  get toBeginVec() {
    return p5.Vector.sub(this.beginNode.pos, this.endNode.pos);
  }
  get toEndVec() {
    return p5.Vector.sub(this.endNode.pos, this.beginNode.pos);
  }

  resolve() {
    const newEndPos = p5.Vector.setMag(this.toEndVec, this.distConstraint).add(
      this.beginNode.pos
    );
    this.endNode.pos.set(newEndPos);
    if (this.prevLink && this.angleConstraint) {
      let {
        from: angleConstraintFrom,
        to: angleConstraintTo,
        dir: angleConstraintDir,
      } = this.angleConstraint;
      const prevHeading = this.prevLink.toBeginVec.heading();
      const currHeading = this.toEndVec.heading();
      angleConstraintFrom = this.positivizeAngle(angleConstraintFrom);
      angleConstraintTo = this.positivizeAngle(angleConstraintTo);
      const currAngle = this.positivizeAngle(currHeading - prevHeading);
      const isAngleInRange = (angle, from, to) => {
        return from <= to
          ? angle >= from && angle <= to
          : angle >= from || angle <= to;
      };
      let isWithinConstraint =
        angleConstraintDir === "cw"
          ? isAngleInRange(currAngle, angleConstraintFrom, angleConstraintTo)
          : isAngleInRange(currAngle, angleConstraintTo, angleConstraintFrom);
      if (!isWithinConstraint) {
        const angleDiff = (a, b) => {
          let diff = Math.abs(a - b) % (2 * Math.PI);
          return diff > Math.PI ? 2 * Math.PI - diff : diff;
        };
        const refA =
          angleConstraintDir === "cw" ? angleConstraintFrom : angleConstraintTo;
        const refB =
          angleConstraintDir === "cw" ? angleConstraintTo : angleConstraintFrom;
        const diffA = angleDiff(currAngle, refA);
        const diffB = angleDiff(currAngle, refB);
        const nearestConstraintAngle = diffA < diffB ? refA : refB;
        const newEndHeading = prevHeading + nearestConstraintAngle;
        const newEndPos = p5.Vector.fromAngle(
          newEndHeading,
          this.distConstraint
        ).add(this.beginNode.pos);
        this.endNode.pos.set(newEndPos);
      }
    }
  }

  show() {
    push();
    stroke(255);
    noFill();
    line(
      this.beginNode.pos.x,
      this.beginNode.pos.y,
      this.endNode.pos.x,
      this.endNode.pos.y
    );
    if (this.prevLink?.toBeginVec) {
      const prevLinkToBeginHeading = this.positivizeAngle(
        this.prevLink.toBeginVec.heading()
      );
      const {
        from: angleConstraintFrom,
        to: angleConstraintTo,
        dir: angleConstraintDir,
      } = this.angleConstraint;
      const angleFrom = this.positivizeAngle(
        prevLinkToBeginHeading + angleConstraintFrom
      );
      const angleTo = this.positivizeAngle(
        prevLinkToBeginHeading + angleConstraintTo
      );
      fill(0, 255, 255, 64);
      noStroke();
      if (angleConstraintDir === "cw") {
        arc(
          this.beginNode.pos.x,
          this.beginNode.pos.y,
          50,
          50,
          angleFrom,
          angleTo
        );
      } else {
        arc(
          this.beginNode.pos.x,
          this.beginNode.pos.y,
          50,
          50,
          angleTo,
          angleFrom
        );
      }
      fill("black");
      circle(
        this.beginNode.pos.x + Math.cos(angleFrom) * 25,
        this.beginNode.pos.y + Math.sin(angleFrom) * 25,
        10
      );
      fill("white");
      circle(
        this.beginNode.pos.x + Math.cos(angleTo) * 25,
        this.beginNode.pos.y + Math.sin(angleTo) * 25,
        10
      );
    }

    pop();
  }
}
