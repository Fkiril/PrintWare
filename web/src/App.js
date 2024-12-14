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

import axios from 'axios';
import { logout } from './controllers/HCMUT_SSO';
import { CustomerModelKeys } from './models/User';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const fetchProfileData = async () => {
    if (!localStorage.getItem(CustomerModelKeys.userId)) {
      console.error('User ID not found in local storage.');
      return;
    }
    if (!localStorage.getItem('accessToken')) {
      console.error('Access token not found in local storage.');
      return;
    }

    const userId = localStorage.getItem(CustomerModelKeys.userId);
    const token = localStorage.getItem('accessToken');

    const responses = await Promise.allSettled([
      axios.get(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/get-user-profile-by-id`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: userId,
        }
      }),
      axios.get(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/get-picture`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: userId,
          type: 'avatar',
        },
        responseType: 'arraybuffer'
      }),
      axios.get(`${process.env.REACT_APP_SERVER_URL}/hcmut-sso/get-picture`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          userId: userId,
          type: 'coverPhoto',
        },
        responseType: 'arraybuffer'
      })
    ]);

    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        if (index === 0) {
          const profileResponse = response.value.data;

          localStorage.setItem(CustomerModelKeys.userRole, profileResponse.data.userRole || '');
          localStorage.setItem(CustomerModelKeys.userName, profileResponse.data.userName || '');
          localStorage.setItem(CustomerModelKeys.email, profileResponse.data.email || '');
          localStorage.setItem(CustomerModelKeys.phoneNum, profileResponse.data.phoneNum || '');
          localStorage.setItem(CustomerModelKeys.hcmutId, profileResponse.data.hcmutId || '');
          localStorage.setItem(CustomerModelKeys.faculty, profileResponse.data.faculty || '');
          localStorage.setItem(CustomerModelKeys.major, profileResponse.data.major || '');
          localStorage.setItem(CustomerModelKeys.classId, profileResponse.data.classId || '');
          localStorage.setItem(CustomerModelKeys.academicYear, profileResponse.data.academicYear || '');
        } else {
          const imageResponse = response.value;
          const imgData = btoa(String.fromCharCode.apply(null, new Uint8Array(imageResponse.data)));
          const imgType = imageResponse.headers.getContentType();

          setImageInLocalStorage(index === 1 ? 'avatar' : 'coverPhoto', { contentType: imgType, data: imgData });
        }
      }
      else {
        if (index === 0) {
          console.error("Error fetching profile data: ", response.reason)
        }
        else if (index === 1) {
          console.error("Error fetching avatar data: ", response.reason)
        }
        else {
          console.error("Error fetching cover photo data: ", response.reason)
        }
      }
    });
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

    if (storedLoggedInStatus === 'true') {
      if (performance.navigation.type === 1) {
        localStorage.setItem('connected', 'false');
      }
      setIsLoggedIn(true);
     
      fetchProfileData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const handleLogout = () => {
    try {
      logout();
      setIsLoggedIn(false);
      localStorage.clear();
      setSidebarOpen(false);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      //TODO: Handle the error here
      return;
    }
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