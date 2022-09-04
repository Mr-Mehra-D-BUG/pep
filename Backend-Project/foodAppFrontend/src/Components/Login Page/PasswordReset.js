import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useHistory } from "react-router-dom";
function PasswordReset() {
  const [password, passwordSet] = useState("");
  const [passwordCnf, passwordCnfSet] = useState("");
  const { resetPassEmail, setResetEmail, otpPassEmail, setOtpPassEmail } =
    useAuth();
  const history = useHistory();

  // email,otp
  // ye send karega request to your reset password
  const resetPassword = async () => {
    // i will send evrything to backend resetPage for reset password
    // if once pass set then reset  setOtpPassEmail : null  setResetEmail : null
    try {
      console.log(password);
      console.log(passwordCnf);
      let res = await axios.patch("/api/v1/auth/restPassword", {
        otp: otpPassEmail,
        email: resetPassEmail,
        password: password,
        ConfirmPassword: passwordCnf,
      });
      console.log(res);
      if (res.status == 201) {
        alert("password changed successfully");
        setOtpPassEmail(null);
        setResetEmail(null);
        history.push("/login"); // to the login page when all done
        setOtpPassEmail(null);
        setResetEmail(null);
      }
    } catch (err) {
      console.log(err.message);
      
      if (err.message == "Request failed with status code 500") {
        alert("Internal server error");
      }
      else if (err.message == "Request failed with status code 401") {
        alert("Invalid otp");
      }
     else if (err.message == "Request failed with status code 403") {
        alert("Otp expired");
      }
      setOtpPassEmail(null);
      setResetEmail(null);
    }
  };

  return (
    <>
      {resetPassEmail && otpPassEmail ? (
        <div className="container-grey">
          <div className="form-container">
            <div className="h1Box">
              <h1 className="h1">RESET PASSWORD</h1>
              <div className="line"></div>
            </div>
            <div className="loginBox">
              <div className="entryBox">
                <div className="entryText">Password</div>
                <input
                  className="password input"
                  type="text"
                  value={password}
                  onChange={(e) => passwordSet(e.target.value)}
                />
              </div>
              <div className="entryBox">
                <div className="entryText">Confirm Password</div>
                <input
                  className="password input"
                  type="text"
                  value={passwordCnf}
                  onChange={(e) => passwordCnfSet(e.target.value)}
                />
              </div>
              <button className="loginBtn  form-button" onClick={resetPassword}>
                Reset
              </button>
            </div>
          </div>
        </div>
      ) : (
        <h2 className="container-grey">First go to your Forget Password</h2>
      )}
    </>
  );
}

export default PasswordReset;
