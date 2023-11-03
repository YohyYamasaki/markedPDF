import {useRecoilValue} from "recoil";
import {pdfUrlState} from "@/recoil/recoilStates";
import {PdfLoadingOverlay} from "./PdfLoadingOverlay";

export function OldPdfView({isShow = false}: {isShow: boolean}): JSX.Element {
  const pdfUrl = useRecoilValue(pdfUrlState);

  return (
    <>
      <PdfLoadingOverlay />
      <div className={"mt-10 " + (isShow ? "" : "hidden")}>
        {pdfUrl !== null && (
          <iframe src={pdfUrl} className="w-full  h-[calc(100vh-90px)]" />
        )}
      </div>
    </>
  );
}
