import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Avatar, Typography, Menu, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import '../../Styles/Styles.css';
import HistoryIcon from '@mui/icons-material/History'; // Icon lịch sử
import LogoutIcon from '@mui/icons-material/Logout'; // Icon logout
export default function Navbar({ onLogout }) {
  const [avatar, setAvatar] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const navigate = useNavigate();
  const location = useLocation();
  const loadData = async () => {
    const savedAvatar = localStorage.getItem('avatar');
    setAvatar(savedAvatar || '');
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget); 
  };


  const handleMenuClose = () => {
    setAnchorEl(null); 
  };


  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: 1200,
        padding: '0px 0',
        backgroundColor: '#fff',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
        borderBottom: '2px solid #ddd',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '60px',
          width: '95%',
          margin: '0 auto',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '20px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/static/Bku.ico"
              alt="Menu Icon"
              style={{ width: '65px', height: '65px' }}
            />
          </Box>

          <Box>
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                sx={{
                  color: location.pathname === '/home' ? '#1976d2' : '#333',
                  '&:hover': { color: '#787878' },
                  paddingLeft: '10px',
                }}
              >
                Home
              </Typography>
            </Link>
          </Box>

          <Box>
            <Link to="/printer" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                sx={{
                  color: location.pathname === '/printer' ? '#1976d2' : '#333', 
                  '&:hover': { color: '#787878' },
                  paddingLeft: '10px',
                }}
              >
                Print
              </Typography>
            </Link>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleAvatarClick} sx={{ marginRight: 2 }}>
          <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            <PersonIcon sx={{ marginRight: 1, color: '#1976d2' }} />
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/viewlogs'); handleMenuClose(); }}>
            <HistoryIcon sx={{ marginRight: 1, color: '#1976d2' }} />
            ViewLogs
          </MenuItem>
          <MenuItem onClick={() => { onLogout(); handleMenuClose(); }}>
            <LogoutIcon sx={{ marginRight: 1, color: '#d32f2f' }} />
            Logout
          </MenuItem>
        </Menu>
       
          

          
        </Box>
      </Box>
    </Box>
  );
}
