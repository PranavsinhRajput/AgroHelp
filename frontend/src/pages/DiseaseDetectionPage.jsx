import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DiseaseDetector from '../components/DiseaseDetector';
import { useTranslation } from 'react-i18next';

const DiseaseDetectionPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold">{t('diseaseDetection')}</h1>
          <p className="lead text-secondary">
            {t('diseaseDetectionDescription')}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <DiseaseDetector />
        </Col>
      </Row>
    </Container>
  );
};

export default DiseaseDetectionPage;