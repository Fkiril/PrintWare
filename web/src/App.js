import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import axios from 'axios';

const test = async (email) => {

  try {
    const res = await axios.get('hcmut-sso/get-user-id-by-email', {
      headers: {
        ContentType: 'application/json'
      },
      params: {
        email: email
      }
    });
  
    console.log(res);
  }
  catch (error) {
    console.log(error);
  }
}

function App() {
  return (
    <Router>
      <div>
        <form onSubmit={(e) => {
              e.preventDefault();
              test(e.target.email.value);
            }}>
          <input type="text" name="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </Router>
  );
}

export default App;
