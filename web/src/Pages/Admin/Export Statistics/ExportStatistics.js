import React from 'react';
import { Button, Typography } from '@mui/material';

const ExportStatistics = () => {
  const handleExport = () => {
    alert('Exporting statistics as PDF...');
  };

  return (
    <div>
      <Typography variant="h4">Export Statistics</Typography>
      <Button variant="contained" onClick={handleExport} style={{ marginTop: '20px' }}>
        Export PDF
      </Button>
    </div>
  );
};

export default ExportStatistics;
