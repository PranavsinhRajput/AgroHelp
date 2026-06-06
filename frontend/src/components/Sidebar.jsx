import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', label: t('home'), icon: 'bi-house-door' },
    { path: '/about', label: t('about'), icon: 'bi-info-circle' },
    { path: '/contact', label: t('contact'), icon: 'bi-envelope' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 style={{ fontSize: 'var(--font-size-brand)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>AgroHelp</h5>
          <Button 
            variant="light" 
            className="sidebar-toggle p-0 rounded-circle" 
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '14px' }}></i>
          </Button>
        </div>
      </div>
      
      <div className="sidebar-content">
        <ul className="nav flex-column">
          {navItems.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
