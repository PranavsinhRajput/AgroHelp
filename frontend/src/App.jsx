import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navigation Bar */}
        <NavigationBar toggleSidebar={toggleSidebar} />
        
        <Container fluid className="px-0 flex-grow-1">
          <Row className="g-0">
            {/* Sidebar - conditionally rendered based on showSidebar state */}
            {showSidebar && (
              <Col xs={12} md={3} lg={2} className="sidebar-col">
                <Sidebar toggleSidebar={toggleSidebar} />
              </Col>
            )}
            
            {/* Main Content */}
            <Col xs={12} md={showSidebar ? 9 : 12} lg={showSidebar ? 10 : 12}>
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
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Col>
          </Row>
        </Container>
        
        {/* Footer */}
        <footer className="bg-light py-3 border-top">
          <Container>
            <p className="text-center text-muted mb-0">© 2025 AgroHelp - Smart Agriculture. All rights reserved.</p>
          </Container>
        </footer>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;