import { pipeline } from '@transformers/core';

let summarizer;

const initializeSummarizer = async () => {
  if (!summarizer) {
    summarizer = await pipeline('summarization');
  }
};

export const summarizeText = async (text, maxLength = 150, minLength = 50) => {
  await initializeSummarizer();
  try {
    const summary = await summarizer(text, {
      max_length: maxLength,
      min_length: minLength,
      do_sample: false
    });
    return summary[0].summary_text;
  } catch (error) {
    console.error('Error al resumir el texto:', error);
    throw new Error('No se pudo generar el resumen del texto.');
  }
};