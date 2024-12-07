import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import LoadingSpinner from '../ui/Loading/LoadingSpinner';
export default function Forget({ open, onClose }) {
  const [step, setStep] = useState('request'); // Các bước: 'request', 'reset'
  const [emailOrusername, setEmailOrUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  const handleRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/email/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrusername }),
      });
      const result = await response.json();
      if (response.ok) {
        setError('');
        setSuccess('Verification code sent to your email.');
        setStep('reset');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleVerifyAndReset = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/email/verify-and-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrusername,
          verificationCode,
          newPassword,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setError('');
        setSuccess('Password reset successful. Redirecting to login...');
        setTimeout(() => {
          onClose();
          window.location.href = '/';
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {step === 'request' && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter your email or username to reset your password
              </Typography>
              <TextField
                label="Email or Username"
                value={emailOrusername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
          {step === 'reset' && (
            <>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enter the verification code and your new password
              </Typography>
              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Close</Button>
        {step === 'request' && (
          <Button variant="contained" color="primary" onClick={handleRequest}>
            {loading ? <LoadingSpinner /> : 'Submit'}
          </Button>
        )}
        {step === 'reset' && (
          <Button variant="contained" color="primary" onClick={handleVerifyAndReset}>
            {loading ? <LoadingSpinner /> : 'Reset Password'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}