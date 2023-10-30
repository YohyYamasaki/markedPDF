import { styleState } from '@/recoil/recoilStates'
import { type Styles } from '@/types/document/Styles'
import { useRecoilState } from 'recoil'

export function StyleSelectModal (): JSX.Element {
  const [style, setStyle] = useRecoilState<Styles>(styleState)

  return (
    <dialog id="style-select-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form method="dialog">
          <h3 className="font-bold text-lg">Select Document Style</h3>
          <div className="flex justify-end items-end gap-3 pt-6">
            <button
              className={style === 'notion-style' ? 'btn btn-disabled' : 'btn'}
              onClick={() => { setStyle('notion-style') }}
            >
              Notion-style
            </button>
            <button
              className={style === 'github-style' ? 'btn btn-disabled' : 'btn'}
              onClick={() => { setStyle('github-style') }}
            >
              Github-style
            </button>
          </div>
        </form>
      </div>

      {/* click out side to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
