import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {MainPage} from "@/components/Layout/MainPage";
import {Login} from "@/components/Layout/Login";
import {Signup} from "./components/Layout/Signup";
import {EmailVerification} from "./components/Layout/EmailVerification";
import {SendPasswordResetLink} from "./components/Layout/SendPasswordResetLink";
import {ResetPassword} from "./components/Layout/ResetPassword";

export default function RouterComponent(): JSX.Element {
  return (
    <>
      <Router basename="/markedPDF">
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/send-password-reset"
            element={<SendPasswordResetLink />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
        </Routes>
      </Router>
    </>
  );
}
