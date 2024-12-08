import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Modal, Paper, setRef } from '@mui/material';
import LoadingSpinner from '../ui/Loading/LoadingSpinner';

import axios from 'axios';
import { sendCustomPasswordResetEmail, resetPassword } from '../../controllers/HCMUT_SSO.js';
import { CustomerModelKeys } from '../../models/User.js';

export default function Signup({ onClose }) {
  const [ userName, setUserName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ hcmutId, setHcmutId ] = useState('');
  const [ faculty, setFaculty ] = useState('');
  const [ phoneNum, setPhoneNum ] = useState(''); // Thêm state cho số điện thoại

  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ verificationCode, setVerificationCode ] = useState('');
  const [ loading, setLoading ] = useState(false); 

  const Signup = async () => {
    let convert_username = userName.toLowerCase();
    let convert_email = email.toLowerCase();
    try {
      setLoading(true);

      if (!password || password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (!convert_username || !convert_email || !password || !confirmPassword || !hcmutId || !faculty || !phoneNum) {
        setError('All fields are required');
        return;
      }

      const formData = new FormData();
      formData.append(CustomerModelKeys.userName, convert_username);
      formData.append(CustomerModelKeys.email, convert_email);
      formData.append('password', password);
      formData.append(CustomerModelKeys.hcmutId, hcmutId);
      formData.append(CustomerModelKeys.faculty, faculty);
      formData.append(CustomerModelKeys.phoneNum, phoneNum);
      
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/register`, formData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = response.data;

      setSuccess(result.message);
      setError('');

      // Close modal after 1 second
      setTimeout(() => {
        setSuccess('');
        setIsModalOpen(false);
        onClose(); // Call onClose to close the signup dialog
      }, 1000);
    }
    catch (error) {
      const response = error.response;
      if (response && response.data && response.data.message) {
        setError(response.data.message);
      } else {
        setError('Failed to connect to the server');
      }
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

      setSuccess(result.message);
      setError('');
      setIsModalOpen(true);  // Open verification modal
    } catch (error) {
      console.error('Error when send code:', error);
      setError(error.message || 'Failed to connect to the server');
    }finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      const result = await resetPassword(verificationCode, email);

      setSuccess(result.message);
      setError('');

      // Close modal after 1 second
      setTimeout(() => {
        setSuccess('');
        setIsModalOpen(false);
        onClose(); // Call onClose to close the signup dialog
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to connect to the server');
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
          label="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
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
          value={hcmutId}
          onChange={(e) => setHcmutId(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="phoneNum"
          value={phoneNum}
          onChange={(e) => setPhoneNum(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {success && <Typography color="success" sx={{ mb: 2 }}>{success}</Typography>}

        <Button variant="contained" color="primary" onClick={Signup} fullWidth>
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
