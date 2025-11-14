import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const NavigationBar = ({ toggleSidebar }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { t, i18n } = useTranslation();

  // Sync token when it changes in localStorage (e.g., logout in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // triggers re-render once, safely
  };
  return (
    <Navbar bg="white" expand="lg" className="border-bottom py-2 px-3 sticky-top shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src="/src/assets/logo.png"
            alt="AgroHelp Logo"
            className="me-2"
            width="40"
            height="40"
            style={{ borderRadius: '50%' }}
          />
          <span className="fw-bold" style={{ color: '#4a6741' }}>AgroHelp</span>
        </Navbar.Brand>

        <Button
          variant="outline-secondary"
          className="d-lg-none me-2"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </Button>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/" className="mx-2 text-uppercase fw-medium" style={{ color: '#4a6741' }}>{t('home')}</Nav.Link>
            <Nav.Link href="/about" className="mx-2 text-uppercase fw-medium">{t('about')}</Nav.Link>
            <Nav.Link href="/contact" className="mx-2 text-uppercase fw-medium">{t('contact')}</Nav.Link>
            <div className="mx-2">
              <select 
                className="form-select form-select-sm border" 
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
            {token? (<Dropdown align="end" className="ms-2">
              <Dropdown.Toggle
                variant="link"
                id="user-dropdown"
                className="p-0 border-0"
                style={{ boxShadow: 'none' }}
                bsPrefix="custom-dropdown-toggle"
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#4a6741',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item href="#">
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={()=>{
                  handleLogout()
                }} href="/" className="text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>) : (<span></span>)}
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;