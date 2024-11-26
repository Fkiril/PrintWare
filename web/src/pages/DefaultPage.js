import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

function DefaultPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div>
      <p>This is the default page of the web application.</p>

      {user? (
        <button onClick={() => navigate('/home')}>Home</button>
      ): (
        <button onClick={() => navigate('/login')}>Login</button>
      )}

      <button onClick={() => navigate('/test')}>Test</button>
    </div>
  );
}

export default DefaultPage;
