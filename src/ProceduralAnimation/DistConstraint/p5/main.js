const points = [];
const pointNum = 10;
const pointOptions = {
  r: 10,
  distConstraint: 50,
};
let mouse;

function setup() {
  createCanvas(600, 800);

  colorMode(HSB, 360, 100, 100, 100);

  const totalWidth = (pointNum - 1) * pointOptions.distConstraint;
  for (let n = 0; n < pointNum; n++) {
    const x = width / 2 - 0.5 * totalWidth + pointOptions.distConstraint * n;
    const colour = color(map(n, 0, pointNum - 1, 0, 240), 100, 100);
    pointOptions.colour = colour;
    const newPoint = new Point(x, height / 2, pointOptions);
    points.push(newPoint);
  }

  mouse = createVector(0, 0);
}

function draw() {
  background(0);

  mouse.set(mouseX, mouseY);

  points[0].setPos(mouse);
  points.forEach((aPoint, idx) => {
    if (idx > 0) {
      aPoint.distConstrainedBy(points[idx - 1], true);
    }
    points[0].setHeading(points[1].heading);
  });

  points.forEach((aPoint, idx) => {
    aPoint.show();
    aPoint.showDistConstraint();
  });
}
