import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Modal, Paper } from '@mui/material';
import LoadingSpinner from '../ui/Loading/LoadingSpinner';

import axios from 'axios';
import { sendCustomPasswordResetEmail, resetPassword } from '../../controller/HCMUT_SSO.js';

export default function Signup({ onClose }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [idstudent, setidstudent] = useState('');
  const [Faculty, setFaculty] = useState('');
  const [phone, setPhone] = useState(''); // Thêm state cho số điện thoại
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false); 

  const Signup = async () => {
    let convert_username = username.toLowerCase();
    let convert_email = email.toLowerCase();
    try {
      setLoading(true);

      if (!password || password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (!convert_username || !convert_email || !password || !confirmPassword || !idstudent || !Faculty || !phone) {
        setError('All fields are required');
        return;
      }

      const formData = new FormData();
      formData.append('userName', convert_username);
      formData.append('email', convert_email);
      formData.append('password', password);
      formData.append('hcmutId', idstudent);
      formData.append('faculty', Faculty);
      formData.append('phoneNum', phone);
      
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/register`, formData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      const result = response.data;

      if (result.ok) {
        setSuccess('Account created successfully!');
        setError('');

        // Close modal after 1 second
        setTimeout(() => {
          setSuccess('');
          setIsModalOpen(false);
          onClose(); // Call onClose to close the signup dialog
        }, 1000);
      } else {
        setError(result.message || 'Failed to create account');
      }
    }
    catch (error) {
      setError('Failed to connect to the server');
    }finally {
      setLoading(false); // Kết thúc loading
    }
  }

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      const result = await sendCustomPasswordResetEmail(email);

      if (result.ok) {
        setSuccess('Verification code sent to your email.');
        setError('');
        setIsModalOpen(true);  // Open verification modal
      } else {
        console.error('Error:', result.message);
        setError(result.message || 'Failed to request verification code');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server');
    }finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      const result = await resetPassword(verificationCode, email);

      if (result.ok) {
        Signup();
      } else {
        console.error('Error:', result.message);
        setError(result.message || 'Failed to verify code');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server');
    }
    finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 3 }}></Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="ID Student"
          value={idstudent}
          onChange={(e) => setidstudent(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Faculty"
          value={Faculty}
          onChange={(e) => setFaculty(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}

        <Button variant="contained" color="primary" onClick={handleSendCode} fullWidth>
          Create Account
        </Button>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="verification-modal-title"
        aria-describedby="verification-modal-description"
      >
        <Paper sx={{ p: 4, maxWidth: '400px', margin: 'auto', mt: '10%', textAlign: 'center' }}>
          <Typography id="verification-modal-title" variant="h6" component="h2">
          {loading ? <LoadingSpinner /> : 'Enter Verification Code'}
          </Typography>
          <TextField
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}
          <Button variant="contained" color="primary" onClick={handleVerifyCode} fullWidth>
          {loading ? <LoadingSpinner /> : 'Verify Code'}
          </Button>
        </Paper>
      </Modal>
    </>
  );
}
