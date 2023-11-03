import {useRecoilValue} from "recoil";
import {markdownDocState, pdfUrlState} from "@/recoil/recoilStates";
import {PdfLoadingOverlay} from "./PdfLoadingOverlay";
import {pdfjs, Document, Page} from "react-pdf";
import {useState} from "react";
import {
  PiArrowsHorizontalBold,
  PiDownloadSimpleBold,
  PiMagnifyingGlassMinusBold,
  PiMagnifyingGlassPlusBold,
} from "react-icons/pi";
import {isMobile} from "react-device-detect";

// default workerSrc is set to pdfjs-dist/build/pdf.worker.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export function PdfView({isShow = false}: {isShow: boolean}): JSX.Element {
  const pdfUrl = useRecoilValue(pdfUrlState);
  const markdownDoc = useRecoilValue(markdownDocState);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(isMobile ? 350 : 600);

  function onDocumentLoadSuccess({numPages}: {numPages: any}): void {
    setNumPages(numPages);
  }

  function zoomOut(): void {
    setPageWidth((prevPageWidth) => Math.max(prevPageWidth - 50, 200));
  }

  function resetZoom(): void {
    const desktopPdfWidth = window.innerWidth * 0.48;
    const mobilePdfWidth = window.innerWidth * 0.9;
    setPageWidth(isMobile ? mobilePdfWidth : desktopPdfWidth);
  }

  function zoomIn(): void {
    setPageWidth((prevPageWidth) => Math.min(prevPageWidth + 50, 1200));
  }

  function downloadPdf(): void {
    if (pdfUrl == null) return;
    // set download attribute to download pdf
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    if (!isMobile) link.download = `${markdownDoc.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <PdfLoadingOverlay />
      <div
        className={
          "relative w-full h-[calc(100vh-90px)] mt-24 " +
          (isShow ? "" : "hidden")
        }
      >
        {/* react pdf wrapper */}
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {/* display all pdf pages */}
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              className="w-0 mb-8 mx-auto shadow-xl"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={pageWidth}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
          ))}
        </Document>

        {/* toolbox wrapper */}
        <div className="fixed left-3/4 transform sm:-translate-x-1/2 flex top-14 sm:pt-1 sm:top-24">
          <div className="join shadow-xl">
            {/* zoom out */}
            <button className="btn btn-sm" type="button" onClick={zoomOut}>
              <PiMagnifyingGlassMinusBold />
            </button>
            {/* default zoom */}
            <button className="btn btn-sm" type="button" onClick={resetZoom}>
              <PiArrowsHorizontalBold />
            </button>
            {/* zoom in */}
            <button className="btn btn-sm" type="button" onClick={zoomIn}>
              <PiMagnifyingGlassPlusBold />
            </button>
          </div>
          {/* download pdf */}
          <button
            className="join-item btn btn-sm font-bold shadow-xl mx-2 normal-case"
            type="button"
            onClick={downloadPdf}
          >
            <PiDownloadSimpleBold /> Download PDF
          </button>
        </div>
      </div>
    </>
  );
}
