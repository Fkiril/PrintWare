import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import axios from 'axios';
function App() {
  const [event, setEvent] = React.useState();
  const [data, setData] = React.useState(null);

  const enroll = async (userId) => {
    const newEvent = new EventSource(`http://localhost:3456/enroll-events?userId=${userId}`);
    
    newEvent.addEventListener('printTaskCompleted', (e) => {
      console.log(e.data);
    });

    newEvent.onmessage = (e) => {
      console.log("onmessage: ", e);
    };

    newEvent.onerror = (e) => {
      console.log('onerror: ', e);
    };

    newEvent.onopen = (e) => {
      console.log('onopen: ', e);
    }

    setEvent(newEvent);
  }

  const uploadPicture = async (paramFile, paramUserId, paramType) => {
    try {
      const formData = new FormData();
      formData.append('file', paramFile);

      const res = await axios.post('hcmut-sso/upload-picture', formData, {
        method: 'POST',
        headers: {
          
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

  const getPicture = async (paramUserId, paramType) => {
    try {
      const res = await axios.get('hcmut-sso/get-picture', {
        method: 'GET',
        headers: {
        },
        params: {
          userId: paramUserId,
          type: paramType
        },
        responseType: 'arraybuffer'
      });
    
      console.log(res);

      const imgData = btoa(String.fromCharCode.apply(null, new Uint8Array(res.data)));
      const imgType = res.headers.getContentType();
      setData(`data:${imgType};base64,${imgData}`);
    }
    catch (error) {
      console.log(error);
      setData(null);
    }
  }

  return (
    <Router>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          uploadPicture(e.target.file.files[0], e.target.userId.value, e.target.type.value);
        }}>
          <input type="text" name="userId" placeholder="userId" />
          <input type="text" name="type" placeholder="type" />
          <input type="file" name="file" />
          <button type="submit">Submit</button>
        </form>

        <br />

        <form onSubmit={(e) => {
          e.preventDefault();
          getPicture(e.target.userId.value, e.target.type.value);
        }}>
          <input type="text" name="userId" placeholder="userId" />
          <input type="text" name="type" placeholder="type" />
          <button type="submit">Submit</button>
        </form>

        <br />

        <img src={data} /> 
      </div>
    </Router>
  );
}

export default App;
