import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import Login from './Pages/Login/Login';
import Signup from './components/auth/Signup';

import MiniSidebar from './Pages/Sidebar/MiniSidebar';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import SidebarLayout from './Pages/Sidebar/Sidebarlayout';
import Footer from './components/ui/Footer/Footer';

import History from './Pages/History/History';

import ViewLogsAD from './Pages/Printer/ViewLogsAdmin/ViewLogsad';
import ManagerPrinter from './Pages/Printer/ManagePrint-er/ManagePrinter';
import ManagerConfiguration from './Pages/Printer/ManageConfiguration/ManageConfiguration';
import ExportStatistics from './Pages/Printer/Export Statistics/ExportStatistics';

import DocumentList from './Pages/User/DocumentList/DocumentList';
import DocumentUp from './Pages/User/DocumentUploader/DocumentUploader';
import Order from './Pages/User/Order/Order';
import Payment from './Pages/User/Payment/Payment';

import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import PRINT from './Pages/Admin/managePrinter/ManagePrint_er';
import USER from './Pages/Admin/manageUser/ManageUser';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const verryAccessToken = async (token) => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await fetch('http://localhost:8080/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (refreshToken) {
          await refreshAccessToken('connect');  
        } else {
          console.error('No refresh token available');
        }
      }
    }
    catch (error) {
      console.error('Error during access token refresh:', error);
    }
  };

  const refreshAccessToken = async (state) => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await fetch('http://localhost:8080/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();

      if (response.ok) {
        const { accessToken } = result;
        localStorage.setItem('accessToken', accessToken);
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error during access token refresh:', error);
    }
  };

  
  const fechLogout = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setIsLoggedIn(false);
        localStorage.clear();
        setSidebarOpen(false);
        console.log('Logged out successfully');
      } else {
        console.error(result.error);
        if (response.status === 403) {
          await refreshAccessToken('disconnect');
        }
      }
    } catch (error) {
      console.error('Error disconnecting from server:', error);
    }
  }

  const fetchProfileData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('username', result.data.username !== undefined ? result.data.username : '');
        localStorage.setItem('fullname', result.data.fullname !== undefined ? result.data.fullname : '');
        localStorage.setItem('email', result.data.email !== undefined ? result.data.email : '');
        localStorage.setItem('phone_number', result.data.phone_number !== undefined ? result.data.phone_number : '');

        localStorage.setItem('AIO_USERNAME', result.data.AIO_USERNAME !== undefined ? result.data.AIO_USERNAME : '');
        localStorage.setItem('AIO_KEY', result.data.AIO_KEY !== undefined ? result.data.AIO_KEY : '');
        localStorage.setItem('webServerIp', result.data.webServerIp !== undefined ? result.data.webServerIp : '');

        setImageInLocalStorage('avatar', result.data.avatar);
        setImageInLocalStorage('coverPhoto', result.data.coverPhoto);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

 

  const setImageInLocalStorage = (key, data) => {
    if (data) {
      const src = `data:${data.contentType};base64,${data.data}`;
      localStorage.setItem(key, src);
    } else {
      localStorage.setItem(key, '');
    }
  };

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    const accessToken = localStorage.getItem('accessToken');
    if (storedLoggedInStatus === 'true') {
      if (performance.navigation.type === 1) {
        localStorage.setItem('connected', 'false');
      }
      setIsLoggedIn(true);
     
      fetchProfileData(accessToken);
     
      verryAccessToken(accessToken);
      const intervalId = setInterval(() => {
        
        verryAccessToken(accessToken);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    const accessToken = localStorage.getItem('accessToken');
    fechLogout(accessToken);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };



  return (
    <Box sx={{backgroundColor:'#f0f0f0'}}>
      <Router >
      <MiniSidebar />
        <Routes >
          <Route 
            path="/"
            element={
              isLoggedIn ? <Navigate to="/home" /> :
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Login onLogin={handleLogin} />
                </Box>
            }
          />
          <Route
            path="/signup"
            element={
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Signup />
              </Box>
            }
          />
          <Route
            path="/home"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Home />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          {/* User */}
          <Route
            path="/documents"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <DocumentList/>
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
           <Route
            path="/document-uploader"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <DocumentUp/>
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
           <Route
            path="/order"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Order/>
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
           <Route
            path="/payment"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Payment/>
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />




          {/* printer */}
           <Route
            path="/manage-printer"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <ManagerPrinter/>
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
           <Route
            path="/manage-configuration"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <ManagerConfiguration/>
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/export-statistics"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <ExportStatistics/>
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/history"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <History />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
           <Route
            path="/viewlogsAD"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <ViewLogsAD />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Profile />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
          {/* Admin */}
         <Route
            path="/dashboard"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <Dashboard />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          /><Route
          path="/manageUser"
          element={
            isLoggedIn ?
              <SidebarLayout
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                onLogout={handleLogout}
              >
                <USER />
              </SidebarLayout>
              : <Navigate to="/" />
          }
        />
         <Route
            path="/managerPrint-er"
            element={
              isLoggedIn ?
                <SidebarLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  onLogout={handleLogout}
                >
                  <PRINT />
                </SidebarLayout>
                : <Navigate to="/" />
            }
          />
        </Routes>
        <Footer />
      </Router>

    </Box>
  );
}

export default App;