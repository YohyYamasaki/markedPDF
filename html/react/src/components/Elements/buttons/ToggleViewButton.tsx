import {useConvertHtmlToPdf} from "@/hooks/document/useConvertHtmlToPdf";
import {
  htmlBodyState,
  isEditModeState,
  pdfUrlState,
  toggleViewButtonState,
} from "@/recoil/recoilStates";
import {PiArrowsClockwise} from "react-icons/pi";
import {useRecoilState, useRecoilValue} from "recoil";

export function ToggleViewButton(): JSX.Element {
  const [isEditMode, setIsEditMode] = useRecoilState<boolean>(isEditModeState);
  const pdfUrl = useRecoilValue<string | null>(pdfUrlState);
  const htmlBody = useRecoilValue<string>(htmlBodyState);

  const [viewSwitchText, setViewButtonText] = useRecoilState<string>(
    toggleViewButtonState
  );
  const convertHtmlToPdf = useConvertHtmlToPdf();

  // toggle view and if pdfUrl is null, convert html to pdf
  async function toggleView(): Promise<void> {
    setIsEditMode(!isEditMode);
    isEditMode ? setViewButtonText("Edit view") : setViewButtonText("PDF view");
    if (pdfUrl === null) await convertHtmlToPdf(htmlBody);
  }

  return (
    <button
      className="btn btn-outline btn-sm normal-case font-bold"
      onClick={() => {
        void toggleView();
      }}
      aria-label="toggle view"
    >
      <PiArrowsClockwise />
      {viewSwitchText}
    </button>
  );
}
