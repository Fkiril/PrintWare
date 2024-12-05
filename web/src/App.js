import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import axios from 'axios';

const test = async (paramUserId) => {
  try {
    const res = await axios.post('hcmut-sso/test', {
      headers: {
        ContentType: 'application/json'
      },
      params: {
        userId: paramUserId
      }
    });
  
    console.log(res);
  }
  catch (error) {
    console.log(error);
  }
}

function App() {
  const [event, setEvent] = React.useState();

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

  console.log('event: ',event);

  return (
    <Router>
      <div>
        <form onSubmit={(e) => {
              e.preventDefault();
              enroll(e.target.userId.value);
            }}>
          <input type="text" name="userId" placeholder="userId" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </Router>
  );
}

export default App;
