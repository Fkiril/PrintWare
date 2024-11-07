import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../hooks/useAuth.js';

function HomePage() {
  const { token } = useAuth();

  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('Request for sample data');
    axios.get('/web-api/sample-data', {
      headers: {
        'authentication': token
      }
    })
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data: ',error));
  }, []);

  return (
    <div>
      <h2>Home Page</h2>
      <p>This is the home page of the web application.</p>
      <div>
        {data ? <p>{data.message} - {data.date}</p> : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default HomePage;
