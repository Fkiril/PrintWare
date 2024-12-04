import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [error, setError] = useState("");

  const handlePay = () => {
    if (!selectedPayment) {
      setError("Please select a payment method!");
    } else {
      setError("");
      navigate("/confirmation");
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Payment</h2>
      <div className="payment-methods">
        <div
          className={`payment-option ${
            selectedPayment === "Momo" ? "selected" : ""
          }`}
          onClick={() => setSelectedPayment("Momo")}
        >
          <input
            type="radio"
            name="payment"
            value="Momo"
            checked={selectedPayment === "Momo"}
            onChange={() => setSelectedPayment("Momo")}
          />
          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" />
          <span>Momo</span>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="actions">
        <button className="secondary-button" onClick={() => navigate("/order")}>
          Back
        </button>
        <button className="primary-button" onClick={handlePay}>
          Pay
        </button>
      </div>
    </div>
  );
};

export default Payment;