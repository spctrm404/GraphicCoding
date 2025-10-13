class Links {
  nodes = [];
  links = [];
  head;
  tail;
  length = 0;

  static createLinks(
    x,
    y,
    cnt = 2,
    distConstraint = 20,
    angleConstraint = null
  ) {
    const head = new Node(x, y, { colour: color(255, 0, 0) });
    const nodes = [head];
    const links = [];
    for (let n = 1; n < cnt; n++) {
      const prevNode = nodes[n - 1];
      const newNode = new Node(x, prevNode.pos.y + distConstraint, {
        colour: color(255 * (1 - n / (cnt - 1)), (255 * n) / (cnt - 1), 0),
      });
      nodes.push(newNode);
      links.push(new Link(prevNode, newNode, distConstraint, angleConstraint));
    }
    links.forEach((aLink, idx) => {
      aLink.prevLink = idx !== 0 && links[idx - 1];
      aLink.nextLink = idx !== links.length - 1 && links[idx + 1];
    });
    const tail = nodes[nodes.length - 1];
    return new Links(nodes, links, head, tail, distConstraint * (cnt - 1));
  }

  constructor(nodes, links, head, tail, length) {
    this.nodes = nodes;
    this.links = links;
    this.head = head;
    this.tail = tail;
    this.length = length;
  }

  addNode(idx, node, distConstraint = 20, angleConstraint = null) {
    let usedIdx = idx;
    if (idx < 0) usedIdx = 0;
    if (idx > this.nodes.length) usedIdx = this.nodes.length;

    const prevNode = this.nodes[usedIdx - 1] || null;
    const nextNode = this.nodes[usedIdx] || null;
    this.nodes.splice(usedIdx, 0, node);

    const prevLink = this.links[usedIdx - 1] || null;
    const nextLink = this.links[usedIdx] || null;
    const newLink = nextNode
      ? new Link(node, nextNode, distConstraint, angleConstraint)
      : new Link(prevNode, node, distConstraint, angleConstraint);
    this.links.splice(nextNode ? usedIdx : usedIdx - 1, 0, newLink);

    if (prevLink) {
      prevLink.nextLink = newLink;
      newLink.prevLink = prevLink;
    }
    if (nextLink) {
      nextLink.prevLink = newLink;
      newLink.nextLink = nextLink;
    }

    if (usedIdx === 0) this.head = node;
    if (usedIdx === this.nodes.length - 1) this.tail = node;

    this.length += distConstraint;
  }

  moveHead(x, y) {
    this.head.pos.set(x, y);
  }

  moveTail(x, y) {
    this.tail.pos.set(x, y);
  }

  resolve() {
    this.links.forEach((aLink) => aLink.resolve());
  }
  revResolve() {
    for (let idx = this.links.length - 1; idx >= 0; idx--) {
      this.links[idx].revResolve();
    }
  }

  fabrikResolve() {
    const currTailPos = this.tail.pos.copy();
    this.resolve();
    this.moveTail(currTailPos.x, currTailPos.y);
    this.revResolve();
  }

  show() {
    this.nodes.forEach((aNode) => aNode.show());
    this.links.forEach((aLink) => aLink.show());
  }
}
