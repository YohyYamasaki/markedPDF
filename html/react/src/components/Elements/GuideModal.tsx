import {ShowPrivacyPolicyButton} from "./buttons/ShowPrivacyPolicyButton";

export function GuideModal(): JSX.Element {
  return (
    <dialog id="guide-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form method="dialog">
          <h3 className="font-bold text-lg">User Guide</h3>
          <div className="pt-6">
            <h1 id="quick-guide" className="font-bold">
              Quick guide
            </h1>
            <ul className="list-disc list-inside">
              <li>Set the document title in the top navigation bar</li>
              <li>Edit your markdown document in the left pane</li>
              <li>Select style by “Style Selector”</li>
              <li>Click “Convert to PDF” to convert</li>
              <li>
                Download by using the browser default download button (chrome
                recommended)
              </li>
            </ul>
            <h1 id="features" className="font-bold mt-4">
              Features
            </h1>
            <ul className="list-disc list-inside">
              <li>Github-flavored markdown supported (mostly)</li>
              <li>You can put page breaks for PDF</li>
              <li>You can use inline / block math</li>
              <li>jpg/png images can be uploaded</li>
              <h2 id="features" className="font-bold mt-4">
                About image upload
              </h2>
              <p>
                Guest: The images will be automatically deleted after 3 days.
                Max. number of images is 20
              </p>
              <p>
                With sign-in: The image will be automatically deleted after half
                a year. Max. number of images is 20 per document
              </p>
              <p>(All images can be deleted by clicking 🗑️ button)</p>
            </ul>
            <h1 id="what-can-you-do-with-sign-in" className="font-bold mt-4">
              What can you do with Sign in
            </h1>
            <ul>
              <li>You can store up to 10 document</li>
              <li>You can store up to 20 images per document</li>
            </ul>
            {/* bottom buttons */}
            <div className="flex gap-2 w-full mt-8">
              <ShowPrivacyPolicyButton />
            </div>
          </div>
        </form>
      </div>

      {/* click out side to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
