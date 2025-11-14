import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import '../styles/Sidebar.css';

const Sidebar = ({ toggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="d-flex justify-content-between align-items-center">
          {!collapsed && <h5 className="mb-0" style={{ color: '#4a6741', fontWeight: 'bold' }}>AgroHelp</h5>}
          <Button 
            variant="light" 
            className="sidebar-toggle p-0 rounded-circle" 
            onClick={handleToggleCollapse}
            style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} style={{ fontSize: '14px' }}></i>
          </Button>
        </div>
        {toggleSidebar && (
          <Button 
            variant="light" 
            className="close-sidebar d-md-none rounded-circle" 
            onClick={toggleSidebar}
            style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '14px' }}></i>
          </Button>
        )}
      </div>
      
      <div className="sidebar-content">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <i className="bi bi-house-door"></i>
              {!collapsed && <span>{t('home')}</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/disease-detection" className={`nav-link ${location.pathname === '/disease-detection' ? 'active' : ''}`}>
              <i className="bi bi-bug"></i>
              {!collapsed && <span>{t('disease')}</span>}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/weather-prediction" className={`nav-link ${location.pathname === '/weather-prediction' ? 'active' : ''}`}>
              <i className="bi bi-cloud-sun"></i>
              {!collapsed && <span>{t('weather')}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;