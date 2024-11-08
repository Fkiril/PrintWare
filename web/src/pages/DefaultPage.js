import React from 'react';
import { useNavigate } from 'react-router-dom';

function DefaultPage() {
  const navigate = useNavigate();

  return (
    <div>
      <p>This is the default page of the web application.</p>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  );
}

export default DefaultPage;
