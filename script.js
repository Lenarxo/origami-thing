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
  
  // Canvas-PDF speichern (dieser Download wird erlaubt)
  pdf.save('zeichnung.pdf');
  
  console.log('zeichnung.pdf gespeichert');

  // Zufällige PDF auswählen
  const files = ['hase.pdf', 'schwan.pdf', 'seepferdchen.pdf'];
  const randomFile = files[Math.floor(Math.random() * files.length)];
  
  console.log('Zufällige PDF:', randomFile);

  // Link zur zufälligen PDF anzeigen (Nutzer muss anklicken)
  setTimeout(() => {
    const msg = document.createElement('div');
    msg.style.position = 'fixed';
    msg.style.bottom = '20px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.background = '#fff';
    msg.style.padding = '15px 25px';
    msg.style.border = '2px solid #007bff';
    msg.style.zIndex = '9999';
    msg.style.fontSize = '14px';
    msg.style.textAlign = 'center';
    
    const link = document.createElement('a');
    link.href = randomFile;
    link.textContent = '📄 ' + randomFile + ' herunterladen';
    link.style.display = 'block';
    link.style.marginTop = '10px';
    link.style.color = '#007bff';
    link.style.textDecoration = 'underline';
    link.style.fontSize = '16px';
    
    msg.appendChild(link);
    document.body.appendChild(msg);
    
    // Nach 15 Sekunden entfernen
    setTimeout(() => msg.remove(), 15000);
    
    alert('Zeichnung wurde als "zeichnung.pdf" gespeichert!\n\nKlicke unten auf den Link, um die zufällige PDF (' + randomFile + ') zu speichern.');
  }, 300);
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