import React, { useEffect } from 'react';
import { Navbar, Container, Nav, Dropdown, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, NavLink } from 'react-router-dom';

const NavigationBar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };
  return (
    <Navbar className="sticky-top">
      <Container fluid>
        <Button
          variant="outline-secondary"
          className="d-lg-none me-2 p-0 rounded-circle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className="bi bi-list"></i>
        </Button>
        
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/src/assets/logo.png"
            alt="AgroHelp Logo"
            className="me-2"
            width="40"
            height="40"
            style={{ borderRadius: '50%' }}
          />
          <span style={{ fontSize: 'var(--font-size-brand)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>AgroHelp</span>
        </Navbar.Brand>

        <Nav className="ms-auto me-3 d-none d-lg-flex">
          <Nav.Link as={NavLink} to="/dashboard" className="mx-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)' }}>{t('home')}</Nav.Link>
          <Nav.Link as={NavLink} to="/about" className="mx-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)' }}>{t('about')}</Nav.Link>
          <Nav.Link as={NavLink} to="/contact" className="mx-2" style={{ fontSize: 'var(--font-size-list-item)', fontWeight: 'var(--font-weight-medium)' }}>{t('contact')}</Nav.Link>
        </Nav>

        <div className="mx-2">
          <select 
            className="form-select form-select-sm" 
            aria-label="Language Selector"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="" disabled hidden>
              {t('selectLanguage')}
            </option>
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
        
        {user ? (
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              id="user-dropdown"
              className="p-0 border-0 d-flex align-items-center ms-2"
              style={{ boxShadow: 'none' }}
              bsPrefix="custom-dropdown-toggle"
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-green)',
                  color: 'white',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer'
                }}
              >
                <i className="bi bi-person"></i>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">
                <i className="bi bi-person me-2"></i>
                {t('profile')}
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/dashboard">
                <i className="bi bi-gear me-2"></i>
                {t('settings')}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                {t('logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : null}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
