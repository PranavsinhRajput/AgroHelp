import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import districtsData from '../locales/market/Districts_codes.json';
import commoditiesData from '../locales/market/Commodities_farmer_only.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Theme colors from CSS variables ────────────────────────────────────────
const THEME = {
  primary:   '#F5A32A',
  green:     '#34A853',
  red:       '#EA4335',
  blue:      '#4285F4',
  border:    '#E0E0E0',
  textPri:   '#1A1A1A',
  textSec:   '#888888',
  bgPage:    '#F2F1EC',
  bgCard:    '#FFFFFF',
  bgActive:  '#FFF4E6',
};

// Market colors for multi-line chart
const MARKET_COLORS = [
  { line: '#F5A32A', fill: 'rgba(245,163,42,0.08)' },
  { line: '#34A853', fill: 'rgba(52,168,83,0.08)'  },
  { line: '#4285F4', fill: 'rgba(66,133,244,0.08)' },
  { line: '#EA4335', fill: 'rgba(234,67,53,0.08)'  },
  { line: '#9B59B6', fill: 'rgba(155,89,182,0.08)' },
];

// ─── Price Chart Component ───────────────────────────────────────────────────
const PriceChart = ({ priceData, markets, commodityName, districtName, t }) => {
  const [activeTab, setActiveTab] = useState('modal'); // modal | min | max

  const { labels, datasets, statCards } = useMemo(() => {
    if (!priceData?.output?.data) return { labels: [], datasets: [], statCards: {} };

    const records = priceData.output.data;

    // Group by market
    const byMarket = {};
    records.forEach(r => {
      const id = r.market_id;
      if (!byMarket[id]) byMarket[id] = [];
      byMarket[id].push(r);
    });

    // Collect all unique sorted dates
    const allDates = [...new Set(records.map(r => r.arrival_date || r.date))]
      .sort((a, b) => new Date(a) - new Date(b));

    const formatLabel = (d) => {
      const dt = new Date(d);
      return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    };

    const priceKey = { modal: 'modal_price', min: 'min_price', max: 'max_price' }[activeTab];

    const datasets = Object.entries(byMarket).map(([marketId, recs], i) => {
      const marketName = markets.find(m => m.market_id === parseInt(marketId))?.market_name || `Market ${marketId}`;
      const color = MARKET_COLORS[i % MARKET_COLORS.length];
      const dataMap = {};
      recs.forEach(r => { dataMap[r.arrival_date || r.date] = r[priceKey]; });
      return {
        label: marketName,
        data: allDates.map(d => dataMap[d] ?? null),
        borderColor: color.line,
        backgroundColor: color.fill,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: color.line,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
        spanGaps: true,
      };
    });

    // Stat cards — across ALL records
    const allModal = records.map(r => r.modal_price).filter(Boolean);
    const allMin   = records.map(r => r.min_price).filter(Boolean);
    const allMax   = records.map(r => r.max_price).filter(Boolean);

    const statCards = {
      avg:  allModal.length ? Math.round(allModal.reduce((a, b) => a + b, 0) / allModal.length) : null,
      low:  allMin.length   ? Math.min(...allMin)   : null,
      high: allMax.length   ? Math.max(...allMax)   : null,
      days: allDates.length,
    };

    return { labels: allDates.map(formatLabel), datasets, statCards };
  }, [priceData, markets, activeTab]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 4,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { family: 'Inter, system-ui, sans-serif', size: 12 },
          color: THEME.textPri,
        }
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#ffffff',
        bodyColor: '#cccccc',
        borderColor: THEME.primary,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ₹${ctx.parsed.y?.toLocaleString('en-IN') ?? 'N/A'}`
        }
      },
      title: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: {
          color: THEME.textSec,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          maxRotation: 45,
        },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: {
          color: THEME.textSec,
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          callback: val => `₹${val.toLocaleString('en-IN')}`
        },
        border: { display: false }
      }
    }
  };

  const tabs = [
    { key: 'modal', label: t('chartTabModal'),  color: THEME.primary },
    { key: 'min',   label: t('chartTabMin'),    color: THEME.green   },
    { key: 'max',   label: t('chartTabMax'),    color: '#EA4335'     },
  ];

  return (
    <Card style={{
      borderRadius: '12px',
      border: `1px solid ${THEME.border}`,
      overflow: 'hidden',
      marginBottom: '1.5rem'
    }}>
      {/* Chart Header */}
      <div style={{
        padding: '1.25rem 1.5rem 0',
        borderBottom: `1px solid ${THEME.border}`,
        backgroundColor: THEME.bgCard
      }}>
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
          <div>
            <h5 style={{ color: THEME.textPri, fontWeight: 600, marginBottom: '2px', fontSize: '15px' }}>
              {t('priceChartTitle')}
            </h5>
            <span style={{ color: THEME.textSec, fontSize: '13px' }}>
              {commodityName} · {districtName}
            </span>
          </div>
          {/* Tab switcher */}
          <div style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: '#F2F1EC',
            borderRadius: '8px',
            padding: '3px'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: activeTab === tab.key ? THEME.bgCard : 'transparent',
                  color: activeTab === tab.key ? tab.color : THEME.textSec,
                  boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingBottom: '1rem' }}>
          {[
            { label: t('statAvgModal'), value: statCards.avg, prefix: '₹', color: THEME.primary },
            { label: t('statLowest'),   value: statCards.low, prefix: '₹', color: THEME.green   },
            { label: t('statHighest'),  value: statCards.high,prefix: '₹', color: '#EA4335'     },
            { label: t('statDays'),     value: statCards.days,prefix: '',   color: '#4285F4'    },
          ].map(s => s.value !== null && (
            <div key={s.label} style={{
              backgroundColor: THEME.bgPage,
              borderRadius: '8px',
              padding: '6px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: s.color, lineHeight: 1.2 }}>
                {s.prefix}{s.value?.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '11px', color: THEME.textSec, marginTop: '1px' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div style={{ padding: '1.25rem 1rem 0.5rem', height: '320px' }}>
        {labels.length > 0 ? (
          <Line data={{ labels, datasets }} options={chartOptions} />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            {t('noChartData')}
          </div>
        )}
      </div>
    </Card>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const MarketRates = () => {
  const { t } = useTranslation();
  const [districtSearch, setDistrictSearch]       = useState('');
  const [commoditySearch, setCommoditySearch]     = useState('');
  const [selectedDistrict, setSelectedDistrict]   = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [showDistrictDropdown, setShowDistrictDropdown]   = useState(false);
  const [showCommodityDropdown, setShowCommodityDropdown] = useState(false);
  const [markets, setMarkets]               = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [priceData, setPriceData]           = useState(null);
  const [loading, setLoading]               = useState(false);
  const [loadingPrices, setLoadingPrices]   = useState(false);
  const [error, setError]                   = useState('');

  const districts = useMemo(() =>
    districtsData.output.data.map(d => ({
      id:      d.census_district_id,
      name:    d.census_district_name,
      state:   d.census_state_name,
      stateId: d.census_state_id
    })), []);

  const commodities = useMemo(() =>
    commoditiesData.map(c => ({
      id:   c.commodity_id,
      name: c.commodity_name
    })), []);

  const filteredDistricts = useMemo(() => {
    if (!districtSearch) return districts.slice(0, 50);
    return districts.filter(d =>
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.state.toLowerCase().includes(districtSearch.toLowerCase())
    ).slice(0, 50);
  }, [districtSearch, districts]);

  const filteredCommodities = useMemo(() => {
    if (!commoditySearch) return commodities.slice(0, 50);
    return commodities.filter(c =>
      c.name.toLowerCase().includes(commoditySearch.toLowerCase())
    ).slice(0, 50);
  }, [commoditySearch, commodities]);

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setDistrictSearch(`${district.name}, ${district.state}`);
    setShowDistrictDropdown(false);
  };

  const handleCommoditySelect = (commodity) => {
    setSelectedCommodity(commodity);
    setCommoditySearch(commodity.name);
    setShowCommodityDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDistrict || !selectedCommodity) {
      setError(t('pleaseSelectBothDistrictAndCommodity'));
      return;
    }
    setLoading(true);
    setError('');
    setMarkets([]);
    setSelectedMarkets([]);
    setPriceData(null);
    try {
      const response = await fetch('http://localhost:4000/api/market/mandi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity_id: selectedCommodity.id,
          district_id:  selectedDistrict.id
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('failedToFetchMarkets'));
      if (data.success && data.data.output.data) {
        setMarkets(data.data.output.data);
      } else {
        throw new Error(t('noMarketsFound'));
      }
    } catch (err) {
      setError(err.message || t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarketToggle = (marketId) => {
    setSelectedMarkets(prev =>
      prev.includes(marketId) ? prev.filter(id => id !== marketId) : [...prev, marketId]
    );
  };

  const handleFetchPrices = async () => {
    if (selectedMarkets.length === 0) {
      setError(t('pleaseSelectAtLeastOneMarket'));
      return;
    }
    setLoadingPrices(true);
    setError('');
    setPriceData(null);
    try {
      const response = await fetch('http://localhost:4000/api/market/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity_id: selectedCommodity.id,
          district_id:  selectedDistrict.id,
          market_ids:   selectedMarkets
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('failedToFetchPrices'));
      if (data.success) {
        setPriceData(data.data);
      } else {
        throw new Error(data.message || t('failedToFetchPrices'));
      }
    } catch (err) {
      setError(err.message || t('somethingWentWrong'));
    } finally {
      setLoadingPrices(false);
    }
  };

  // ── Shared dropdown style ──
  const dropdownStyle = {
    position: 'absolute',
    width: '100%',
    marginTop: '4px',
    backgroundColor: THEME.bgCard,
    border: `1px solid ${THEME.border}`,
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    maxHeight: '250px',
    overflowY: 'auto',
    zIndex: 1000,
  };

  const dropdownItemStyle = (hovered) => ({
    padding: '10px 14px',
    cursor: 'pointer',
    backgroundColor: hovered ? THEME.bgActive : 'transparent',
    transition: 'background 0.1s',
  });

  return (
    <Container className="py-5">

      {/* ── Header ── */}
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-2" style={{ color: THEME.textPri, fontWeight: 700 }}>
            {t('marketPrice')}
          </h1>
          <p className="text-center lead" style={{ color: THEME.textSec }}>
            {t('checkLiveApmcMandiRates')}
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8}>

          {/* ── Filter Card ── */}
          <Card className="mb-4">
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ color: THEME.textPri, fontWeight: 600, fontSize: '16px' }}>
                {t('selectDistrictAndCommodity')}
              </h4>

              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* District */}
                  <Col md={6}>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label style={{ fontSize: '13px', fontWeight: 500, color: THEME.textPri }}>
                        {t('district')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('searchDistrict')}
                        value={districtSearch}
                        onChange={(e) => { setDistrictSearch(e.target.value); setShowDistrictDropdown(true); }}
                        onFocus={() => setShowDistrictDropdown(true)}
                        style={{ borderColor: THEME.border, borderRadius: '8px', fontSize: '14px' }}
                        required
                      />
                      {showDistrictDropdown && (
                        <div style={dropdownStyle}>
                          {filteredDistricts.length > 0 ? filteredDistricts.map(district => (
                            <div
                              key={district.id}
                              style={dropdownItemStyle(false)}
                              onClick={() => handleDistrictSelect(district)}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = THEME.bgActive}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <strong style={{ fontSize: '13px' }}>{district.name}</strong>
                              <br />
                              <small style={{ color: THEME.textSec }}>{district.state}</small>
                            </div>
                          )) : (
                            <div style={{ padding: '10px 14px', color: THEME.textSec, fontSize: '13px' }}>
                              {t('noDistrictsFound')}
                            </div>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Commodity */}
                  <Col md={6}>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label style={{ fontSize: '13px', fontWeight: 500, color: THEME.textPri }}>
                        {t('commodity')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t('searchCommodity')}
                        value={commoditySearch}
                        onChange={(e) => { setCommoditySearch(e.target.value); setShowCommodityDropdown(true); }}
                        onFocus={() => setShowCommodityDropdown(true)}
                        style={{ borderColor: THEME.border, borderRadius: '8px', fontSize: '14px' }}
                        required
                      />
                      {showCommodityDropdown && (
                        <div style={dropdownStyle}>
                          {filteredCommodities.length > 0 ? filteredCommodities.map(commodity => (
                            <div
                              key={commodity.id}
                              style={dropdownItemStyle(false)}
                              onClick={() => handleCommoditySelect(commodity)}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = THEME.bgActive}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <span style={{ fontSize: '13px' }}>{commodity.name}</span>
                            </div>
                          )) : (
                            <div style={{ padding: '10px 14px', color: THEME.textSec, fontSize: '13px' }}>
                              {t('noCommoditiesFound')}
                            </div>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {selectedDistrict && (
                  <div className="mb-3">
                    <small style={{ color: THEME.textSec, fontSize: '12px' }}>
                      <i className="bi bi-geo-alt-fill me-1" style={{ color: THEME.primary }}></i>
                      {t('selected')} <strong>{selectedDistrict.name}</strong> ({selectedDistrict.state})
                    </small>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-100"
                  disabled={loading || !selectedDistrict || !selectedCommodity}
                  style={{
                    backgroundColor: THEME.primary,
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '10px'
                  }}
                >
                  {loading ? (
                    <><Spinner as="span" animation="border" size="sm" className="me-2" />{t('loading')}</>
                  ) : t('getMarkets')}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* ── Error ── */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')} style={{ borderRadius: '8px', fontSize: '14px' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          {/* ── Market Selection ── */}
          {markets.length > 0 && (
            <Card className="mb-4">
              <Card.Body className="p-4">
                <h4 className="mb-1" style={{ color: THEME.textPri, fontWeight: 600, fontSize: '16px' }}>
                  <i className="bi bi-shop me-2" style={{ color: THEME.primary }}></i>
                  {t('selectMarkets')}
                </h4>
                <p style={{ color: THEME.textSec, fontSize: '13px', marginBottom: '1.25rem' }}>
                  {t('foundMarketsIn')} <strong>{markets.length}</strong> {t('marketIn')} <strong>{selectedDistrict?.name}</strong>.{' '}
                  {t('selectOneOrMoreMarkets')}
                </p>

                <Row className="g-3 mb-4">
                  {markets.map(market => {
                    const isSelected = selectedMarkets.includes(market.market_id);
                    return (
                      <Col md={6} key={market.market_id}>
                        <div
                          onClick={() => handleMarketToggle(market.market_id)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `1.5px solid ${isSelected ? THEME.primary : THEME.border}`,
                            backgroundColor: isSelected ? THEME.bgActive : THEME.bgCard,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = THEME.primary; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = THEME.border; }}
                        >
                          <div style={{
                            width: '18px', height: '18px',
                            borderRadius: '4px',
                            border: `2px solid ${isSelected ? THEME.primary : THEME.border}`,
                            backgroundColor: isSelected ? THEME.primary : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, marginRight: '12px', transition: 'all 0.15s ease'
                          }}>
                            {isSelected && <i className="bi bi-check" style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}></i>}
                          </div>
                          <div className="flex-grow-1">
                            <div style={{ fontSize: '14px', fontWeight: 500, color: THEME.textPri }}>{market.market_name}</div>
                            <div style={{ fontSize: '11px', color: THEME.textSec }}>{t('marketId')} {market.market_id}</div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>

                {selectedMarkets.length > 0 && (
                  <div style={{
                    backgroundColor: 'rgba(245,163,42,0.08)',
                    border: `1px solid rgba(245,163,42,0.3)`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: THEME.textPri,
                    marginBottom: '1rem'
                  }}>
                    <i className="bi bi-info-circle-fill me-2" style={{ color: THEME.primary }}></i>
                    <strong>{selectedMarkets.length}</strong> {t('marketsSelected')}
                  </div>
                )}

                <Button
                  onClick={handleFetchPrices}
                  className="w-100"
                  size="lg"
                  disabled={loadingPrices || selectedMarkets.length === 0}
                  style={{
                    backgroundColor: THEME.primary,
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '12px'
                  }}
                >
                  {loadingPrices ? (
                    <><Spinner as="span" animation="border" size="sm" className="me-2" />{t('fetchingPrices')}</>
                  ) : (
                    <><i className="bi bi-currency-rupee me-2"></i>{t('getPricesFor')} {selectedMarkets.length} {t('marketIn')}</>
                  )}
                </Button>
              </Card.Body>
            </Card>
          )}

          {/* ── Price Results ── */}
          {priceData && priceData.output && priceData.output.data && (
            <>
              {/* Chart */}
              <PriceChart
                priceData={priceData}
                markets={markets}
                commodityName={selectedCommodity?.name}
                districtName={selectedDistrict?.name}
                t={t}
              />

              {/* Table */}
              <Card>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <h5 style={{ color: THEME.textPri, fontWeight: 600, fontSize: '15px', margin: 0 }}>
                      {t('priceDetails')}
                    </h5>
                    <span style={{
                      fontSize: '12px', color: THEME.textSec,
                      backgroundColor: THEME.bgPage, padding: '4px 10px',
                      borderRadius: '20px'
                    }}>
                      {priceData.output.data.length} {t('records')}
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover mb-0" style={{ fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: THEME.bgPage }}>
                          <th style={{ color: THEME.textSec, fontWeight: 500, borderBottom: `2px solid ${THEME.border}`, padding: '10px 12px' }}>{t('date')}</th>
                          <th style={{ color: THEME.textSec, fontWeight: 500, borderBottom: `2px solid ${THEME.border}`, padding: '10px 12px' }}>{t('market')}</th>
                          <th style={{ color: THEME.textSec, fontWeight: 500, borderBottom: `2px solid ${THEME.border}`, padding: '10px 12px' }}>{t('minPrice')}</th>
                          <th style={{ color: THEME.textSec, fontWeight: 500, borderBottom: `2px solid ${THEME.border}`, padding: '10px 12px' }}>{t('maxPrice')}</th>
                          <th style={{ color: THEME.textSec, fontWeight: 500, borderBottom: `2px solid ${THEME.border}`, padding: '10px 12px' }}>{t('modalPrice')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceData.output.data.map((record, index) => {
                          const formatDate = (ds) => {
                            if (!ds) return t('na');
                            return new Date(ds).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                          };
                          const getMarketName = (id) => markets.find(m => m.market_id === id)?.market_name || t('na');

                          return (
                            <tr key={index}>
                              <td style={{ padding: '10px 12px', color: THEME.textSec }}>{formatDate(record.arrival_date || record.date)}</td>
                              <td style={{ padding: '10px 12px', fontWeight: 500 }}>{getMarketName(record.market_id)}</td>
                              <td style={{ padding: '10px 12px', color: THEME.green, fontWeight: 500 }}>
                                ₹{(record.min_price || record.minPrice || 0).toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '10px 12px', color: '#EA4335', fontWeight: 500 }}>
                                ₹{(record.max_price || record.maxPrice || 0).toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{
                                  backgroundColor: THEME.bgActive,
                                  color: THEME.primary,
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px'
                                }}>
                                  ₹{(record.modal_price || record.modalPrice || 0).toLocaleString('en-IN')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 text-center">
                    <small style={{ color: THEME.textSec, fontSize: '12px' }}>
                      <i className="bi bi-info-circle me-1"></i>
                      {t('pricesArePerQuintal')}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

        </Col>
      </Row>

      {/* ── Info Section ── */}
      <Row className="mt-5 justify-content-center">
        <Col lg={8}>
          <Card style={{ backgroundColor: THEME.bgPage, border: `1px solid ${THEME.border}` }}>
            <Card.Body className="p-4">
              <h5 className="mb-2" style={{ color: THEME.textPri, fontWeight: 600, fontSize: '15px' }}>
                <i className="bi bi-lightbulb me-2" style={{ color: THEME.primary }}></i>
                {t('aboutMarketRates')}
              </h5>
              <p style={{ color: THEME.textSec, marginBottom: 0, fontSize: '13px' }}>
                {t('ourMarketRatesAreUpdated')}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ── Click outside overlay ── */}
      {(showDistrictDropdown || showCommodityDropdown) && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
          onClick={() => { setShowDistrictDropdown(false); setShowCommodityDropdown(false); }}
        />
      )}
    </Container>
  );
};

export default MarketRates;