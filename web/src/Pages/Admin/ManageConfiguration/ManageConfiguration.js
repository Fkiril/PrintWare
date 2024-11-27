import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const ManageConfiguration = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    allowedFormats: 'PDF, DOCX',
    defaultPages: 10,
  });

  const handleSave = () => {
    alert('Configuration saved!');
  };

  return (
    <Box sx={{ marginTop: '50px',height:'100vh'}} >
      <Typography variant="h4">Manage Configuration</Typography>
      <TextField
        label="Allowed Formats"
        fullWidth
        value={config.allowedFormats}
        onChange={(e) => setConfig({ ...config, allowedFormats: e.target.value })}
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Default Pages"
        fullWidth
        type="number"
        value={config.defaultPages}
        onChange={(e) => setConfig({ ...config, defaultPages: e.target.value })}
        style={{ marginBottom: '10px' }}
      />
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/viewlogsAD')}
        style={{ marginTop: '20px' }}
      >
        Go to Manage Config
      </Button>
    </Box>
  );
};

export default ManageConfiguration;
