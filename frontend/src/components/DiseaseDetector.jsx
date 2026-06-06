import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const DiseaseDetector = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setPrediction(null);
      setError(null);
    }
  };

  const handleReupload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
  };

  const handleDiseasePrediction = async () => {
    if (!selectedImage) {
      setError(t('error'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/predict/disease', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      setPrediction(response.data);
    } catch (err) {
      setError(t('error'));
      console.error('Disease detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <Form.Group className="mb-4 text-center">
            <Form.Label htmlFor="image-upload" className="d-block">
              <div className="bg-light p-5 rounded-3 cursor-pointer mb-3">
                <div className="display-4 mb-2">📷</div>
                <p className="mb-0 text-secondary">{t('uploadImage')}</p>
              </div>
            </Form.Label>
            <Form.Control
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageSelect}
              className="d-none"
            />
          </Form.Group>

          {imagePreview && (
            <div className="text-center mb-4">
              <img
                src={imagePreview}
                alt="Selected plant"
                className="img-fluid rounded-3 border"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          <div className="d-grid gap-2">
            <Button
              onClick={handleDiseasePrediction}
              disabled={loading || !selectedImage}
              variant="primary"
              size="lg"
              className="py-2"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  {t('loading')}
                </>
              ) : t('diseaseDetection')}
            </Button>

            {prediction && (
              <Button
                onClick={handleReupload}
                variant="outline-secondary"
                size="lg"
                className="py-2"
              >
                🔄 Re-upload Image
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error</Alert.Heading>
          <p className="mb-0">❌ {error}</p>
        </Alert>
      )}

      {prediction && (
        prediction.confidence < 90 ? (
          <Alert variant="warning" className="mb-4">
            <Alert.Heading>⚠️ Poor Image Quality</Alert.Heading>
            <p className="mb-0">
              The uploaded image is not clear. Please upload a clear plant image.
            </p>
          </Alert>
        ) : (
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h3 className="h5 mb-0">{t('diseaseDetectionResult')}</h3>
            </Card.Header>
            <Card.Body className="d-flex flex-column" style={{ gap: '1rem' }}>
              <Row className="mb-3">
                <Col sm={4} className="fw-bold">{t('disease')}</Col>
                <Col sm={8} className="text-primary fw-bold">{prediction.disease}</Col>
              </Row>
              <Row className="pb-3 border-bottom">
                <Col sm={4} className="fw-bold">{t('confidence')}:</Col>
                <Col sm={8}>{prediction.confidence}%</Col>
              </Row>
              <Row className="pb-3 border-bottom">
                <Col sm={4} className="fw-bold">{t('recommendation')}</Col>
                <Col sm={8}>
                  <ul className="mb-0">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
              <Row className="pb-3 border-bottom">
                <Col sm={4} className="fw-bold">{t('prevention')}</Col>
                <Col sm={8}>
                  <ul className="mb-0">
                    {prediction.prevention.map((prev, index) => (
                      <li key={index}>{prev}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
              <Row>
                <Col sm={4} className="fw-bold">{t('organicAlternatives')}</Col>
                <Col sm={8}>
                  <ul className="mb-0">
                    {prediction.organic_alternatives.map((alt, index) => (
                      <li key={index}>{alt}</li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )
      )}
    </Container>
  );
};

export default DiseaseDetector;