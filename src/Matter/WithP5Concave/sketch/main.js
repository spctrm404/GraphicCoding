const {
  Engine,
  Render,
  Runner,
  Composites,
  Common,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
} = Matter;

Common.setDecomp(decomp);

const container = document.getElementById('canvas-container');

let renderer;

let arrow = '40 0 40 20 100 20 100 80 40 80 40 100 0 50',
  chevron = '100 0 75 50 100 100 25 100 0 50 25 0',
  star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38',
  horseShoe =
    '35 7 19 17 14 38 14 58 25 79 45 85 65 84 65 66 46 67 34 59 30 44 33 29 45 23 66 23 66 7 53 7';
function parsePoints(str) {
  return str
    .trim()
    .split(/\s+/)
    .map(Number)
    .reduce((acc, val, idx, arr) => {
      if (idx % 2 === 0) acc.push({ x: val, y: arr[idx + 1] });
      return acc;
    }, []);
}
arrow = parsePoints(arrow);
chevron = parsePoints(chevron);
star = parsePoints(star);
horseShoe = parsePoints(horseShoe);
let concaves;

let walls;
const wallThickness = 50;

function parsePoints(str) {
  return str
    .trim()
    .split(/\s+/)
    .map(Number)
    .reduce((acc, val, idx, arr) => {
      if (idx % 2 === 0) acc.push({ x: val, y: arr[idx + 1] });
      return acc;
    }, []);
}

function setup() {
  renderer = createCanvas(800, 600);
  renderer.parent(container);

  const engine = Engine.create(),
    world = engine.world;

  concaves = Composites.stack(
    wallThickness * 0.5,
    wallThickness * 0.5,
    8,
    4,
    0,
    0,
    (x, y) =>
      Bodies.fromVertices(
        x,
        y,
        Common.choose([arrow, chevron, star, horseShoe])
      )
  );
  Composite.add(world, concaves);

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

  console.log(concaves);
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

  noFill();
  stroke(255, 0, 0);
  strokeJoin(ROUND);
  concaves.bodies.forEach((body) => {
    const edgeMap = new Map();
    body.parts.forEach((part, pIdx) => {
      if (pIdx === 0) return;
      const verts = part.vertices;
      verts.forEach((v, i) => {
        const vNext = verts[(i + 1) % verts.length];
        const key = `${Math.min(v.x, vNext.x)},${Math.min(
          v.y,
          vNext.y
        )}|${Math.max(v.x, vNext.x)},${Math.max(v.y, vNext.y)}`;
        edgeMap.has(key) ? edgeMap.delete(key) : edgeMap.set(key, [v, vNext]);
      });
    });

    const edges = Array.from(edgeMap.values());
    if (edges.length === 0) return;
    const outline = [edges[0][0], edges[0][1]];
    edges.splice(0, 1);
    while (edges.length > 0) {
      const last = outline[outline.length - 1];
      const idx = edges.findIndex(
        ([a, b]) =>
          (a.x === last.x && a.y === last.y) ||
          (b.x === last.x && b.y === last.y)
      );
      if (idx === -1) break;
      const [a, b] = edges[idx];
      outline.push(a.x === last.x && a.y === last.y ? b : a);
      edges.splice(idx, 1);
    }

    beginShape();
    for (const { x, y } of outline) vertex(x, y);
    endShape(CLOSE);
  });
}
