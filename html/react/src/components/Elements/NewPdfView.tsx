import {useRecoilValue} from "recoil";
import {pdfUrlState} from "@/recoil/recoilStates";
import {PdfLoadingOverlay} from "./PdfLoadingOverlay";
import {pdfjs, Document, Page} from "react-pdf";
import {useState} from "react";
import {
  PiCaretLeftBold,
  PiCaretRightBold,
  PiMagnifyingGlassMinusBold,
  PiMagnifyingGlassPlusBold,
} from "react-icons/pi";

// default workerSrc is set to pdfjs-dist/build/pdf.worker.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export function NewPdfView({isShow = false}: {isShow: boolean}): JSX.Element {
  const pdfUrl = useRecoilValue(pdfUrlState);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(600);

  function onDocumentLoadSuccess({numPages}: {numPages: any}): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number): void {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage(): void {
    changePage(-1);
  }

  function nextPage(): void {
    changePage(1);
  }

  function zoomOut(): void {
    setPageWidth((prevPageWidth) => prevPageWidth - 50);
  }

  function zoomIn(): void {
    setPageWidth((prevPageWidth) => prevPageWidth + 50);
  }

  return (
    <>
      <PdfLoadingOverlay />
      <div
        className={
          "relative w-full h-[calc(100vh-90px)] mt-12 " +
          (isShow ? "" : "hidden")
        }
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            className="w-0 mx-auto shadow-xl"
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={pageWidth}
          />
        </Document>
        <div className="fixed left-3/4 transform -translate-x-1/2 bottom-16">
          <div className="join">
            <button
              className="btn btn-lg"
              type="button"
              disabled={false}
              onClick={zoomOut}
            >
              <PiMagnifyingGlassMinusBold />
            </button>

            <button
              className="btn btn-lg"
              type="button"
              disabled={false}
              onClick={zoomIn}
            >
              <PiMagnifyingGlassPlusBold />
            </button>

            <button
              className="join-item btn btn-lg"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              <PiCaretLeftBold />
            </button>

            <button
              className="join-item btn btn-lg"
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              <PiCaretRightBold />
            </button>

            <div className="join-item bg-base-200 px-6 flex items-center">
              {pageNumber || (numPages ? 1 : "-")} / {numPages || "-"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
