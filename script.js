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


async function savePDF() {
  console.log('savePDF gestartet');
  
  const c = document.querySelector('canvas');
  if (!c) {
    console.log('Kein canvas gefunden');
    return;
  }

  const imgData = c.toDataURL('image/png');
  
  // jsPDF korrekt aus window.jspdf
  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    console.error('jsPDF nicht gefunden! window.jspdf:', window.jspdf);
    alert('jsPDF wurde nicht geladen.');
    return;
  }
  
  console.log('jsPDF vorhanden');

  // Canvas als jsPDF erstellen
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

  // Zufällige Assets-PDF auswählen
  const files = ['assets/hase.pdf', 'assets/schwan.pdf', 'assets/seepferdchen.pdf'];
  const randomFile = files[Math.floor(Math.random() * files.length)];

  console.log('Canvas-PDF erstellen...', randomFile);

  // jsPDF als Blob/Bytes
  const canvasPdfBlob = await pdf.output('blob');
  const canvasPdfBytes = await canvasPdfBlob.array();

  console.log('Canvas-PDF als Bytes:', canvasPdfBytes.byteLength);

  // Zufällige PDF laden
  const randomPdfResponse = await fetch(randomFile);
  if (!randomPdfResponse.ok) {
    console.error('Fehler beim Laden von ' + randomFile, randomPdfResponse);
    alert('PDF konnte nicht geladen werden: ' + randomFile + '\nFehler: ' + randomPdfResponse.status);
    return;
  }
  const randomPdfBytes = await randomPdfResponse.arrayBuffer();

  console.log('Random-PDF als Bytes:', randomPdfBytes.byteLength);

  // PDFs mit pdf-lib zusammenfügen
  const PDFDocument = pdfLib.PDFDocument;
  if (!PDFDocument) {
    console.error('pdfLib.PDFDocument existiert nicht! pdfLib:', pdfLib);
    alert('pdf-lib wurde nicht richtig geladen.');
    return;
  }

  console.log('PDFDocument vorhanden, PDFs zusammenfügen...');

  const pdfDoc = await PDFDocument.load(randomPdfBytes);

  // Canvas-PDF laden und Seiten kopieren
  const canvasPdf = await PDFDocument.load(canvasPdfBytes);
  const canvasPages = canvasPdf.getPages();

  console.log('Canvas-PDF hat ' + canvasPages.length + ' Seiten');

  for (const page of canvasPages) {
    const copiedPage = await pdfDoc.copyPage(page);
    pdfDoc.addPage(copiedPage);
  }

  // Zusammengeführtes PDF speichern
  const combinedPdfBytes = await pdfDoc.save();
  console.log('Kombiniertes PDF:', combinedPdfBytes.byteLength);

  const blob = new Blob([combinedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'zeichnung+mystery.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('Download gestartet!');
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