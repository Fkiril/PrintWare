import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import useAuth from '../hooks/useAuth';
import { handleResponseError } from '../utils';

function HomePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [data, setData] = useState(null);

  const handleFetchSampleData = async (id) => {
    try {
      const response = await axios.get('web-api/sample-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          id: id
        }
      });
      setData(response.data);
    } catch (error) {
      console.log('Error fetching data: ',error);

      if (error.response) {
        handleResponseError(error, navigate);
      }
    }
  }

  return (
    <div>
      <h2>Home Page</h2>
      <p>This is the home page of the web application.</p>
      <br></br>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleFetchSampleData(e.target.id.value);
      }}>
        <label htmlFor="id">ID:</label>
        <input type="text" id="id" name="id" />
        <button type="submit">Fetch Data</button>
      </form>
      <br></br>
      <div>
        {data ? (
          <>
            {data.map(item => (
              <div key={item.id}>
                <p>{item.message}</p>
                <p>{item.date}</p>
              </div>
            ))}
          </>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default HomePage;
