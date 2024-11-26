import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginComponent from './components/Login';

import HomePage from './pages/HomePage';
import DefaultPage from './pages/DefaultPage';
import TestPage from './pages/TestPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
