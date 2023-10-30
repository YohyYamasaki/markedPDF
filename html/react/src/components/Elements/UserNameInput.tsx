export function UserNameInput (): JSX.Element {
  return (
    <>
      <div className="flex">
        <input
          type="text"
          className="input input-bordered input-sm"
          placeholder="Name"
        />
        <button className="btn btn-primary btn-sm ml-2">Change</button>
      </div>
    </>
  )
}
