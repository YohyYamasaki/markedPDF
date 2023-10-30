import { markdownDocState } from '@/recoil/recoilStates'
import { type MarkdownDoc } from '@/types/document/MarkdownDoc'
import { useEffect, useMemo } from 'react'
import { type FileWithPath, useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { useRecoilValue } from 'recoil'

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderWidth: 4,
  borderStyle: 'dashed',
  borderColor: 'rgba(0, 0, 0, 0.2)',
  outline: 'none',
  transition: 'border .2s ease-in-out',
  height: '60px',
  background: 'rgba(255, 255, 255, 0.7)',
  position: 'relative',
  top: '2.5px',
  boxSizing: 'border-box',
  margin: '12px 0',
  cursor: 'pointer'
}

const focusedStyle: React.CSSProperties = {
  borderColor: 'rgba(0, 0, 0, 0.2)'
}

const acceptStyle: React.CSSProperties = {
  borderColor: 'rgba(70,96,247, 0.9)'
}

const rejectStyle: React.CSSProperties = {
  borderColor: '#ff1744'
}

export function DropZone ({ onDrop }: any): JSX.Element {
  const {
    acceptedFiles,
    fileRejections,
    getInputProps,
    getRootProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    noKeyboard: true,
    multiple: false
  })
  const markdownDoc = useRecoilValue<MarkdownDoc>(markdownDocState)

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  )

  // drop accepted
  useEffect(() => {
    if (acceptedFiles != null) {
      onDrop?.(acceptedFiles)
      acceptedFiles.splice(0)
    }
  }, [acceptedFiles])

  // drop rejected
  useEffect(() => {
    fileRejections.map(({ errors }: { file: FileWithPath, errors: any }) =>
      toast.error(`${errors[0].message}`)
    )
  }, [fileRejections])

  return (
    <>
      {markdownDoc.images.length < 20
        ? (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p className={'font-bold text-lg text-gray-500 leading-[52px]'}>
            Drop jpg/png here, or click to select file
          </p>
        </div>
          )
        : (
        <p className={'font-bold text-sm text-center text-gray-400'}>
          Maximum number of images reached (20 images)
        </p>
          )}
    </>
  )
}
