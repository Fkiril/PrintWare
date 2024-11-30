import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Avatar, Typography, Menu, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History'; // Icon lịch sử
import LogoutIcon from '@mui/icons-material/Logout'; // Icon logout

export default function Navbar({ onLogout }) {
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const navigate = useNavigate();
  const location = useLocation();
  
  const loadData = async () => {
    const savedAvatar = localStorage.getItem('avatar');
    const savedRole = localStorage.getItem('role'); // Lấy role từ localStorage
    setAvatar(savedAvatar || '');
    setRole(savedRole || '');
  };

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, 1000); // Cập nhật định kỳ
    return () => clearInterval(intervalId);
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const breadcrumbs = location.pathname
    .split('/')
    .filter((path) => path) // Loại bỏ chuỗi rỗng
    .map((path, index, array) => ({
      label: path.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
      link: `/${array.slice(0, index + 1).join('/')}`,
    }));

    const handleGoBack = () => {
      navigate(-1); // Quay lại trang trước
    };
  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: 1200,
        padding: '5px 0',
        backgroundColor: '#fff',
        boxShadow: '0 0.1px 0.1px rgba(0, 0, 0, 0.1)',
        borderBottom: '2px solid #ddd',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '40px',
          width: '97%',
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
            gap: '10px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px',}}>
            <img
              src="/static/Bku.ico"
              alt="Menu Icon"
              style={{ width: '65px', height: '65px' }}
            />
          </Box>

          {/* Hiển thị menu khác nhau dựa trên role */}
          {role === 'user' && (
            <Box
            sx={{
              display: 'flex', // Đặt các phần tử con trong cùng một hàng
              alignItems: 'center', // Căn giữa theo chiều dọc
              gap: '20px', // Khoảng cách giữa các liên kết
            }}
          >
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
            
            <Link to="/documents" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                sx={{
                  color: location.pathname === '/docmuments' ? '#1976d2' : '#333',
                  '&:hover': { color: '#787878' },
                  paddingLeft: '10px',
                }}
              >
                Document List
              </Typography>
            </Link>
          </Box>
          
          )}

          {role === 'printer' && (
            <>
              <Box>
                <Link to="/manage-printer" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: location.pathname === '/manage-printer' ? '#1976d2' : '#333',
                      '&:hover': { color: '#787878' },
                      paddingLeft: '10px',
                    }}
                  >
                    Manage
                  </Typography>
                </Link>
              </Box>
            </>
          )}

          {role === 'admin' && (
            <>
              <Box>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: location.pathname === '/dashboard' ? '#1976d2' : '#333',
                      '&:hover': { color: '#787878' },
                      paddingLeft: '10px',
                    }}
                  >
                    Dashboard
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Link to="/manageUser" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: location.pathname === '/manageUser' ? '#1976d2' : '#333',
                      '&:hover': { color: '#787878' },
                      paddingLeft: '10px',
                    }}
                  >
                    Manage User
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Link to="/managerPrint-er" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: location.pathname === '/managerPrint-er' ? '#1976d2' : '#333',
                      '&:hover': { color: '#787878' },
                      paddingLeft: '10px',
                    }}
                  >
                    Manage Printer
                  </Typography>
                </Link>
              </Box>
            </>
          )}

        </Box>
    
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {role === 'user' ? (
            <IconButton onClick={handleAvatarClick} sx={{ marginRight: 2 ,marginTop:'5px'}}>
              <Avatar src={avatar} sx={{ width: 35, height: 35 }} />
            </IconButton>
          ) : role === 'printer' ||  role === 'admin'? (
            <IconButton onClick={onLogout} sx={{ marginRight: 2 }}>
              <LogoutIcon sx={{ color: '#d32f2f', fontSize: 30 }} />
            </IconButton>
          ) : null}


          {role === 'user' && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                <PersonIcon sx={{ marginRight: 1, color: '#1976d2' }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/history'); handleMenuClose(); }}>
                <HistoryIcon sx={{ marginRight: 1, color: '#1976d2' }} />
                History
              </MenuItem>
              <MenuItem onClick={onLogout} sx={{ marginRight: 2 }}>
                <LogoutIcon sx={{ color: '#d32f2f', fontSize: 30 }} />
                Logout
              </MenuItem>
            </Menu>
          )}
        </Box>
      </Box>
      <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        padding: '1px 40px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
       <IconButton onClick={handleGoBack} sx={{ marginRight: '10px' }}>
          <Typography variant="h6" sx={{ color: '#007bff', cursor: 'pointer' }}>
            {'«'}  {/* Thay '»' bằng '<<' */}
          </Typography>
        </IconButton>
      {breadcrumbs.map((crumb, index) => (
        <Typography key={crumb.link} sx={{ marginRight: '10px' }}>
          <Link
            to={crumb.link}
            style={{ textDecoration: 'none', color: '#007bff' }}
          >
            {crumb.label} 
          </Link>
           {index < breadcrumbs.length - 1 && ' » '}
        </Typography>
      ))}
    </Box>
    </Box>
  );
}
