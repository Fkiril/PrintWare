import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DefaultPage from './pages/DefaultPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/default" element={<DefaultPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
