import { useCreateMarkdownDoc } from '@/hooks/document/useCreateMarkdownDoc'
import { isEnableCreateNewDocState } from '@/recoil/recoilStates'
import { useRecoilValue } from 'recoil'

export function CreateNewDocButton (): JSX.Element {
  const createMarkdownDoc = useCreateMarkdownDoc()
  const isEnebleCreateNewDoc = useRecoilValue(isEnableCreateNewDocState)

  // create new markdown document
  async function handleClick (): Promise<void> {
    await createMarkdownDoc({
      title: 'New Document',
      content: ''
    })
  }

  return (
    // show tooltip if user cannot create more than 10 documents
    <div
      className={'w-full my-4' + (isEnebleCreateNewDoc ? '' : ' tooltip')}
      data-tip="Cannot create more than 10 documents"
    >
      <button
        className={
          'font-bold px-4 rounded btn btn-neutral w-full' +
          (isEnebleCreateNewDoc ? '' : ' btn-disabled')
        }
        onClick={() => { void handleClick() }}
        aria-label="create new document"
      >
        create New Document
      </button>
    </div>
  )
}
