import {useEffect, useState} from "react";
import {Navbar} from "@/components/Elements/Navbar";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {isDragOverState, isEditModeState} from "@/recoil/recoilStates";
import {SimpleMarkdownEditor} from "../Elements/SimpleMarkdownEditor";
import {HtmlView} from "@/components/Elements/HtmlView";
import {ImageSelector} from "@/components/Elements/ImageSelector";
import {useCheckAuth} from "@/hooks/auth/useCheckAuth";
import {ConverToPdfButton} from "@/components/Elements/buttons/ConvertToPdfButton";
import {ShowStyleSelectButton} from "@/components/Elements/buttons/ShowStyleSelectButton";
import {ToggleViewButton} from "@/components/Elements/buttons/ToggleViewButton";
import SEO from "@/components/Elements/SEO";
import {useGetDocSummaryList} from "@/hooks/document/useGetDocSummaryList";
import {useGetUser} from "@/hooks/auth/useGetUser";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import {PdfView} from "@/components/Elements/PdfView";
import {PiCaretDoubleLeftBold} from "react-icons/pi";

export function MainPage(): JSX.Element {
  const setIsDragOver = useSetRecoilState<boolean>(isDragOverState);
  const isEditMode = useRecoilValue<boolean>(isEditModeState);
  const checkAuth = useCheckAuth();
  const getUser = useGetUser();
  const getDocSummaryList = useGetDocSummaryList();
  const [slidingState, setSlidingState] = useState({
    isPaneOpen: false,
  });

  // initialize application
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const isLoggedIn: boolean = await checkAuth();
      if (!isLoggedIn) return;
      await getUser();
      await getDocSummaryList(true);
    };
    void fetchData();

    // set markdown css
    const url = process.env.REACT_APP_ENV_URL ?? "default_url";
    if (url != null) {
      // set markdown css
      const mdCssLink = document.createElement("link");
      mdCssLink.rel = "stylesheet";
      mdCssLink.href = `${url}/src/markedPDF/styles/markdown.css`;
      document.head.appendChild(mdCssLink);
      // set pagebreak css
      const pageBreakCssLink = document.createElement("link");
      pageBreakCssLink.rel = "stylesheet";
      pageBreakCssLink.href = `${url}/src/markedPDF/styles/page-break.css`;
      document.head.appendChild(pageBreakCssLink);
    }
  }, []);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragOver(false);
  }

  return (
    <>
      <SEO
        title="markedPDF | Markdown to PDF Converter"
        description="An online Markdown editor with PDF converter. Supports basic Markdown features plus page breaks and image uploads, etc."
        name="markedPDF"
        type="website"
      />
      <div
        className="flex flex-col h-screen max-h-screen bg-base-300"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Navbar />
        <div className="flex flex-grow overflow-scroll no-scrollbar">
          {/* Left Pane */}
          <div className="flex-shrink-0 w-full sm:w-1/2 overflow-hidden py-1 border-r border-neutral-content bg-neutral-content">
            <div className="flex items-center">
              <ImageSelector />

              {/* open slider button */}
              <button
                className="h-10 w-fit pl-4 pr-2 bg-primary rounded-bl-full rounded-tl-full text-white font-bold flex justify-center items-center ml-auto shadow-md sm:hidden"
                onClick={() => {
                  setSlidingState({isPaneOpen: true});
                }}
              >
                <PiCaretDoubleLeftBold /> Compiled Doc
              </button>
            </div>

            <SimpleMarkdownEditor />
          </div>

          {/* Right Pane */}
          <div className="hidden sm:block flex-shrink-0 w-1/2 overflow-y-auto">
            <div className="absolute w-1/2 flex-shrink-0 flex flex-wrap pt-1 bg-neutral-content z-[1]">
              <ToggleViewButton />
              <ShowStyleSelectButton />
              <div className="lg:ml-auto mx-1 mb-1">
                <ConverToPdfButton />
              </div>
            </div>
            <HtmlView isShow={isEditMode} />
            <PdfView isShow={!isEditMode} />
          </div>

          {/* for smartphone */}
          <SlidingPane
            className="mt-14 sm:hidden bg-neutral-content"
            overlayClassName="some-custom-overlay-class"
            isOpen={slidingState.isPaneOpen}
            onRequestClose={() => {
              setSlidingState({isPaneOpen: false});
            }}
            width="100%"
          >
            <div className="fixed top-0 right-0 w-11/12 flex-shrink-0 flex flex-wrap pt-1 bg-neutral-content z-[1]">
              <div className="ml-auto">
                <ToggleViewButton />
              </div>
              <div className="mx-1 mb-1">
                <ConverToPdfButton />
              </div>
            </div>
            <HtmlView isShow={isEditMode} />
            <PdfView isShow={!isEditMode} />
          </SlidingPane>
        </div>
      </div>
    </>
  );
}
