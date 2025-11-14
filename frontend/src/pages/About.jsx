import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container className="py-5">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col>
            <div className="text-center mb-4">
              <Badge bg="success" className="mb-3 px-3 py-2">
                <i className="bi bi-stars me-2"></i>
                Empowering Agriculture with Technology
              </Badge>
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#4a6741' }}>
                About AgroHelp
              </h1>
              <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
                {t('empoweringFarmers') || 'Your trusted companion for modern farming solutions, combining AI and real-time data to help farmers make informed decisions.'}
              </p>
            </div>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <Card className="border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #4a6741 0%, #6b8e5f 100%)', padding: '40px' }}>
                <h2 className="text-white text-center mb-0">
                  <i className="bi bi-bullseye me-3"></i>
                  {t('ourMission') || 'Our Mission'}
                </h2>
              </div>
              <Card.Body className="p-5">
                <p className="text-muted fs-5 mb-4 text-center">
                  {t('missionDescription') || 'To revolutionize agriculture by providing farmers with cutting-edge technology and real-time insights that increase productivity, reduce losses, and ensure sustainable farming practices.'}
                </p>
                <p className="text-muted text-center mb-0">
                  {t('platformDescription') || 'Our platform combines artificial intelligence, machine learning, and comprehensive market data to deliver actionable insights directly to farmers, helping them thrive in an ever-changing agricultural landscape.'}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-4" style={{ color: '#4a6741' }}>
              <i className="bi bi-gear-fill me-2"></i>
              Our Core Modules
            </h2>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {/* Disease Detection */}
          <Col lg={6}>
            <Card 
              className="h-100 border-0 shadow-sm hover-card" 
              style={{ 
                borderRadius: '15px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: '#e8f5e9' }}
                  >
                    <i className="bi bi-bug-fill fs-2" style={{ color: '#4a6741' }}></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ color: '#4a6741' }}>
                      {t('diseaseDetection') || 'Disease Detection'}
                    </h4>
                    <Badge bg="success" className="mb-2">AI-Powered</Badge>
                  </div>
                </div>
                <p className="text-muted mb-0">
                  {t('diseaseDetectionDescription') || 'Advanced AI algorithms analyze crop images to detect diseases early, providing instant diagnosis and treatment recommendations to prevent crop loss and increase yield.'}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Market Prices */}
          <Col lg={6}>
            <Card 
              className="h-100 border-0 shadow-sm hover-card"
              style={{ 
                borderRadius: '15px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: '#fff3e0' }}
                  >
                    <i className="bi bi-currency-rupee fs-2" style={{ color: '#f57c00' }}></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ color: '#4a6741' }}>
                      Real-Time Market Prices
                    </h4>
                    <Badge bg="warning" text="dark" className="mb-2">Live Data</Badge>
                  </div>
                </div>
                <p className="text-muted mb-0">
                  Track live APMC mandi rates across multiple markets and districts. Get historical price trends and make informed decisions about when and where to sell your produce for maximum profit.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Weather Forecasting */}
          <Col lg={6}>
            <Card 
              className="h-100 border-0 shadow-sm hover-card"
              style={{ 
                borderRadius: '15px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: '#e3f2fd' }}
                  >
                    <i className="bi bi-cloud-sun-fill fs-2" style={{ color: '#1976d2' }}></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ color: '#4a6741' }}>
                      {t('weatherForecasting') || 'Weather Forecasting'}
                    </h4>
                    <Badge bg="info" className="mb-2">Real-Time</Badge>
                  </div>
                </div>
                <p className="text-muted mb-0">
                  {t('weatherForecastingDescription') || 'Access accurate weather forecasts tailored for your location. Plan your farming activities with confidence using up-to-date meteorological data.'}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Weather Prediction */}
          <Col lg={6}>
            <Card 
              className="h-100 border-0 shadow-sm hover-card"
              style={{ 
                borderRadius: '15px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: '#f3e5f5' }}
                  >
                    <i className="bi bi-graph-up-arrow fs-2" style={{ color: '#7b1fa2' }}></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ color: '#4a6741' }}>
                      Weather Prediction (ML)
                    </h4>
                    <Badge bg="primary" className="mb-2">RNN/LSTM</Badge>
                  </div>
                </div>
                <p className="text-muted mb-0">
                  Advanced machine learning models using RNN and LSTM neural networks to predict long-term weather patterns, helping you plan seasonal activities and mitigate weather-related risks.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Why Choose Us Section */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <Card className="border-0 shadow-lg" style={{ borderRadius: '15px', backgroundColor: '#fff' }}>
              <Card.Body className="p-5">
                <h3 className="text-center mb-4" style={{ color: '#4a6741' }}>
                  <i className="bi bi-star-fill me-2"></i>
                  {t('whyChooseUs') || 'Why Choose AgroHelp?'}
                </h3>
                <Row className="g-4">
                  <Col md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="mb-2">{t('userFriendly') || 'User-Friendly Interface'}</h6>
                        <p className="text-muted small mb-0">Simple and intuitive design accessible to farmers of all technical backgrounds</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="mb-2">{t('accuratePredictions') || 'Accurate AI Predictions'}</h6>
                        <p className="text-muted small mb-0">State-of-the-art machine learning models for precise disease detection and weather forecasting</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="mb-2">{t('multiLanguageSupport') || 'Multi-Language Support'}</h6>
                        <p className="text-muted small mb-0">Access information in your preferred language for better understanding</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="mb-2">{t('regularUpdates') || 'Real-Time Updates'}</h6>
                        <p className="text-muted small mb-0">Live market prices and weather data updated continuously</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="mb-2">{t('dedicatedSupport') || 'Dedicated Support'}</h6>
                        <p className="text-muted small mb-0">Expert assistance available to help you maximize the platform's benefits</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="mb-2">Comprehensive Analytics</h6>
                        <p className="text-muted small mb-0">Data-driven insights to optimize your farming operations and increase profitability</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row>
          <Col lg={8} className="mx-auto">
            <Card 
              className="border-0 shadow-lg text-white text-center"
              style={{ 
                background: 'linear-gradient(135deg, #4a6741 0%, #6b8e5f 100%)',
                borderRadius: '15px'
              }}
            >
              {/* <Card.Body className="p-5">
                <h3 className="mb-3">Ready to Transform Your Farming?</h3>
                <p className="mb-4">
                  Join thousands of farmers who are already using AgroHelp to make smarter farming decisions.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    <i className="bi bi-people-fill me-2"></i>
                    10,000+ Active Users
                  </Badge>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    <i className="bi bi-graph-up me-2"></i>
                    98% Accuracy Rate
                  </Badge>
                  <Badge bg="light" text="dark" className="px-3 py-2">
                    <i className="bi bi-award-fill me-2"></i>
                    Award Winning Platform
                  </Badge>
                </div>
              </Card.Body> */}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;