import React, { useState } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import farmerImage from '../assets/homelogo3.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigator = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="min-vh-80 bg-white border-bottom border-light">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="py-4">
              <h1 className="mb-4 fw-bold" style={{ color: '#4a6741' }}>{t('smartAgriculture')}</h1>
              <p className="mb-4 text-secondary">
                  {t('appDescription')}
              </p>
              <Button 
                variant="dark" 
                className="px-4 py-2 text-uppercase fw-medium"
                style={{ backgroundColor: '#1e293b', borderColor: '#1e293b' }}
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
            <Col lg={5} className="p-0 d-flex justify-content-end align-items-center">
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