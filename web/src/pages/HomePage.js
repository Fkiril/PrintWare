import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {

  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('Request for sample data');
    axios.get('/web/sample-data', {
      headers: {
        'User-Agent': navigator.userAgent
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
