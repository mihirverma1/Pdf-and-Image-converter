
// We use external script loaders for browser-side libraries to avoid bundler issues
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const PDF_LIB_URL = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfLibLoaded = false;
let pdfjsLoaded = false;

const initLibraries = async () => {
  if (!pdfLibLoaded) {
    await loadScript(PDF_LIB_URL);
    pdfLibLoaded = true;
  }
  if (!pdfjsLoaded) {
    await loadScript(PDFJS_URL);
    // @ts-ignore
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    pdfjsLoaded = true;
  }
};

const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const processPdfToImages = async (file: File) => {
  await initLibraries();
  // @ts-ignore
  const pdfjsLib = window.pdfjsLib;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${file.name.replace('.pdf', '')}_page_${i}.jpg`);
    }, 'image/jpeg', 0.95);
  }
};

export const processImagesToPdf = async (files: File[]) => {
  await initLibraries();
  // @ts-ignore
  const { PDFDocument } = window.PDFLib;
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const imgBytes = await file.arrayBuffer();
    let img;
    if (file.type === 'image/jpeg') {
      img = await pdfDoc.embedJpg(imgBytes);
    } else if (file.type === 'image/png') {
      img = await pdfDoc.embedPng(imgBytes);
    } else {
      continue;
    }

    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  downloadBlob(blob, 'combined_images.pdf');
};

export const mergePdfs = async (files: File[]) => {
  await initLibraries();
  // @ts-ignore
  const { PDFDocument } = window.PDFLib;
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page: any) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  downloadBlob(blob, 'merged_document.pdf');
};

/**
 * Shrinking a PDF in the browser is challenging.
 * We'll use a "re-render and re-compress" strategy:
 * Render each page as a medium-quality JPG and re-compile into a new PDF.
 */
export const shrinkPdf = async (file: File) => {
  await initLibraries();
  // @ts-ignore
  const pdfjsLib = window.pdfjsLib;
  // @ts-ignore
  const { PDFDocument } = window.PDFLib;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    // Use a lower scale for shrinking (e.g., 1.2 instead of 2)
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    const imgData = canvas.toDataURL('image/jpeg', 0.6); // Lower quality
    const img = await newPdf.embedJpg(imgData);
    const newPage = newPdf.addPage([img.width, img.height]);
    newPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  downloadBlob(blob, `shrunk_${file.name}`);
};
