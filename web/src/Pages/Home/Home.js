import React from 'react';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundImage: 'url(/static/Library.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }} 
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',  
        }}
      />
      
      <h1 
        style={{
          position: 'relative',
          color: '#fff',  
          padding: '20px 40px',  
          margin: 0,
          fontSize: '3rem',  
          textAlign: 'center',  
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',  
          fontWeight: 'bold', 
        }}
      >
        Welcome to Printer
      </h1>
    </Box>
  );  
};

export default Home;
