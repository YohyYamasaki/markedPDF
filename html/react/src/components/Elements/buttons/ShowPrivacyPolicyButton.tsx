export function ShowPrivacyPolicyButton (): JSX.Element {
  function showPrivacyPolicy (): void {
    const dialogElement = document.getElementById('privacy-policy-modal')
    if (dialogElement instanceof HTMLDialogElement) {
      dialogElement.showModal()
    }
  }

  return (
    <>
      <button
        className="btn btn-sm block flex-1 normal-case"
        onClick={showPrivacyPolicy}
        aria-label="show privacy policy"
      >
        Privacy Policy
      </button>
    </>
  )
}
