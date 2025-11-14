import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import districtsData from '../locales/market/Districts_codes.json'; // Adjust path as needed
import commoditiesData from '../locales/market/Commodities_farmer_only.json'; // Uncomment when you have the file

const MarketRates = () => {
  const [districtSearch, setDistrictSearch] = useState('');
  const [commoditySearch, setCommoditySearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showCommodityDropdown, setShowCommodityDropdown] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [error, setError] = useState('');

  // Extract districts from JSON
  const districts = useMemo(() => {
    return districtsData.output.data.map(d => ({
      id: d.census_district_id,
      name: d.census_district_name,
      state: d.census_state_name,
      stateId: d.census_state_id
    }));
  }, []);

  // Load commodities from JSON file
  const commodities = useMemo(() => {
    return commoditiesData.map(c => ({
      id: c.commodity_id,
      name: c.commodity_name
    }));
  }, []);


  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!districtSearch) return districts.slice(0, 50); // Show first 50 by default
    return districts.filter(d =>
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.state.toLowerCase().includes(districtSearch.toLowerCase())
    ).slice(0, 50);
  }, [districtSearch, districts]);

  // Filter commodities based on search
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
      setError('Please select both district and commodity');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commodity_id: selectedCommodity.id,
          district_id: selectedDistrict.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch markets');
      }

      if (data.success && data.data.output.data) {
        setMarkets(data.data.output.data);
      } else {
        throw new Error('No markets found');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarketToggle = (marketId) => {
    setSelectedMarkets(prev => {
      if (prev.includes(marketId)) {
        return prev.filter(id => id !== marketId);
      } else {
        return [...prev, marketId];
      }
    });
  };

  const handleFetchPrices = async () => {
    if (selectedMarkets.length === 0) {
      setError('Please select at least one market');
      return;
    }

    setLoadingPrices(true);
    setError('');
    setPriceData(null);

    try {
      const response = await fetch('http://localhost:4000/api/market/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commodity_id: selectedCommodity.id,
          district_id: selectedDistrict.id,
          market_ids: selectedMarkets
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch prices');
      }

      if (data.success) {
        setPriceData(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch prices');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoadingPrices(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3" style={{ color: '#4a6741' }}>
            Market Rates
          </h1>
          <p className="text-center text-muted lead">
            Check live APMC mandi rates for agricultural commodities
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h4 className="mb-4" style={{ color: '#4a6741' }}>
                Select District & Commodity
              </h4>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>District</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search district..."
                        value={districtSearch}
                        onChange={(e) => {
                          setDistrictSearch(e.target.value);
                          setShowDistrictDropdown(true);
                        }}
                        onFocus={() => setShowDistrictDropdown(true)}
                        required
                      />
                      {showDistrictDropdown && (
                        <div
                          className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                          style={{
                            maxHeight: '250px',
                            overflowY: 'auto',
                            zIndex: 1000
                          }}
                        >
                          {filteredDistricts.length > 0 ? (
                            filteredDistricts.map(district => (
                              <div
                                key={district.id}
                                className="p-2 cursor-pointer hover-bg-light"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDistrictSelect(district)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                <strong>{district.name}</strong>
                                <br />
                                <small className="text-muted">{district.state}</small>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-muted">No districts found</div>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Commodity</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search commodity..."
                        value={commoditySearch}
                        onChange={(e) => {
                          setCommoditySearch(e.target.value);
                          setShowCommodityDropdown(true);
                        }}
                        onFocus={() => setShowCommodityDropdown(true)}
                        required
                      />
                      {showCommodityDropdown && (
                        <div
                          className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                          style={{
                            maxHeight: '250px',
                            overflowY: 'auto',
                            zIndex: 1000
                          }}
                        >
                          {filteredCommodities.length > 0 ? (
                            filteredCommodities.map(commodity => (
                              <div
                                key={commodity.id}
                                className="p-2 cursor-pointer"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleCommoditySelect(commodity)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                {commodity.name}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-muted">No commodities found</div>
                          )}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {selectedDistrict && (
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Selected: <strong>{selectedDistrict.name}</strong> ({selectedDistrict.state})
                    </small>
                  </div>
                )}

                <Button
                  type="submit"
                  style={{ backgroundColor: '#4a6741', border: 'none' }}
                  className="w-100"
                  disabled={loading || !selectedDistrict || !selectedCommodity}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Loading...
                    </>
                  ) : (
                    'Get Markets'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          {/* Markets Selection */}
          {markets.length > 0 && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="mb-3" style={{ color: '#4a6741' }}>
                  <i className="bi bi-shop me-2"></i>
                  Select Markets
                </h4>
                <p className="text-muted mb-4">
                  Found <strong>{markets.length}</strong> market(s) in <strong>{selectedDistrict?.name}</strong>.
                  Select one or more markets to get price details.
                </p>

                <Row className="g-3 mb-4">
                  {markets.map(market => (
                    <Col md={6} key={market.market_id}>
                      <Card
                        className={`h-100 cursor-pointer transition ${selectedMarkets.includes(market.market_id)
                          ? 'border-success bg-light'
                          : 'border-secondary'
                          }`}
                        style={{
                          cursor: 'pointer',
                          borderWidth: '2px',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleMarketToggle(market.market_id)}
                        onMouseEnter={(e) => {
                          if (!selectedMarkets.includes(market.market_id)) {
                            e.currentTarget.style.borderColor = '#4a6741';
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedMarkets.includes(market.market_id)) {
                            e.currentTarget.style.borderColor = '#6c757d';
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <Card.Body className="d-flex align-items-center p-3">
                          <Form.Check
                            type="checkbox"
                            id={`market-${market.market_id}`}
                            checked={selectedMarkets.includes(market.market_id)}
                            onChange={() => { }}
                            className="me-3"
                            style={{ pointerEvents: 'none' }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-0" style={{ color: '#4a6741' }}>
                              {market.market_name}
                            </h6>
                            <small className="text-muted">
                              Market ID: {market.market_id}
                            </small>
                          </div>
                          {selectedMarkets.includes(market.market_id) && (
                            <i className="bi bi-check-circle-fill text-success fs-4"></i>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {selectedMarkets.length > 0 && (
                  <Alert variant="info" className="d-flex align-items-center mb-3">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <span>
                      <strong>{selectedMarkets.length}</strong> market{selectedMarkets.length !== 1 ? 's' : ''} selected
                    </span>
                  </Alert>
                )}

                <Button
                  onClick={handleFetchPrices}
                  style={{ backgroundColor: '#4a6741', border: 'none' }}
                  className="w-100"
                  size="lg"
                  disabled={loadingPrices || selectedMarkets.length === 0}
                >
                  {loadingPrices ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Fetching Prices...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-currency-rupee me-2"></i>
                      Get Prices for {selectedMarkets.length} Market{selectedMarkets.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </Card.Body>
            </Card>
          )}

          {/* Price Data Display */}
          {priceData && priceData.output && priceData.output.data && (
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="mb-4 text-center" style={{ color: '#4a6741' }}>
                  Price Details
                </h4>

                <div className="text-center mb-4">
                  <h5 className="text-muted">
                    {selectedCommodity?.name} in {selectedDistrict?.name}
                  </h5>
                  <small className="text-muted">
                    Showing data for {priceData.output.data.length} record(s)
                  </small>
                </div>

                {/* Price Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{ backgroundColor: '#4a6741', color: 'white' }}>
                      <tr>
                        <th>Date</th>
                        <th>Market</th>
                        <th>Min Price</th>
                        <th>Max Price</th>
                        <th>Modal Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceData.output.data.map((record, index) => {
                        // Format date to be more readable
                        const formatDate = (dateString) => {
                          if (!dateString) return 'N/A';
                          const date = new Date(dateString);
                          return date.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          });
                        };

                        // Find market name from markets state
                        const getMarketName = (marketId) => {
                          const market = markets.find(m => m.market_id === marketId);
                          return market ? market.market_name : 'N/A';
                        };

                        return (
                          <tr key={index}>
                            <td>{formatDate(record.arrival_date || record.date)}</td>
                            <td>{getMarketName(record.market_id)}</td>
                            <td className="text-success">
                              ₹{record.min_price || record.minPrice || 'N/A'}
                            </td>
                            <td className="text-danger">
                              ₹{record.max_price || record.maxPrice || 'N/A'}
                            </td>
                            <td className="text-primary">
                              <strong>₹{record.modal_price || record.modalPrice || 'N/A'}</strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Prices are per quintal and subject to market fluctuations
                  </small>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Info Section */}
      <Row className="mt-5 justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body className="p-4">
              <h5 className="mb-3" style={{ color: '#4a6741' }}>
                <i className="bi bi-lightbulb me-2"></i>
                About Market Rates
              </h5>
              <p className="text-muted mb-0">
                Our market rates are updated in real-time from APMC (Agricultural Produce Market Committee)
                data across major cities in India. These rates help farmers make informed decisions about
                when and where to sell their produce for the best prices.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Click outside to close dropdowns */}
      {(showDistrictDropdown || showCommodityDropdown) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => {
            setShowDistrictDropdown(false);
            setShowCommodityDropdown(false);
          }}
        />
      )}
    </Container>
  );
};

export default MarketRates;