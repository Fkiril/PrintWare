import React, { useState } from "react";
import "../../../Styles/Wallet.css";

const Wallet = () => {
  const [wallet, setWallet] = useState({
    walletId: "WALLET12345",
    ownerId: "STUDENT001",
    availablePages: 100,
    createdAt: "2024-01-01",
    updatedAt: "2024-12-20",
    lastSemesterUpdate: "2024-09-01",
  });

  const [depositAmount, setDepositAmount] = useState("");

  const handleDeposit = () => {
    if (depositAmount) {
      setWallet((prev) => ({
        ...prev,
        availablePages: prev.availablePages + parseInt(depositAmount, 10),
        updatedAt: new Date().toISOString().split("T")[0],
      }));
      setDepositAmount("");
    }
  };

  return (
    <div className="wallet-container">
      <h1 className="wallet-title">Student Wallet</h1>
      <div className="wallet-info">
        <p><strong>Wallet ID:</strong> {wallet.walletId}</p>
        <p><strong>Owner ID:</strong> {wallet.ownerId}</p>
        <p><strong>Available Pages:</strong> {wallet.availablePages}</p>
        <p><strong>Created At:</strong> {wallet.createdAt}</p>
        <p><strong>Last Updated:</strong> {wallet.updatedAt}</p>
        <p><strong>Last Semester Update:</strong> {wallet.lastSemesterUpdate}</p>
      </div>
      <div className="wallet-actions">
        <h2>Deposit Pages</h2>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter pages to deposit"
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>
    </div>
  );
};

export default Wallet;