class Links {
  nodes = [];
  links = [];
  head;
  tail;
  constructor(x, y, cnt = 2, distConstraint = 20, angleConstraint = null) {
    this.head = new Node(x, y, { colour: color(255, 0, 0) });
    this.nodes.push(this.head);
    for (let n = 1; n < cnt; n++) {
      const prevNode = this.nodes[n - 1];
      const newNode = new Node(x, prevNode.pos.y + distConstraint, {
        colour: color(255 * (1 - n / (cnt - 1)), (255 * n) / (cnt - 1), 0),
      });
      this.nodes.push(newNode);
      this.links.push(
        new Link(prevNode, newNode, distConstraint, angleConstraint)
      );
    }
    this.links.forEach((aLink, idx) => {
      aLink.prevLink = idx !== 0 && this.links[idx - 1];
      aLink.nextLink = idx !== this.links.length - 1 && this.links[idx + 1];
    });
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
      aLink.resolve();
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
