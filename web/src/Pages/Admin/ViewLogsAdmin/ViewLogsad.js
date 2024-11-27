import React from 'react';
import { Box, Typography, Menu, MenuItem, Button } from '@mui/material';

const ViewLog = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ marginTop: '50px',height:'100vh'}} >
      <Typography variant="h4">View Log</Typography>
      <Button variant="contained" onClick={handleClick}>
        Select Log Type
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => alert('General Printing Log')}>General Printing Log</MenuItem>
        <MenuItem onClick={() => alert('General Payment Log')}>General Payment Log</MenuItem>
      </Menu>
    </Box>
  );
};

export default ViewLog;
