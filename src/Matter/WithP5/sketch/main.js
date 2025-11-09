const {
  Engine,
  Render,
  Runner,
  Composites,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
} = Matter;

const container = document.getElementById('canvas-container');

let renderer;

let boxes;

let walls;
const wallThickness = 50;

function setup() {
  renderer = createCanvas(800, 600);
  renderer.parent(container);

  const engine = Engine.create(),
    world = engine.world;

  boxes = Composites.stack(
    wallThickness * 0.5,
    wallThickness * 0.5,
    10,
    5,
    0,
    0,
    (x, y) => {
      if (random() < 0.8) {
        return Bodies.rectangle(x, y, random(25, 50), random(25, 50));
      } else {
        return Bodies.rectangle(x, y, random(80, 120), random(25, 30));
      }
    }
  );
  Composite.add(world, boxes);

  walls = [
    Bodies.rectangle(width * 0.5, 0, width, wallThickness, { isStatic: true }),
    Bodies.rectangle(width * 0.5, height, width, wallThickness, {
      isStatic: true,
    }),
    Bodies.rectangle(0, height * 0.5, wallThickness, height, {
      isStatic: true,
    }),
    Bodies.rectangle(width, height * 0.5, wallThickness, height, {
      isStatic: true,
    }),
  ];
  Composite.add(world, walls);

  const mouse = Mouse.create(renderer.elt);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
    },
  });
  mouse.pixelRatio = pixelDensity();
  Composite.add(world, mouseConstraint);

  console.log(boxes);
  console.log(walls);

  const runner = Runner.create();
  Runner.run(runner, engine);
}

function draw() {
  background(255);

  noStroke();
  fill(0);
  walls.forEach((body) => {
    beginShape();
    body.vertices.forEach((v) => vertex(v.x, v.y));
    endShape(CLOSE);
  });
  stroke(0);
  fill(255);
  boxes.bodies.forEach((body) => {
    beginShape();
    body.vertices.forEach((v) => vertex(v.x, v.y));
    endShape(CLOSE);
  });
}
