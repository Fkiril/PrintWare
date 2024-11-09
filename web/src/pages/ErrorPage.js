import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state;

  return (
    <div>
        <p>ERROR!!!</p>

        {!error ? (
            <p>No error. Why are you here?</p>
        ) : (
            <>
                {error.status === 500 && (
                    <>
                        <p>{error.statusText}</p>
                        <p>{error.data}</p>
                    </>
                )}
                {error.status === 401 && (
                    <>
                        <h1>You are not authenticated!</h1>
                        <p>{error.statusText}</p>
                        <p>{error.data?.message}</p>
                        <p>{error.data?.error}</p>
                        <p>Please login to continue.</p>

                        <button onClick={() => navigate('/login')}>Login</button>
                    </>
                )}
                {error.status === 'unknown' && (
                    <>
                        <p>Unknown error</p>
                        <p>{error.statusText}</p>
                        <p>{error.data}</p>
                    </>
                )}
            </>
        )}
    </div>
  );
};
