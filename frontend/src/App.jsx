import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavigationBar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import WeatherPredictionPage from './pages/WeatherPredictionPage';
import WeatherForecasting from './pages/WeatherForecasting'
import MarketRates from './pages/MarketRates';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <NavigationBar toggleSidebar={toggleSidebar} />
          
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          
          {sidebarOpen && (
            <div 
              className="sidebar-overlay open" 
              onClick={toggleSidebar}
              aria-label="Close sidebar overlay"
            ></div>
          )}
          
          <Container fluid className="px-0 flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
              <Route path="/weather-prediction" element={<WeatherPredictionPage />} />
              <Route path="/weather-forecasting" element={<WeatherForecasting />} />
              <Route path="/market-rates" element={<MarketRates />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Container>
          
          <footer className="py-3 border-top" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <Container>
              <p className="text-center mb-0" style={{ color: 'var(--color-text-secondary)' }}>© 2025 AgroHelp - Smart Agriculture. All rights reserved.</p>
            </Container>
          </footer>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;