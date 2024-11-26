import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';


import useAuth from '../hooks/useAuth';
import { loginWithEmailAndPassword, logout, changePassword } from '../controller/HCMUT_SSO';
import LoginComponent from '../components/Login';

function TestPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [data, setData] = useState(null);

  const handleTestFunc = async (email, oldPassword, newPassword) => {
    try {
      changePassword(email, oldPassword, newPassword);
    } catch (error) {
      console.log('Error: ',error);
    }
  }

  return (
    <div>
      <LoginComponent />
      <h2>Test Page</h2>
      <br></br>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleTestFunc(e.target.email.value, e.target.oldPassword.value, e.target.newPassword.value);
      }}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="oldPassword" placeholder="Old Password" />
        <input type="password" name="newPassword" placeholder="New Password" />
        <button type="submit">Test</button>
      </form>
      <br></br>
      <div>
        {data ? (
          <div>
            <img src={data.url} alt="Image" style={{ width: '100%', height: 'auto' }} />
          </div>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default TestPage;
