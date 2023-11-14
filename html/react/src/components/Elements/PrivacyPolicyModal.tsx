export function PrivacyPolicyModal(): JSX.Element {
  return (
    <dialog id="privacy-policy-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <form method="dialog">
          <h3 className="font-bold text-lg">Privacy Policy</h3>
          <div>
            <h2
              id="1-collection-and-use-of-personal-information"
              className="font-bold mt-4"
            >
              1. Collection and Use of Personal Information
            </h2>
            <p>
              Our application collects the minimum necessary information to
              provide the following features:
            </p>
            <ul>
              <li>
                <strong>Use without login</strong>: You can upload images, which
                will be automatically deleted after 3 days. We also offer a
                feature to convert Markdown to PDF. The conversion is done on
                the server, but the data is not saved and is immediately
                discarded.
              </li>
              <li>
                <strong>Use with login</strong>: You can upload images, which
                will be automatically deleted after half a year. You can save up
                to 10 Markdown documents on the server. The PDF conversion
                feature is the same as when not logged in.
              </li>
            </ul>
            <h2
              id="2-protection-of-personal-information"
              className="font-bold mt-4"
            >
              2. Protection of Personal Information
            </h2>
            <p>
              We are committed to ensuring the security of your personal
              information. We take appropriate security measures to protect
              against unauthorized access to or unauthorized alteration,
              disclosure or destruction of data.
            </p>
            <h2
              id="3-provision-of-personal-information-to-third-parties"
              className="font-bold mt-4"
            >
              3. Provision of Personal Information to Third Parties
            </h2>
            <p>
              We do not share personal information with companies, organizations
              and individuals outside of our application.
            </p>
            <h2
              id="4-compliance-and-cooperation-with-regulatory-authorities"
              className="font-bold mt-4"
            >
              4. Compliance and Cooperation with Regulatory Authorities
            </h2>
            <p>
              We regularly review our compliance with our Privacy Policy. When
              we receive formal written complaints, we will contact the person
              who made the complaint to follow up.
            </p>
            <h2 id="5-changes" className="font-bold mt-4">
              5. Changes
            </h2>
            <p>
              Our Privacy Policy may change from time to time. We will not
              reduce your rights under this Privacy Policy without your explicit
              consent.
            </p>
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
