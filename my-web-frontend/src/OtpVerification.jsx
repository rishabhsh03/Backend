import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OtpVerification() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(true);

  const navigate = useNavigate();

  const generateOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setShowOtpField(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            otp,
          }),
        }
      );

    

      if (response.ok) {
        alert("OTP Verified");
        navigate("/OtpVerification");
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={generateOtp}>
        Generate OTP
      </button>

      {showOtpField && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={verifyOtp}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

export default OtpVerification;