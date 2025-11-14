const express = require('express');
const router = express.Router();

// Import districts data to map district_id to state_id
const districtsData = require('../Districts_codes.json'); // Adjust path as needed

router.post('/mandi', async (req, res) => {
  try {
    // Extract parameters from request body
    const { commodity_id, district_id } = req.body;

    // Validate required fields
    if (!commodity_id || !district_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: commodity_id, district_id'
      });
    }

    // Find state_id from district_id
    const districtInfo = districtsData.output.data.find(
      d => d.census_district_id === parseInt(district_id)
    );

    if (!districtInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid district_id'
      });
    }

    // Prepare request payload
    const payload = {
      commodity_id: parseInt(commodity_id),
      state_id: districtInfo.census_state_id,
      district_id: parseInt(district_id),
      indicator: 'price'
    };

    // Make API request
    const response = await fetch('https://api.ceda.ashoka.edu.in/v1/agmarknet/markets', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.CEDA_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        message: 'API request failed',
        error: errorData
      });
    }

    // Parse response data
    const data = await response.json();

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Market API data fetched successfully',
      data: data
    });

  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Route to fetch prices for selected markets
router.post('/prices', async (req, res) => {
  try {
    // Extract parameters from request body
    const { commodity_id, district_id, market_ids, from_date, to_date } = req.body;

    // Validate required fields
    if (!commodity_id || !district_id || !market_ids || !Array.isArray(market_ids) || market_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: commodity_id, district_id, market_ids (array)'
      });
    }

    // Find state_id from district_id
    const districtInfo = districtsData.output.data.find(
      d => d.census_district_id === parseInt(district_id)
    );

    if (!districtInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid district_id'
      });
    }

    // Set default date range if not provided (last 5 days)
    const toDate = to_date || new Date().toISOString().split('T')[0];
    const fromDate = from_date || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];


    // Prepare request payload
    const payload = {
      commodity_id: parseInt(commodity_id),
      state_id: districtInfo.census_state_id,
      district_id: [parseInt(district_id)],
      market_id: market_ids.map(id => parseInt(id)),
      from_date: fromDate,
      to_date: toDate
    };

    // Make API request
    const response = await fetch('https://api.ceda.ashoka.edu.in/v1/agmarknet/prices', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.CEDA_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        success: false,
        message: 'API request failed',
        error: errorData
      });
    }

    // Parse response data
    const data = await response.json();

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Price data fetched successfully',
      data: data
    });

  } catch (error) {
    console.error('Error fetching price data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;