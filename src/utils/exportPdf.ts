import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type ExportPdfOptions = {
  scale?: number; // canvas scale for quality
  landscape?: boolean; // page orientation
  marginMm?: number; // page margin in millimeters
  filename?: string; // fallback filename
};

/**
 * Export a specific DOM element (by CSS selector or element) to a multi-page PDF.
 * - Uses html2canvas to rasterize the element
 * - Inserts the resulting image into a jsPDF document across multiple pages if needed
 */
export async function exportElementToPdf(
  target: string | HTMLElement,
  filename = 'export.pdf',
  options: ExportPdfOptions = {}
) {
  const { scale = 2, landscape = false, marginMm = 10 } = options;

  const element =
    typeof target === 'string'
      ? (document.querySelector(target) as HTMLElement | null)
      : target;

  if (!element) throw new Error('exportElementToPdf: target element not found');

  // Ensure element is fully visible before capture
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'visible';

  try {
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(landscape ? 'l' : 'p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const usableWidth = pageWidth - marginMm * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width; // keep aspect ratio

    let heightLeft = imgHeight;
    let position = marginMm;

    // First page
    pdf.addImage(
      imgData,
      'PNG',
      marginMm,
      position,
      usableWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    heightLeft -= pageHeight - marginMm * 2;

    // Extra pages
    while (heightLeft > 0) {
      pdf.addPage();
      position = marginMm - (imgHeight - heightLeft);
      pdf.addImage(
        imgData,
        'PNG',
        marginMm,
        position,
        usableWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pageHeight - marginMm * 2;
    }

    pdf.save(filename);
  } finally {
    document.body.style.overflow = previousOverflow;
  }
}
