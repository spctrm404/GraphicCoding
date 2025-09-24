class Link {
  head;
  tail;
  distConstraint;
  angleConstraint;
  prevLink = null;
  nextLink = null;

  constructor(head, tail, distConstraint = 20, angleConstraint = null) {
    this.head = head;
    this.tail = tail;
    this.distConstraint = distConstraint;
    this.angleConstraint = angleConstraint;
  }

  set prevLink(aLink) {
    if (aLink) this.prevLink = aLink;
  }
  set nextLink(aLink) {
    if (aLink) this.nextLink = aLink;
  }

  get toHeadVec() {
    return p5.Vector.sub(this.head.pos, this.tail.pos);
  }
  get toTailVec() {
    return p5.Vector.sub(this.tail.pos, this.head.pos);
  }

  resolve() {
    const newTailPos = p5.Vector.setMag(
      this.toTailVec,
      this.distConstraint
    ).add(this.head.pos);
    this.tail.pos.set(newTailPos);
    if (this.prevLink && this.angleConstraint) {
      const {
        from: angleFrom,
        to: angleTo,
        dir: angleDir,
      } = this.angleConstraint;
      const positivizedAngleFrom = positivizeAngle(angleFrom);
      const positivizedAngleTo = positivizeAngle(angleTo);
      const prevLinkToHeadVec = this.prevLink.toHeadVec;
      const prevLinkToHeadHeading = prevLinkToHeadVec.heading();
      const toTailHeading = this.toTailVec.heading();
      const positivizedCurrAngle = positivizeAngle(
        toTailHeading - prevLinkToHeadHeading
      );
      const isAngleInRange = (angle, from, to) => {
        return from <= to
          ? angle >= from && angle <= to
          : angle >= from || angle <= to;
      };
      let isWithinConstraint =
        angleDir === 'cw'
          ? isAngleInRange(
              positivizedCurrAngle,
              positivizedAngleFrom,
              positivizedAngleTo
            )
          : isAngleInRange(
              positivizedCurrAngle,
              positivizedAngleTo,
              positivizedAngleFrom
            );
      if (!isWithinConstraint) {
        const refA =
          angleDir === 'cw' ? positivizedAngleFrom : positivizedAngleTo;
        const refB =
          angleDir === 'cw' ? positivizedAngleTo : positivizedAngleFrom;
        const diffA = angleDiff(positivizedCurrAngle, refA);
        const diffB = angleDiff(positivizedCurrAngle, refB);
        const closestConstraintAngle = diffA < diffB ? refA : refB;
        const newTailHeading =
          prevLinkToHeadVec.heading() + closestConstraintAngle;
        const newTailPos = p5.Vector.fromAngle(
          newTailHeading,
          this.distConstraint
        ).add(this.head.pos);
        this.tail.pos.set(newTailPos);
      }
    }
  }

  show() {
    push();
    stroke(255);
    noFill();
    line(this.head.pos.x, this.head.pos.y, this.tail.pos.x, this.tail.pos.y);
    if (this.prevLink?.toBeginVec) {
      const prevLinkToBeginHeading = positivizeAngle(
        this.prevLink.toBeginVec.heading()
      );
      const {
        from: angleConstraintFrom,
        to: angleConstraintTo,
        dir: angleConstraintDir,
      } = this.angleConstraint;
      const angleFrom = positivizeAngle(
        prevLinkToBeginHeading + angleConstraintFrom
      );
      const angleTo = positivizeAngle(
        prevLinkToBeginHeading + angleConstraintTo
      );
      fill(0, 255, 255, 64);
      noStroke();
      if (angleConstraintDir === 'cw') {
        arc(this.head.pos.x, this.head.pos.y, 50, 50, angleFrom, angleTo);
      } else {
        arc(this.head.pos.x, this.head.pos.y, 50, 50, angleTo, angleFrom);
      }
      fill('black');
      circle(
        this.head.pos.x + Math.cos(angleFrom) * 25,
        this.head.pos.y + Math.sin(angleFrom) * 25,
        10
      );
      fill('white');
      circle(
        this.head.pos.x + Math.cos(angleTo) * 25,
        this.head.pos.y + Math.sin(angleTo) * 25,
        10
      );
    }

    pop();
  }
}
