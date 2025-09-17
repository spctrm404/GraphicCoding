class Links {
  nodes = [];
  links = [];
  head = null;
  constructor(x, y, cnt, length, angle) {
    this.head = new Node(x, y);
    this.nodes.push(this.head);
    for (let n = 1; n < cnt; n++) {
      const prevNode = this.nodes[n - 1];
      this.nodes.push(new Node(prevNode.pos.x + length, y));
      this.links.push(new Link(prevNode, this.nodes[n], length, angle));
    }
  }

  moveHead(x, y) {
    this.head.pos.set(x, y);
  }

  constrain() {
    this.links.forEach((aLink, idx) => {
      aLink.constrain(idx !== 0 && this.links[idx - 1]);
    });
  }

  show() {
    this.nodes.forEach((aNode) => aNode.show());
    this.links.forEach((aLink) => aLink.show());
  }
}
