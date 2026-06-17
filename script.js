let brushColor;
let brushSize = 10;
let saveBtn, printBtn;
let img;
let currentColor;
let imgLoaded = false;

function preload() {
  img = loadImage('waterfall.jpg');
}

function setup() {
  // PIXELS MUST BE LOADED BEFORE USING img.get()
  img.loadPixels();
  
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas-wrapper");
  background(255);
  
  brushColor = color(0);

  saveBtn = createButton('Speichern');
  saveBtn.parent('buttonBar');
  saveBtn.mousePressed(savePDF);

  printBtn = createButton('Drucken');
  printBtn.parent('buttonBar');
  printBtn.mousePressed(printCanvas);

  const sizeSlider = document.getElementById("sizeSlider");
  const sizeLabel = document.getElementById("sizeLabel");

  sizeSlider.addEventListener("input", () => {
    brushSize = sizeSlider.value;
    sizeLabel.textContent = brushSize;
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    background(255);
  });

  const colorPickerImg = document.getElementById("colorPickerImg");

  colorPickerImg.addEventListener("click", (e) => {
    const bounds = colorPickerImg.getBoundingClientRect();

    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    const imgX = constrain(
      floor(map(mouseX, 0, bounds.width, 0, img.width)),
      0,
      img.width - 1
    );

    const imgY = constrain(
      floor(map(mouseY, 0, bounds.height, 0, img.height)),
      0,
      img.height - 1
    );
  
    const picked = img.get(imgX, imgY);

    brushColor = color(
      picked[0],
      picked[1],
      picked[2]
    );

    updateColorDisplay();
  });

  currentColor = color(0, 0, 0);
  updateColorDisplay();
}

function draw() {
  if (mouseIsPressed) {
    stroke(brushColor);
    strokeWeight(brushSize);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function rgbToHex(r, g, b) {
  let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  console.log("rgbToHex:", r, g, b, "->", hex);
  return hex;
}

function updateColorDisplay() {
  const display = document.getElementById("currentColorDisplay");

  if (display) {

    const r = red(brushColor);
    const g = green(brushColor);
    const b = blue(brushColor);

    display.style.backgroundColor =
      `rgb(${r}, ${g}, ${b})`;
  }

}
function keyPressed() {
  if (key === 'p' && keyIsDown(CONTROL)) {
    printCanvas();
  }
}

function savePDF() {
  const c = document.querySelector('canvas');
  if (!c) {
    console.log('Kein canvas gefunden');
    return;
  }

  const imgData = c.toDataURL('image/png');
  
  const jsPDF = window.jspdf.jsPDF;
  if (!jsPDF) {
    console.error('jsPDF nicht gefunden!');
    alert('jsPDF wurde nicht geladen.');
    return;
  }

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

  // Zufällige PDF auswählen
  const files = ['hase.pdf', 'schwan.pdf', 'seepferdchen.pdf'];
  const randomFile = files[Math.floor(Math.random() * files.length)];
  
  console.log('Zufällige PDF:', randomFile);

  // Download 1: Canvas-PDF
  pdf.save('zeichnung.pdf');
  
  console.log('Download 1: zeichnung.pdf');

  // Download 2: Random-PDF nach 1.5 Sekunden (Browser erlauben verzögerte Downloads)
  setTimeout(() => {
    const a = document.createElement('a');
    a.href = randomFile;
    a.download = randomFile;
    a.target = '_blank';
    
    // Click via Event (nicht direkt)
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    a.dispatchEvent(event);
    
    console.log('Download 2: ' + randomFile);
  }, 1500);
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