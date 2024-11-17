import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import useAuth from '../hooks/useAuth';
import { handleResponseError } from '../utils';

function TestPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [data, setData] = useState(null);

  const handleTestFunc = async (userName, userEmail, userPassword) => {
    try {
      const response = await axios.get('spso/test', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          name: userName,
          email: userEmail,
          password: userPassword
        }
      });
      setData(response.data);
    } catch (error) {
      console.log('Error: ',error);
    }
  }

  return (
    <div>
      <h2>Test Page</h2>
      <br></br>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleTestFunc(e.target.userName.value, e.target.userEmail.value, e.target.userPassword.value);
      }}>
        <input type="text" name="userName" placeholder="User name" required />
        <input type="email" name="userEmail" placeholder="User email" required />
        <input type="password" name="userPassword" placeholder="User password" required />
        <button type="submit">Test</button>
      </form>
      <br></br>
      <div>
        {data ? (
          <p>{JSON.stringify(data)}</p>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default TestPage;
