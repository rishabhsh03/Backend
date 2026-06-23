import { useState, useEffect } from "react";
import { sendotp } from "../../Backend/controller/user";
function Otpform() {
  const [formData, setFormData] = useState({
    otp:"", 
    phone_no: ""
  });
  const[phone, setPhone] = useState("");
  const[otp, setOtp] = useState("");
  const[showOtpField, setShowOtpFiled]  = useState("");

  <input
  type = "text"
  placeholder = "Enter Phone Number"
  value = {phone}
  onChange = {(e) => setPhone(e.target.value)}
  />
    <button onclick={sendotp}>
        
    </button>
 