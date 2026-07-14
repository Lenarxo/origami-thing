let brushColor;
let brushSize = 10;
let saveBtn, printBtn;
let img;
let stiftImg;
let currentColor;
let imgLoaded = false;

let tile;
let tile2;

let tileSize = 300;
let scaleFactor = 1;
let scaleSlider;

let currentBrush = 1;
let brush1Btn, brush2Btn, brush3Btn, brush4Btn;
let imgSpawnCount = 0.01;
let imgSpawnChance = 0.2;

function preload() {
  img = loadImage('wasser2.png');
  stiftImg = loadImage('brushflower2.png');
}

function setup() {
  scaleSlider = document.getElementById("scaleSlider");
  
  tile = createGraphics(tileSize, tileSize);
  tile.background(255);
  tile.strokeCap(ROUND);

  tile2 = createGraphics(tileSize, tileSize);
  tile2.clear();
  tile2.strokeCap(ROUND);

  let canvas = createCanvas(300, 300);
  canvas.parent("canvasPos");
  background(255);

  brushColor = color(230, 20, 200);

  saveBtn = createButton('');
  saveBtn.parent('buttonBar');
  saveBtn.mousePressed(savePDF);
  
  saveBtn.style('width', '300px');
  saveBtn.style('height', '300px');
  saveBtn.style('border', 'none');
  saveBtn.style('background', 'url("save.svg") no-repeat center / contain');
  saveBtn.style('cursor', 'pointer');
  
  aboutBtn = createButton('');
  aboutBtn.parent('aboutBar');
  aboutBtn.mousePressed(() => {
    window.location.href = 'about.html';
  });

  aboutBtn.style('width', '300px');
  aboutBtn.style('height', '300px');
  aboutBtn.style('border', 'none');
  aboutBtn.style('background', 'url("about.svg") no-repeat center / contain');
  aboutBtn.style('cursor', 'pointer');

  
  
  
brush1Btn = createButton('');
brush1Btn.parent('buttonWahl');
brush1Btn.class('brushBtn');
brush1Btn.mousePressed(() => {
  currentBrush = 1;
});
brush1Btn.style('width', '70px');
brush1Btn.style('height', '70px');
brush1Btn.style('border', 'none');
brush1Btn.style('background', 'url("button1.svg") no-repeat center / contain');
brush1Btn.style('cursor', 'pointer');

brush2Btn = createButton('');
brush2Btn.parent('buttonWahl');
brush2Btn.class('brushBtn');
brush2Btn.mousePressed(() => {
  currentBrush = 2;
});
brush2Btn.style('width', '70px');
brush2Btn.style('height', '70px');
brush2Btn.style('border', 'none');
brush2Btn.style('background', 'url("button2.svg") no-repeat center / contain');
brush2Btn.style('cursor', 'pointer');

brush3Btn = createButton('');
brush3Btn.parent('buttonWahl');
brush3Btn.class('brushBtn');
brush3Btn.mousePressed(() => {
  currentBrush = 3;
});
brush3Btn.style('width', '70px');
brush3Btn.style('height', '70px');
brush3Btn.style('border', 'none');
brush3Btn.style('background', 'url("blumebtn.svg") no-repeat center / contain');
brush3Btn.style('cursor', 'pointer');

brush4Btn = createButton('');
brush4Btn.parent('buttonWahl');
brush4Btn.class('brushBtn');
brush4Btn.mousePressed(() => {
  currentBrush = 4;
});
brush4Btn.style('width', '70px');
brush4Btn.style('height', '70px');
brush4Btn.style('border', 'none');
brush4Btn.style('background', 'url("button4.svg") no-repeat center / contain');
brush4Btn.style('cursor', 'pointer');
  
  
  

  const sizeSlider = document.getElementById("sizeSlider");
  const sizeLabel = document.getElementById("sizeLabel");

  sizeSlider.addEventListener("input", () => {
    brushSize = sizeSlider.value;
    sizeLabel.textContent = brushSize;
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    tile.background(255);
    tile2.clear();
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

  for (let x = 0; x < width; x += w) {
    for (let y = 0; y < height; y += h) {
      image(tile, x, y, w, h);

      push();
      tint(255, 128);
      image(tile2, x, y, w, h);
      pop();
    }
  }

  if (mouseIsPressed &&
      !window.sliderActive &&
      mouseX >= 0 && mouseX < width &&
      mouseY >= 0 && mouseY < height) {

    let x = (mouseX / scaleFactor) % tileSize;
    let y = (mouseY / scaleFactor) % tileSize;
    let px = (pmouseX / scaleFactor) % tileSize;
    let py = (pmouseY / scaleFactor) % tileSize;

    let dx = abs(x - px);
    let dy = abs(y - py);
    if (dx > tileSize / 2 || dy > tileSize / 2) return;

    if (currentBrush === 1 || currentBrush === 2) {
      if (currentBrush === 2) {
        let count = 3;
        let radius = 15;

        for (let i = 0; i < count; i++) {
          let angle = random(TWO_PI);
          let r = random(radius);

          let sx = (x + cos(angle) * r + tileSize) % tileSize;
          let sy = (y + sin(angle) * r + tileSize) % tileSize;

          let size = random(4, 9);
          let alpha = random(80, 200);

          tile.noStroke();
          tile.fill(brushColor);
          tile.ellipse(sx, sy, size, size);
        }
      } else {
        tile.stroke(brushColor);
        tile.strokeWeight(brushSize);
        tile.line(x, y, px, py);
      }
    } else if (currentBrush === 4) {
      tile2.stroke(brushColor);
      tile2.strokeWeight(brushSize);
      tile2.line(x, y, px, py);
    } 
    else if (currentBrush === 3) {
  for (let i = 0; i < imgSpawnCount; i++) {
    if (random() < imgSpawnChance) {
      let offsetX = random(-10, 10);
      let offsetY = random(-10, 10);
      let stampSize = brushSize * 2;
      
      tile.push();
      tile.tint(red(brushColor), green(brushColor), blue(brushColor));
      tile.imageMode(CENTER);
      tile.image(stiftImg, x + offsetX, y + offsetY, stampSize, stampSize);
      tile.imageMode(CORNER);
      tile.pop();
    }
  }
}
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
  pdf.save('pattern.pdf');
  
  console.log('Download 1: pattern.pdf');

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
    printWindow.document.write(`<html><head><title>pattern</title></head><body>`);
    printWindow.document.write(`<img src="${img.src}" style="max-width:100%;height:auto;">`);
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
}