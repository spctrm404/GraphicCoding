class Animal {
  constructor(x, y, arryD) {
    this.links = [];
    let _x = x;
    for (let n = 0; n < arryD.length; n++) {
      this.links.push(new Link(x, y, arryD[n]));
      x += 0.5 * arryD[n];
    }
  }

  loop() {
    this.links.forEach((aLink, i) => {
      if (i === 0) aLink.move(mouseX, mouseY);
      if (i < this.links.length - 1) aLink.chain(this.links[i + 1]);
      aLink.show();
    });
  }
}
