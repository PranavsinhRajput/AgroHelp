import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('thankYouForYourMessage'));
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const teamMembers = [
    {
      name: 'Pranavsinh Rajput',
      email: 'johndoe@agrohelp.com',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Pratik Bagul',
      email: 'janesmith@agrohelp.com',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Dhiraj Patil',
      email: 'mikejohnson@agrohelp.com',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Jaid Killedar',
      email: 'sarahwilliams@agrohelp.com',
      linkedin: '#',
      github: '#'
    }
  ];

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{t('contactUs')}</h1>
          <p className="text-center lead" style={{ color: 'var(--color-text-secondary)' }}>
            {t('getInTouch')}
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h3 className="mb-4" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('meetOurTeam')}</h3>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {teamMembers.map((member, index) => (
          <Col xs={12} md={6} lg={3} key={index}>
            <Card className="h-100">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mx-auto"
                    style={{ width: '60px', height: '60px', backgroundColor: 'var(--color-green)', color: 'white' }}
                  >
                    <i className="bi bi-person fs-2"></i>
                  </div>
                </div>
                <h5 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{member.name}</h5>
                <p className="small mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-envelope me-2"></i>
                  {member.email}
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a href={member.linkedin} style={{ color: 'var(--color-text-primary)' }}>
                    <i className="bi bi-linkedin fs-5"></i>
                  </a>
                  <a href={member.github} style={{ color: 'var(--color-text-primary)' }}>
                    <i className="bi bi-github fs-5"></i>
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('sendMessage')}</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-text-primary)' }}>{t('yourName')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('yourName')}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-text-primary)' }}>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('yourEmail')}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-text-primary)' }}>{t('subject')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('subject')}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: 'var(--color-text-primary)' }}>{t('yourMessage')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder={t('yourMessage')}
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary"
                  className="w-100"
                >
                  {t('sendMessage')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="mb-4">
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('contactInformation')}</h4>
              <div className="mb-3">
                <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                  <i className="bi bi-geo-alt me-2" style={{ color: 'var(--color-primary)' }}></i>
                  {t('address')}
                </h6>
                <p className="ms-4" style={{ color: 'var(--color-text-secondary)' }}>{t('agriculturalResearchCenterIndia')}</p>
              </div>
              <div className="mb-3">
                <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                  <i className="bi bi-envelope me-2" style={{ color: 'var(--color-primary)' }}></i>
                  {t('email')}
                </h6>
                <p className="ms-4" style={{ color: 'var(--color-text-secondary)' }}>{t('contactAtAgrohelpCom')}</p>
              </div>
              <div className="mb-0">
                <h6 className="mb-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                  <i className="bi bi-telephone me-2" style={{ color: 'var(--color-primary)' }}></i>
                  {t('phone')}
                </h6>
                <p className="ms-4" style={{ color: 'var(--color-text-secondary)' }}>{t('plus911234567890')}</p>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>{t('followUs')}</h4>
              <div className="d-flex gap-3">
                <a href="#" style={{ color: 'var(--color-text-primary)' }} className="fs-4">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" style={{ color: 'var(--color-text-primary)' }} className="fs-4">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" style={{ color: 'var(--color-text-primary)' }} className="fs-4">
                  <i className="bi bi-github"></i>
                </a>
                <a href="#" style={{ color: 'var(--color-text-primary)' }} className="fs-4">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;