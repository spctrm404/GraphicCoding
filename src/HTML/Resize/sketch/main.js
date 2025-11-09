const canvasContainer = document.getElementById('canvas-container');

const INITIAL_WIDTH = 800;
const INITIAL_HEIGHT = 600;

let renderer;

function resizeHandler(entries) {
  for (let entry of entries) {
    const { width: containerWidth, height: containerHeight } =
      entry.contentRect;

    const aspect = INITIAL_WIDTH / INITIAL_HEIGHT;

    let newWidth = containerWidth;
    let newHeight = newWidth / aspect;
    if (newHeight > containerHeight) {
      newHeight = containerHeight;
      newWidth = newHeight * aspect;
    }
    resizeCanvas(Math.floor(newWidth), Math.floor(newHeight));
  }
}

function setup() {
  renderer = createCanvas(INITIAL_WIDTH, INITIAL_HEIGHT);
  renderer.parent(canvasContainer);

  canvasContainer.style.aspectRatio = `${INITIAL_WIDTH} / ${INITIAL_HEIGHT}`;
  const resizeObserver = new ResizeObserver(resizeHandler);
  resizeObserver.observe(canvasContainer);
}

function draw() {
  background(0);
  fill('#F00');
  circle(width / 2, height / 2, 100);
}
