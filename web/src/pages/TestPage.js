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
      const response = await axios.get('spso/test', {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          fileId: fileId
        }
      });
      console.log('Response: ', response.data);

      const reader = new FileReader();
      reader.onloadend = () => {
          const base64data = reader.result; // This is the base64 string
          console.log('Base64 data: ', base64data);
          localStorage.setItem(fileId, base64data); // Store it in localStorage
          setData({
            data: response.data,
            url: base64data
          }); // Set the image source to display
      };
      reader.readAsDataURL(response.data); // Convert Blob to base64
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
