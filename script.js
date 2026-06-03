let brushColor = "#000000";
let brushSize = 10;

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("canvas-wrapper"); // center container
  background(255);

  // Color picker
  const colorPicker = document.getElementById("colorPicker");
  colorPicker.addEventListener("input", () => {
    brushColor = colorPicker.value;
  });

  // Brush size slider
  const sizeSlider = document.getElementById("sizeSlider");
  const sizeLabel = document.getElementById("sizeLabel");

  sizeSlider.addEventListener("input", () => {
    brushSize = sizeSlider.value;
    sizeLabel.textContent = brushSize;
  });

  // Clear button
  document.getElementById("clearBtn").addEventListener("click", () => {
    background(255);
  });
}

function draw() {
  if (mouseIsPressed) {
    stroke(brushColor);
    strokeWeight(brushSize);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}
