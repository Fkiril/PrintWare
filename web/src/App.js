import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import axios from 'axios';

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
      </div>
    </Router>
  );
}

export default App;
