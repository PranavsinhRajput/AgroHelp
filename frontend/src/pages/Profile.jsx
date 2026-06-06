import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate('/signin');
          return;
        }

        const res = await axios.get("http://localhost:4000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data && res.data.farmer) {
          setUser(res.data.farmer);
        } else {
          throw new Error("User data not found in response");
        }
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load user profile");
        
        if (err.response?.status === 401 || err.response?.status === 404) {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="lead">{t('loadingProfile')}</p>
        </div>
      </Container>
    );
  }

  if (error && !user) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>{t('error')}</h4>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline-danger">{t('retry')}</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            {t('userProfile')}
          </h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                  style={{ width: '100px', height: '100px', backgroundColor: 'var(--color-green)', color: 'white' }}
                >
                  <i className="bi bi-person fs-1"></i>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                  {user?.name}
                </h3>
              </div>

              <div className="mb-4">
                <div className="p-3 mb-3 rounded" style={{ backgroundColor: 'var(--color-bg-page)' }}>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>{t('village')}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>{user?.village}</span>
                  </div>
                </div>
                
                <div className="p-3 mb-3 rounded" style={{ backgroundColor: 'var(--color-bg-page)' }}>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--color-text-secondary)' }}>{t('phone')}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>{user?.phone}</span>
                  </div>
                </div>
                
                {user?.createdAt && (
                  <div className="p-3 rounded" style={{ backgroundColor: 'var(--color-bg-page)' }}>
                    <div className="d-flex justify-content-between">
                      <span style={{ color: 'var(--color-text-secondary)' }}>{t('accountCreated')}</span>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="d-grid gap-2">
                <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
                  {t('backToDashboard')}
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  {t('logout')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
