import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import farmerImage from '../assets/homelogo3.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigator = useNavigate();
  const [token] = useState(localStorage.getItem("token"));
  const { t } = useTranslation();

  return (
    <div>
      <section className="py-5">
        <Container>
          <Row className="align-items-center gy-4">
            <Col xs={12} md={6}>
              <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-semibold)' }}>{t('smartAgriculture')}</h1>
              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('appDescription')}
              </p>
              <Button 
                variant="primary" 
                className="px-4 py-2"
                onClick={() => {
                   if(token){
                       navigator('/dashboard');
                   }else{
                    navigator('/signup');
                   }
                }}
              >
                {t('getStarted')}
              </Button>
            </Col>
            <Col xs={12} md={6} className="d-flex justify-content-center">
              <img 
                src={farmerImage} 
                alt="Farmer" 
                className="img-fluid" 
              />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;