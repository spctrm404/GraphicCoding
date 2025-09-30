class Link {
  head;
  tail;
  distConstraint;
  angleConstraint;
  prevLink = null;
  nextLink = null;
  showAngleConstraint = true;

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

  revResolve() {
    const newHeadPos = p5.Vector.setMag(
      this.toHeadVec,
      this.distConstraint
    ).add(this.tail.pos);
    this.head.pos.set(newHeadPos);
    if (this.nextLink && this.angleConstraint) {
      const {
        from: angleFrom,
        to: angleTo,
        dir: angleDir,
      } = this.angleConstraint;
      const positivizedAngleFrom = positivizeAngle(angleFrom);
      const positivizedAngleTo = positivizeAngle(angleTo);
      const nextLinkToTailVec = this.nextLink.toTailVec;
      const nextLinkToTailHeading = nextLinkToTailVec.heading();
      const toHeadHeading = this.toHeadVec.heading();
      const positivizedCurrAngle = positivizeAngle(
        toHeadHeading - nextLinkToTailHeading
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
        const newHeadHeading =
          nextLinkToTailVec.heading() + closestConstraintAngle;
        const newHeadPos = p5.Vector.fromAngle(
          newHeadHeading,
          this.distConstraint
        ).add(this.tail.pos);
        this.head.pos.set(newHeadPos);
      }
    }
  }

  show() {
    push();
    stroke(255);
    noFill();
    line(this.head.pos.x, this.head.pos.y, this.tail.pos.x, this.tail.pos.y);
    if (
      this.showAngleConstraint &&
      this.prevLink?.toHeadVec &&
      this.angleConstraint
    ) {
      const {
        from: angleFrom,
        to: angleTo,
        dir: angleDir,
      } = this.angleConstraint;
      const positivizedAngleFrom = positivizeAngle(angleFrom);
      const positivizedAngleTo = positivizeAngle(angleTo);
      const prevLinkToHeadVec = this.prevLink.toHeadVec;
      const prevLinkToHeadHeading = prevLinkToHeadVec.heading();
      const currAngleFrom = prevLinkToHeadHeading + angleFrom;
      const currAngleTo = prevLinkToHeadHeading + angleTo;
      fill(0, 255, 255, 64);
      noStroke();
      if (angleDir === 'cw') {
        arc(
          this.head.pos.x,
          this.head.pos.y,
          50,
          50,
          currAngleFrom,
          currAngleTo
        );
      } else {
        arc(
          this.head.pos.x,
          this.head.pos.y,
          50,
          50,
          currAngleTo,
          currAngleFrom
        );
      }
      fill('black');
      circle(
        this.head.pos.x + Math.cos(currAngleFrom) * 25,
        this.head.pos.y + Math.sin(currAngleFrom) * 25,
        10
      );
      fill('white');
      circle(
        this.head.pos.x + Math.cos(currAngleTo) * 25,
        this.head.pos.y + Math.sin(currAngleTo) * 25,
        10
      );
    }
    pop();
  }
}
