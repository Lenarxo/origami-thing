let brushColor = "#000000";
let brushSize = 10;
let saveBtn, printBtn;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas-wrapper");
  background(255);

  saveBtn = createButton('Speichern');
  saveBtn.parent('buttonBar');
  saveBtn.mousePressed(savePDF);

  printBtn = createButton('Drucken');
  printBtn.parent('buttonBar');
  printBtn.mousePressed(printCanvas);

  const colorPicker = document.getElementById("colorPicker");
  colorPicker.addEventListener("input", () => {
    brushColor = colorPicker.value;
  });

  const sizeSlider = document.getElementById("sizeSlider");
  const sizeLabel = document.getElementById("sizeLabel");

  sizeSlider.addEventListener("input", () => {
    brushSize = sizeSlider.value;
    sizeLabel.textContent = brushSize;
  });

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
  if (key === 'p' && keyIsDown(CONTROL)) {
    printCanvas();
  }
}

function savePDF() {
  const c = document.querySelector('canvas');
  if (!c) return;

  const imgData = c.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  if (!jsPDF) return;

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = c.width;
  const imgHeight = c.height;
  const ratio = imgHeight / imgWidth;

  let w = pageWidth;
  let h = w * ratio;

  if (h > pageHeight) {
    h = pageHeight;
    w = h / ratio;
  }

  const x = (pageWidth - w) / 2;
  const y = 0;

  pdf.addImage(imgData, 'PNG', x, y, w, h);
  pdf.save('zeichnung.pdf');
}

function printCanvas() {
  const c = document.querySelector('canvas');
  if (!c) {
    window.print();
    return;
  }
  
  // Direkt canvas drucken
  const img = new Image();
  img.src = c.toDataURL('image/png');
  img.onload = () => {
    const printWindow = window.open('', '', 'height=400,width=600');
    printWindow.document.write(`<html><head><title>Zeichnung</title></head><body>`);
    printWindow.document.write(`<img src="${img.src}" style="max-width:100%;height:auto;">`);
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
}