import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph } from 'docx';

export const exportToPDF = (content) => {
  // Aquí iría la lógica para generar un PDF
  // Por ahora, simularemos la descarga con un archivo de texto
  const blob = new Blob([content], { type: 'application/pdf' });
  saveAs(blob, 'result.pdf');
};

export const exportToTXT = (content) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'result.txt');
};

export const exportToDOCX = (content) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [{ text: content }],
        }),
      ],
    }],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, 'result.docx');
  });
};

export const exportResult = (content, format) => {
  switch (format) {
    case 'pdf':
      exportToPDF(content);
      break;
    case 'txt':
      exportToTXT(content);
      break;
    case 'docx':
      exportToDOCX(content);
      break;
    default:
      console.error('Formato de exportación no soportado');
  }
};