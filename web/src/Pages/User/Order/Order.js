import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import "./styleorder.css";

const Order = () => {
  const [documents, setDocuments] = useState([
    { name: "policy.pdf", size: "20 MB", price: 2000, copies: 2 },
    { name: "tailieu.pdf", size: "20 MB", price: 2000, copies: 2 },
  ]);
  const [printerLocation, setPrinterLocation] = useState("BK.B6 - 112");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const updateCopies = (index, change) => {
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index
          ? { ...doc, copies: Math.max(1, doc.copies + change) }
          : doc
      )
    );
  };

  // eslint-disable-next-line no-unused-vars
  const totalPrice = documents.reduce(
    (sum, doc) => sum + doc.price * doc.copies,
    0
  );

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handlePrinterChange = (location) => {
    setPrinterLocation(location);
    setPopupVisible(false);
  };

  const handleNext = () => {
    navigate("/payment");
  };

  return (
    <div className="order-container">
      <h2>Order Confirmation</h2>
      <div className="printer-location">
        <span>Printer location: {printerLocation}</span>
        <FaCog className="settings-icon" onClick={togglePopup} />
      </div>
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Select Printer Location</h3>
            <div className="popup-buttons">
              <button
                className="popup-button"
                onClick={() => handlePrinterChange("BK.B6 - 113")}
              >
                BK.B6 - 113
              </button>
              <button
                className="popup-button"
                onClick={() => handlePrinterChange("BK.B6 - 114")}
              >
                BK.B6 - 114
              </button>
              <button
                className="popup-button"
                onClick={() => handlePrinterChange("BK.B6 - 115")}
              >
                BK.B6 - 115
              </button>
              <button
                className="popup-button"
                onClick={() => handlePrinterChange("BK.B6 - 115")}
              >
                BK.B6 - 116
              </button>
            </div>
            <button className="close-popup" onClick={togglePopup}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className="order-content">
        <table className="order-table">
        <thead>
          <tr>
            <th>Document List</th>
            <th>Copies</th> {/* Giữ lại cột Copies */}
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr key={index}>
              <td>{doc.name} ({doc.size})</td>
              <td>
                <button onClick={() => updateCopies(index, -1)}>-</button>
                {doc.copies}
                <button onClick={() => updateCopies(index, 1)}>+</button>
              </td>
            </tr>
          ))}
        </tbody>

        </table>
        <div className="invoice">
        <h3>Invoice</h3>
            <div className="invoice-item">
              <span><strong>Total Prints:</strong> {documents.reduce((sum, doc) => sum + doc.copies, 0)}</span>
            </div>
            <br></br>
            <div className="invoice-item">
              <span><strong>Total Prints Remaining:</strong> {/* Add calculation logic */}</span>
            </div>
            <br></br>
            <div className="invoice-item">
              <span><strong>Expected Completion Time:</strong> {/* Add estimation logic */}</span>
            </div>
          <button className="primary-button" onClick={handleNext}>
            Place an order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
