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
    alert('Thank you for your message! We will get back to you soon.');
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
          <h1 className="text-center mb-3" style={{ color: '#4a6741' }}>{t('contactUs')}</h1>
          <p className="text-center text-muted lead">
            {t('getInTouch')}
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h3 className="mb-4" style={{ color: '#4a6741' }}>{t('meetOurTeam')}</h3>
        </Col>
      </Row>

      <Row className="g-4 mb-5">
        {teamMembers.map((member, index) => (
          <Col md={6} lg={3} key={index}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-person-circle fs-1" style={{ color: '#4a6741' }}></i>
                </div>
                <h5 className="mb-2">{member.name}</h5>
                <p className="text-muted small mb-3">
                  <i className="bi bi-envelope me-2"></i>
                  {member.email}
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <a href={member.linkedin} className="text-dark">
                    <i className="bi bi-linkedin fs-5"></i>
                  </a>
                  <a href={member.github} className="text-dark">
                    <i className="bi bi-github fs-5"></i>
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ color: '#4a6741' }}>{t('sendMessage')}</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('yourName')}</Form.Label>
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
                  <Form.Label>{t('email')}</Form.Label>
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
                  <Form.Label>{t('subject')}</Form.Label>
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
                  <Form.Label>{t('yourMessage')}</Form.Label>
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
                  style={{ backgroundColor: '#4a6741', border: 'none' }}
                  className="w-100"
                >
                  {t('sendMessage')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ color: '#4a6741' }}>{t('contactInformation')}</h4>
              <div className="mb-3">
                <h6 className="mb-2">
                  <i className="bi bi-geo-alt-fill me-2" style={{ color: '#4a6741' }}></i>
                  {t('address')}
                </h6>
                <p className="text-muted ms-4">Agricultural Research Center, India</p>
              </div>
              <div className="mb-3">
                <h6 className="mb-2">
                  <i className="bi bi-envelope-fill me-2" style={{ color: '#4a6741' }}></i>
                  {t('email')}
                </h6>
                <p className="text-muted ms-4">contact@agrohelp.com</p>
              </div>
              <div className="mb-0">
                <h6 className="mb-2">
                  <i className="bi bi-telephone-fill me-2" style={{ color: '#4a6741' }}></i>
                  {t('phone')}
                </h6>
                <p className="text-muted ms-4">+91 12345 67890</p>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ color: '#4a6741' }}>{t('followUs')}</h4>
              <div className="d-flex gap-3">
                <a href="#" className="text-dark fs-4">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-dark fs-4">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="text-dark fs-4">
                  <i className="bi bi-github"></i>
                </a>
                <a href="#" className="text-dark fs-4">
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