import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, Spinner, Alert, Container, Row, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const WeatherPredictor = () => {
  const { t } = useTranslation();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWeatherPrediction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:4000/api/predict/weather', {
        // Dummy data for 7 days
        weatherData: [
          { date: '2025-09-05', avgtemp_c: 25.2, humidity: 80, pressure_mb: 1013 },
          { date: '2025-09-06', avgtemp_c: 26.1, humidity: 75, pressure_mb: 1015 },
          { date: '2025-09-07', avgtemp_c: 24.8, humidity: 85, pressure_mb: 1012 },
          { date: '2025-09-08', avgtemp_c: 27.3, humidity: 70, pressure_mb: 1018 },
          { date: '2025-09-09', avgtemp_c: 23.2, humidity: 84, pressure_mb: 1011 },
          { date: '2025-09-10', avgtemp_c: 25.7, humidity: 78, pressure_mb: 1016 },
          { date: '2025-09-11', avgtemp_c: 26.5, humidity: 72, pressure_mb: 1014 }
        ]
      });
      
      setPrediction(response.data);
    } catch (err) {
      setError(t('error'));
      console.error('Weather prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm mb-4">
        <Card.Body className="p-4 text-center">
          <div className="display-4 mb-3">🌤️</div>
          <h2 className="h4 mb-3">{t('weatherPrediction')}</h2>
          <p className="text-secondary mb-4">{t('weatherForecastingDescription')}</p>
          
          <div className="d-grid">
            <Button 
              onClick={handleWeatherPrediction}
              disabled={loading}
              variant="primary"
              size="lg"
              className="py-2"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  {t('loading')}
                </>
              ) : t('submit')}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>{t('error')}</Alert.Heading>
          <p className="mb-0">❌ {error}</p>
        </Alert>
      )}

      {prediction && (
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h3 className="h5 mb-0">{t('results')}</h3>
          </Card.Header>
          <Card.Body>
            <Table responsive bordered hover className="mb-4">
              <tbody>
                <tr>
                  <th className="bg-light" width="40%">{t('temperature')}:</th>
                  <td>{prediction.temperature}°C</td>
                </tr>
                <tr>
                  <th className="bg-light">{t('humidity')}:</th>
                  <td>{prediction.humidity}%</td>
                </tr>
                <tr>
                  <th className="bg-light">{t('precipitation')}:</th>
                  <td>{prediction.precipitation}mm</td>
                </tr>
                <tr>
                  <th className="bg-light">{t('windSpeed')}:</th>
                  <td>{prediction.wind_speed} km/h</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default WeatherPredictor;