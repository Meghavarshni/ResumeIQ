import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import type { ExtractionStage } from '../types';

// Set up pdf.js worker URL to point to unpkg CDN matching the current pdf.js version
const pdfjsVersion = pdfjsLib.version || '4.10.38';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;

/**
 * Extracts text from a PDF file page by page.
 */
export async function extractTextFromPdf(
  file: File,
  onProgress: (percent: number, log: string) => void
): Promise<string> {
  onProgress(5, 'Reading PDF file bytes...');
  const arrayBuffer = await file.arrayBuffer();
  
  onProgress(15, 'Loading PDF document into memory...');
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  // Track loading progress if possible
  loadingTask.onProgress = (progressData: { loaded: number; total: number }) => {
    if (progressData.total > 0) {
      const loadPercent = Math.round((progressData.loaded / progressData.total) * 100);
      onProgress(15 + Math.round(loadPercent * 0.15), `Loading file: ${loadPercent}%`);
    }
  };

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  onProgress(30, `Successfully parsed PDF header. Pages detected: ${numPages}`);

  let fullText = '';
  for (let i = 1; i <= numPages; i++) {
    onProgress(
      30 + Math.round((i / numPages) * 60),
      `Reading page ${i} of ${numPages}...`
    );
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Concat text fragments with space
    const pageText = textContent.items
      .map((item: any) => item.str || '')
      .join(' ');
    
    fullText += pageText + '\n';
  }

  onProgress(100, 'Finished extracting all text pages successfully.');
  return fullText;
}

/**
 * Extracts raw text from a DOCX file using mammoth.
 */
export async function extractTextFromDocx(
  file: File,
  onProgress: (percent: number, log: string) => void
): Promise<string> {
  onProgress(10, 'Reading DOCX file bytes...');
  const arrayBuffer = await file.arrayBuffer();

  onProgress(40, 'Decompressing document xml layers...');
  const result = await mammoth.extractRawText({ arrayBuffer });
  
  onProgress(80, 'Extracting content tags and paragraph hierarchies...');
  if (result.messages && result.messages.length > 0) {
    onProgress(90, `Extraction warning: ${result.messages[0].message}`);
  }

  onProgress(100, 'Document text extracted completely.');
  return result.value;
}

/**
 * Extracts text from images via OCR using client-side Tesseract.js.
 */
export async function extractTextFromImage(
  file: File,
  onProgress: (percent: number, log: string, confidence?: number) => void
): Promise<{ text: string; confidence: number }> {
  onProgress(10, 'Spawning background WebAssembly OCR worker...');
  
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const percent = Math.round(m.progress * 100);
        onProgress(20 + Math.round(m.progress * 75), `OCR Recognizing: ${percent}%`);
      } else {
        onProgress(15, `OCR Status: ${m.status}...`);
      }
    },
  });

  onProgress(20, 'Sending image buffer to OCR pipeline...');
  const ret = await worker.recognize(file);
  const text = ret.data.text;
  const confidence = ret.data.confidence;

  onProgress(95, 'Terminating active OCR worker thread...');
  await worker.terminate();

  onProgress(100, 'OCR process completed successfully.');
  return { text, confidence };
}

/**
 * Master controller for extracting text from any supported file type.
 */
export async function extractResume(
  file: File,
  onProgress: (stage: ExtractionStage, percent: number, log: string, confidence: number | null) => void
): Promise<{ text: string; ocrConfidence: number | null }> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      onProgress('reading', 5, 'Starting PDF extraction pipeline...', null);
      const text = await extractTextFromPdf(file, (p, log) => {
        onProgress('extracting', p, log, null);
      });
      return { text, ocrConfidence: null };
    } 
    
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx')
    ) {
      onProgress('reading', 5, 'Starting Word Document extraction...', null);
      const text = await extractTextFromDocx(file, (p, log) => {
        onProgress('extracting', p, log, null);
      });
      return { text, ocrConfidence: null };
    } 
    
    if (
      fileType.startsWith('image/') || 
      fileName.endsWith('.png') || 
      fileName.endsWith('.jpg') || 
      fileName.endsWith('.jpeg') || 
      fileName.endsWith('.webp')
    ) {
      onProgress('reading', 5, 'Detected image format. Initializing Tesseract OCR...', null);
      const { text, confidence } = await extractTextFromImage(file, (p, log) => {
        onProgress('extracting', p, log, confidence);
      });
      return { text, ocrConfidence: confidence };
    }

    throw new Error(`Unsupported file type: ${file.type || 'unknown format'}`);
  } catch (error: any) {
    onProgress('error', 0, `Extraction failed: ${error.message || error}`, null);
    throw error;
  }
}
