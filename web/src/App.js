import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import axios from 'axios';
import { loginWithGoogleAccount } from './controller/HCMUT_SSO.js';

const test = async (paramUserId, paramType, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('hcmut-sso/upload-picture', formData, {
      headers: {
        ContentType: 'form-data'
      },
      params: {
        userId: paramUserId,
        type: paramType
      }
    });
  
    console.log(res);
  }
  catch (error) {
    console.log(error);
  }
}


function App() {
  const [User, setUser] = useState(null);
  const [CustomToken, setCustomToken] = useState(null);
  const [GoogleAccessToken, setGoogleAccessToken] = useState(null);

  return (
    <Router>
      <div>
        <form onSubmit={(e) => {
              e.preventDefault();
              test(e.target.userId.value, e.target.type.value, e.target.file.files[0]);
            }}>
          <input type="text" name="userId" placeholder="userId" />
          <input type="text" name="type" placeholder="type" />
          <input type="file" name="file" />
          <button type="submit">Submit</button>
        </form>

        <br/>

        <button onClick={async (e) => {
          e.preventDefault();
          const result = await loginWithGoogleAccount();

          console.log(result);

          setUser(result.user);
          setCustomToken(result.customToken);
          setGoogleAccessToken(result.googleAccessToken);
        }}>
          Login with Google
        </button>

        {User && <p>Username: {User.name}</p>}
        {CustomToken && <p>Custom Token: {CustomToken}</p>}
        {GoogleAccessToken && <p>Google Access Token: {GoogleAccessToken}</p>}
      </div>
    </Router>
  );
}

export default App;
