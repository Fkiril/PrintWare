import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        backgroundColor: '#333', 
        color: '#fff', 
        textAlign: 'center', 
        padding: '0px 0', 
        position: 'fixed',
        bottom: 0, 
        left: 0, 
      }}
    >
      <Typography variant="body2">
        © 2024 PrintWare. Best Sites You Can Choose!
      </Typography>
    </Box>
  );
};

export default Footer;
