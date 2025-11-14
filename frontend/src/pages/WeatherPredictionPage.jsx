import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import WeatherPredictor from '../components/WeatherPredictor';
import { useTranslation } from 'react-i18next';

const WeatherPredictionPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">{t('weatherPrediction')}</h1>
          <p className="lead text-secondary">
            {t('weatherForecastingDescription')}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <WeatherPredictor />
        </Col>
      </Row>
    </Container>
  );
};

export default WeatherPredictionPage;