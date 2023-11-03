import {useRecoilState, useRecoilValue} from "recoil";
import {
  htmlBodyState,
  markdownDocState,
  styleState,
} from "@/recoil/recoilStates";
import {type MarkdownDoc} from "@/types/document/MarkdownDoc";
import {useEffect, useRef} from "react";
import {useDebounce} from "@uidotdev/usehooks";
import DOMPurify from "dompurify";
import {type Styles} from "@/types/document/Styles";
import "katex/dist/katex.min.css";

// Import the necessary modules from html-to-react
import HtmlToReact from "html-to-react";
const HtmlToReactParser = HtmlToReact.Parser;

export function HtmlView({isShow = false}: {isShow: boolean}): JSX.Element {
  const markdownDoc = useRecoilValue<MarkdownDoc>(markdownDocState);
  const [htmlBody, setHtmlBody] = useRecoilState<string>(htmlBodyState);
  const debouncedMarkdownDoc = useDebounce<MarkdownDoc>(markdownDoc, 50);
  const workerRef = useRef<Worker | null>(null);
  const style = useRecoilValue<Styles>(styleState);

  const htmlBodyHeader = `
  <div class="markdown-body ${style}">  
  ${
    markdownDoc.title !== ""
      ? '<h1 className="doc-title">' + markdownDoc.title + "</h1>"
      : ""
  }
  `;

  // Initialize the worker
  useEffect(() => {
    // Initialize the worker if it's not already initialized
    if (workerRef.current == null) {
      workerRef.current = new Worker(
        new URL("@/libs/markdownWorker.ts", import.meta.url),
        {type: "module"}
      );
      // Listen for messages from the worker and update the state
      workerRef.current.addEventListener("message", (event) => {
        const html = event.data as string;
        const cleanHtml = DOMPurify.sanitize(html);
        setHtmlBody(htmlBodyHeader + cleanHtml + "</div>");
      });
    }
    // Send markdown content to the worker for processing
    workerRef.current?.postMessage(debouncedMarkdownDoc.content);
    // Clean up the worker when the component is unmounted
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [debouncedMarkdownDoc, style]);

  // set markdown css and page break css
  useEffect(() => {
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

  // Create an instance of the parser
  const parser = HtmlToReactParser();

  return (
    <>
      <div
        id="compiled-doc"
        className={"bg-white mt-10 p-4 " + (isShow ? "" : "hidden")}
      >
        {/* Parse and render the HTML string */}
        {parser.parse(htmlBody)}
      </div>
    </>
  );
}
