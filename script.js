let brushColor;
let brushSize = 10;
let saveBtn, printBtn;
let img;
let currentColor;
let imgLoaded = false;

let tile;
let tileSize = 400;
let scaleFactor = 1;
let scaleSlider;


function preload() {
  img = loadImage('wasserfall.png');
}

function setup() {
  scaleSlider = document.getElementById("scaleSlider");
  
  tile = createGraphics(tileSize, tileSize);
  tile.background(255);
  tile.strokeCap(ROUND);

  let canvas = createCanvas(500, 500);
  canvas.parent("canvas-wrapper");
  background(255);

  brushColor = color(0);




  saveBtn = createButton('');
  saveBtn.parent('buttonBar');
  saveBtn.mousePressed(savePDF);
  
  saveBtn.style('width', '400px');
  saveBtn.style('height', '400px');
  saveBtn.style('border', 'none');
  saveBtn.style('background', 'url("save.svg") no-repeat center / contain');
  saveBtn.style('cursor', 'pointer');
  
  
  aboutBtn = createButton('');
  aboutBtn.parent('aboutBar');
  aboutBtn.mousePressed(() => {
    window.location.href = 'about.html';
  });

  aboutBtn.style('width', '400px');
  aboutBtn.style('height', '400px');
  aboutBtn.style('border', 'none');
  aboutBtn.style('background', 'url("about.svg") no-repeat center / contain');
  aboutBtn.style('cursor', 'pointer');



  const sizeSlider = document.getElementById("sizeSlider");
  const sizeLabel = document.getElementById("sizeLabel");

  sizeSlider.addEventListener("input", () => {
    brushSize = sizeSlider.value;
    sizeLabel.textContent = brushSize;
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    tile.background(255); // IMPORTANT: clear tile, not screen
  });

  // color picker image
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

    brushColor = color(picked[0], picked[1], picked[2]);
    updateColorDisplay();
  });

  currentColor = color(0, 0, 0);
  updateColorDisplay();
}

function draw() {
  background(255);

  scaleFactor = parseFloat(scaleSlider.value);

  let w = tileSize * scaleFactor;
  let h = tileSize * scaleFactor;

  // --- DRAW PATTERN ---
  for (let x = 0; x < width; x += w) {
    for (let y = 0; y < height; y += h) {
      image(tile, x, y, w, h);
    }
  }

  // --- DRAW INTO TILE ---
  if (mouseIsPressed &&
    !window.sliderActive &&
    mouseX >= 0 && mouseX < width &&
    mouseY >= 0 && mouseY < height) {

  // Mausposition unabhängig vom Scale berechnen
  let x = (mouseX / scaleFactor) % tileSize;
  let y = (mouseY / scaleFactor) % tileSize;
  let px = (pmouseX / scaleFactor) % tileSize;
  let py = (pmouseY / scaleFactor) % tileSize;

  // Wrap-around Linien verhindern
  let dx = abs(x - px);
  let dy = abs(y - py);
  if (dx > tileSize/2 || dy > tileSize/2) return;

  tile.stroke(brushColor);
  tile.strokeWeight(brushSize);
  tile.line(x, y, px, py);
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