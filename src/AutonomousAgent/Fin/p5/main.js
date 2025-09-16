let animal;

function setup() {
  createCanvas(600, 400);
  animal = new Animal(
    0.5 * width,
    0.5 * height,
    [53, 59, 43, 61, 69, 71, 64, 50, 29, 16, 12, 10, 7, 7]
  );
}

function draw() {
  background(220);
  animal.loop();
}
