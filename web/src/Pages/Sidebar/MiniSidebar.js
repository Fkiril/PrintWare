import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, IconButton, Avatar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../Styles/Styles.css';

export default function Navbar({ onLogout }) {
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    const savedAvatar = localStorage.getItem('avatar');
    setAvatar(savedAvatar || '');
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAvatarClick = () => {
    navigate('/profile');
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
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        borderBottom: '2px solid #ddd', 
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '60px', 
          width: '90%', 
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
          }}>
          {/* Menu Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/static/Bku.ico" 
              alt="Menu Icon" 
              style={{ width: '55px', height: '55px' }} 
            />
          </Box>

          <Box >
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Typography variant="h6" sx={{
                  color: '#333',
                  '&:hover': { color: '#787878' }, 
                  paddingLeft: '10px', 
                }}>
                Home
              </Typography>
            </Link>
          </Box>

          <Box >
            <Link to="/printer" style={{ textDecoration: 'none', }}>
              <Typography variant="h6" sx={{
                  color: '#333',
                  '&:hover': { color: '#787878' }, 
                  paddingLeft: '10px', 
                }}>
                Print
              </Typography>
            </Link>
          </Box>
        </Box>


        <Box sx={{ display: 'flex', alignItems: 'center' }}>
       
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              marginRight: 2,
            }}
          >
            <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
          </IconButton>

          <IconButton
            sx={{
              color: '#f44336',
              '&:hover': {
                color: '#c62828',
              },
            }}
            onClick={onLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
