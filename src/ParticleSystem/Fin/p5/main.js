const pallete = ['#77BEF0', '#FFCB61', '#FF894F', '#EA5B6F'];

let emitters = [];
let gravity;

function setup() {
  createCanvas(800, 600);
  emitters.push(
    new Emitter(width / 2, height / 2, {
      emitRate: 1,
      area: 10,
      lifeSpan: 180,
      initialSpeed: 5,
      initialVelAngleRange: 30,
    })
  );
  gravity = createVector(0, 0.1);
}

function draw() {
  background(0);

  if (mouseIsPressed && frameCount % 8 === 0) {
    emitters.push(
      new Emitter(mouseX, mouseY, {
        emitRate: 1,
        area: 10,
        lifeSpan: 180,
        initialSpeed: 5,
        initialVelAngleRange: 30,
      })
    );
  }

  emitters.forEach((emitter) => {
    emitter.emit();
    emitter.applyGravity(gravity);
    emitter.update();
    emitter.show();
  });
}
