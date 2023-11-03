import {useRecoilState, useRecoilValue} from "recoil";
import {Navbar} from "@/components/Elements/Navbar";
import {useSignupErrorState, useSignupInputState} from "@/recoil/recoilStates";
import {type SignupInput} from "@/types/auth/SignupInput";
import {FaCircleExclamation} from "react-icons/fa6";
import {type SignupError} from "@/types/auth/SignupError";
import {useSignup} from "@/hooks/auth/useSignup";
import SEO from "../Elements/SEO";

export function Signup(): JSX.Element {
  const [signupInput, setSignupInput] =
    useRecoilState<SignupInput>(useSignupInputState);
  const signupError = useRecoilValue<SignupError>(useSignupErrorState);
  const signup = useSignup(signupInput);

  // Input handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const {name, value} = e.target;
    setSignupInput((prevSignupInput) => ({
      ...prevSignupInput,
      [name]: value,
    }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    void signup();
  }

  return (
    <>
      <SEO
        title="markedPDF | Markdown to PDF Converter"
        description="An online Markdown editor with PDF converter. Supports basic Markdown features plus page breaks, image uploads, math supports, etc."
        name="markedPDF"
        type="website"
      />

      <Navbar />
      <div className="relative flex flex-col px-4 justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 max-w-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-700">
            Sign up
          </h1>
          {/* Error Message */}
          {signupError.email.length > 0 ||
          signupError.name.length > 0 ||
          signupError.password.length > 0 ? (
            <div className="my-4 alert alert-error block">
              <div className="flex">
                <FaCircleExclamation />
                <p className="ml-2">Sign up Error:</p>
              </div>
              {Object.keys(signupError).map((key) =>
                signupError[key as keyof typeof signupError].map(
                  (message, index) => (
                    <span
                      key={`${key}-${index}`}
                      className="block label-text-alt font-bold"
                    >
                      {message}
                    </span>
                  )
                )
              )}
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Email input */}
            <div>
              <label className="label">
                <span className="text-base label-text">Email</span>
              </label>
              <input
                type="text"
                name="email"
                placeholder="Email Address"
                className="w-full input input-bordered"
                value={signupInput.email}
                onChange={handleInputChange}
              />
            </div>
            {/* User Name input */}
            <div>
              <label className="label">
                <span className="text-base label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                className="w-full input input-bordered"
                value={signupInput.name}
                onChange={handleInputChange}
              />
            </div>
            {/* Password input */}
            <div>
              <label className="label">
                <span className="text-base label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="w-full input input-bordered"
                value={signupInput.password}
                onChange={handleInputChange}
              />
            </div>
            {/* Password confirmation input */}
            <div>
              <label className="label">
                <span className="text-base label-text">
                  Password Confirmation
                </span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Enter Password"
                className="w-full input input-bordered"
                value={signupInput.password_confirmation}
                onChange={handleInputChange}
              />
            </div>

            <div className="pt-4">
              <button className="btn btn-block">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
