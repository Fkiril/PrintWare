import React, { useState } from 'react';
import { Box, Button, TextField, Grid, Card, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs'; 
const Dashboardadmin = () => {
  // Dữ liệu ảo, bao gồm tần suất in trong 7 ngày
  const mockData = [
    {
      name: 'Printer 1',
      id: 'P001',
      status: 'Active',
      paperType: 'A4',
      printFrequency: [
        { day: '01/11/2024', value: 10 },
        { day: '02/11/2024', value: 12 },
        { day: '03/11/2024', value: 15 },
        { day: '04/11/2024', value: 14 },
        { day: '05/11/2024', value: 18 },
        { day: '06/11/2024', value: 13 },
        { day: '07/11/2024', value: 17 },
      ],
    },
    {
      name: 'Printer 2',
      id: 'P002',
      status: 'Inactive',
      paperType: 'A3',
      printFrequency: [
        { day: '01/11/2024', value: 5 },
        { day: '02/11/2024', value: 6 },
        { day: '03/11/2024', value: 7 },
        { day: '04/11/2024', value: 9 },
        { day: '05/11/2024', value: 8 },
        { day: '06/11/2024', value: 7 },
        { day: '07/11/2024', value: 6 },
      ],
    },
    {
      name: 'Printer 3',
      id: 'P003',
      status: 'Inactive',
      paperType: 'A3',
      printFrequency: [
        { day: '01/11/2024', value: 5 },
        { day: '02/11/2024', value: 6 },
        { day: '03/11/2024', value: 7 },
        { day: '04/11/2024', value: 9 },
        { day: '05/11/2024', value: 8 },
        { day: '06/11/2024', value: 7 },
        { day: '07/11/2024', value: 6 },
      ],
    },
    {
      name: 'Printer 4',
      id: 'P004',
      status: 'Inactive',
      paperType: 'A3',
      printFrequency: [
        { day: '01/11/2024', value: 5 },
        { day: '02/11/2024', value: 6 },
        { day: '03/11/2024', value: 7 },
        { day: '04/11/2024', value: 9 },
        { day: '05/11/2024', value: 8 },
        { day: '06/11/2024', value: 7 },
        { day: '07/11/2024', value: 6 },
      ],
    },
  ];

  const [printers, setPrinters] = useState(mockData);

  // State cho form thêm máy in
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    status: '',
    paperType: '',
    resolution: '',
    printSpeed: '',
    memory: '',
    inkType: '',
  });

  // State cho dialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  // Thêm máy in
  const handleAddPrinter = () => {
    setPrinters([
      ...printers,
      { ...formData, printFrequency: [] } // Khởi tạo printFrequency rỗng khi thêm máy in mới
    ]);
    setFormData({
      name: '',
      id: '',
      status: '',
      paperType: '',
      resolution: '',
      printSpeed: '',
      memory: '',
      inkType: '',
    });
    handleDialogClose(); // Đóng dialog sau khi thêm
  };
  const handleDeletePrinter = (printerId) => {
    setPrinters(printers.filter((printer) => printer.id !== printerId));
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', margin: 0, padding: '100px 100px 20px 100px' }}>
      {/* Nút Add Printer */}
      <Box sx={{ padding: '20px 40px'}}>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Add Printer
        </Button>
      </Box>

      {/* Hiển thị thẻ thông tin máy in */}
      <Grid container spacing={3} sx={{ padding: '20px' }}>
        {printers.map((printer, index) => (
         <Grid item xs={12} sm={6} md={6} key={index}>
            <Card sx={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
              {/* Phần thông tin máy in */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column',}}>
                <Typography variant="h6">{printer.name}</Typography>
                <Typography>ID: {printer.id}</Typography>
                <Typography>Status: {printer.status}</Typography>
                <Typography>Paper Type: {printer.paperType}</Typography>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={() => handleDeletePrinter(printer.id)} 
                  sx={{ marginTop: '10px' }}
                >
                  Delete
                </Button>
              </Box>

              {/* Phần biểu đồ tần suất in */}
              <Box sx={{ width: '70%', height: '160px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={printer.printFrequency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      tickFormatter={(tick) => dayjs(tick).format('DD/MM')} 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip tick={{ fontSize: 10 }}/>
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
            
          </Grid> 
          
        ))}
      </Grid>

      {/* Dialog thêm máy in */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Printer</DialogTitle>
        <DialogContent>
          <TextField
            label="Printer Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Printer ID"
            variant="outlined"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Status"
            variant="outlined"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Paper Type (A1, A2, A3, A4)"
            variant="outlined"
            name="paperType"
            value={formData.paperType}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Resolution"
            variant="outlined"
            name="resolution"
            value={formData.resolution}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Print Speed"
            variant="outlined"
            name="printSpeed"
            value={formData.printSpeed}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Memory"
            variant="outlined"
            name="memory"
            value={formData.memory}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ink Type"
            variant="outlined"
            name="inkType"
            value={formData.inkType}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddPrinter} color="primary">
            Add Printer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboardadmin;
