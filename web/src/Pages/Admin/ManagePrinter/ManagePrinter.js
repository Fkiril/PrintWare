import React, { useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const ManagePrinter = () => {
  const navigate = useNavigate();
  const [printers, setPrinters] = useState([
    { id: 1, name: 'Printer 1', status: true },
    { id: 2, name: 'Printer 2', status: false },
  ]);

  const [open, setOpen] = useState(false);
  const [newPrinter, setNewPrinter] = useState({ name: '', id: '' });

  const handleAddPrinter = () => {
    setPrinters([...printers, { ...newPrinter, status: false }]);
    setNewPrinter({ name: '', id: '' });
    setOpen(false);
  };

  const toggleStatus = (id) => {
    setPrinters(printers.map((printer) =>
      printer.id === id ? { ...printer, status: !printer.status } : printer
    ));
  };

  return (
    <Box sx={{marginTop: '50px',height:'100vh',}} >
      <Typography variant="h4">Manage Printer</Typography>
      <Button onClick={() => setOpen(true)} variant="contained" style={{ margin: '20px 0' }}>
        Add Printer
      </Button>
     
      {printers.map((printer) => (
        <Box
          key={printer.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="10px"
          padding="10px"
          border="1px solid #ccc"
        >
          <img
            src="/placeholder.jpg"
            alt={printer.name}
            style={{ width: '50px', cursor: 'pointer' }}
            onClick={() => alert(`Details for ${printer.name}`)}
          />
          <Typography>{printer.name}</Typography>
          <Switch
            checked={printer.status}
            onChange={() => toggleStatus(printer.id)}
          />
        </Box>
      ))}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box style={{ padding: '20px', backgroundColor: '#fff', margin: '100px auto', width: '300px' }}>
          <Typography variant="h6">Add Printer</Typography>
          <TextField
            label="Printer Name"
            fullWidth
            value={newPrinter.name}
            onChange={(e) => setNewPrinter({ ...newPrinter, name: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Printer ID"
            fullWidth
            value={newPrinter.id}
            onChange={(e) => setNewPrinter({ ...newPrinter, id: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <Box
            sx={{
              display: 'flex', // Căn nút trên cùng một hàng
              gap: '10px', // Khoảng cách giữa các nút
              marginTop: '10px', // Khoảng cách phía trên các nút
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={handleAddPrinter} // Gọi hàm xử lý thêm printer
            >
              Add
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff0004', // Màu nền tùy chỉnh
                color: '#fff', // Màu chữ
                '&:hover': {
                  backgroundColor: '#cc0003', // Màu khi hover
                },
              }}
              fullWidth
              onClick={() => setOpen(false)} // Đóng modal
            >
              Cancel
            </Button>

          </Box>

        </Box>
      </Modal>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/manage-configuration')}
        style={{ marginTop: '20px' }}
      >
        Go to Manage Config
      </Button>
    </Box>
  );
};

export default ManagePrinter;
