import { useGetDocSummaryList } from '@/hooks/document/useGetDocSummaryList'
import { useUpdateMarkdownDoc } from '@/hooks/document/useUpdateMarkdownDoc'
import { markdownDocState } from '@/recoil/recoilStates'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useRecoilState } from 'recoil'
import { useDebouncedCallback } from 'use-debounce'

export function DocTitleInput (): JSX.Element {
  const [markdownDoc, setMarkdownDoc] =
    useRecoilState<MarkdownDoc>(markdownDocState)
  const getDocSummaryList = useGetDocSummaryList()
  const updateMarkdownDoc = useUpdateMarkdownDoc(markdownDoc)
  const LocalStorageValue = useLocalStorage(
    'MarkdownDocument',
    ''
  )
  const setLocalStorageValue = LocalStorageValue[1]

  // handle title change and update doc state
  function handleTitleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const newDoc: MarkdownDoc = { ...markdownDoc, title: e.target.value }
    setLocalStorageValue(JSON.stringify(newDoc))
    setMarkdownDoc(newDoc)
    void debouncedUpdateDocData()
  }

  // each 500ms after input, update document data
  const debouncedUpdateDocData = useDebouncedCallback(async () => {
    if (markdownDoc.id != null) {
      await updateMarkdownDoc()
      await getDocSummaryList(false)
    }
  }, 500)

  return (
    <input
      type="text"
      placeholder="Document Title"
      value={markdownDoc.title}
      className="input input-sm w-full max-w-4xl mx-auto mr-0 md:mr-8 bg-neutral-focus focus:border-neutral-content text-neutral-content font-bold text-base"
      onChange={handleTitleChange}
    />
  )
}
