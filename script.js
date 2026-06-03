let brushColor = "#000000";
let brushSize = 10;

function setup() {
let canvas = createCanvas(800, 600);
  canvas.parent("canvas-wrapper");
  background(255);

  // Buttons EINMAL erzeugen
  saveBtn = createButton('Speichern als PDF');
  saveBtn.position(10, 10);
  saveBtn.mousePressed(savePDF);

  printBtn = createButton('Drucken');
  printBtn.position(150, 10);
  printBtn.mousePressed(printCanvas);

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

function keyPressed() {
  // STRG + P → Drucken
  if (key === 'p' && keyIsDown(CONTROL)) {
    printCanvas();
  }
}

function savePDF() {
  saveCanvas('zeichnung', 'pdf');
}

function printCanvas() {
  window.print();
}