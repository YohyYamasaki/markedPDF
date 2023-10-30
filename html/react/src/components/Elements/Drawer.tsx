import { docSummaryListState } from '@/recoil/recoilStates'
import { type DocumentSummary } from '@/types/document/DocumentSummary'
import { useRecoilValue } from 'recoil'
import { useGetMarkdownDoc } from '@/hooks/document/useGetMarkdownDoc'
import { CreateNewDocButton } from './buttons/CreateNewDocButton'
import { DocSelectButton } from './buttons/DocSelectButton'
import { UserInfoButton } from './buttons/UserInfoButton'
import { DocDeleteModal } from './DocDeleteModal'

export function Drawer (): JSX.Element {
  const documentSummaryList =
    useRecoilValue<DocumentSummary[]>(docSummaryListState)
  const getMarkdownDoc = useGetMarkdownDoc()

  // fetch document
  function selectDocument (id: number): () => void {
    return () => { if (id !== 0) void getMarkdownDoc(id) }
  }

  return (
    <>
      <div className="p-4 w-80 min-h-full bg-base-200 text-base-content">
        {/* user setting button */}
        <UserInfoButton />

        {/* create new document button */}
        <CreateNewDocButton />

        {/* Document list */}
        <ul className="menu text-base-content p-0">
          <li className="max-w-full">
            <h2 className="menu-title">Documents</h2>
            <ul className="max-w-full">
              {/* Document list */}
              {documentSummaryList.map((docSummary, index) => (
                <li className="mr-2" key={index}>
                  <DocSelectButton
                    id={docSummary.id}
                    title={docSummary.title}
                    onClick={selectDocument(docSummary.id)}
                    isShowDeleteBtn={documentSummaryList.length !== 1}
                  />
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      {/* Document delete modal */}
      {documentSummaryList.map((docSummary, index) => (
        <DocDeleteModal
          key={index}
          id={docSummary.id}
          title={docSummary.title}
        />
      ))}
    </>
  )
}
