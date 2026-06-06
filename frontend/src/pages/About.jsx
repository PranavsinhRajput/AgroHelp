import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ minHeight: '100vh' }}>
      <Container className="py-5">
        <Row className="mb-5">
          <Col>
            <div className="text-center mb-4">
              <Badge bg="success" className="mb-3 px-3 py-2">
                <i className="bi bi-stars me-2"></i>
                {t('empoweringAgricultureWithTechnology')}
              </Badge>
              <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                {t('aboutAgroHelp')}
              </h1>
              <p className="lead mx-auto" style={{ maxWidth: '700px', color: 'var(--color-text-secondary)' }}>
                {t('empoweringFarmers') || t('yourTrustedCompanionForModernFarmingSolutions')}
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <Card>
              <div style={{ backgroundColor: 'var(--color-primary)', padding: '40px' }}>
                <h2 className="text-white text-center mb-0" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-semibold)' }}>
                  <i className="bi bi-bullseye me-3"></i>
                  {t('ourMission')}
                </h2>
              </div>
              <Card.Body className="p-5">
                <p className="fs-5 mb-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('missionDescription')}
                </p>
                <p className="text-center mb-0" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('platformDescription')}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-4" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              <i className="bi bi-gear me-2"></i>
              {t('ourCoreModules')}
            </h2>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          <Col xs={12} md={6}>
            <Card className="h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: 'var(--color-green)', color: 'white' }}
                  >
                    <i className="bi bi-bug fs-2"></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      {t('diseaseDetection')}
                    </h4>
                    <Badge bg="success" className="mb-2">{t('aiPowered')}</Badge>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }} className="mb-0">
                  {t('diseaseDetectionDescription')}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    <i className="bi bi-currency-rupee fs-2"></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      {t('realTimeMarketPrices')}
                    </h4>
                    <Badge bg="warning" text="dark" className="mb-2">{t('liveData')}</Badge>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }} className="mb-0">
                  {t('trackLiveApmcMandiRates')}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: '#1976d2', color: 'white' }}
                  >
                    <i className="bi bi-cloud-sun fs-2"></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      {t('weatherForecasting')}
                    </h4>
                    <Badge bg="info" className="mb-2">{t('realTime')}</Badge>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }} className="mb-0">
                  {t('weatherForecastingDescription')}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: '#7b1fa2', color: 'white' }}
                  >
                    <i className="bi bi-graph-up-arrow fs-2"></i>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      {t('weatherPredictionMl')}
                    </h4>
                    <Badge bg="primary" className="mb-2">{t('rnnLstm')}</Badge>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }} className="mb-0">
                  {t('advancedMachineLearningModels')}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <Card>
              <Card.Body className="p-5">
                <h3 className="text-center mb-4" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                  <i className="bi bi-star me-2"></i>
                  {t('whyChooseAgroHelp')}
                </h3>
                <Row className="g-4">
                  <Col xs={12} md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle fs-4 me-3 mt-1" style={{ color: 'var(--color-green)' }}></i>
                      <div>
                        <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('userFriendlyInterface')}</h6>
                        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{t('simpleAndIntuitiveDesign')}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle fs-4 me-3 mt-1" style={{ color: 'var(--color-green)' }}></i>
                      <div>
                        <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('accurateAiPredictions')}</h6>
                        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{t('stateOfTheArtMachineLearningModels')}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle fs-4 me-3 mt-1" style={{ color: 'var(--color-green)' }}></i>
                      <div>
                        <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('multiLanguageSupportWhy')}</h6>
                        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{t('accessInformationInYourPreferredLanguage')}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <i className="bi bi-check-circle fs-4 me-3 mt-1" style={{ color: 'var(--color-green)' }}></i>
                      <div>
                        <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('realTimeUpdates')}</h6>
                        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{t('liveMarketPricesAndWeatherData')}</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-check-circle fs-4 me-3 mt-1" style={{ color: 'var(--color-green)' }}></i>
                      <div>
                        <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('dedicatedSupport')}</h6>
                        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>Expert assistance available to help you maximize the platform's benefits</p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="d-flex align-items-start">
                      <i className="bi bi-check-circle fs-4 me-3 mt-1" style={{ color: 'var(--color-green)' }}></i>
                      <div>
                        <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('comprehensiveAnalytics')}</h6>
                        <p className="small mb-0" style={{ color: 'var(--color-text-secondary)' }}>{t('dataDrivenInsightsToOptimize')}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;