import {SimpleMdeReact} from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "@/assets/css/editor.css";
import {useRecoilState, useRecoilValue} from "recoil";
import {type MarkdownDoc} from "@/types/document/MarkdownDoc";
import {
  currentAuthState,
  isDragOverState,
  markdownDocState,
  updatedTimeState,
} from "@/recoil/recoilStates";
import {useCallback, useEffect, useMemo} from "react";
import {useUpdateMarkdownDoc} from "@/hooks/document/useUpdateMarkdownDoc";
import {useLocalStorage} from "@uidotdev/usehooks";
import {mathButtonFunction} from "@/libs/MDEfunctions/MathButton";
import {pageBreakButton} from "@/libs/MDEfunctions/PageBreakButton";
import {useDebouncedCallback} from "use-debounce";

export function SimpleMarkdownEditor(): JSX.Element {
  const [markdownDoc, setMarkdownDoc] =
    useRecoilState<MarkdownDoc>(markdownDocState);
  const updateMarkdownDoc = useUpdateMarkdownDoc(markdownDoc);
  const [localStorageValue, setLocalStorageValue] = useLocalStorage(
    "MarkdownDocument",
    ""
  );
  const isLoggedIn = useRecoilValue<boolean>(currentAuthState);
  const isDragOver = useRecoilValue<boolean>(isDragOverState);
  const updatedTime = useRecoilValue<string>(updatedTimeState);

  // each 500ms after input, update document data
  const updateDocData = useDebouncedCallback(async () => {
    if (markdownDoc.id != null) void updateMarkdownDoc();
  }, 500);

  // load doc from local storage if not logged in
  useEffect(() => {
    if (isLoggedIn) return;
    // set new document to local storage if not exist
    if (
      localStorageValue === null ||
      localStorageValue === "" ||
      localStorageValue === undefined
    ) {
      setLocalStorageValue(JSON.stringify(markdownDoc));
      return;
    }
    // load document from local storage
    const mdDoc: MarkdownDoc = JSON.parse(localStorageValue);
    if (mdDoc != null) setMarkdownDoc(mdDoc);
  }, []);

  // set markdown doc by onchange function of editor
  const onChange = useCallback(
    (value: string) => {
      const updatedMdDoc = {...markdownDoc, content: value};
      setMarkdownDoc(updatedMdDoc);
      if (isLoggedIn) {
        void updateDocData();
      } else {
        setLocalStorageValue(JSON.stringify(updatedMdDoc));
      }
    },
    [markdownDoc]
  );

  // Option for SimpleMdeReact
  const options = useMemo(() => {
    return {
      spellChecker: false,
      hideIcons: ["guide", "fullscreen", "side-by-side", "image"],
      height: "70%",
      maxHeight: "65vh",
      toolbar: [
        "heading",
        "strikethrough",
        "code",
        "horizontal-rule",
        "link",
        "quote",
        "unordered-list",
        "table",
        {
          name: "math-inline",
          action: (editor: any) => {
            mathButtonFunction(editor, false);
          },
          className: "icon-inline-math",
          title: "math inline",
        },
        {
          name: "math-block",
          action: (editor: any) => {
            mathButtonFunction(editor, true);
          },
          className: "icon-block-math",
          title: "math block",
        },
        {
          name: "page-break",
          action: (editor: any) => {
            pageBreakButton(editor);
          },
          className: "icon-page-break",
          title: "page break",
        },
      ],
    } as any;
  }, []);

  return (
    <>
      <SimpleMdeReact
        className={`w-full p-1 ${isDragOver ? "-z-10" : ""}`}
        value={markdownDoc.content}
        onChange={onChange}
        options={options}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
        }}
      />
      {/* Autosave time */}
      <p className="block w-full text-right text-gray-400 text-xs pr-3 -mt-2">
        {isLoggedIn ? `auto-saved at: ${updatedTime}` : "　"}
      </p>
    </>
  );
}
