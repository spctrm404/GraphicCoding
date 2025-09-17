class Chain {
  joints = [];
  linkLen;
  angles = [];
  angleLim;

  constructor(origin, jointCnt, linkLen, angleLim) {
    this.linkLen = linkLen;
    this.angleLim = angleLim;
    this.joints.push(createVector(origin[0], origin[1]));
    this.angles.push(0);
    for (let n = 1; n < jointCnt; n++) {
      const { x, y } = this.joints[n - 1];
      this.joints.push(createVector(x, y + linkLen));
      this.angles.push(0);
    }
  }

  simplifyAngle(angle) {
    return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  }

  relativeAngleDiff(angle, anchor) {
    angle = this.simplifyAngle(angle + Math.PI - anchor);
    anchor = Math.PI;
    return anchor - angle;
  }

  constrainAngle(angle, anchor, constraint) {
    if (Math.abs(this.relativeAngleDiff(angle, anchor)) <= constraint)
      return this.simplifyAngle(angle);

    if (this.relativeAngleDiff(angle, anchor) > constraint)
      return this.simplifyAngle(anchor - constraint);

    return this.simplifyAngle(anchor + constraint);
  }

  moveTo(pos) {
    this.angles[0] = p5.Vector.sub(pos, this.joints[0]).heading();
    this.joints[0].set(pos);
    for (let idx = 1; idx < this.joints.length; idx++) {
      const currAngle = p5.Vector.sub(
        this.joints[idx - 1],
        this.joints[idx]
      ).heading();
      this.angles[idx] = this.constrainAngle(
        currAngle,
        this.angles[idx - 1],
        this.angleLim
      );
      const newJointPos = p5.Vector.sub(
        this.joints[idx - 1],
        p5.Vector.fromAngle(this.angles[idx]).setMag(this.linkLen)
      );
      this.joints[idx].set(newJointPos);
    }
  }

  show() {
    stroke(255);
    strokeWeight(8);
    this.joints.forEach((aJoint, idx) => {
      if (idx > 0) {
        const beginJoint = this.joints[idx - 1];
        line(beginJoint.x, beginJoint.y, aJoint.x, aJoint.y);
      }
    });

    fill(255, 0, 0);
    this.joints.forEach((aJoint, idx) => {
      circle(aJoint.x, aJoint.y, 32);
    });
  }
}
