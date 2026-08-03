import PDFParser from "pdf2json";
<<<<<<< HEAD
=======

>>>>>>> 1994384d9fedfbe400d6911da1b972e6c5caff88

// This is to Parse the pdf to text form.
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (err: any) => {
      reject(new Error("PDF parsing failed: " + err.parserError));
    });

<<<<<<< HEAD
=======

>>>>>>> 1994384d9fedfbe400d6911da1b972e6c5caff88
    pdfParser.on("pdfParser_dataReady", () => {
      const text = pdfParser.getRawTextContent();
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}