class Link {
  beginNode = null;
  endNode = null;
  length;
  angle = undefined;

  constructor(beginNode, endNode, length = 20, angle = undefined) {
    this.beginNode = beginNode;
    this.endNode = endNode;
    this.length = length;
    if (angle) this.angle = angle;
  }

  get toBeginVec() {
    return p5.Vector.sub(this.beginNode.pos, this.endNode.pos);
  }
  get toEndVec() {
    return p5.Vector.sub(this.endNode.pos, this.beginNode.pos);
  }

  resolve(prevLink) {
    const headToTailVec = p5.Vector.sub(this.endNode.pos, this.beginNode.pos);
    const newTailPos = p5.Vector.setMag(headToTailVec, this.length).add(
      this.beginNode.pos
    );
    this.endNode.pos.set(newTailPos);
    if (prevLink && this.angle !== undefined) {
      const currAngle = prevLink.toEndVec.angleBetween(headToTailVec);
      const unsignedCurrAngle = Math.abs(currAngle);
      if (unsignedCurrAngle > this.angle) {
        const sign = currAngle > 0 ? 1 : -1;
        const angleDiff = sign * (unsignedCurrAngle - this.angle);
        const newEndPos = p5.Vector.rotate(headToTailVec, -angleDiff)
          .setMag(this.length)
          .add(this.beginNode.pos);
        this.endNode.pos.set(newEndPos);
      }
    }
  }

  reverseResolve(nextLink) {
    const tailToHeadVec = p5.Vector.sub(this.beginNode.pos, this.endNode.pos);
    const newHeadPos = p5.Vector.setMag(tailToHeadVec, this.length).add(
      this.endNode.pos
    );
    this.beginNode.pos.set(newHeadPos);
    if (nextLink && this.angle !== undefined) {
      const currAngle = nextLink.toBeginVec.angleBetween(tailToHeadVec);
      const unsignedCurrAngle = Math.abs(currAngle);
      if (unsignedCurrAngle > this.angle) {
        const sign = currAngle > 0 ? 1 : -1;
        const angleDiff = sign * (unsignedCurrAngle - this.angle);
        const newBeginPos = p5.Vector.rotate(tailToHeadVec, -angleDiff)
          .setMag(this.length)
          .add(this.endNode.pos);
        this.beginNode.pos.set(newBeginPos);
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
    pop();
  }
}
