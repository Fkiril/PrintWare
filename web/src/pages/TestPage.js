import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';


import useAuth from '../hooks/useAuth';
import { handleResponseError } from '../utils';

function TestPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [data, setData] = useState(null);

  const handleTestFunc = async (fileId) => {
    try {
      const response = await axios.patch('web-api/test', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          fileId: fileId
        }
      })
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
        handleTestFunc(e.target.fileId.value);
      }} method='get'>
        <input type="text" name="fileId" placeholder="File ID" required />
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
