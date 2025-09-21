class Links {
  nodes = [];
  links = [];
  head = null;
  tail = null;
  constructor(x, y, cnt = 2, length = 20, angle = (15 / 180) * Math.PI) {
    this.head = new Node(x, y, { fill: color(255, 0, 0) });
    this.nodes.push(this.head);
    for (let n = 1; n < cnt; n++) {
      const prevNode = this.nodes[n - 1];
      this.nodes.push(
        new Node(x, prevNode.pos.y + length, {
          fill: color(255 * (1 - n / (cnt - 1)), (255 * n) / (cnt - 1), 0),
        })
      );
      this.links.push(new Link(prevNode, this.nodes[n], length, angle));
    }
    this.tail = this.nodes[this.nodes.length - 1];
  }

  moveHead(x, y) {
    this.head.pos.set(x, y);
  }

  moveTail(x, y) {
    this.tail.pos.set(x, y);
  }

  resolve() {
    this.links.forEach((aLink, idx) => {
      aLink.resolve(idx !== 0 && this.links[idx - 1]);
    });
  }
  reverseResolve() {
    for (let idx = this.links.length - 1; idx >= 0; idx--) {
      this.links[idx].reverseResolve(
        idx !== this.links.length - 1 && this.links[idx + 1]
      );
    }
  }

  fabrikResolve() {
    const prevTailPos = this.tail.pos.copy();
    for (let idx = 0; idx < this.links.length; idx++) {
      // this.links[idx].resolve(idx !== 0 && this.links[idx - 1]);
      this.links[idx].resolve();
    }
    this.moveTail(prevTailPos.x, prevTailPos.y);
    for (let idx = this.links.length - 1; idx >= 0; idx--) {
      // this.links[idx].reverseResolve(
      //   idx !== this.links.length - 1 && this.links[idx + 1]
      // );
      this.links[idx].reverseResolve();
    }
  }

  show() {
    this.nodes.forEach((aNode) => aNode.show());
    this.links.forEach((aLink) => aLink.show());
  }
}
