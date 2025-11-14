import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 send token here
        },
      });

      setUser(res.data.farmer);
    } catch (err) {
      console.error("Error fetching user:", err);
      //localStorage.removeItem("token");
    }
  };

  fetchUser();
}, []);


  if (!user) return <p>Loading...</p>;

  const modules = [
    {
      title: t('weatherForecasting'),
      description: t('weatherForecastingDescription'),
      icon: 'bi-cloud-sun',
      route: '/weather-forecasting',
      color: '#4a6741'
    },
    {
      title: t('marketPrice'),
      description: t('Get live APMC mandi rates for various crops and commodities to make informed selling decisions.'),
      icon: 'bi-graph-up-arrow',
      route: '/market-rates',
      color: '#4a6741'
    },
    {
      title: t('weatherPrediction'),
      description: t('weatherForecastingDescription'),
      icon: 'bi-cpu',
      route: '/weather-prediction',
      color: '#4a6741'
    },
    {
      title: t('diseaseDetection'),
      description: t('diseaseDetectionDescription'),
      icon: 'bi-bug',
      route: '/disease-detection',
      color: '#4a6741'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3" style={{ color: '#4a6741' }}>Dashboard</h1>
          <p className="text-center text-muted lead">
            Access all AgroHelp smart farming tools
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {modules.map((module, index) => (
          <Col xs={12} md={6} key={index}>
            <Card 
              className="h-100 border-0 shadow-sm module-card"
              style={{ 
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onClick={() => handleCardClick(module.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
              }}
            >
              <Card.Body className="p-4 d-flex flex-column">
                <div className="text-center mb-3">
                  <i 
                    className={`bi ${module.icon} fs-1`} 
                    style={{ color: module.color }}
                  ></i>
                </div>
                <h4 className="text-center mb-3" style={{ color: '#4a6741' }}>
                  {module.title}
                </h4>
                <p className="text-muted text-center mb-4 flex-grow-1">
                  {module.description}
                </p>
                <Button 
                  style={{ 
                    backgroundColor: module.color, 
                    border: 'none' 
                  }}
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(module.route);
                  }}
                >
                  Open Module
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col>
          <Card className="border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body className="p-4">
              <h5 className="mb-3" style={{ color: '#4a6741' }}>
                <i className="bi bi-info-circle me-2"></i>
                Quick Guide
              </h5>
              <ul className="text-muted mb-0">
                <li className="mb-2">
                  <strong>Weather Forecasting:</strong> View current weather conditions and 7-day forecasts
                </li>
                <li className="mb-2">
                  <strong>Mandi Rates:</strong> Access real-time agricultural commodity prices from APMC markets
                </li>
                <li className="mb-2">
                  <strong>ML Weather Prediction:</strong> Get AI-powered weather predictions for better planning
                </li>
                <li className="mb-0">
                  <strong>Plant Disease Detection:</strong> Upload crop images for instant disease diagnosis
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;