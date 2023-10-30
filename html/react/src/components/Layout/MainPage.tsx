import { useEffect } from 'react'
import { Navbar } from '@/components/Elements/Navbar'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isDragOverState, isEditModeState } from '@/recoil/recoilStates'
import { PdfView } from '@/components/Elements/PdfView'
import { SimpleMarkdownEditor } from '../Elements/SimpleMarkdownEditor'
import { HtmlView } from '@/components/Elements/HtmlView'
import { ImageSelector } from '@/components/Elements/ImageSelector'
import { useCheckAuth } from '@/hooks/auth/useCheckAuth'
import { ConverToPdfButton } from '@/components/Elements/buttons/ConvertToPdfButton'
import { ShowStyleSelectButton } from '@/components/Elements/buttons/ShowStyleSelectButton'
import { ToggleViewButton } from '@/components/Elements/buttons/ToggleViewButton'
import SEO from '@/components/Elements/SEO'
import { useGetDocSummaryList } from '@/hooks/document/useGetDocSummaryList'
import { useGetUser } from '@/hooks/auth/useGetUser'

export function MainPage (): JSX.Element {
  const setIsDragOver = useSetRecoilState<boolean>(isDragOverState)
  const isEditMode = useRecoilValue<boolean>(isEditModeState)
  const checkAuth = useCheckAuth()
  const getUser = useGetUser()
  const getDocSummaryList = useGetDocSummaryList()

  // initialize application
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const isLoggedIn: boolean = await checkAuth()
      if (!isLoggedIn) return
      await getUser()
      await getDocSummaryList(true)
    }
    void fetchData()
  }, [])

  function handleDragOver (e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave (e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleDrop (e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragOver(false)
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
          <div className="flex-shrink-0 w-1/2 overflow-hidden py-1 border-r border-neutral-content bg-neutral-content">
            <ImageSelector />
            <SimpleMarkdownEditor />
          </div>

          {/* Right Pane */}
          <div className="flex-shrink-0 w-1/2 overflow-y-auto">
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
        </div>
      </div>
    </>
  )
}
