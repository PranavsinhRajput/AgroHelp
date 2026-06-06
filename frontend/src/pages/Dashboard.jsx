import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("No token found, redirecting to signin");
          navigate('/signin');
          return;
        }

        const res = await axios.get("http://localhost:4000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.farmer) {
          setUser(res.data.farmer);
        } else {
          throw new Error("User data not found in response");
        }
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load user profile");
        
        if (err.response?.status === 404) {
          navigate('/signup');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="lead">{t('loadingYourProfile')}</p>
        </div>
      </Container>
    );
  }

  if (error && !user) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-danger">
          <h4>{t('error')}</h4>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline-danger">{t('retry')}</Button>
        </div>
      </Container>
    );
  }

  const modules = [
    {
      title: t('weatherForecasting'),
      description: t('weatherForecastingDescription'),
      icon: 'bi-cloud-sun',
      route: '/weather-forecasting'
    },
    {
      title: t('marketPrice'),
      description: t('getLiveApmcMandiRates'),
      icon: 'bi-graph-up-arrow',
      route: '/market-rates'
    },
    {
      title: t('weatherPrediction'),
      description: t('weatherForecastingDescription'),
      icon: 'bi-cpu',
      route: '/weather-prediction'
    },
    {
      title: t('diseaseDetection'),
      description: t('diseaseDetectionDescription'),
      icon: 'bi-bug',
      route: '/disease-detection'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-semibold)' }}>{t('dashboard')}</h1>
          <p className="text-center text-muted lead">
            {t('accessAllAgroHelpSmartFarmingTools')}
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {modules.map((module, index) => (
          <Col xs={12} md={6} lg={4} key={index}>
            <Card 
              className="h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(module.route)}
            >
              <Card.Body className="p-4 d-flex flex-column">
                <div className="text-center mb-3">
                  <i 
                    className={`bi ${module.icon} fs-1`} 
                    style={{ color: 'var(--color-primary)' }}
                  ></i>
                </div>
                <h4 className="text-center mb-3" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                  {module.title}
                </h4>
                <p className="text-center mb-4 flex-grow-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {module.description}
                </p>
                <Button 
                  variant="primary"
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(module.route);
                  }}
                >
                  {t('openModule')}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body className="p-4">
              <h5 className="mb-3" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-medium)' }}>
                <i className="bi bi-info-circle me-2"></i>
                {t('quickGuide')}
              </h5>
              <ul style={{ color: 'var(--color-text-secondary)' }} className="mb-0">
                <li className="mb-2">
                  <strong style={{ color: 'var(--color-text-primary)' }}>{t('weatherForecasting')}:</strong> {t('weatherForecastingGuide')}
                </li>
                <li className="mb-2">
                  <strong style={{ color: 'var(--color-text-primary)' }}>{t('marketPrice')}:</strong> {t('mandiRatesGuide')}
                </li>
                <li className="mb-2">
                  <strong style={{ color: 'var(--color-text-primary)' }}>{t('weatherPrediction')}:</strong> {t('mlWeatherPredictionGuide')}
                </li>
                <li className="mb-0">
                  <strong style={{ color: 'var(--color-text-primary)' }}>{t('diseaseDetection')}:</strong> {t('plantDiseaseDetectionGuide')}
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